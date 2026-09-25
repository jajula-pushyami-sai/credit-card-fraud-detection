from sqlalchemy import Column, String, Enum, Boolean, JSON
from sqlalchemy.orm import relationship
from app.database.core import db
from app.models.mixins import UUIDMixin, TimestampMixin, SoftDeleteMixin
import enum


class RoleEnum(enum.Enum):
    CUSTOMER = "Customer"
    ANALYST = "Fraud Analyst"
    ADMIN = "Administrator"


class User(UUIDMixin, TimestampMixin, SoftDeleteMixin, db.Model):
    __tablename__ = "users"

    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    role = Column(Enum(RoleEnum), default=RoleEnum.CUSTOMER, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    email_verified = Column(Boolean, default=False, nullable=False)

    # Profile Settings Fields
    organization = Column(String(255), nullable=True)
    department = Column(String(255), nullable=True)
    employee_id = Column(String(100), nullable=True)
    phone = Column(String(50), nullable=True)
    location = Column(String(255), nullable=True)

    # Notification Preferences
    notification_preferences = Column(JSON, nullable=True)

    sessions = relationship(
        "Session", back_populates="user", cascade="all, delete-orphan"
    )
    reviews = relationship("Review", back_populates="analyst")
    audit_logs = relationship("AuditLog", back_populates="user")

    def __repr__(self):
        return f"<User {self.email} ({self.role.value})>"
