from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database.core import db
from app.models.mixins import UUIDMixin, TimestampMixin


class Session(UUIDMixin, TimestampMixin, db.Model):
    __tablename__ = "sessions"

    user_id = Column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    family_id = Column(String(36), nullable=False, index=True)
    # Stores HMAC-SHA256 hash of the raw refresh token — never the raw token.
    # The raw token is returned to the client once at issuance and never persisted.
    refresh_token_hash = Column(String(64), unique=True, nullable=False, index=True)
    device_info = Column(String(255), nullable=True)
    ip_address = Column(String(45), nullable=True)
    expires_at = Column(DateTime, nullable=False)
    is_revoked = Column(Boolean, default=False, nullable=False)

    user = relationship("User", back_populates="sessions")
