from flask import Blueprint, request, current_app
from flask_jwt_extended import jwt_required
from app.core.responses import success_response
from app.core.exceptions import AppError
from app.api.v1.predict import get_inference_service
import random
import pandas as pd
import os
import threading

fraud_bp = Blueprint("fraud", __name__)

# ---------------------------------------------------------------------------
# Module-level DataFrame cache — loaded once on first request, not per-call.
# A lock ensures only one thread reads the CSV if multiple requests arrive
# simultaneously during cold start.
# ---------------------------------------------------------------------------
_df_cache: pd.DataFrame | None = None
_df_lock = threading.Lock()


def _get_dataset() -> pd.DataFrame:
    """Return the cached transaction DataFrame, loading it on first access."""
    global _df_cache
    if _df_cache is not None:
        return _df_cache
    with _df_lock:
        if _df_cache is not None:  # double-checked locking
            return _df_cache
        base_dir = os.path.dirname(
            os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        )
        data_path = os.path.join(
            base_dir, "app", "ml", "data", "raw", "creditcard.csv"
        )
        if not os.path.exists(data_path):
            raise AppError("Dataset not found", 404)
        current_app.logger.info(
            f"[fraud_bp] Loading dataset into cache from {data_path}"
        )
        _df_cache = pd.read_csv(data_path)
        current_app.logger.info(f"[fraud_bp] Dataset cached — {len(_df_cache):,} rows.")
    return _df_cache


@fraud_bp.route("/predict", methods=["POST"])
@jwt_required()
def predict():
    """
    Demo-mode fraud prediction endpoint.
    Picks a real transaction row from the training dataset (by index or
    randomly at 50/50 fraud vs. legit) and runs it through the full
    InferenceService stacked ensemble — the same model used by /predict/single.

    Requires a valid JWT token.
    """
    data = request.get_json(silent=True) or {}

    df = _get_dataset()

    transaction_index = data.get("transaction_index")

    if transaction_index is not None:
        try:
            row = df.iloc[int(transaction_index)]
        except IndexError:
            raise AppError("Transaction index out of bounds", 404)
    else:
        # Force 50/50 split for meaningful demo coverage
        is_fraud = random.choice([True, False])
        subset = df[df["Class"] == (1 if is_fraud else 0)]
        if subset.empty:
            subset = df
        sampled = subset.sample(n=1)
        transaction_index = int(sampled.index[0])
        row = sampled.iloc[0]

    # Build the full 30-feature dict (Time, V1-V28, Amount) for the ensemble
    from app.ml.schema import CANONICAL_FEATURES
    features_dict = {k: float(row[k]) for k in CANONICAL_FEATURES}

    # Run through the stacked ensemble (Extra Trees + MLP + XGBoost)
    shap_explanation = None
    model_version = "v1.0.0-ensemble"
    try:
        engine = get_inference_service()
        result = engine.predict_single(features_dict)
        prob = result["probability"]
        risk_level_name = result["risk_level"]
        feature_mode = result.get("feature_mode", "full")
        base_models = result.get("base_models", {})
        model_version = getattr(engine, "active_record", {}).get("version_id", "v1.0.0-ensemble")

        # Compute SHAP explanation
        try:
            base_val, shap_vals = engine.get_shap_explanation(features_dict)
            import numpy as np
            top_indices = np.argsort(np.abs(shap_vals))[::-1][:8]
            top_features = []
            for idx in top_indices:
                feat_name = CANONICAL_FEATURES[idx]
                top_features.append({
                    "feature": feat_name,
                    "value": round(float(features_dict[feat_name]), 4),
                    "shap_value": round(float(shap_vals[idx]), 4)
                })
            shap_explanation = {
                "base_value": round(float(base_val), 4),
                "top_features": top_features
            }
        except Exception as e:
            current_app.logger.warning(f"[fraud_bp] SHAP calculation error: {e}")
            shap_explanation = None
    except Exception:
        # Gracefully fall back to pretrained LightGBM pipeline if ensemble is not yet trained
        from app.services.fraud_model import FraudDetectionModel
        lgb_model = FraudDetectionModel()
        pred_res = lgb_model.predict_fraud(features_dict)
        prob = pred_res["fraud_probability"]
        risk_level_name = "High Risk" if prob >= 0.75 else ("Review Required" if prob >= 0.3 else "Low Risk")
        feature_mode = "lightgbm_pretrained"
        base_models = {"lightgbm": round(prob, 4)}

    # Map ensemble risk levels to response vocabulary
    risk_map = {
        "Low Risk": ("LOW", "APPROVE"),
        "Review Required": ("MEDIUM", "REVIEW"),
        "High Risk": ("HIGH", "DECLINE"),
    }
    risk_level, recommended_action = risk_map.get(
        risk_level_name, ("MEDIUM", "REVIEW")
    )

    # Return clean response — V1-V28 values are never forwarded to the frontend
    clean_response = {
        "transaction_id": f"TX-{transaction_index}",
        "transaction_index": transaction_index,
        "transaction_amount": float(row.get("Amount", 0.0)),
        "fraud_probability": round(prob, 4),
        "risk_score": round(prob * 100.0, 2),
        "prediction": "Fraud" if prob >= 0.75 else "Normal",
        "risk_level": risk_level,
        "recommended_action": recommended_action,
        "feature_mode": feature_mode,
        "base_models": base_models,
        "model_version": model_version,
        "shap_explanation": shap_explanation
    }

    return success_response(
        data=clean_response, message="Prediction completed successfully."
    )


@fraud_bp.route("/random", methods=["GET"])
@jwt_required()
def random_transaction():
    """Pick a random transaction row index and information from creditcard.csv."""
    df = _get_dataset()
    is_fraud = random.choice([True, False])
    subset = df[df["Class"] == (1 if is_fraud else 0)]
    if subset.empty:
        subset = df
    sampled = subset.sample(n=1)
    idx = int(sampled.index[0])
    row = sampled.iloc[0]

    return success_response(
        data={
            "transaction_index": idx,
            "transaction_id": f"TX-{idx}",
            "amount": float(row.get("Amount", 0.0)),
            "time": float(row.get("Time", 0.0)),
            "is_fraud_label": int(row.get("Class", 0))
        },
        message="Random transaction selected."
    )

