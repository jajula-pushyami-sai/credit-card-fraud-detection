from flask import Blueprint
from flask_jwt_extended import jwt_required, get_current_user
from app.middleware.auth import require_role
from app.core.responses import success_response
from app.models.mlops import MLModel, MLExperiment, DriftMetric
from app.database.core import db

ml_bp = Blueprint("ml", __name__)


@ml_bp.route("/registry", methods=["GET"])
@jwt_required()
@require_role(["Administrator", "Fraud Analyst"])
def get_model_registry():
    """Returns the current status of all deployed and retired models from the database."""
    get_current_user()

    models = MLModel.query.all()
    
    if not models:
        # Do NOT seed database with fabricated metrics.
        # Check for real evaluation artifact
        import json
        import os
        eval_path = os.path.join(os.path.dirname(__file__), "../../ml/models/saved/eval_metrics.json")
        registry = []
        if os.path.exists(eval_path):
            try:
                with open(eval_path, "r") as f:
                    eval_data = json.load(f)
                
                metrics = eval_data.get("metrics", eval_data)
                provenance = eval_data.get("evaluation_type", "unavailable") if isinstance(eval_data, dict) and "evaluation_type" in eval_data else "unavailable"
                
                f1 = metrics.get("f1", 0)
                if not f1:
                    p = metrics.get("precision", 0)
                    r = metrics.get("recall", 0)
                    f1 = 2 * (p * r) / (p + r) if (p + r) > 0 else 0
                
                registry.append({
                    "id": "mdl_v1.0",
                    "name": "ET + MLP + XGBoost Meta-Ensemble",
                    "status": "Available",
                    "f1_score": f1,
                    "pr_auc": metrics.get("pr_auc", 0),
                    "latency_ms": None,
                    "training_date": "Historical",
                    "commit": None,
                    "provenance": provenance,
                    "is_demo": False
                })
            except Exception:
                pass
        
        if not registry:
            return success_response(data={"status": "unavailable", "reason": "No verified evaluation artifact is available.", "registry": []})
    else:
        registry = [
            {
                "id": f"mdl_{m.version}",
                "name": m.model_type,
                "status": m.status,
                "f1_score": m.f1_score,
                "pr_auc": m.pr_auc,
                "latency_ms": int(m.inference_time) if m.inference_time is not None else None,
                "training_date": m.created_at.isoformat() + "Z",
                "commit": None,  # Removing auto-gen
                "provenance": "database",
                "is_demo": False
            }
            for m in models
        ]
        
    return success_response(data={"registry": registry})


@ml_bp.route("/experiments", methods=["GET"])
@jwt_required()
@require_role(["Administrator", "Fraud Analyst"])
def get_experiments():
    """Returns historical hyperparameter tuning runs from the DB."""
    get_current_user()

    exps = MLExperiment.query.all()
    # Do NOT seed database with fabricated experiments.
    
    experiments = [
        {
            "run_id": f"exp_{e.id}",
            "model": e.experiment_name,
            "learning_rate": e.learning_rate,
            "max_depth": e.max_depth,
            "f1_score": e.f1_score,
        }
        for e in exps
    ]
    return success_response(data={"experiments": experiments})


@ml_bp.route("/drift", methods=["GET"])
@jwt_required()
@require_role(["Administrator", "Fraud Analyst"])
def get_drift():
    """Returns real feature drift calculations from the DB."""
    get_current_user()

    drifts = DriftMetric.query.all()
    # Do NOT seed database with fabricated drift metrics.
    
    if not drifts:
        drift_data = {
            "status": "unavailable",
            "features": [],
            "concept_drift": {
                "kl_divergence": None,
                "status": "unavailable",
            },
        }
        return success_response(data=drift_data)

    features = [
        {
            "name": d.feature_name,
            "psi_score": d.psi_score,
            "status": "Warning" if d.psi_score is not None and d.psi_score > 0.1 else "Stable",
        }
        for d in drifts
    ]

    drift_data = {
        "status": (
            "Warning" if any(f["status"] == "Warning" for f in features) else "Healthy"
        ),
        "features": features,
        "concept_drift": {
            "kl_divergence": drifts[0].kl_divergence if drifts else None,
            "status": (
                "Stable"
                if (drifts[0].kl_divergence is not None and drifts[0].kl_divergence < 0.1)
                else "Warning" if drifts[0].kl_divergence is not None else "unavailable"
            ),
        },
    }
    return success_response(data=drift_data)


@ml_bp.route("/metrics", methods=["GET"])
@jwt_required()
def get_ml_metrics():
    """Returns the actual ML model evaluation metrics, confusion matrix, and dataset summary."""
    import json
    import os
    eval_path = os.path.join(os.path.dirname(__file__), "../../ml/models/saved/eval_metrics.json")
    if not os.path.exists(eval_path):
        return success_response(data={"status": "unavailable", "message": "Evaluation metrics not available."})
    
    with open(eval_path, "r") as f:
        eval_data = json.load(f)
        
    return success_response(data=eval_data)

