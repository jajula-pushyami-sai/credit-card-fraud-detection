from sqlalchemy import Column, String, Numeric, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from app.database.core import db
from app.models.mixins import UUIDMixin, TimestampMixin
import enum


class TransactionStatus(enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    DECLINED = "declined"
    FLAGGED = "flagged"


class Transaction(UUIDMixin, TimestampMixin, db.Model):
    __tablename__ = "transactions"

    __table_args__ = (
        db.Index("idx_transactions_user_status", "user_id", "status"),
        db.Index("idx_transactions_status_date", "status", "transaction_date"),
    )

    user_id = Column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    merchant = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(3), default="USD", nullable=False)
    status = Column(
        Enum(TransactionStatus),
        default=TransactionStatus.PENDING,
        nullable=False,
        index=True,
    )
    transaction_date = Column(DateTime, nullable=False, index=True)

    # Relationships
    prediction = relationship(
        "Prediction",
        back_populates="transaction",
        uselist=False,
        cascade="all, delete-orphan",
    )
    review = relationship(
        "Review",
        back_populates="transaction",
        uselist=False,
        cascade="all, delete-orphan",
    )
