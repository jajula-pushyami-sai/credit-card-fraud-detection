from sqlalchemy import Column, String, ForeignKey, DateTime
from app.database.core import db
from app.models.mixins import UUIDMixin, TimestampMixin


class VerificationToken(UUIDMixin, TimestampMixin, db.Model):
    __tablename__ = "verification_tokens"

    user_id = Column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    token = Column(String(128), unique=True, nullable=False, index=True)
    purpose = Column(
        String(50), nullable=False
    )  # e.g., 'email_verify', 'password_reset'
    expires_at = Column(DateTime, nullable=False)
