from flask import jsonify, g
from datetime import datetime, timezone


def success_response(data=None, message="Success", status_code=200):
    return (
        jsonify(
            {
                "success": True,
                "message": message,
                "data": data,
                "errors": None,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "request_id": getattr(g, "request_id", None),
            }
        ),
        status_code,
    )


def error_response(message="An error occurred", errors=None, status_code=400):
    return (
        jsonify(
            {
                "success": False,
                "message": message,
                "data": None,
                "errors": errors if errors else [],
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "request_id": getattr(g, "request_id", None),
            }
        ),
        status_code,
    )
