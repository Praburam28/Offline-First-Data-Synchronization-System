from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class RecordCreate(BaseModel):
    id: str | None = Field(
        default=None,
        max_length=36,
    )

    title: str = Field(
        min_length=1,
        max_length=255,
    )

    content: str = ""


class RecordUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=255,
    )

    content: str | None = None

    version: int = Field(
        ge=1,
    )


class RecordResponse(BaseModel):
    id: str
    owner_id: int
    title: str
    content: str
    version: int
    updated_at: datetime
    deleted: bool

    model_config = ConfigDict(from_attributes=True)


class RecordListResponse(BaseModel):
    items: list[RecordResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
