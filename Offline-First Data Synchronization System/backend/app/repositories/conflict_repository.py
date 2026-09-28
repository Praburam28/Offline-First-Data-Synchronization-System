from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.conflict import Conflict


class ConflictRepository:

    @staticmethod
    def create(
        db: Session,
        conflict: Conflict,
    ) -> Conflict:

        db.add(conflict)
        db.flush()

        return conflict

    @staticmethod
    def get_by_id(
        db: Session,
        conflict_id: int,
        user_id: int,
    ) -> Conflict | None:

        statement = select(Conflict).where(
            Conflict.id == conflict_id,
            Conflict.user_id == user_id,
        )

        return db.scalar(statement)

    @staticmethod
    def get_by_sync_id(
        db: Session,
        sync_id: str,
        user_id: int,
    ) -> Conflict | None:

        statement = select(Conflict).where(
            Conflict.sync_id == sync_id,
            Conflict.user_id == user_id,
        )

        return db.scalar(statement)

    @staticmethod
    def list_conflicts(
        db: Session,
        user_id: int,
        page: int,
        page_size: int,
        status: str | None = None,
        sort_order: str = "desc",
    ) -> list[Conflict]:

        statement = select(Conflict).where(
            Conflict.user_id == user_id
        )

        if status:
            statement = statement.where(
                Conflict.status == status
            )

        if sort_order.lower() == "asc":
            statement = statement.order_by(
                Conflict.created_at.asc()
            )
        else:
            statement = statement.order_by(
                Conflict.created_at.desc()
            )

        offset = (page - 1) * page_size

        statement = statement.offset(
            offset
        ).limit(
            page_size
        )

        return list(db.scalars(statement).all())

    @staticmethod
    def count(
        db: Session,
        user_id: int,
        status: str | None = None,
    ) -> int:

        statement = select(
            func.count(Conflict.id)
        ).where(
            Conflict.user_id == user_id
        )

        if status:
            statement = statement.where(
                Conflict.status == status
            )

        return db.scalar(statement) or 0
