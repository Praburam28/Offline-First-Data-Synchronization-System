from datetime import datetime

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.local_sync_operation import LocalSyncOperation
from app.models.sync_history import SyncHistory


class SyncRepository:

    @staticmethod
    def get_operation_by_sync_id(
        db: Session,
        sync_id: str,
    ) -> LocalSyncOperation | None:

        statement = select(
            LocalSyncOperation
        ).where(
            LocalSyncOperation.sync_id == sync_id
        )

        return db.scalar(statement)

    @staticmethod
    def create_operation(
        db: Session,
        operation: LocalSyncOperation,
    ) -> LocalSyncOperation:

        db.add(operation)
        db.flush()

        return operation

    @staticmethod
    def update_operation(
        db: Session,
        operation: LocalSyncOperation,
    ) -> LocalSyncOperation:

        db.add(operation)
        db.flush()

        return operation

    @staticmethod
    def create_history(
        db: Session,
        history: SyncHistory,
    ) -> SyncHistory:

        db.add(history)
        db.flush()

        return history

    @staticmethod
    def get_history(
        db: Session,
        user_id: int,
        page: int,
        page_size: int,
        status: str | None = None,
        conflict_status: str | None = None,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
        sort_order: str = "desc",
    ) -> list[SyncHistory]:

        statement = select(
            SyncHistory
        ).where(
            SyncHistory.user_id == user_id
        )

        if status:
            statement = statement.where(
                SyncHistory.status == status
            )

        if conflict_status:
            statement = statement.where(
                SyncHistory.conflict_status == conflict_status
            )

        if start_date:
            statement = statement.where(
                SyncHistory.timestamp >= start_date
            )

        if end_date:
            statement = statement.where(
                SyncHistory.timestamp <= end_date
            )

        if sort_order.lower() == "asc":
            statement = statement.order_by(
                SyncHistory.timestamp.asc()
            )
        else:
            statement = statement.order_by(
                SyncHistory.timestamp.desc()
            )

        offset = (page - 1) * page_size

        statement = statement.offset(
            offset
        ).limit(
            page_size
        )

        return list(db.scalars(statement).all())

    @staticmethod
    def count_by_status(
        db: Session,
        user_id: int,
        status: str,
    ) -> int:

        statement = select(
            func.count(SyncHistory.id)
        ).where(
            SyncHistory.user_id == user_id,
            SyncHistory.status == status,
        )

        return db.scalar(statement) or 0

    @staticmethod
    def count_all(
        db: Session,
        user_id: int,
    ) -> int:

        statement = select(
            func.count(SyncHistory.id)
        ).where(
            SyncHistory.user_id == user_id
        )

        return db.scalar(statement) or 0

    @staticmethod
    def get_last_sync_time(
        db: Session,
        user_id: int,
    ):

        statement = select(
            func.max(SyncHistory.timestamp)
        ).where(
            SyncHistory.user_id == user_id
        )

        return db.scalar(statement)
