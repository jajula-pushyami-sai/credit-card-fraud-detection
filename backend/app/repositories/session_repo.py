from datetime import datetime, timezone
from app.database.core import db
from app.models.session import Session
from app.security.hashing import hash_token


class SessionRepository:
    @staticmethod
    def create(session_data: dict) -> Session:
        session = Session(**session_data)
        db.session.add(session)
        db.session.commit()
        return session

    @staticmethod
    def get_by_refresh_token(raw_token: str) -> Session:
        """Look up a session by the raw refresh token.

        The raw token is hashed before querying — no plaintext tokens are
        ever stored or compared against the database.

        Enforces BOTH is_revoked=False AND expires_at > now independently
        of JWT expiry. This provides defence-in-depth: even if a JWT's
        expiry were forged or misconfigured, an expired server session
        still rejects the request.
        """
        token_hash = hash_token(raw_token)
        now = datetime.now(timezone.utc)
        return Session.query.filter(
            Session.refresh_token_hash == token_hash,
            Session.is_revoked == False,  # noqa: E712
            Session.expires_at > now,
        ).first()

    @staticmethod
    def get_any_by_refresh_token(raw_token: str) -> Session:
        """Look up a session by hash, regardless of revoked/expired status."""
        token_hash = hash_token(raw_token)
        return Session.query.filter(Session.refresh_token_hash == token_hash).first()

    @staticmethod
    def revoke(session: Session):
        session.is_revoked = True
        db.session.commit()

    @staticmethod
    def revoke_all_for_user(user_id: str) -> int:
        """Revoke every active session for a user (used on logout).

        Returns the number of sessions revoked.
        """
        updated = (
            db.session.query(Session)
            .filter(
                Session.user_id == user_id,
                Session.is_revoked == False,  # noqa: E712
            )
            .all()
        )
        count = 0
        for s in updated:
            s.is_revoked = True
            count += 1
        db.session.commit()
        return count

    @staticmethod
    def revoke_family(family_id: str) -> int:
        """Revoke every active session belonging to the same token family."""
        updated = (
            db.session.query(Session)
            .filter(
                Session.family_id == family_id,
                Session.is_revoked == False,  # noqa: E712
            )
            .all()
        )
        count = 0
        for s in updated:
            s.is_revoked = True
            count += 1
        db.session.commit()
        return count
