from flask_jwt_extended import JWTManager
from app.models.user import User
from app.database.core import db

jwt = JWTManager()


@jwt.user_identity_loader
def user_identity_lookup(user):
    return user.id


from flask import current_app

@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    current_app.logger.debug(f"DEBUG_JWT: Looking up user with identity: {identity}")
    user = db.session.get(User, identity)
    current_app.logger.debug(f"DEBUG_JWT: Found user: {user}")
    return user


@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    from app.core.redis import redis_client
    import logging

    jti = jwt_payload["jti"]
    token_type = jwt_payload.get("type", "access")
    
    # We only blocklist access tokens in Redis (refresh tokens are verified via DB sessions)
    if token_type != "access":
        return False
        
    try:
        # If the key exists in Redis, the token is revoked
        if redis_client:
            token_in_redis = redis_client.get(f"blocklist:{jti}")
            return token_in_redis is not None
        return False
    except Exception as e:
        # If Redis is unavailable, log the error but allow the request to proceed.
        # This prevents a total authentication outage if the cache layer fails.
        logging.error(f"Redis unavailable for blocklist check: {e}")
        return False
