"""
HISTORICAL / EXPERIMENTAL IMPLEMENTATION
This module represents a historical LightGBM implementation that was not wired into 
the production API routes. It is preserved for reference.
The active production runtime uses the Extra Trees + MLP + XGBoost Meta-Ensemble 
located in `app.ml.inference.predict`.
"""

import os
import json
import joblib
import pandas as pd
from typing import Dict, Any


class FraudDetectionModel:
    """
    EXPERIMENTAL: Do not use in production. 
    Use `InferenceService` from `app.ml.inference.predict` instead.
    """
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(FraudDetectionModel, cls).__new__(
                cls, *args, **kwargs
            )
        return cls._instance

    def __init__(self):
        if not hasattr(self, "is_initialized"):
            base_dir = os.path.dirname(
                os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            )
            self.model_dir = os.path.join(base_dir, "models", "fraud-ccf-lightgbm")
            self.pipeline_path = os.path.join(self.model_dir, "pipeline.pkl")
            self.threshold_path = os.path.join(self.model_dir, "threshold.json")

            self._load_model()
            self.is_initialized = True

    def _load_model(self):
        try:
            self.pipeline = joblib.load(self.pipeline_path)
            with open(self.threshold_path, "r") as f:
                self.threshold_data = json.load(f)
                self.threshold = self.threshold_data.get("threshold", 0.5)
        except Exception as e:
            raise RuntimeError(f"Failed to load Hugging Face model: {e}")

    def predict_fraud(self, transaction_features: Dict[str, Any]) -> Dict[str, Any]:
        expected_features = [
            "Amount",
            "V1",
            "V2",
            "V3",
            "V4",
            "V5",
            "V6",
            "V7",
            "V8",
            "V9",
            "V10",
            "V11",
            "V12",
            "V13",
            "V14",
            "V15",
            "V16",
            "V17",
            "V18",
            "V19",
            "V20",
            "V21",
            "V22",
            "V23",
            "V24",
            "V25",
            "V26",
            "V27",
            "V28",
        ]

        # 1. Validate features
        for f in expected_features:
            if f not in transaction_features:
                raise ValueError(f"Missing required feature: {f}")

        # 2. Extract features in exact order
        try:
            feature_values = [float(transaction_features[f]) for f in expected_features]
        except (ValueError, TypeError) as e:
            raise ValueError(f"Invalid numeric value in features: {e}")

        # 3. Create DataFrame (pipeline expects pandas DataFrame with correct names)
        df = pd.DataFrame([feature_values], columns=expected_features)

        # 4. Predict
        try:
            probabilities = self.pipeline.predict_proba(df)
            fraud_probability = float(probabilities[0, 1])
        except Exception as e:
            raise RuntimeError(f"Prediction failed: {e}")

        # 5. Generate prediction
        prediction_label = "Fraud" if fraud_probability >= self.threshold else "Normal"
        risk_score = fraud_probability * 100.0

        return {
            "fraud_probability": fraud_probability,
            "risk_score": risk_score,
            "prediction": prediction_label,
            "threshold": self.threshold,
        }
