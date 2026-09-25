import datetime
import time
from flask import Blueprint, Response, stream_with_context
from flask_jwt_extended import jwt_required, get_current_user
from app.core.responses import success_response
from app.core.exceptions import AppError
from app.database.core import db
from app.models.misc import Notification

notifications_bp = Blueprint("notifications", __name__)


@notifications_bp.route("/", methods=["GET"])
@jwt_required()
def get_notifications():
    user = get_current_user()

    # Simple mocked notifications based on role
    notifs = []
    if user.role.value in ["Administrator", "Fraud Analyst"]:
        notifs = [
            {
                "id": "n1",
                "title": "High Risk Alert",
                "message": "Transaction TX-9428 requires immediate review.",
                "type": "alert",
                "priority": "high",
                "read": False,
                "timestamp": datetime.datetime.utcnow().isoformat(),
            },
            {
                "id": "n2",
                "title": "Model Deployed",
                "message": "Hybrid Ensemble v1.4 successfully rolled out.",
                "type": "system",
                "priority": "normal",
                "read": True,
                "timestamp": (
                    datetime.datetime.utcnow() - datetime.timedelta(hours=2)
                ).isoformat(),
            },
        ]
    else:
        notifs = [
            {
                "id": "n3",
                "title": "Welcome",
                "message": "Welcome to FraudShield AI.",
                "type": "system",
                "priority": "normal",
                "read": False,
                "timestamp": datetime.datetime.utcnow().isoformat(),
            }
        ]

    return success_response(data={"notifications": notifs})


from app.security.rate_limiter import limiter

@notifications_bp.route("/stream", methods=["GET"])
@jwt_required()
@limiter.limit("5 per minute")
def notification_stream():
    def generate():
        # Cap the stream at 60 heartbeats (15 mins) so connections don't hang indefinitely
        max_heartbeats = 60
        for _ in range(max_heartbeats):
            # Pushes a heartbeat SSE event every 15 seconds to keep the connection alive
            # In production, this would yield actual events from a Redis Pub/Sub queue
            yield f'data: {{"type": "heartbeat", "timestamp": "{datetime.datetime.utcnow().isoformat()}"}}\n\n'
            time.sleep(15)

    return Response(stream_with_context(generate()), mimetype="text/event-stream")


@notifications_bp.route("/<note_id>/read", methods=["PUT"])
@jwt_required()
def mark_read(note_id):
    user = get_current_user()
    note = Notification.query.filter_by(id=note_id, user_id=user.id).first()
    if not note:
        raise AppError("Notification not found", 404)

    note.is_read = True
    db.session.commit()
    return success_response(message="Notification marked as read")
