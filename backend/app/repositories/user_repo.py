from app.database.core import db
from app.models.user import User


class UserRepository:
    @staticmethod
    def get_by_id(user_id: str) -> User:
        return User.query.filter_by(id=user_id, is_deleted=False).first()

    @staticmethod
    def get_by_email(email: str) -> User:
        if not email:
            return None
        normalized_email = email.strip().lower()
        return User.query.filter_by(email=normalized_email, is_deleted=False).first()

    @staticmethod
    def create(user_data: dict) -> User:
        if "email" in user_data and isinstance(user_data["email"], str):
            user_data["email"] = user_data["email"].strip().lower()
        user = User(**user_data)
        db.session.add(user)
        db.session.commit()
        return user
