from datetime import datetime, timezone

from sqlalchemy import (
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class SyncHistory(Base):
    __tablename__ = "sync_history"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    sync_id: Mapped[str] = mapped_column(
        String(36),
        nullable=False,
        index=True,
    )

    record_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey(
            "records.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    operation: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        index=True,
    )

    error_details: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    conflict_status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="none",
        server_default="none",
        index=True,
    )

    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        index=True,
    )

    user = relationship(
        "User",
        back_populates="sync_history",
    )

    record = relationship(
        "Record",
        back_populates="sync_history",
    )
