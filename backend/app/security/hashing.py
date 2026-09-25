import hashlib
import hmac
import os
import bcrypt


def _token_secret() -> bytes:
    """Return the HMAC secret used for refresh-token hashing.

    Uses JWT_SECRET_KEY from the environment so the hash is tied to a
    server-side secret (prevents offline brute-force even if the DB leaks).
    Falls back to a dev-only placeholder — production validation in
    config/settings.py ensures this is always set in prod.
    """
    secret = os.environ.get("JWT_SECRET_KEY", "dev-hmac-secret-not-for-production")
    return secret.encode("utf-8")


def hash_token(raw_token: str) -> str:
    """Return the HMAC-SHA256 hex digest of a raw token.

    Use this to hash refresh tokens before persisting them.  The raw token
    is returned to the client once at issuance and never stored.
    """
    return hmac.new(_token_secret(), raw_token.encode("utf-8"), hashlib.sha256).hexdigest()


def hash_password(password: str) -> str:
    """Hash a plaintext password using bcrypt."""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plaintext password against a hash."""
    return bcrypt.checkpw(
        plain_password.encode("utf-8"), hashed_password.encode("utf-8")
    )
