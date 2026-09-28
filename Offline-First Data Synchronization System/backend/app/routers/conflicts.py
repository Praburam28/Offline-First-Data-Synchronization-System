import json
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.constants.sync_status import ConflictStatus
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.repositories.conflict_repository import ConflictRepository
from app.schemas.conflict import (
    ConflictResponse,
)

router = APIRouter(
    prefix="/conflicts",
    tags=["Conflicts"],
)


@router.get(
    "",
    response_model=list[ConflictResponse],
)
def list_conflicts(
    page: int = 1,
    page_size: int = 20,
    conflict_status: str | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    conflicts = ConflictRepository.list_conflicts(
        db=db,
        user_id=current_user.id,
        page=page,
        page_size=page_size,
        status=conflict_status,
    )

    result = []

    for conflict in conflicts:
        result.append(
            {
                "id": conflict.id,
                "sync_id": conflict.sync_id,
                "record_id": conflict.record_id,
                "client_payload": json.loads(
                    conflict.client_payload
                ),
                "server_payload": json.loads(
                    conflict.server_payload
                ),
                "client_version": conflict.client_version,
                "server_version": conflict.server_version,
                "resolution": conflict.resolution,
                "status": conflict.status,
                "created_at": conflict.created_at,
                "resolved_at": conflict.resolved_at,
            }
        )

    return result


@router.get(
    "/{conflict_id}",
    response_model=ConflictResponse,
)
def get_conflict(
    conflict_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    conflict = ConflictRepository.get_by_id(
        db,
        conflict_id,
        current_user.id,
    )

    if not conflict:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conflict not found",
        )

    return {
        "id": conflict.id,
        "sync_id": conflict.sync_id,
        "record_id": conflict.record_id,
        "client_payload": json.loads(
            conflict.client_payload
        ),
        "server_payload": json.loads(
            conflict.server_payload
        ),
        "client_version": conflict.client_version,
        "server_version": conflict.server_version,
        "resolution": conflict.resolution,
        "status": conflict.status,
        "created_at": conflict.created_at,
        "resolved_at": conflict.resolved_at,
    }
