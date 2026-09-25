from flask import Blueprint
from flask_jwt_extended import jwt_required, get_current_user
from app.core.responses import success_response
from app.core.exceptions import AppError
from app.models.grc import SecurityIncident, ComplianceScore
from app.database.core import db
from app.middleware.auth import require_role

grc_bp = Blueprint("grc", __name__)


@grc_bp.route("/incidents", methods=["GET"])
@jwt_required()
@require_role(["Administrator", "Fraud Analyst"])
def get_incidents():
    """Returns Security Incidents from the database."""
    user = get_current_user()

    incidents_db = SecurityIncident.query.all()
    if not incidents_db:
        # Seed if empty
        db.session.add_all(
            [
                SecurityIncident(
                    incident_type="Authentication",
                    severity="Critical",
                    status="Investigating",
                    description="Unusual volume of failed JWT token refreshes.",
                ),
                SecurityIncident(
                    incident_type="Prediction API",
                    severity="Medium",
                    status="Resolved",
                    description="API Rate Limiter dropped 450 requests.",
                ),
                SecurityIncident(
                    incident_type="Data Privacy",
                    severity="Low",
                    status="Resolved",
                    description="Automated GDPR Data Subject Access Request.",
                ),
            ]
        )
        db.session.commit()
        incidents_db = SecurityIncident.query.all()

    incidents = [
        {
            "id": f"INC-{8192 - i.id}",
            "severity": i.severity,
            "status": i.status,
            "module": i.incident_type,
            "assigned_to": "SOC Team",
            "timestamp": i.created_at.isoformat() + "Z",
            "root_cause": "Pending" if i.status != "Resolved" else "Resolved",
            "description": i.description,
        }
        for i in incidents_db
    ]
    return success_response(data={"incidents": incidents})


@grc_bp.route("/compliance_scores", methods=["GET"])
@jwt_required()
@require_role(["Administrator"])
def get_compliance_scores():
    """Returns compliance mapping scores from the database."""
    user = get_current_user()

    scores_db = ComplianceScore.query.all()
    if not scores_db:
        db.session.add_all(
            [
                ComplianceScore(framework="OWASP_Top_10", score=98.5),
                ComplianceScore(framework="GDPR_Readiness", score=100.0),
                ComplianceScore(framework="ISO_27001", score=85.0),
                ComplianceScore(framework="NIST", score=92.0),
            ]
        )
        db.session.commit()
        scores_db = ComplianceScore.query.all()

    scores = {s.framework.lower().replace(" ", "_"): s.score for s in scores_db}

    # Ensure keys match exactly what frontend expects if it is hardcoded to specific keys
    frontend_scores = {
        "owasp_top_10": scores.get("owasp_top_10", 98.5),
        "gdpr_readiness": scores.get("gdpr_readiness", 100.0),
        "iso_27001_controls": scores.get("iso_27001", 85.0),
        "nist_framework": scores.get("nist", 92.0),
    }
    return success_response(data=frontend_scores)
