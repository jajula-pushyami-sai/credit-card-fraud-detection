from flask import Blueprint
from flask_jwt_extended import jwt_required, get_current_user
from app.core.responses import success_response
from app.database.core import db
from app.models.transaction import Transaction, TransactionStatus
from app.models.user import User

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/stats", methods=["GET"])
@jwt_required()
def get_stats():
    user = get_current_user()
    role = user.role.value

    if role == "Customer":
        total_tx = Transaction.query.filter_by(user_id=user.id).count()
        flagged_tx = Transaction.query.filter_by(
            user_id=user.id, status=TransactionStatus.FLAGGED
        ).count()
        return success_response(
            data={
                "total_transactions": total_tx,
                "flagged_transactions": flagged_tx,
                "account_health": "Good" if flagged_tx == 0 else "Review Needed",
            }
        )

    elif role == "Fraud Analyst":
        queue_size = Transaction.query.filter_by(
            status=TransactionStatus.FLAGGED
        ).count()
        my_reviews = (
            db.session.query(db.func.count())
            .filter(Transaction.review.has(analyst_id=user.id))
            .scalar()
            or 0
        )
        return success_response(
            data={
                "priority_queue_size": queue_size,
                "my_reviews_this_month": my_reviews,
            }
        )

    elif role == "Administrator":
        total_users = User.query.count()
        total_tx = Transaction.query.count()
        total_fraud = Transaction.query.filter_by(
            status=TransactionStatus.DECLINED
        ).count()
        total_fraud_dollars = (
            db.session.query(db.func.sum(Transaction.amount))
            .filter_by(status=TransactionStatus.DECLINED)
            .scalar()
            or 0
        )
        return success_response(
            data={
                "total_users": total_users,
                "total_transactions": total_tx,
                "fraud_prevented": round(float(total_fraud_dollars), 2),
                "fraud_count": total_fraud,
                "system_status": "Online",
            }
        )
