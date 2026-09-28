import json
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.constants.sync_status import ConflictStatus
from app.models.conflict import Conflict
from app.models.record import Record
from app.repositories.conflict_repository import ConflictRepository


class ConflictService:

    @staticmethod
    def detect(
        db: Session,
        sync_id: str,
        record: Record,
        user_id: int,
        client_version: int,
        client_payload: dict,
    ) -> Conflict:

        conflict = Conflict(
            sync_id=sync_id,
            record_id=record.id,
            user_id=user_id,
            client_payload=json.dumps(
                client_payload
            ),
            server_payload=json.dumps(
                {
                    "id": record.id,
                    "title": record.title,
                    "content": record.content,
                    "version": record.version,
                    "updated_at": record.updated_at.isoformat(),
                    "deleted": record.deleted,
                }
            ),
            client_version=client_version,
            server_version=record.version,
            resolution="server_wins",
            status=ConflictStatus.RESOLVED,
            created_at=datetime.now(timezone.utc),
            resolved_at=datetime.now(timezone.utc),
        )

        ConflictRepository.create(
            db,
            conflict,
        )

        return conflict

    @staticmethod
    def resolve_server_wins(
        record: Record,
    ) -> Record:

        return record
