from sqlalchemy import Column, String, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database.core import db
from app.models.mixins import UUIDMixin, TimestampMixin


class AuditLog(UUIDMixin, TimestampMixin, db.Model):
    __tablename__ = "audit_logs"

    user_id = Column(
        String(36),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    action = Column(String(100), nullable=False, index=True)
    entity_type = Column(String(100), nullable=False)
    entity_id = Column(String(36), nullable=True)
    details = Column(JSON, nullable=True)
    ip_address = Column(String(45), nullable=True)

    user = relationship("User", back_populates="audit_logs")

    __table_args__ = (
        db.Index("idx_audit_logs_created_at", "created_at"),
    )
