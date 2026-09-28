from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from app.core.config import settings
from app.repositories.auth_repository import AuthRepository


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    return pwd_context.verify(
        plain_password,
        hashed_password,
    )


def create_access_token(
    subject: str,
    user_id: int,
    role: str,
) -> str:

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": subject,
        "user_id": user_id,
        "role": role,
        "exp": expire,
    }

    return jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )      
    


def decode_access_token(token: str) -> dict:
    try:
        return jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
    except JWTError as exc:
        raise ValueError("Invalid or expired token") from exc


def register_user(
    db: Session,
    username: str,
    email: str,
    password: str,
    role: str = "user",
):
    if AuthRepository.get_by_username(db, username):
        raise ValueError("Username already exists")

    if AuthRepository.get_by_email(db, email):
        raise ValueError("Email already exists")

    hashed_password = hash_password(password)

    user = AuthRepository.create(
        db=db,
        username=username,
        email=email,
        hashed_password=hashed_password,
        role=role,
    )

    db.commit()
    db.refresh(user)

    return user


def authenticate_user(
    db: Session,
    username: str,
    password: str,
):
    user = AuthRepository.get_by_username(
        db,
        username,
    )

    if not user:
        return None

    if not user.is_active:
        return None

    if not verify_password(
        password,
        user.hashed_password,
    ):
        return None

    return user