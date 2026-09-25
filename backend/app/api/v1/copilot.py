import json
from flask import Blueprint, request, Response, stream_with_context
from flask_jwt_extended import jwt_required, get_current_user
from app.core.responses import success_response
from app.core.exceptions import AppError
from app.services.llm_service import get_llm_service
from app.middleware.auth import require_role
from app.models.transaction import Transaction, TransactionStatus
from app.models.grc import SecurityIncident
import datetime
import yaml
from pathlib import Path

copilot_bp = Blueprint("copilot", __name__)


@copilot_bp.route("/chat", methods=["POST"])
@jwt_required()
def chat_stream():
    """
    Streams a response back to the client using Server-Sent Events (SSE).
    """
    user = get_current_user()
    data = request.get_json() or {}
    query = data.get("query", "")

    if not query:
        raise AppError("Query cannot be empty", 400)

    context_role = user.role.value if user and hasattr(user, "role") else "Customer"
    tx_id = data.get("context", {}).get("transactionId")
    
    verified_context = f"User role: {context_role}.\n"
    if tx_id:
        tx = Transaction.query.filter_by(id=tx_id).first()
        if tx:
            if context_role == "Customer" and tx.user_id != user.id:
                tx = None
        if tx:
            verified_context += f"Transaction context: ID={tx.id}, Amount={tx.amount} {tx.currency}, Merchant={tx.merchant}, Status={tx.status.value}, Date={tx.transaction_date}.\n"
        else:
            verified_context += f"Transaction context: Transaction ID {tx_id} not found or inaccessible.\n"
    
    verified_context += f"User query: {query}"
    
    llm = get_llm_service()
    full_response = llm.generate_chat_response(verified_context, context_role)

    def generate():
        for token in llm.stream_tokens(full_response):
            # SSE format: data: {"token": "hello"}\n\n
            payload = json.dumps({"token": token})
            yield f"data: {payload}\n\n"
        # Send an end event
        yield f"data: {json.dumps({'done': True})}\n\n"

    return Response(stream_with_context(generate()), mimetype="text/event-stream")


@copilot_bp.route("/summarize/<tx_id>", methods=["GET"])
@jwt_required()
@require_role(["Administrator", "Fraud Analyst"])
def summarize_case(tx_id):
    user = get_current_user()
    tx = Transaction.query.filter_by(id=tx_id).first()
    if not tx:
        raise AppError("Transaction not found", 404)

    summary = f"Transaction Summary for {tx_id}: Transaction Amount: {tx.amount} {tx.currency}. Merchant: {tx.merchant}. Status: {tx.status.value}."
    
    if tx.prediction and tx.prediction.risk_score is not None:
        score = tx.prediction.risk_score
        risk_level = None
        try:
            config_path = Path(__file__).resolve().parent.parent.parent / "ml" / "config" / "risk_thresholds.yaml"
            with open(config_path, "r") as f:
                thresholds = yaml.safe_load(f)["thresholds"]
            if score < thresholds["low_risk"]["max_probability"]:
                risk_level = "Low Risk"
            elif score < thresholds["review_required"]["max_probability"]:
                risk_level = "Review Required"
            else:
                risk_level = "High Risk"
        except Exception:
            pass

        if risk_level:
            summary += f" Risk Level: {risk_level} ({round(score * 100, 2)}%)."
        else:
            summary += f" Risk Score: {round(score * 100, 2)}% (Categorical risk label is unavailable)."
    else:
        summary += " Risk probability and detailed feature attribution are currently unavailable."

    return success_response(data={"summary": summary})


@copilot_bp.route("/report", methods=["GET"])
@jwt_required()
@require_role(["Administrator"])
def generate_report():
    user = get_current_user()
    
    today_start = datetime.datetime.now(datetime.timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    tx_today = Transaction.query.filter(Transaction.transaction_date >= today_start).count()
    
    total_tx = Transaction.query.count()
    total_fraud = Transaction.query.filter_by(status=TransactionStatus.DECLINED).count()
    total_queue = Transaction.query.filter_by(status=TransactionStatus.FLAGGED).count()
    
    fraud_rate_str = f"{round((total_fraud / total_tx) * 100, 2)}%" if total_tx > 0 else "Unavailable"
    
    if hasattr(SecurityIncident, "query"):
        criticals = SecurityIncident.query.filter(
            SecurityIncident.severity == "Critical",
            SecurityIncident.status.in_(["Open", "Investigating"])
        ).count()
    else:
        criticals = 0

    markdown_report = f"""# Executive Fraud Report

## Transaction Overview
- **Transactions Today**: {tx_today}
- **Global Fraud Rate**: {fraud_rate_str}
- **Review Queue**: {total_queue} flagged transactions awaiting review.

## Security Overview
- **Active Critical Incidents**: {criticals} active critical security incidents.

*Note: Model evaluation, latency, and false positive rates are currently unmeasured and unavailable.*
"""
    return success_response(data={"report": markdown_report})
