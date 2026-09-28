from enum import StrEnum


class SyncStatus(StrEnum):
    PENDING = "pending"
    PROCESSING = "processing"
    SUCCESS = "success"
    FAILED = "failed"
    CONFLICT = "conflict"
    SKIPPED = "skipped"


class ConflictStatus(StrEnum):
    NONE = "none"
    DETECTED = "detected"
    RESOLVED = "resolved"
    MANUAL = "manual"
