from datetime import timedelta, datetime, timezone
from flask_jwt_extended import create_access_token, create_refresh_token
from app.repositories.user_repo import UserRepository
from app.repositories.session_repo import SessionRepository
from app.security.hashing import hash_password, verify_password, hash_token
from app.core.exceptions import AuthenticationError, ConflictError
from app.models.user import RoleEnum


class AuthService:
    @staticmethod
    def register_user(data: dict):
        if UserRepository.get_by_email(data["email"]):
            raise ConflictError("User with this email already exists.")

        data["password_hash"] = hash_password(data.pop("password"))

        # Role is ALWAYS forced to Customer on public registration.
        # Any "role" key from the schema is discarded. Privileged roles can
        # only be assigned by an administrator via a separate admin API.
        data.pop("role", None)
        data["role"] = RoleEnum.CUSTOMER

        return UserRepository.create(data)

    @staticmethod
    def login(
        email: str, password: str, device_info: str = None, ip_address: str = None
    ):
        user = UserRepository.get_by_email(email)
        if not user or not verify_password(password, user.password_hash):
            raise AuthenticationError("Invalid email or password.")

        access_token = create_access_token(identity=user)
        # Raw refresh token — returned to client once, never stored in plaintext
        refresh_token = create_refresh_token(identity=user)

        import uuid
        family_id = str(uuid.uuid4())

        # Persist only the HMAC-SHA256 hash of the refresh token
        SessionRepository.create(
            {
                "user_id": user.id,
                "family_id": family_id,
                "refresh_token_hash": hash_token(refresh_token),
                "device_info": device_info,
                "ip_address": ip_address,
                "expires_at": datetime.now(timezone.utc) + timedelta(days=30),
            }
        )

        return user, access_token, refresh_token

    @staticmethod
    def refresh_tokens(user, old_refresh_token: str):
        """Rotate refresh token with reuse detection and session expiry enforcement.

        Returns (new_access_token, new_refresh_token).

        Security guarantees:
        - The old session is looked up by its HMAC hash, checking is_revoked=False
          AND expires_at > now (enforced in SessionRepository).
        - Once found, the old session is immediately revoked before issuing new tokens
          so that a replay of the old token will not find a valid session.
        - A brand-new session row is created for the new refresh token.
        - If the token is already revoked/expired/unknown, AuthenticationError is raised.
        """
        session = SessionRepository.get_any_by_refresh_token(old_refresh_token)
        if not session or session.user_id != user.id:
            raise AuthenticationError("Invalid refresh token.")

        if session.is_revoked:
            # Token reuse detected! Check grace period (5 seconds)
            now = datetime.now(timezone.utc)
            if session.updated_at and session.updated_at.tzinfo is None:
                updated_at_aware = session.updated_at.replace(tzinfo=timezone.utc)
            else:
                updated_at_aware = session.updated_at
                
            if updated_at_aware and (now - updated_at_aware) < timedelta(seconds=5):
                # Benign concurrent refresh: reject but do not penalize
                raise AuthenticationError("Concurrent refresh detected.")
            
            # Malicious reuse: Revoke the entire token family
            SessionRepository.revoke_family(session.family_id)
            raise AuthenticationError("Token reuse detected. All related sessions revoked.")

        expires_at_aware = session.expires_at.replace(tzinfo=timezone.utc) if session.expires_at.tzinfo is None else session.expires_at
        if expires_at_aware < datetime.now(timezone.utc):
            raise AuthenticationError("Refresh token expired.")

        # Revoke the old session atomically before issuing new credentials.
        SessionRepository.revoke(session)

        # Issue new token pair
        new_access_token = create_access_token(identity=user)
        new_refresh_token = create_refresh_token(identity=user)

        # Persist only the HMAC hash of the new refresh token
        SessionRepository.create(
            {
                "user_id": user.id,
                "family_id": session.family_id,
                "refresh_token_hash": hash_token(new_refresh_token),
                "device_info": session.device_info,
                "ip_address": session.ip_address,
                "expires_at": datetime.now(timezone.utc) + timedelta(days=30),
            }
        )

        return new_access_token, new_refresh_token

