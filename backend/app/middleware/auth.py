from functools import wraps
from flask_jwt_extended import get_current_user, verify_jwt_in_request
from app.core.exceptions import AuthorizationError


def require_role(roles):
    """
    Decorator to ensure the current JWT user has one of the required roles.
    Expects a list of RoleEnum values (strings).
    """

    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            current_user = get_current_user()

            if not current_user:
                raise AuthorizationError("User not found.")

            if current_user.role.value not in roles:
                raise AuthorizationError(f"Requires one of roles: {', '.join(roles)}")

            return fn(*args, **kwargs)

        return decorator

    return wrapper
