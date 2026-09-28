from sqlalchemy.orm import Session

from app.constants.sync_status import SyncStatus
from app.repositories.conflict_repository import ConflictRepository
from app.repositories.sync_repository import SyncRepository


class DashboardService:

    @staticmethod
    def get_statistics(
        db: Session,
        user_id: int,
    ):

        pending = SyncRepository.count_by_status(
            db,
            user_id,
            SyncStatus.PENDING,
        )

        successful = SyncRepository.count_by_status(
            db,
            user_id,
            SyncStatus.SUCCESS,
        )

        failed = SyncRepository.count_by_status(
            db,
            user_id,
            SyncStatus.FAILED,
        )

        conflicts = ConflictRepository.count(
            db,
            user_id,
        )

        total = SyncRepository.count_all(
            db,
            user_id,
        )

        last_sync = SyncRepository.get_last_sync_time(
            db,
            user_id,
        )

        return {
            "pending_changes": pending,
            "successful_syncs": successful,
            "failed_syncs": failed,
            "conflicts": conflicts,
            "total_sync_operations": total,
            "last_sync_time": last_sync,
        }
