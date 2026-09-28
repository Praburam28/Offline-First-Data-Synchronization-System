from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.models.record import Record


class RecordRepository:

    @staticmethod
    def get_by_id(
        db: Session,
        record_id: str,
        user_id: int | None = None,
    ) -> Record | None:

        statement = select(Record).where(
            Record.id == record_id
        )

        if user_id is not None:
            statement = statement.where(
                Record.owner_id == user_id
            )

        return db.scalar(statement)

    @staticmethod
    def create(
        db: Session,
        record: Record,
    ) -> Record:

        db.add(record)
        db.flush()

        return record

    @staticmethod
    def update(
        db: Session,
        record: Record,
    ) -> Record:

        db.add(record)
        db.flush()

        return record

    @staticmethod
    def count(
        db: Session,
        user_id: int,
        search: str | None = None,
        include_deleted: bool = False,
    ) -> int:

        statement = select(
            func.count(Record.id)
        ).where(
            Record.owner_id == user_id
        )

        if not include_deleted:
            statement = statement.where(
                Record.deleted.is_(False)
            )

        if search:
            search_value = f"%{search}%"

            statement = statement.where(
                or_(
                    Record.title.ilike(search_value),
                    Record.content.ilike(search_value),
                )
            )

        return db.scalar(statement) or 0

    @staticmethod
    def list_records(
        db: Session,
        user_id: int,
        page: int,
        page_size: int,
        search: str | None = None,
        include_deleted: bool = False,
        sort_by: str = "updated_at",
        sort_order: str = "desc",
    ) -> list[Record]:

        allowed_sort_columns = {
            "title": Record.title,
            "updated_at": Record.updated_at,
            "version": Record.version,
        }

        sort_column = allowed_sort_columns.get(
            sort_by,
            Record.updated_at,
        )

        statement = select(Record).where(
            Record.owner_id == user_id
        )

        if not include_deleted:
            statement = statement.where(
                Record.deleted.is_(False)
            )

        if search:
            search_value = f"%{search}%"

            statement = statement.where(
                or_(
                    Record.title.ilike(search_value),
                    Record.content.ilike(search_value),
                )
            )

        if sort_order.lower() == "asc":
            statement = statement.order_by(
                sort_column.asc()
            )
        else:
            statement = statement.order_by(
                sort_column.desc()
            )

        offset = (page - 1) * page_size

        statement = statement.offset(
            offset
        ).limit(
            page_size
        )

        return list(db.scalars(statement).all())
