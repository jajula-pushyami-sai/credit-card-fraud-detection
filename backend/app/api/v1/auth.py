from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_current_user
from app.services.auth_service import AuthService
from app.schemas.user import RegisterSchema, LoginSchema, UserSchema
from app.core.responses import success_response
from app.core.exceptions import ValidationError
from marshmallow import ValidationError as MarshmallowError

from app.security.rate_limiter import limiter
from flask_limiter.util import get_remote_address

auth_bp = Blueprint("auth", __name__)


def login_rate_limit_key():
    """Key the rate limit by IP and the submitted email to prevent targeted and rotating brute-force attacks."""
    email = request.json.get("email", "") if request.is_json else ""
    return f"{get_remote_address()}:{email}"


@auth_bp.route("/register", methods=["POST"])
@limiter.limit("60 per hour")
def register():
    try:
        data = RegisterSchema().load(request.json)
    except MarshmallowError as e:
        raise ValidationError(errors=e.messages)

    user = AuthService.register_user(data)
    return success_response(
        data={"user": UserSchema().dump(user)},
        message="User registered successfully.",
        status_code=201,
    )


@auth_bp.route("/login", methods=["POST"])
@limiter.limit("60 per minute", key_func=login_rate_limit_key)
def login():
    print(f"--> LOGIN ROUTE HIT: {request.json}", flush=True)
    try:
        data = LoginSchema().load(request.json)
    except MarshmallowError as e:
        raise ValidationError(errors=e.messages)

    user, access_token, refresh_token = AuthService.login(
        email=data["email"],
        password=data["password"],
        device_info=request.headers.get("User-Agent"),
        ip_address=request.remote_addr,
    )

    return success_response(
        data={
            "user": UserSchema().dump(user),
            "access_token": access_token,
            "refresh_token": refresh_token,
        },
        message="Login successful.",
    )


@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    """Rotate the refresh token.

    Validates the JWT, looks up the server-side session (checking is_revoked
    and expires_at), revokes the old session, issues a new token pair, and
    stores only the hash of the new refresh token.

    The client must send the raw refresh token as a Bearer token in the
    Authorization header.  Both a new access_token AND a new refresh_token
    are returned — the client must replace both stored tokens.
    """
    current_user = get_current_user()
    # Extract the raw refresh token from the Authorization header
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        from app.core.exceptions import AuthenticationError
        raise AuthenticationError("Missing refresh token.")

    old_refresh_token = auth_header.split(" ", 1)[1]

    new_access_token, new_refresh_token = AuthService.refresh_tokens(
        current_user, old_refresh_token
    )
    return success_response(
        data={
            "access_token": new_access_token,
            "refresh_token": new_refresh_token,
        },
        message="Tokens refreshed successfully.",
    )


@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    """Revoke the access token and ALL refresh sessions for the authenticated user.

    Revocation strategy:
    1. Access token: blocklisted in Redis until natural JWT expiry.
    2. Refresh sessions: ALL active sessions for the user are revoked in the
       database regardless of whether the client supplies a refresh token.
       This prevents a stale refresh session from surviving a logout.
    """
    from flask_jwt_extended import get_jwt
    from app.core.redis import redis_client
    from app.repositories.session_repo import SessionRepository
    from datetime import datetime, timezone
    import logging

    jwt_data = get_jwt()
    jti = jwt_data["jti"]

    # 1. Blocklist the access token in Redis until it expires naturally
    exp = jwt_data.get("exp")
    if exp:
        now = datetime.now(timezone.utc).timestamp()
        ttl = max(1, int(exp - now))
    else:
        ttl = 3600  # Fallback to 1 hour

    try:
        if redis_client:
            redis_client.setex(f"blocklist:{jti}", ttl, "true")
        else:
            logging.warning("Redis client is not available. Skipping access token blocklist.")
    except Exception as e:
        logging.error(f"Failed to add token to Redis blocklist: {e}")
        # Proceed with session revocation even if Redis fails

    # 2. Revoke ALL active refresh sessions for this user — guaranteed cleanup
    #    regardless of whether the client sends a refresh token in the body.
    current_user = get_current_user()
    revoked_count = SessionRepository.revoke_all_for_user(current_user.id)
    logging.info(f"Logout: revoked {revoked_count} session(s) for user {current_user.id}")

    return success_response(message="Logged out successfully.")


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_me():
    return success_response(data={"user": UserSchema().dump(get_current_user())})


@auth_bp.route("/users/<user_id>/role", methods=["PUT"])
@jwt_required()
def change_role(user_id):
    """
    Secure role modification endpoint.
    Only allows Administrators to change user roles.
    Explicitly prevents downgrading existing Administrators.
    """
    current_user = get_current_user()
    if current_user.role.value != "Administrator":
        from app.core.exceptions import AppError
        raise AppError("Only administrators can change roles.", 403)
        
    data = request.json or {}
    new_role_value = data.get("role")
    if not new_role_value:
        raise ValidationError(errors=["Role is required."])
        
    from app.repositories.user_repo import UserRepository
    from app.models.user import RoleEnum
    
    target_user = UserRepository.get_by_id(user_id)
    if not target_user:
        from app.core.exceptions import AppError
        raise AppError("User not found.", 404)
        
    # Prevent downgrading existing administrators
    if target_user.role == RoleEnum.ADMIN and new_role_value != "Administrator":
        from app.core.exceptions import AppError
        raise AppError("Cannot downgrade existing administrators.", 403)
        
    try:
        new_role = RoleEnum(new_role_value)
    except ValueError:
        raise ValidationError(errors=["Invalid role."])
        
    target_user.role = new_role
    from app.database.core import db
    db.session.commit()
    
    return success_response(message="Role updated successfully.")

