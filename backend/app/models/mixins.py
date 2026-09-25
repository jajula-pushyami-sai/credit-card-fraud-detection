import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, Boolean, String
from sqlalchemy.orm import declarative_mixin


def utcnow():
    return datetime.now(timezone.utc)


@declarative_mixin
class UUIDMixin:
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))


@declarative_mixin
class TimestampMixin:
    created_at = Column(DateTime, default=utcnow, nullable=False)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow, nullable=False)


@declarative_mixin
class SoftDeleteMixin:
    is_deleted = Column(Boolean, default=False, nullable=False)
    deleted_at = Column(DateTime, nullable=True)

    def soft_delete(self):
        self.is_deleted = True
        self.deleted_at = utcnow()
