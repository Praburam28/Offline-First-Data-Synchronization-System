from datetime import datetime

from pydantic import BaseModel, Field

from app.constants.operation_types import OperationType


class SyncOperationRequest(BaseModel):
    sync_id: str = Field(
        min_length=1,
        max_length=36,
    )

    record_id: str = Field(
        min_length=1,
        max_length=36,
    )

    operation: OperationType

    client_version: int = Field(
        ge=1,
    )

    payload: dict = Field(
        default_factory=dict,
    )

    client_timestamp: datetime | None = None


class SyncBatchRequest(BaseModel):
    operations: list[SyncOperationRequest] = Field(
        default_factory=list,
        max_length=100,
    )


class SyncOperationResponse(BaseModel):
    sync_id: str
    record_id: str
    status: str
    conflict_status: str
    message: str
    server_version: int | None = None
    error_details: str | None = None


class SyncBatchResponse(BaseModel):
    results: list[SyncOperationResponse]
    total_operations: int
    successful: int
    failed: int
    conflicts: int


class SyncHistoryResponse(BaseModel):
    id: int
    sync_id: str
    record_id: str
    operation: str
    status: str
    error_details: str | None
    conflict_status: str
    timestamp: datetime

    class Config:
        from_attributes = True
