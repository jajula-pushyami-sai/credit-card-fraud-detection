from app.database.core import db
from datetime import datetime


class SecurityIncident(db.Model):
    __tablename__ = "security_incidents"

    id = db.Column(db.Integer, primary_key=True)
    incident_type = db.Column(db.String(100), nullable=False)
    severity = db.Column(
        db.String(20), nullable=False
    )  # 'Low', 'Medium', 'High', 'Critical'
    description = db.Column(db.Text)
    status = db.Column(
        db.String(20), default="Open"
    )  # 'Open', 'Investigating', 'Resolved'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    resolved_at = db.Column(db.DateTime, nullable=True)


class ComplianceScore(db.Model):
    __tablename__ = "compliance_scores"

    id = db.Column(db.Integer, primary_key=True)
    framework = db.Column(db.String(50), nullable=False)  # e.g., 'GDPR', 'OWASP'
    score = db.Column(db.Float, nullable=False)
    last_assessed = db.Column(db.DateTime, default=datetime.utcnow)
