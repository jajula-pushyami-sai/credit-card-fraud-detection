class AppError(Exception):
    def __init__(self, message, status_code=400, errors=None):
        super().__init__()
        self.message = message
        self.status_code = status_code
        self.errors = errors


class ValidationError(AppError):
    def __init__(self, message="Validation failed", errors=None):
        super().__init__(message, 422, errors)


class AuthenticationError(AppError):
    def __init__(self, message="Authentication failed"):
        super().__init__(message, 401)


class AuthorizationError(AppError):
    def __init__(self, message="Permission denied"):
        super().__init__(message, 403)


class NotFoundError(AppError):
    def __init__(self, message="Resource not found"):
        super().__init__(message, 404)


class ConflictError(AppError):
    def __init__(self, message="Resource already exists"):
        super().__init__(message, 409)


class ModelNotReadyError(AppError):
    """Raised when ML model artifacts are missing, corrupt, or incompatible."""
    def __init__(self, message="Fraud detection model is not available."):
        super().__init__(message, 503)
