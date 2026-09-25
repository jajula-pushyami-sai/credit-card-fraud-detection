from sqlalchemy import Column, String, Enum, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database.core import db
from app.models.mixins import UUIDMixin, TimestampMixin
import enum


class ReviewStatus(enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"  # False positive
    REJECTED = "rejected"  # True positive (fraud confirmed)


class Review(UUIDMixin, TimestampMixin, db.Model):
    __tablename__ = "reviews"

    transaction_id = Column(
        String(36),
        ForeignKey("transactions.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    analyst_id = Column(String(36), ForeignKey("users.id"), nullable=True, index=True)
    status = Column(Enum(ReviewStatus), default=ReviewStatus.PENDING, nullable=False)
    notes = Column(Text, nullable=True)

    transaction = relationship("Transaction", back_populates="review")
    analyst = relationship("User", back_populates="reviews")
