from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.sync import (
    SyncBatchRequest,
    SyncBatchResponse,
    SyncHistoryResponse,
)
from app.services.sync_service import SyncService
from app.repositories.sync_repository import SyncRepository

router = APIRouter(
    prefix="/sync",
    tags=["Synchronization"],
)


@router.post(
    "/batch",
    response_model=SyncBatchResponse,
)
def synchronize(
    data: SyncBatchRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        result = SyncService.process_batch(
            db=db,
            user_id=current_user.id,
            operations=data.operations,
        )

        return result

    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        )


@router.get(
    "/history",
    response_model=list[SyncHistoryResponse],
)
def sync_history(
    page: int = 1,
    page_size: int = 20,
    sync_status: str | None = None,
    conflict_status: str | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return SyncRepository.get_history(
        db=db,
        user_id=current_user.id,
        page=page,
        page_size=page_size,
        status=sync_status,
        conflict_status=conflict_status,
    )
