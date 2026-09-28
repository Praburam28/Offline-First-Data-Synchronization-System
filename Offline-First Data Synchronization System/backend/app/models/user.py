from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, Integer, String
from sqlalchemy.orm import relationship

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
    )

    email = Column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )

    hashed_password = Column(
	String(255), 
	nullable=False
    )

    role = Column(
        String(50),
        nullable=False,
        default="user",
        index=True,
    )

    is_active = Column(
        Boolean,
        nullable=False,
        default=True,
    )

    created_at = Column(
        DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    updated_at = Column(
        DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    records = relationship(
        "Record",
        back_populates="owner",
        foreign_keys="Record.owner_id",
    )

    sync_operations = relationship(
        "LocalSyncOperation",
        back_populates="user",
        foreign_keys="LocalSyncOperation.user_id",
    )

    sync_history = relationship(
        "SyncHistory",
        back_populates="user",
        foreign_keys="SyncHistory.user_id",
    )

    conflicts = relationship(
        "Conflict",
        back_populates="user",
        foreign_keys="Conflict.user_id",
    )

    audit_logs = relationship(
        "AuditLog",
        back_populates="user",
        foreign_keys="AuditLog.user_id",
    )
