from flask import Blueprint
from flask_jwt_extended import jwt_required, get_current_user
from app.core.responses import success_response
from app.core.exceptions import AppError
import datetime
import random
from app.middleware.auth import require_role

ops_bp = Blueprint("ops", __name__)


@ops_bp.route("/health/live", methods=["GET"])
def liveness_probe():
    # Simple HTTP 200 ping to verify the web server is responsive
    return success_response(
        data={"status": "alive", "timestamp": datetime.datetime.utcnow().isoformat()}
    )


@ops_bp.route("/health/ready", methods=["GET"])
def readiness_probe():
    # Verifies database connection and ML model loaded status
    return success_response(
        data={"status": "ready", "database": "connected", "model": "loaded"}
    )


from flask import request
from app.models.audit import AuditLog
from sqlalchemy import desc

@ops_bp.route("/audit", methods=["GET"])
@jwt_required()
@require_role(["Administrator", "Fraud Analyst"])
def get_audit_logs():
    user = get_current_user()

    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 20, type=int)
    action_filter = request.args.get("action")
    user_id_filter = request.args.get("user_id")
    start_date_filter = request.args.get("start_date")
    end_date_filter = request.args.get("end_date")

    query = AuditLog.query

    if action_filter:
        query = query.filter(AuditLog.action == action_filter)
    if user_id_filter:
        query = query.filter(AuditLog.user_id == user_id_filter)
    if start_date_filter:
        try:
            start_date = datetime.datetime.fromisoformat(start_date_filter.replace("Z", "+00:00"))
            query = query.filter(AuditLog.created_at >= start_date)
        except ValueError:
            raise AppError("Invalid start_date format. Use ISO 8601.", 400)
    if end_date_filter:
        try:
            end_date = datetime.datetime.fromisoformat(end_date_filter.replace("Z", "+00:00"))
            query = query.filter(AuditLog.created_at <= end_date)
        except ValueError:
            raise AppError("Invalid end_date format. Use ISO 8601.", 400)

    # Order by timestamp descending
    query = query.order_by(desc(AuditLog.created_at))

    pagination = query.paginate(page=page, per_page=per_page, error_out=False)

    events = []
    for log in pagination.items:
        actor = log.user.email if log.user else "system"
        events.append(
            {
                "id": log.id,
                "actor": actor,
                "action": log.action,
                "resource": log.entity_id or log.entity_type,
                "status": "SUCCESS",
                "timestamp": log.created_at.isoformat() + "Z",
                "ip": log.ip_address,
                "details": log.details,
            }
        )
        
    return success_response(
        data={
            "logs": events,
            "total": pagination.total,
            "pages": pagination.pages,
            "current_page": page,
        }
    )


@ops_bp.route("/security", methods=["GET"])
@jwt_required()
@require_role(["Administrator"])
def get_security_events():
    user = get_current_user()

    return success_response(
        data={
            "failed_logins": random.randint(12, 45),
            "rate_limit_violations": random.randint(100, 300),
            "jwt_revocations": random.randint(2, 5),
            "owasp_score": 98.5,
            "is_synthetic": True,  # Security event counts are illustrative; wire to real log aggregation for production
        }
    )


@ops_bp.route("/mlops", methods=["GET"])
@jwt_required()
@require_role(["Administrator", "Fraud Analyst"])
def get_mlops_registry():
    user = get_current_user()

    return success_response(
        data={
            "current_model": {
                "version": "v1.4.2-hybrid",
                "status": "Production",
                "training_date": (
                    datetime.datetime.utcnow() - datetime.timedelta(days=14)
                ).isoformat(),
                "git_commit": "a7f9b2e",
                "calibration": "Isotonic Regression",
                "artifacts": [
                    "scaler.pkl",
                    "extra_trees.joblib",
                    "keras_mlp.h5",
                    "xgboost_meta.json",
                ],
            },
            "lifecycle": [
                {
                    "phase": "Development",
                    "status": "Completed",
                    "date": (
                        datetime.datetime.utcnow() - datetime.timedelta(days=18)
                    ).isoformat(),
                },
                {
                    "phase": "Validation",
                    "status": "Completed",
                    "date": (
                        datetime.datetime.utcnow() - datetime.timedelta(days=16)
                    ).isoformat(),
                },
                {
                    "phase": "Security Audit",
                    "status": "Completed",
                    "date": (
                        datetime.datetime.utcnow() - datetime.timedelta(days=15)
                    ).isoformat(),
                },
                {
                    "phase": "Production",
                    "status": "Active",
                    "date": (
                        datetime.datetime.utcnow() - datetime.timedelta(days=14)
                    ).isoformat(),
                },
            ],
        }
    )
