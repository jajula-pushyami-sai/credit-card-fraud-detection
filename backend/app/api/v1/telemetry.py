from flask import Blueprint
from flask_jwt_extended import jwt_required, get_current_user
from app.core.responses import success_response
from app.core.exceptions import AppError
from app.models.transaction import Transaction, TransactionStatus
from app.models.user import User
import datetime
from app.models.session import Session
from app.middleware.auth import require_role

telemetry_bp = Blueprint("telemetry", __name__)


@telemetry_bp.route("/kpi", methods=["GET"])
@jwt_required()
@require_role(["Administrator", "Fraud Analyst"])
def get_kpis():
    user = get_current_user()

    today_start = datetime.datetime.now(datetime.timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    tx_today = Transaction.query.filter(Transaction.transaction_date >= today_start).count()
    
    total_tx = Transaction.query.count()
    total_fraud = Transaction.query.filter_by(status=TransactionStatus.DECLINED).count()
    total_queue = Transaction.query.filter_by(status=TransactionStatus.FLAGGED).count()

    fraud_rate = (
        round((total_fraud / total_tx) * 100, 2)
        if total_tx > 0
        else None
    )
    
    active_users = Session.query.filter(
        Session.expires_at > datetime.datetime.now(datetime.timezone.utc),
        Session.is_revoked == False
    ).with_entities(Session.user_id).distinct().count()

    return success_response(
        data={
            "transactions_today": tx_today,
            "fraud_rate": fraud_rate,
            "detection_accuracy": None,
            "review_queue": total_queue,
            "avg_decision_time_ms": None,
            "active_users": active_users,
        }
    )


@telemetry_bp.route("/trends", methods=["GET"])
@jwt_required()
@require_role(["Administrator", "Fraud Analyst"])
def get_trends():
    user = get_current_user()

    # Get transactions from the last 30 days
    start_date = datetime.datetime.now() - datetime.timedelta(days=30)
    transactions = Transaction.query.filter(Transaction.transaction_date >= start_date).all()

    if not transactions:
        return success_response(
            data={
                "status": "unavailable",
                "labels": [],
                "legitimate": [],
                "fraudulent": [],
                "flagged": [],
                "is_synthetic": False,
                "reason": "No transaction telemetry is available for the selected period."
            }
        )

    days = [
        (datetime.datetime.now() - datetime.timedelta(days=i)).strftime("%m-%d")
        for i in range(29, -1, -1)
    ]
    
    legit_counts = {day: 0 for day in days}
    fraud_counts = {day: 0 for day in days}
    flagged_counts = {day: 0 for day in days}
    
    for tx in transactions:
        tx_day = tx.transaction_date.strftime("%m-%d")
        if tx_day in legit_counts:
            if tx.status == TransactionStatus.APPROVED:
                legit_counts[tx_day] += 1
            elif tx.status == TransactionStatus.DECLINED:
                fraud_counts[tx_day] += 1
            elif tx.status == TransactionStatus.FLAGGED:
                flagged_counts[tx_day] += 1

    return success_response(
        data={
            "status": "available",
            "labels": days,
            "legitimate": [legit_counts[day] for day in days],
            "fraudulent": [fraud_counts[day] for day in days],
            "flagged": [flagged_counts[day] for day in days],
            "is_synthetic": False,
        }
    )


@telemetry_bp.route("/health", methods=["GET"])
@jwt_required()
@require_role(["Administrator"])
def get_system_health():
    user = get_current_user()
    
    # Check DB status
    from app.database.core import db
    try:
        db.session.execute(db.text("SELECT 1"))
        db_status = "Online"
    except Exception:
        db_status = "Offline"

    return success_response(
        data={
            "cpu_usage": None,
            "memory_usage": None,
            "api_latency_ms": None,
            "backend_status": "Online",
            "database_status": db_status,
            "smtp_status": None,
            "active_model_version": None,
        }
    )
