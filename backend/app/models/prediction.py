from sqlalchemy import Column, String, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database.core import db
from app.models.mixins import UUIDMixin, TimestampMixin


class Prediction(UUIDMixin, TimestampMixin, db.Model):
    __tablename__ = "predictions"

    transaction_id = Column(
        String(36),
        ForeignKey("transactions.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    model_version = Column(String(50), nullable=False)
    risk_score = Column(Float, nullable=False)
    shap_values = Column(JSON, nullable=True)  # Explainability stub

    transaction = relationship("Transaction", back_populates="prediction")
