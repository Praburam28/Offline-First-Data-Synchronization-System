from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Record(Base):
    __tablename__ = "records"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
    )

    owner_id: Mapped[int] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    content: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    version: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1,
        server_default="1",
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        index=True,
    )

    deleted: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
        server_default="0",
        index=True,
    )

    owner = relationship(
        "User",
        back_populates="records",
    )

    sync_operations = relationship(
        "LocalSyncOperation",
        back_populates="record",
    )

    sync_history = relationship(
        "SyncHistory",
        back_populates="record",
    )

    conflicts = relationship(
        "Conflict",
        back_populates="record",
    )

    audit_logs = relationship(
        "AuditLog",
        back_populates="record",
        foreign_keys="AuditLog.entity_id",
    )