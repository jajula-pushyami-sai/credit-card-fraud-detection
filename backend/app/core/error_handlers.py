import traceback
from flask import current_app, jsonify
from marshmallow import ValidationError as MarshmallowValidationError
from sqlalchemy.exc import SQLAlchemyError
from app.core.exceptions import AppError, ModelNotReadyError
from app.core.responses import error_response


def register_error_handlers(app):
    @app.errorhandler(ModelNotReadyError)
    def handle_model_not_ready(e):
        """Return the exact structured 503 required by the API contract."""
        return (
            jsonify({
                "success": False,
                "error": {
                    "code": "MODEL_NOT_READY",
                    "message": e.message,
                },
            }),
            503,
        )

    @app.errorhandler(AppError)
    def handle_app_error(e):
        return error_response(e.message, e.errors, e.status_code)

    @app.errorhandler(MarshmallowValidationError)
    def handle_marshmallow_error(e):
        return error_response("Validation failed", e.messages, 422)

    @app.errorhandler(SQLAlchemyError)
    def handle_db_error(e):
        current_app.logger.error(f"Database error: {str(e)}")
        return error_response("A database error occurred", None, 500)

    @app.errorhandler(429)
    def handle_rate_limit(e):
        current_app.logger.warning(f"Rate limit exceeded: {str(e)}")
        return error_response(str(e.description) if hasattr(e, "description") else "Too many requests", None, 429)

    @app.errorhandler(Exception)
    def handle_generic_error(e):
        current_app.logger.error(
            f"Unhandled exception: {str(e)}\n{traceback.format_exc()}"
        )
        return error_response("Internal server error", None, 500)
