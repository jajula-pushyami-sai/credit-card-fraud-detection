from app.database.core import db
from datetime import datetime


class MLModel(db.Model):
    __tablename__ = "ml_models"

    id = db.Column(db.Integer, primary_key=True)
    version = db.Column(db.String(50), nullable=False, unique=True)
    model_type = db.Column(
        db.String(50), nullable=False
    )  # e.g. 'XGBoost', 'ExtraTrees'
    f1_score = db.Column(db.Float)
    pr_auc = db.Column(db.Float)
    inference_time = db.Column(db.Float)
    status = db.Column(
        db.String(20), default="Retired"
    )  # 'Champion', 'Challenger', 'Retired'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class MLExperiment(db.Model):
    __tablename__ = "ml_experiments"

    id = db.Column(db.Integer, primary_key=True)
    experiment_name = db.Column(db.String(100), nullable=False)
    learning_rate = db.Column(db.Float)
    max_depth = db.Column(db.Integer)
    f1_score = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class DriftMetric(db.Model):
    __tablename__ = "drift_metrics"

    id = db.Column(db.Integer, primary_key=True)
    feature_name = db.Column(db.String(50), nullable=False)
    kl_divergence = db.Column(db.Float)
    psi_score = db.Column(db.Float)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
