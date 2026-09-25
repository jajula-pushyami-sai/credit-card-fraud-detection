from sqlalchemy import Column, String, Boolean, ForeignKey
from app.database.core import db
from app.models.mixins import UUIDMixin, TimestampMixin


class Notification(UUIDMixin, TimestampMixin, db.Model):
    __tablename__ = "notifications"

    user_id = Column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title = Column(String(255), nullable=False)
    message = Column(String(1000), nullable=False)
    is_read = Column(Boolean, default=False, nullable=False)
    type = Column(String(50), nullable=False)  # e.g., 'alert', 'system'


class ModelMetadata(UUIDMixin, TimestampMixin, db.Model):
    __tablename__ = "model_metadata"

    version = Column(String(50), unique=True, nullable=False)
    is_active = Column(Boolean, default=False, nullable=False)
    metrics = Column(String(1000), nullable=True)  # JSON string or basic text for now
