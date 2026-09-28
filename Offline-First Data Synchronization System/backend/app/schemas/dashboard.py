from datetime import datetime

from pydantic import BaseModel


class SyncStatistics(BaseModel):
    pending_changes: int
    successful_syncs: int
    failed_syncs: int
    conflicts: int
    total_sync_operations: int
    last_sync_time: datetime | None


class DashboardResponse(BaseModel):
    statistics: SyncStatistics
