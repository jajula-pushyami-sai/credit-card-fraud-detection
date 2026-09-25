from flask import Blueprint
from app.api.v1.auth import auth_bp
from app.api.v1.predict import predict_bp
from app.api.v1.fraud import fraud_bp
from app.api.v1.transactions import transactions_bp
from app.api.v1.dashboard import dashboard_bp
from app.api.v1.notifications import notifications_bp
from app.api.v1.explainability import explainability_bp
from app.api.v1.telemetry import telemetry_bp
from app.api.v1.ops import ops_bp
from app.api.v1.copilot import copilot_bp
from app.api.v1.grc import grc_bp
from app.api.v1.ml import ml_bp
from app.api.v1.settings import settings_bp

v1_bp = Blueprint("api_v1", __name__, url_prefix="/api/v1")

v1_bp.register_blueprint(auth_bp, url_prefix="/auth")
v1_bp.register_blueprint(predict_bp, url_prefix="/predict")
v1_bp.register_blueprint(fraud_bp, url_prefix="/fraud")
v1_bp.register_blueprint(transactions_bp, url_prefix="/transactions")
v1_bp.register_blueprint(dashboard_bp, url_prefix="/dashboard")
v1_bp.register_blueprint(notifications_bp, url_prefix="/notifications_feed")
v1_bp.register_blueprint(explainability_bp, url_prefix="/explainability")
v1_bp.register_blueprint(telemetry_bp, url_prefix="/telemetry")
v1_bp.register_blueprint(ops_bp, url_prefix="/ops")
v1_bp.register_blueprint(copilot_bp, url_prefix="/copilot")
v1_bp.register_blueprint(grc_bp, url_prefix="/grc")
v1_bp.register_blueprint(ml_bp, url_prefix="/ml")
v1_bp.register_blueprint(settings_bp, url_prefix="/settings")
