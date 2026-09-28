from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.schemas.auth import (
    PasswordChange,
    TokenResponse,
    UserLogin,
    UserProfileUpdate,
    UserRegister,
    UserResponse,
)
from app.repositories.auth_repository import AuthRepository
from app.services.auth_service import (
    authenticate_user,
    create_access_token,
    hash_password,
    register_user,
    verify_password,
)


router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(
    data: UserRegister,
    db: Session = Depends(get_db),
):
    try:
        user = register_user(
            db=db,
            username=data.username,
            email=data.email,
            password=data.password,
            role=data.role,
        )
        return user

    except ValueError as exc:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        )

@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(
    data: UserLogin,
    db: Session = Depends(get_db),
):
    user = authenticate_user(
        db=db,
        username=data.username,
        password=data.password,
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token(
        subject=user.username,
        user_id=user.id,
        role=user.role,
    )

    return TokenResponse(
        access_token=token,
        user=user,
    )

@router.get(
    "/me",
    response_model=UserResponse,
)
def get_profile(
    current_user=Depends(get_current_user),
):
    return current_user


@router.put(
    "/profile",
    response_model=UserResponse,
)
def update_profile(
    data: UserProfileUpdate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if data.email is not None:

        existing_user = AuthRepository.get_by_email(
            db,
            data.email,
        )

        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already exists",
            )

        current_user.email = data.email

    db.commit()
    db.refresh(current_user)

    return current_user


@router.put(
    "/change-password",
)
def change_password(
    data: PasswordChange,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not verify_password(
        data.current_password,
        current_user.hashed_password,
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )

    current_user.hashed_password = hash_password(
        data.new_password
    )

    db.commit()

    return {
        "message": "Password changed successfully"
    }
