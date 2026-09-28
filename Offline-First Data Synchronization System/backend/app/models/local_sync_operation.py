from datetime import datetime, timezone

from sqlalchemy import (
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class LocalSyncOperation(Base):
    __tablename__ = "local_sync_operations"

    __table_args__ = (
        UniqueConstraint(
            "sync_id",
            name="uq_local_sync_operations_sync_id",
        ),
    )

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

    user_id: Mapped[int] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
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

    operation: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    client_version: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    payload: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="pending",
        server_default="pending",
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    processed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    user = relationship(
        "User",
        back_populates="sync_operations",
    )

    record = relationship(
        "Record",
        back_populates="sync_operations",
    )

