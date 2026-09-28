from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserProfileResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserProfileUpdate(BaseModel):
    email: EmailStr | None = None

    username: str | None = Field(
        default=None,
        min_length=3,
        max_length=100,
    )
