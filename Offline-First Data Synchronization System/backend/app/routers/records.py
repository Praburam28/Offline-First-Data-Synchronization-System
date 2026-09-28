from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.record import (
    RecordCreate,
    RecordListResponse,
    RecordResponse,
    RecordUpdate,
)
from app.services.record_service import RecordService

router = APIRouter(
    prefix="/records",
    tags=["Records"],
)


@router.post(
    "",
    response_model=RecordResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_record(
    data: RecordCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return RecordService.create(
            db,
            current_user.id,
            data,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


@router.get(
    "",
    response_model=RecordListResponse,
)
def list_records(
    page: int = Query(
        default=1,
        ge=1,
    ),
    page_size: int = Query(
        default=20,
        ge=1,
        le=100,
    ),
    search: str | None = Query(
        default=None,
    ),
    include_deleted: bool = Query(
        default=False,
    ),
    sort_by: str = Query(
        default="updated_at",
    ),
    sort_order: str = Query(
        default="desc",
        pattern="^(asc|desc)$",
    ),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return RecordService.list(
        db=db,
        user_id=current_user.id,
        page=page,
        page_size=page_size,
        search=search,
        include_deleted=include_deleted,
        sort_by=sort_by,
        sort_order=sort_order,
    )


@router.get(
    "/{record_id}",
    response_model=RecordResponse,
)
def get_record(
    record_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return RecordService.get(
            db,
            current_user.id,
            record_id,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )


@router.put(
    "/{record_id}",
    response_model=RecordResponse,
)
def update_record(
    record_id: str,
    data: RecordUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return RecordService.update(
            db,
            current_user.id,
            record_id,
            data,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        )


@router.delete(
    "/{record_id}",
    response_model=RecordResponse,
)
def delete_record(
    record_id: str,
    version: int = Query(
        ...,
        ge=1,
    ),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return RecordService.delete(
            db,
            current_user.id,
            record_id,
            version,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        )
