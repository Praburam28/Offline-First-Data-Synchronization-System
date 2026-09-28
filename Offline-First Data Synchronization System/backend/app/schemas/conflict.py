from datetime import datetime

from pydantic import BaseModel


class ConflictResponse(BaseModel):
    id: int
    sync_id: str
    record_id: str
    client_payload: dict
    server_payload: dict
    client_version: int
    server_version: int
    resolution: str
    status: str
    created_at: datetime
    resolved_at: datetime | None

    class Config:
        from_attributes = True


class ConflictResolutionRequest(BaseModel):
    resolution: str
