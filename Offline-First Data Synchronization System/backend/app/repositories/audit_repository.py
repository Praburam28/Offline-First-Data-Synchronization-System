from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog


class AuditRepository:

    @staticmethod
    def create(
        db: Session,
        audit_log: AuditLog,
    ) -> AuditLog:

        db.add(audit_log)
        db.flush()

        return audit_log