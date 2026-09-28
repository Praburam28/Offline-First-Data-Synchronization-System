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


class Conflict(Base):
    __tablename__ = "conflicts"

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

    client_payload: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    server_payload: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    client_version: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    server_version: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    resolution: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="server_wins",
        server_default="server_wins",
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="resolved",
        server_default="resolved",
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        index=True,
    )

    resolved_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    user = relationship(
        "User",
        back_populates="conflicts",
    )

    record = relationship(
        "Record",
        back_populates="conflicts",
    )
