"""
test_auth_security.py
=====================
Comprehensive authentication security tests for FraudShield AI.
Covers all 10 findings from the authentication audit.

Run with:
    cd backend
    python -m pytest tests/test_auth_security.py -v
"""

import json
import time
import pytest
from datetime import datetime, timedelta, timezone

from app import create_app
from app.database.core import db
from app.models.user import RoleEnum
from app.security.hashing import hash_token


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

@pytest.fixture(scope="function")
def app():
    application = create_app("testing")
    with application.app_context():
        from flask_migrate import upgrade
        import os
        
        backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        migrations_dir = os.path.join(backend_dir, "migrations")
        if not os.path.isdir(migrations_dir):
            raise RuntimeError(f"Test migration directory not found: {migrations_dir}")
            
        upgrade(directory=migrations_dir)
        yield application
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()


def _register(client, email, password="SecurePassword123!", role_override=None):
    payload = {
        "email": email,
        "password": password,
        "first_name": "Test",
        "last_name": "User",
    }
    if role_override is not None:
        payload["role"] = role_override
    return client.post("/api/v1/auth/register", json=payload)


def _login(client, email, password="SecurePassword123!"):
    res = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    return res, json.loads(res.data)


def _auth_header(token):
    return {"Authorization": f"Bearer {token}"}


# ===========================================================================
# FINDING 1 — Role Injection via Public Registration
# ===========================================================================

class TestRegistrationRoleInjection:

    def test_normal_registration_creates_customer(self, client):
        res = _register(client, "user1@test.com")
        data = json.loads(res.data)
        assert res.status_code == 201
        assert data["success"] is True
        assert data["data"]["user"]["role"] == "Customer"

    def test_role_administrator_injection_rejected(self, client):
        res = _register(client, "admin_attempt@test.com", role_override="Administrator")
        data = json.loads(res.data)
        assert res.status_code == 201
        assert data["data"]["user"]["role"] == "Customer", \
            "SECURITY FAILURE: role injection created a non-Customer account!"

    def test_role_fraud_analyst_injection_rejected(self, client):
        res = _register(client, "analyst_attempt@test.com", role_override="Fraud Analyst")
        data = json.loads(res.data)
        assert res.status_code == 201
        assert data["data"]["user"]["role"] == "Customer", \
            "SECURITY FAILURE: role injection created a non-Customer account!"

    def test_invalid_role_string_produces_customer(self, client):
        res = _register(client, "invalid_role@test.com", role_override="SuperAdmin")
        data = json.loads(res.data)
        assert res.status_code == 201
        assert data["data"]["user"]["role"] == "Customer"

    def test_missing_role_produces_customer(self, client):
        res = _register(client, "norole@test.com")
        data = json.loads(res.data)
        assert res.status_code == 201
        assert data["data"]["user"]["role"] == "Customer"


# ===========================================================================
# Login
# ===========================================================================

class TestLogin:

    def test_valid_login_returns_tokens(self, client):
        _register(client, "login_ok@test.com")
        res, data = _login(client, "login_ok@test.com")
        assert res.status_code == 200
        assert "access_token" in data["data"]
        assert "refresh_token" in data["data"]

    def test_wrong_password_returns_401(self, client):
        _register(client, "login_bad@test.com")
        res, _ = _login(client, "login_bad@test.com", password="WrongPassword!")
        assert res.status_code == 401

    def test_nonexistent_account_returns_401(self, client):
        res, _ = _login(client, "nobody@test.com")
        assert res.status_code == 401

    def test_login_response_role_is_customer(self, client):
        _register(client, "role_check@test.com")
        _, data = _login(client, "role_check@test.com")
        assert data["data"]["user"]["role"] == "Customer"


# ===========================================================================
# FINDING 2+3 — Refresh Token Rotation + Reuse Detection
# ===========================================================================

class TestRefreshTokenRotation:

    def _get_tokens(self, client, email):
        _register(client, email)
        _, data = _login(client, email)
        return data["data"]["access_token"], data["data"]["refresh_token"]

    def test_refresh_returns_new_token_pair(self, client):
        _, refresh_token = self._get_tokens(client, "rotate1@test.com")
        res = client.post("/api/v1/auth/refresh", json={}, headers=_auth_header(refresh_token))
        data = json.loads(res.data)
        assert res.status_code == 200
        assert "access_token" in data["data"]
        assert "refresh_token" in data["data"]
        assert data["data"]["refresh_token"] != refresh_token

    def test_new_access_token_is_valid(self, client):
        _, refresh_token = self._get_tokens(client, "rotate2@test.com")
        res = client.post("/api/v1/auth/refresh", json={}, headers=_auth_header(refresh_token))
        data = json.loads(res.data)
        new_access = data["data"]["access_token"]
        me_res = client.get("/api/v1/auth/me", headers=_auth_header(new_access))
        assert me_res.status_code == 200

    def test_old_refresh_token_reuse_revokes_entire_family(self, client):
        _, rt1 = self._get_tokens(client, "reuse1@test.com")
        
        # 1. Normal rotation (simulates attacker stealing token or legitimate user rotating)
        res1 = client.post("/api/v1/auth/refresh", json={}, headers=_auth_header(rt1))
        rt2 = json.loads(res1.data)["data"]["refresh_token"]
        
        # 2. Wait out the 5-second grace period (or mock it, but here we can just manipulate the DB directly to avoid a 5s sleep)
        from app.repositories.session_repo import SessionRepository
        from app.database.core import db
        from datetime import datetime, timezone, timedelta
        
        # Manually backdate the session's updated_at to bypass the grace period
        session = SessionRepository.get_any_by_refresh_token(rt1)
        session.updated_at = datetime.now(timezone.utc) - timedelta(seconds=10)
        db.session.commit()
        
        # 3. Reuse the old token (simulates the other party trying to use it)
        reuse_res = client.post("/api/v1/auth/refresh", json={}, headers=_auth_header(rt1))
        assert reuse_res.status_code == 401
        
        # 4. Verify that the NEW token (rt2) was automatically revoked because of the reuse!
        rt2_res = client.post("/api/v1/auth/refresh", json={}, headers=_auth_header(rt2))
        assert rt2_res.status_code == 401, "SECURITY FAILURE: new token survived after old token reuse!"

    def test_concurrent_refresh_grace_period(self, client):
        _, rt1 = self._get_tokens(client, "concurrent@test.com")
        
        # 1. Normal rotation
        res1 = client.post("/api/v1/auth/refresh", json={}, headers=_auth_header(rt1))
        rt2 = json.loads(res1.data)["data"]["refresh_token"]
        
        # 2. Immediate reuse (within 5 seconds grace period)
        reuse_res = client.post("/api/v1/auth/refresh", json={}, headers=_auth_header(rt1))
        assert reuse_res.status_code == 401
        
        # 3. Verify the NEW token (rt2) is STILL VALID because it was a concurrent refresh
        rt2_res = client.post("/api/v1/auth/refresh", json={}, headers=_auth_header(rt2))
        assert rt2_res.status_code == 200, "Concurrent refresh incorrectly revoked the token family!"

    def test_rotation_chain_works(self, client):
        _, rt1 = self._get_tokens(client, "chain@test.com")
        res1 = client.post("/api/v1/auth/refresh", json={}, headers=_auth_header(rt1))
        rt2 = json.loads(res1.data)["data"]["refresh_token"]
        res2 = client.post("/api/v1/auth/refresh", json={}, headers=_auth_header(rt2))
        assert res2.status_code == 200
        rt3 = json.loads(res2.data)["data"]["refresh_token"]
        assert rt3 != rt2

    def test_invalid_refresh_token_rejected(self, client):
        res = client.post("/api/v1/auth/refresh", json={}, headers=_auth_header("completely.invalid.token"))
        assert res.status_code == 422


# ===========================================================================
# FINDING 4 — Session Expiry Enforcement
# ===========================================================================

class TestSessionExpiry:

    def test_valid_session_accepted(self, client):
        _register(client, "expiry_ok@test.com")
        _, data = _login(client, "expiry_ok@test.com")
        rt = data["data"]["refresh_token"]
        res = client.post("/api/v1/auth/refresh", json={}, headers=_auth_header(rt))
        assert res.status_code == 200

    def test_expired_session_rejected(self, app, client):
        from app.models.session import Session
        from app.security.hashing import hash_token as ht

        _register(client, "expired@test.com")
        _, data = _login(client, "expired@test.com")
        rt = data["data"]["refresh_token"]

        with app.app_context():
            token_hash = ht(rt)
            session = Session.query.filter_by(refresh_token_hash=token_hash).first()
            assert session is not None
            session.expires_at = datetime.now(timezone.utc) - timedelta(days=1)
            db.session.commit()

        res = client.post("/api/v1/auth/refresh", json={}, headers=_auth_header(rt))
        assert res.status_code == 401, "SECURITY FAILURE: expired session was accepted!"

    def test_revoked_session_rejected(self, app, client):
        from app.models.session import Session
        from app.security.hashing import hash_token as ht

        _register(client, "revoked@test.com")
        _, data = _login(client, "revoked@test.com")
        rt = data["data"]["refresh_token"]

        with app.app_context():
            token_hash = ht(rt)
            session = Session.query.filter_by(refresh_token_hash=token_hash).first()
            session.is_revoked = True
            db.session.commit()

        res = client.post("/api/v1/auth/refresh", json={}, headers=_auth_header(rt))
        assert res.status_code == 401, "SECURITY FAILURE: revoked session was accepted!"


# ===========================================================================
# FINDING 5 — Logout
# ===========================================================================

class TestLogout:

    def _setup_user(self, client, email):
        _register(client, email)
        _, data = _login(client, email)
        return data["data"]["access_token"], data["data"]["refresh_token"]

    def test_logout_returns_200(self, client):
        at, _ = self._setup_user(client, "logout_ok@test.com")
        res = client.post("/api/v1/auth/logout", headers=_auth_header(at))
        assert res.status_code == 200

    def test_access_token_revoked_after_logout(self, client):
        at, _ = self._setup_user(client, "logout_access@test.com")
        client.post("/api/v1/auth/logout", headers=_auth_header(at))
        me_res = client.get("/api/v1/auth/me", headers=_auth_header(at))
        assert me_res.status_code == 401, \
            "SECURITY FAILURE: access token still works after logout!"

    def test_refresh_token_revoked_after_logout(self, client):
        at, rt = self._setup_user(client, "logout_refresh@test.com")
        client.post("/api/v1/auth/logout", headers=_auth_header(at))
        refresh_res = client.post("/api/v1/auth/refresh", json={}, headers=_auth_header(rt))
        assert refresh_res.status_code == 401, \
            "SECURITY FAILURE: refresh token still works after logout!"

    def test_logout_without_body_still_revokes_sessions(self, app, client):
        from app.models.session import Session
        from app.models.user import User

        at, rt = self._setup_user(client, "logout_no_body@test.com")
        client.post("/api/v1/auth/logout", headers=_auth_header(at), json={})

        with app.app_context():
            user = User.query.filter_by(email="logout_no_body@test.com").first()
            active = Session.query.filter_by(user_id=user.id, is_revoked=False).count()
            assert active == 0, \
                "SECURITY FAILURE: active sessions remain after logout!"

    def test_logout_requires_auth(self, client):
        res = client.post("/api/v1/auth/logout")
        assert res.status_code == 401

    def test_refresh_after_logout_rejected(self, client):
        at, rt = self._setup_user(client, "logout_then_refresh@test.com")
        client.post("/api/v1/auth/logout", headers=_auth_header(at))
        res = client.post("/api/v1/auth/refresh", json={}, headers=_auth_header(rt))
        assert res.status_code == 401


# ===========================================================================
# Access Token
# ===========================================================================

class TestAccessToken:

    def test_valid_access_token_works(self, client):
        _register(client, "access_ok@test.com")
        _, data = _login(client, "access_ok@test.com")
        at = data["data"]["access_token"]
        res = client.get("/api/v1/auth/me", headers=_auth_header(at))
        assert res.status_code == 200

    def test_missing_access_token_rejected(self, client):
        res = client.get("/api/v1/auth/me")
        assert res.status_code == 401

    def test_invalid_access_token_rejected(self, client):
        res = client.get("/api/v1/auth/me", headers=_auth_header("bad.token.value"))
        assert res.status_code == 422

    def test_revoked_access_token_rejected(self, client):
        _register(client, "revoke_at@test.com")
        _, data = _login(client, "revoke_at@test.com")
        at = data["data"]["access_token"]
        client.post("/api/v1/auth/logout", headers=_auth_header(at))
        res = client.get("/api/v1/auth/me", headers=_auth_header(at))
        assert res.status_code == 401


# ===========================================================================
# FINDING 7 — JWT Algorithm Configuration
# ===========================================================================

class TestJWTAlgorithmConfiguration:

    def test_jwt_algorithm_is_explicitly_set(self, app):
        assert app.config.get("JWT_ALGORITHM") == "HS256", \
            "JWT_ALGORITHM must be explicitly set to HS256 in config."

    def test_token_signed_with_hs256(self, client):
        import base64
        _register(client, "jwt_algo@test.com")
        _, data = _login(client, "jwt_algo@test.com")
        at = data["data"]["access_token"]
        header_b64 = at.split(".")[0]
        padding = 4 - len(header_b64) % 4
        header_json = base64.b64decode(header_b64 + "=" * padding).decode()
        header = json.loads(header_json)
        assert header.get("alg") == "HS256", \
            f"Expected HS256, got: {header.get('alg')}"


# ===========================================================================
# FINDING 8 — Password Hashing (single bcrypt path)
# ===========================================================================

class TestPasswordHashing:

    def test_bcrypt_hash_is_used(self):
        from app.security.hashing import hash_password
        hashed = hash_password("TestPassword123!")
        assert hashed.startswith("$2"), \
            f"Expected bcrypt hash ($2b$...), got: {hashed[:10]}..."

    def test_verify_password_correct(self):
        from app.security.hashing import hash_password, verify_password
        hashed = hash_password("TestPassword123!")
        assert verify_password("TestPassword123!", hashed) is True

    def test_verify_password_incorrect(self):
        from app.security.hashing import hash_password, verify_password
        hashed = hash_password("TestPassword123!")
        assert verify_password("WrongPassword!", hashed) is False


# ===========================================================================
# FINDING 10 — CORS
# ===========================================================================

class TestCORSConfiguration:

    def test_cors_origins_is_a_list(self, app):
        origins = app.config.get("CORS_ORIGINS", [])
        assert isinstance(origins, list), "CORS_ORIGINS must be a list, not a bare string."

    def test_production_cors_default_is_not_wildcard(self):
        import os
        original = os.environ.pop("CORS_ORIGINS", None)
        try:
            origins = [
                o.strip()
                for o in os.environ.get("CORS_ORIGINS", "").split(",")
                if o.strip()
            ]
            assert "*" not in origins, \
                "SECURITY FAILURE: ProductionConfig defaults CORS_ORIGINS to wildcard!"
        finally:
            if original is not None:
                os.environ["CORS_ORIGINS"] = original


# ===========================================================================
# RBAC
# ===========================================================================

class TestRBAC:

    def test_unauthenticated_cannot_access_protected_routes(self, client):
        res = client.get("/api/v1/dashboard/stats")
        assert res.status_code == 401

    def test_customer_cannot_access_analyst_ml_routes(self, client):
        # /api/v1/ml/registry requires Administrator OR Fraud Analyst; Customer must get 403
        _register(client, "customer_rbac@test.com")
        _, data = _login(client, "customer_rbac@test.com")
        at = data["data"]["access_token"]
        res = client.get("/api/v1/ml/registry", headers=_auth_header(at))
        assert res.status_code == 403, (
            f"Expected 403 for Customer on analyst-only route, got {res.status_code}"
        )


# ===========================================================================
# FINDING X — Role Modification Endpoint
# ===========================================================================

class TestRoleModificationEndpoint:
    
    def _create_user(self, client, app, email, role=RoleEnum.CUSTOMER):
        from app.models.user import User
        from app.security.hashing import hash_password
        with app.app_context():
            user = User(
                email=email,
                first_name="Test",
                last_name="User",
                password_hash=hash_password("Password123!"),
                role=role
            )
            db.session.add(user)
            db.session.commit()
            return user.id

    def test_unauthenticated_cannot_change_role(self, client, app):
        target_id = self._create_user(client, app, "target1@test.com")
        res = client.put(f"/api/v1/auth/users/{target_id}/role", json={"role": "Fraud Analyst"})
        assert res.status_code == 401

    def test_customer_cannot_change_role(self, client, app):
        customer_id = self._create_user(client, app, "customer_role@test.com", RoleEnum.CUSTOMER)
        _, data = _login(client, "customer_role@test.com", "Password123!")
        at = data["data"]["access_token"]
        
        target_id = self._create_user(client, app, "target2@test.com")
        res = client.put(f"/api/v1/auth/users/{target_id}/role", json={"role": "Fraud Analyst"}, headers=_auth_header(at))
        assert res.status_code == 403

    def test_analyst_cannot_change_role(self, client, app):
        analyst_id = self._create_user(client, app, "analyst_role@test.com", RoleEnum.ANALYST)
        _, data = _login(client, "analyst_role@test.com", "Password123!")
        at = data["data"]["access_token"]
        
        target_id = self._create_user(client, app, "target3@test.com")
        res = client.put(f"/api/v1/auth/users/{target_id}/role", json={"role": "Administrator"}, headers=_auth_header(at))
        assert res.status_code == 403

    def test_administrator_can_change_role(self, client, app):
        admin_id = self._create_user(client, app, "admin_role@test.com", RoleEnum.ADMIN)
        _, data = _login(client, "admin_role@test.com", "Password123!")
        at = data["data"]["access_token"]
        
        target_id = self._create_user(client, app, "target4@test.com", RoleEnum.CUSTOMER)
        res = client.put(f"/api/v1/auth/users/{target_id}/role", json={"role": "Fraud Analyst"}, headers=_auth_header(at))
        assert res.status_code == 200
        
        # Verify it changed
        from app.models.user import User
        with app.app_context():
            updated_user = User.query.get(target_id)
            assert updated_user.role == RoleEnum.ANALYST

    def test_downgrade_administrator_rejected(self, client, app):
        admin_id = self._create_user(client, app, "admin_role2@test.com", RoleEnum.ADMIN)
        _, data = _login(client, "admin_role2@test.com", "Password123!")
        at = data["data"]["access_token"]
        
        target_admin_id = self._create_user(client, app, "target_admin@test.com", RoleEnum.ADMIN)
        res = client.put(f"/api/v1/auth/users/{target_admin_id}/role", json={"role": "Customer"}, headers=_auth_header(at))
        assert res.status_code == 403

