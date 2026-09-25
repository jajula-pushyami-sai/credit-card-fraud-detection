from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_current_user
from app.core.responses import success_response
from app.core.exceptions import AppError
from app.database.core import db
from app.models.transaction import Transaction, TransactionStatus
from app.models.review import Review, ReviewStatus
from app.models.audit import AuditLog
from app.middleware.auth import require_role

transactions_bp = Blueprint("transactions", __name__)


@transactions_bp.route("/", methods=["GET"])
@jwt_required()
def get_transactions():
    user = get_current_user()
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 20, type=int)

    from sqlalchemy.orm import joinedload

    query = Transaction.query.options(joinedload(Transaction.prediction))
    if user.role.value == "Customer":
        query = query.filter_by(user_id=user.id)
    # Analysts/Admins can see all

    query = query.order_by(Transaction.created_at.desc())
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)

    items = []
    for tx in pagination.items:
        items.append(
            {
                "id": tx.id,
                "merchant": tx.merchant,
                "amount": float(tx.amount),
                "status": tx.status.value,
                "date": tx.transaction_date.isoformat(),
                "risk_score": tx.prediction.risk_score if tx.prediction else None,
            }
        )

    return success_response(
        data={
            "items": items,
            "total": pagination.total,
            "pages": pagination.pages,
            "current_page": page,
        }
    )


@transactions_bp.route("/<tx_id>/review", methods=["PUT"])
@jwt_required()
@require_role(["Fraud Analyst", "Administrator"])
def review_transaction(tx_id):
    data = request.json
    action = data.get("action")  # 'approve' or 'reject'
    notes = data.get("notes", "")

    user = get_current_user()
    tx = Transaction.query.get(tx_id)
    if not tx:
        raise AppError("Transaction not found", 404)

    # Create or update review
    review = Review.query.filter_by(transaction_id=tx.id).first()
    if not review:
        review = Review(transaction_id=tx.id, analyst_id=user.id)
        db.session.add(review)

    review.analyst_id = user.id
    review.notes = notes

    if action == "approve":
        review.status = ReviewStatus.APPROVED
        tx.status = (
            TransactionStatus.APPROVED
        )  # False positive by ML, approved by human
    elif action == "reject":
        review.status = ReviewStatus.REJECTED
        tx.status = TransactionStatus.DECLINED  # True positive, fraud confirmed
    else:
        raise AppError("Invalid action", 400)

    audit = AuditLog(
        user_id=user.id,
        action="MANUAL_REVIEW_COMPLETED",
        entity_type="Transaction",
        entity_id=tx.id,
        details={"decision": action, "notes": notes},
    )
    db.session.add(audit)
    db.session.commit()

    return success_response(message=f"Transaction {action}d successfully.")


@transactions_bp.route("/heatmap", methods=["GET"])
@jwt_required()
@require_role(["Administrator", "Fraud Analyst"])
def get_heatmap():
    """Aggregates real fraud instances by Day of Week and Hour of Day."""
    from sqlalchemy import func, extract

    user = get_current_user()

    # The extract('dow') function must remain dialect-portable to support both SQLite and MySQL.
    # Note: SQLite extract('dow') returns 0=Sunday..6=Saturday. 
    # MySQL DAYOFWEEK() behavior returns 1=Sunday..7=Saturday.
    query = (
        db.session.query(
            extract('dow', Transaction.transaction_date).label("dow"),
            extract('hour', Transaction.transaction_date).label("hour"),
            func.count(Transaction.id).label("count"),
        )
        .filter(Transaction.status == TransactionStatus.DECLINED)
        .group_by("dow", "hour")
    )

    results = query.all()

    echarts_data = []
    is_synthetic = False

    if not results:
        # No real declined transactions in DB yet — generate illustrative demo data.
        # is_synthetic=True is returned so the frontend can badge this as demo data.
        import random
        is_synthetic = True

        for i in range(7):
            for j in range(24):
                base = random.random() * 5
                if j < 6 or j > 22:
                    base += random.random() * 10
                echarts_data.append([j, i, int(base)])
    else:
        is_sqlite = db.engine.dialect.name == "sqlite"
        for dow_raw, hour, count in results:
            # Normalize to 0=Sunday, 1=Monday ... 6=Saturday
            if is_sqlite:
                standard_dow = int(dow_raw)
            else:
                # Assuming MySQL 1-7 where 1=Sunday
                standard_dow = int(dow_raw) - 1

            # ECharts y-axis maps 0=Saturday, 1=Friday, ..., 6=Sunday
            echarts_day = 6 - standard_dow

            echarts_data.append([int(hour), echarts_day, count])

    return success_response(data={"heatmap": echarts_data, "is_synthetic": is_synthetic})

