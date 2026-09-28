import json
from datetime import datetime, timezone

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.constants.operation_types import OperationType
from app.constants.sync_status import ConflictStatus, SyncStatus
from app.models.audit_log import AuditLog
from app.models.local_sync_operation import LocalSyncOperation
from app.models.record import Record
from app.models.sync_history import SyncHistory
from app.repositories.audit_repository import AuditRepository
from app.repositories.record_repository import RecordRepository
from app.repositories.sync_repository import SyncRepository
from app.services.conflict_service import ConflictService
from app.schemas.sync import SyncOperationRequest


class SyncService:

    @staticmethod
    def process_operation(
        db: Session,
        user_id: int,
        operation_data: SyncOperationRequest,
    ):

        sync_id = operation_data.sync_id

        # -------------------------------------------------
        # 1. IDEMPOTENCY CHECK
        # -------------------------------------------------

        existing_operation = (
            SyncRepository.get_operation_by_sync_id(
                db,
                sync_id,
            )
        )

        if existing_operation:

            existing_history = SyncRepository.get_history(
                db=db,
                user_id=user_id,
                page=1,
                page_size=1,
            )

            for history in existing_history:
                if history.sync_id == sync_id:
                    return {
                        "sync_id": sync_id,
                        "record_id": operation_data.record_id,
                        "status": history.status,
                        "conflict_status": history.conflict_status,
                        "message": "Operation already processed",
                        "server_version": None,
                        "error_details": history.error_details,
                    }

            return {
                "sync_id": sync_id,
                "record_id": operation_data.record_id,
                "status": existing_operation.status,
                "conflict_status": "none",
                "message": "Operation already exists",
                "server_version": None,
                "error_details": None,
            }

        # -------------------------------------------------
        # 2. START TRANSACTION
        # -------------------------------------------------

        try:

            operation = LocalSyncOperation(
                sync_id=sync_id,
                user_id=user_id,
                record_id=operation_data.record_id,
                operation=operation_data.operation.value,
                client_version=operation_data.client_version,
                payload=json.dumps(
                    operation_data.payload
                ),
                status=SyncStatus.PROCESSING,
                created_at=datetime.now(timezone.utc),
            )

            SyncRepository.create_operation(
                db,
                operation,
            )

            # -------------------------------------------------
            # 3. FIND RECORD
            # -------------------------------------------------

            record = RecordRepository.get_by_id(
                db,
                operation_data.record_id,
            )

            # -------------------------------------------------
            # 4. CREATE OPERATION
            # -------------------------------------------------

            if operation_data.operation == OperationType.CREATE:

                if record:

                    if (
                        record.owner_id != user_id
                    ):
                        raise ValueError(
                            "Record belongs to another user"
                        )

                    raise ValueError(
                        "Record already exists"
                    )

                record = Record(
                    id=operation_data.record_id,
                    owner_id=user_id,
                    title=operation_data.payload.get(
                        "title",
                        "",
                    ),
                    content=operation_data.payload.get(
                        "content",
                        "",
                    ),
                    version=1,
                    updated_at=datetime.now(timezone.utc),
                    deleted=False,
                )

                RecordRepository.create(
                    db,
                    record,
                )

                server_version = record.version

                conflict_status = ConflictStatus.NONE

                message = "Record created successfully"

            # -------------------------------------------------
            # 5. UPDATE / DELETE
            # -------------------------------------------------

            elif operation_data.operation in (
                OperationType.UPDATE,
                OperationType.DELETE,
            ):

                if not record:

                    raise ValueError(
                        "Record not found"
                    )

                if record.owner_id != user_id:

                    raise ValueError(
                        "Record belongs to another user"
                    )

                # -------------------------------------------------
                # OPTIMISTIC CONCURRENCY CHECK
                # -------------------------------------------------

                if (
                    record.version
                    != operation_data.client_version
                ):

                    ConflictService.detect(
                        db=db,
                        sync_id=sync_id,
                        record=record,
                        user_id=user_id,
                        client_version=(
                            operation_data.client_version
                        ),
                        client_payload=(
                            operation_data.payload
                        ),
                    )

                    operation.status = (
                        SyncStatus.CONFLICT
                    )

                    operation.processed_at = (
                        datetime.now(timezone.utc)
                    )

                    history = SyncHistory(
                        sync_id=sync_id,
                        record_id=record.id,
                        user_id=user_id,
                        operation=(
                            operation_data.operation.value
                        ),
                        status=SyncStatus.CONFLICT,
                        error_details=(
                            "Client version does not match "
                            "server version"
                        ),
                        conflict_status=(
                            ConflictStatus.RESOLVED
                        ),
                        timestamp=datetime.now(
                            timezone.utc
                        ),
                    )

                    SyncRepository.create_history(
                        db,
                        history,
                    )

                    audit = AuditLog(
                        user_id=user_id,
                        action="sync_conflict",
                        entity_type="record",
                        entity_id=record.id,
                        details=(
                            "Conflict detected. "
                            "Server-Wins strategy applied."
                        ),
                        created_at=datetime.now(
                            timezone.utc
                        ),
                    )

                    AuditRepository.create(
                        db,
                        audit,
                    )

                    db.commit()

                    return {
                        "sync_id": sync_id,
                        "record_id": record.id,
                        "status": SyncStatus.CONFLICT,
                        "conflict_status": (
                            ConflictStatus.RESOLVED
                        ),
                        "message": (
                            "Conflict detected. "
                            "Server version retained."
                        ),
                        "server_version": record.version,
                        "error_details": (
                            "Client version does not "
                            "match server version"
                        ),
                    }

                # -------------------------------------------------
                # UPDATE
                # -------------------------------------------------

                if operation_data.operation == OperationType.UPDATE:

                    if "title" in operation_data.payload:
                        record.title = (
                            operation_data.payload["title"]
                        )

                    if "content" in operation_data.payload:
                        record.content = (
                            operation_data.payload["content"]
                        )

                    record.version += 1
                    record.updated_at = (
                        datetime.now(timezone.utc)
                    )

                    server_version = record.version

                    message = (
                        "Record updated successfully"
                    )

                # -------------------------------------------------
                # DELETE
                # -------------------------------------------------

                else:

                    record.deleted = True
                    record.version += 1
                    record.updated_at = (
                        datetime.now(timezone.utc)
                    )

                    server_version = record.version

                    message = (
                        "Record deleted successfully"
                    )

                RecordRepository.update(
                    db,
                    record,
                )

                conflict_status = ConflictStatus.NONE

            else:

                raise ValueError(
                    "Unsupported synchronization operation"
                )

            # -------------------------------------------------
            # 6. SUCCESS
            # -------------------------------------------------

            operation.status = SyncStatus.SUCCESS
            operation.processed_at = (
                datetime.now(timezone.utc)
            )

            history = SyncHistory(
                sync_id=sync_id,
                record_id=operation_data.record_id,
                user_id=user_id,
                operation=(
                    operation_data.operation.value
                ),
                status=SyncStatus.SUCCESS,
                error_details=None,
                conflict_status=conflict_status,
                timestamp=datetime.now(timezone.utc),
            )

            SyncRepository.create_history(
                db,
                history,
            )

            # -------------------------------------------------
            # 7. AUDIT
            # -------------------------------------------------

            audit = AuditLog(
                user_id=user_id,
                action=f"sync_{operation_data.operation.value}",
                entity_type="record",
                entity_id=operation_data.record_id,
                details=json.dumps(
                    {
                        "sync_id": sync_id,
                        "status": "success",
                    }
                ),
                created_at=datetime.now(timezone.utc),
            )

            AuditRepository.create(
                db,
                audit,
            )

            # -------------------------------------------------
            # 8. COMMIT EVERYTHING
            # -------------------------------------------------

            db.commit()

            return {
                "sync_id": sync_id,
                "record_id": operation_data.record_id,
                "status": SyncStatus.SUCCESS,
                "conflict_status": conflict_status,
                "message": message,
                "server_version": server_version,
                "error_details": None,
            }

        except IntegrityError:

            db.rollback()

            return {
                "sync_id": sync_id,
                "record_id": operation_data.record_id,
                "status": SyncStatus.FAILED,
                "conflict_status": ConflictStatus.NONE,
                "message": (
                    "Synchronization operation "
                    "already exists or violates "
                    "a database constraint"
                ),
                "server_version": None,
                "error_details": (
                    "Database integrity error"
                ),
            }

        except Exception as exc:

            db.rollback()

            return {
                "sync_id": sync_id,
                "record_id": operation_data.record_id,
                "status": SyncStatus.FAILED,
                "conflict_status": ConflictStatus.NONE,
                "message": "Synchronization failed",
                "server_version": None,
                "error_details": str(exc),
            }

    @staticmethod
    def process_batch(
        db: Session,
        user_id: int,
        operations: list[SyncOperationRequest],
    ):

        results = []

        for operation in operations:

            result = SyncService.process_operation(
                db=db,
                user_id=user_id,
                operation_data=operation,
            )

            results.append(result)

        successful = sum(
            1
            for result in results
            if result["status"] == SyncStatus.SUCCESS
        )

        failed = sum(
            1
            for result in results
            if result["status"] == SyncStatus.FAILED
        )

        conflicts = sum(
            1
            for result in results
            if result["status"] == SyncStatus.CONFLICT
        )

        return {
            "results": results,
            "total_operations": len(results),
            "successful": successful,
            "failed": failed,
            "conflicts": conflicts,
        }
