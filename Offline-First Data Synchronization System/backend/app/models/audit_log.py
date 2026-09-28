from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.core.database import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    entity_type = Column(String(50), nullable=False, default="record")
    entity_id = Column(
        Integer,
        ForeignKey("records.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    action = Column(String(50), nullable=False, index=True)
    details = Column(Text, nullable=True)

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )

    user = relationship(
        "User",
        back_populates="audit_logs",
        foreign_keys=[user_id],
    )

    record = relationship(
        "Record",
        back_populates="audit_logs",
        foreign_keys=[entity_id],
    )
