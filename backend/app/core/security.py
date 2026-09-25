from flask_jwt_extended import JWTManager
from flask_mail import Mail
from werkzeug.security import generate_password_hash, check_password_hash

# Global security structures initialized without app contexts.
jwt = JWTManager()
mail = Mail()


def init_security(app):
    """Register security and mailing helpers with Flask application context."""
    jwt.init_app(app)
    mail.init_app(app)


def hash_password(password: str) -> str:
    """Generate a password hash."""
    return generate_password_hash(password)


def verify_password(password: str, hashed: str) -> bool:
    """Check credentials validity."""
    return check_password_hash(hashed, password)
