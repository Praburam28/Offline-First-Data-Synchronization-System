from datetime import datetime, timezone
from uuid import uuid4

from sqlalchemy.orm import Session

from app.models.record import Record
from app.repositories.record_repository import RecordRepository
from app.schemas.record import (
    RecordCreate,
    RecordUpdate,
)


class RecordService:

    @staticmethod
    def create(
        db: Session,
        user_id: int,
        data: RecordCreate,
    ) -> Record:

        record_id = data.id or str(uuid4())

        existing = RecordRepository.get_by_id(
            db,
            record_id,
        )

        if existing:
            raise ValueError(
                "A record with this ID already exists"
            )

        record = Record(
            id=record_id,
            owner_id=user_id,
            title=data.title,
            content=data.content,
            version=1,
            updated_at=datetime.now(timezone.utc),
            deleted=False,
        )

        RecordRepository.create(
            db,
            record,
        )

        db.commit()
        db.refresh(record)

        return record

    @staticmethod
    def get(
        db: Session,
        user_id: int,
        record_id: str,
    ) -> Record:

        record = RecordRepository.get_by_id(
            db,
            record_id,
            user_id,
        )

        if not record or record.deleted:
            raise ValueError("Record not found")

        return record

    @staticmethod
    def update(
        db: Session,
        user_id: int,
        record_id: str,
        data: RecordUpdate,
    ) -> Record:

        record = RecordRepository.get_by_id(
            db,
            record_id,
            user_id,
        )

        if not record or record.deleted:
            raise ValueError("Record not found")

        if record.version != data.version:
            raise ValueError(
                "Record has been modified on the server"
            )

        if data.title is not None:
            record.title = data.title

        if data.content is not None:
            record.content = data.content

        record.version += 1
        record.updated_at = datetime.now(timezone.utc)

        RecordRepository.update(
            db,
            record,
        )

        db.commit()
        db.refresh(record)

        return record

    @staticmethod
    def delete(
        db: Session,
        user_id: int,
        record_id: str,
        version: int,
    ) -> Record:

        record = RecordRepository.get_by_id(
            db,
            record_id,
            user_id,
        )

        if not record or record.deleted:
            raise ValueError("Record not found")

        if record.version != version:
            raise ValueError(
                "Record has been modified on the server"
            )

        record.deleted = True
        record.version += 1
        record.updated_at = datetime.now(timezone.utc)

        RecordRepository.update(
            db,
            record,
        )

        db.commit()
        db.refresh(record)

        return record

    @staticmethod
    def list(
        db: Session,
        user_id: int,
        page: int,
        page_size: int,
        search: str | None = None,
        include_deleted: bool = False,
        sort_by: str = "updated_at",
        sort_order: str = "desc",
    ):

        total = RecordRepository.count(
            db=db,
            user_id=user_id,
            search=search,
            include_deleted=include_deleted,
        )

        records = RecordRepository.list_records(
            db=db,
            user_id=user_id,
            page=page,
            page_size=page_size,
            search=search,
            include_deleted=include_deleted,
            sort_by=sort_by,
            sort_order=sort_order,
        )

        total_pages = (
            (total + page_size - 1) // page_size
            if total
            else 0
        )

        return {
            "items": records,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages,
        }
