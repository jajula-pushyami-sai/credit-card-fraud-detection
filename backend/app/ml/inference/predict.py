import numpy as np
import yaml
import joblib
import os
import logging
from pathlib import Path

from app.core.exceptions import ModelNotReadyError

logger = logging.getLogger(__name__)

# Expected feature counts for artifact validation
_EXPECTED_INPUT_FEATURES = 30   # Time + V1..V28 + Amount
_EXPECTED_META_FEATURES = 2     # prob_et, prob_mlp


class InferenceService:
    def __init__(self, registry_path=None, config_path=None):
        """
        Load trained model artifacts. Raises ModelNotReadyError if artifacts
        are missing, corrupt, or incompatible with the expected feature schema.

        config_path: path to risk_thresholds.yaml. If None, derived from __file__.
        """
        base_dir = Path(__file__).resolve().parent.parent  # app/ml/
        models_dir = base_dir / "models" / "saved"

        if config_path is None:
            config_path = base_dir / "config" / "risk_thresholds.yaml"
        else:
            config_path = Path(config_path)
            if not config_path.is_absolute():
                config_path = base_dir / config_path

        # ------------------------------------------------------------------
        # 0. Load and validate canonical schema
        # ------------------------------------------------------------------
        schema_path = models_dir / "schema.json"
        if not schema_path.exists():
            raise ModelNotReadyError("Fraud detection model is not available. Missing artifact: schema.json.")
        try:
            import json
            from app.ml.schema import CANONICAL_FEATURES
            with open(schema_path, "r") as f:
                schema_data = json.load(f)
            if schema_data.get("features") != CANONICAL_FEATURES:
                raise ModelNotReadyError("Fraud detection model is not available. Loaded schema does not match canonical schema.")
        except Exception as e:
            if isinstance(e, ModelNotReadyError):
                raise
            raise ModelNotReadyError(f"Fraud detection model is not available. Corrupt artifact: schema.json ({e})") from e

        # ------------------------------------------------------------------
        # 1. Check all required artifact files exist
        # ------------------------------------------------------------------
        required_artifacts = ["scaler.pkl", "extra_trees.pkl", "mlp.keras", "xgboost_meta.pkl"]
        missing = [a for a in required_artifacts if not (models_dir / a).exists()]
        if missing:
            raise ModelNotReadyError(
                f"Fraud detection model is not available. "
                f"Missing artifacts: {', '.join(missing)}."
            )

        # ------------------------------------------------------------------
        # 2. Load artifacts — any deserialization failure ⇒ ModelNotReadyError
        # ------------------------------------------------------------------
        try:
            self.scaler = joblib.load(models_dir / "scaler.pkl")
        except Exception as e:
            raise ModelNotReadyError(
                f"Fraud detection model is not available. Corrupt artifact: scaler.pkl ({e})"
            ) from e

        try:
            from app.ml.training.extra_trees import ExtraTreesTrainer
            self.et_model = ExtraTreesTrainer.load(models_dir / "extra_trees.pkl")
        except Exception as e:
            raise ModelNotReadyError(
                f"Fraud detection model is not available. Corrupt artifact: extra_trees.pkl ({e})"
            ) from e

        try:
            from app.ml.training.mlp import MLPTrainer
            self.mlp_model = MLPTrainer.load(models_dir / "mlp.keras")
        except Exception as e:
            raise ModelNotReadyError(
                f"Fraud detection model is not available. Corrupt artifact: mlp.keras ({e})"
            ) from e

        try:
            from app.ml.training.xgboost_meta import XGBoostMetaTrainer
            self.meta_model = XGBoostMetaTrainer.load(models_dir / "xgboost_meta.pkl")
        except Exception as e:
            raise ModelNotReadyError(
                f"Fraud detection model is not available. Corrupt artifact: xgboost_meta.pkl ({e})"
            ) from e

        # ------------------------------------------------------------------
        # 3. Validate artifact compatibility with expected feature schema
        # ------------------------------------------------------------------
        self._validate_artifacts()

        # ------------------------------------------------------------------
        # 4. Load optional calibrator
        # ------------------------------------------------------------------
        calibrator_path = models_dir / "calibrator.pkl"
        if calibrator_path.exists():
            try:
                from app.ml.training.calibration import ProbabilityCalibrator
                self.calibrator = ProbabilityCalibrator.load(calibrator_path)
            except Exception as e:
                logger.warning(f"Calibrator artifact corrupt, skipping: {e}")
                self.calibrator = None
        else:
            self.calibrator = None

        # ------------------------------------------------------------------
        # 5. Load risk thresholds
        # ------------------------------------------------------------------
        try:
            with open(config_path, "r") as f:
                self.risk_config = yaml.safe_load(f)["thresholds"]
        except Exception as e:
            raise ModelNotReadyError(
                f"Fraud detection model is not available. "
                f"Risk threshold config unreadable: {e}"
            ) from e

        self.active_record = {"version_id": "v1.0.0-ensemble"}
        self.models_dir = models_dir

        logger.info("[InferenceService] All model artifacts loaded and validated.")

    # ------------------------------------------------------------------
    # Artifact validation
    # ------------------------------------------------------------------
    def _validate_artifacts(self):
        """Validate that every loaded artifact is compatible with the expected
        feature schema.  Raises ModelNotReadyError on any mismatch."""

        # --- Scaler ---
        if not callable(getattr(self.scaler, "transform", None)):
            raise ModelNotReadyError(
                "Fraud detection model is not available. "
                "scaler.pkl does not expose a transform() method."
            )
        scaler_features = getattr(self.scaler, "n_features_in_", None)
        if scaler_features is not None and scaler_features != _EXPECTED_INPUT_FEATURES:
            raise ModelNotReadyError(
                f"Fraud detection model is not available. "
                f"scaler.pkl expects {scaler_features} features, "
                f"but {_EXPECTED_INPUT_FEATURES} are required."
            )

        # --- ExtraTrees ---
        if not callable(getattr(self.et_model, "predict_proba", None)):
            raise ModelNotReadyError(
                "Fraud detection model is not available. "
                "extra_trees.pkl does not expose predict_proba()."
            )
        et_features = getattr(self.et_model.model, "n_features_in_", None)
        if et_features is not None and et_features != _EXPECTED_INPUT_FEATURES:
            raise ModelNotReadyError(
                f"Fraud detection model is not available. "
                f"extra_trees.pkl expects {et_features} features, "
                f"but {_EXPECTED_INPUT_FEATURES} are required."
            )

        # --- MLP (Keras) ---
        if not callable(getattr(self.mlp_model, "predict_proba", None)):
            raise ModelNotReadyError(
                "Fraud detection model is not available. "
                "mlp.keras does not expose predict_proba()."
            )
        keras_model = getattr(self.mlp_model, "model", None)
        if keras_model is not None:
            input_shape = getattr(keras_model, "input_shape", None)
            if input_shape is not None:
                # Keras input_shape is (None, n_features)
                expected_dim = input_shape[-1] if isinstance(input_shape, tuple) else None
                if expected_dim is not None and expected_dim != _EXPECTED_INPUT_FEATURES:
                    raise ModelNotReadyError(
                        f"Fraud detection model is not available. "
                        f"mlp.keras expects input dim {expected_dim}, "
                        f"but {_EXPECTED_INPUT_FEATURES} are required."
                    )

        # --- XGBoost Meta ---
        if not callable(getattr(self.meta_model, "predict_proba", None)):
            raise ModelNotReadyError(
                "Fraud detection model is not available. "
                "xgboost_meta.pkl does not expose predict_proba()."
            )
        meta_features = getattr(self.meta_model.model, "n_features_in_", None)
        if meta_features is not None and meta_features != _EXPECTED_META_FEATURES:
            raise ModelNotReadyError(
                f"Fraud detection model is not available. "
                f"xgboost_meta.pkl expects {meta_features} meta-features, "
                f"but {_EXPECTED_META_FEATURES} are required."
            )

    # ------------------------------------------------------------------
    # Risk classification
    # ------------------------------------------------------------------
    def _determine_risk(self, probability: float):
        if probability < self.risk_config["low_risk"]["max_probability"]:
            return "Low Risk", self.risk_config["low_risk"]["action"]
        elif probability < self.risk_config["review_required"]["max_probability"]:
            return "Review Required", self.risk_config["review_required"]["action"]
        else:
            return "High Risk", self.risk_config["high_risk"]["action"]

    # ------------------------------------------------------------------
    # Single-transaction inference
    # ------------------------------------------------------------------
    def predict_single(self, transaction_dict: dict) -> dict:
        """
        Run a single-transaction inference through the full ensemble.

        Expects a full feature payload strictly matching CANONICAL_FEATURES.
        """
        from app.ml.schema import CANONICAL_FEATURES
        from app.core.exceptions import AppError

        features = np.zeros((1, len(CANONICAL_FEATURES)))
        
        # Exact feature set validation
        if set(transaction_dict.keys()) != set(CANONICAL_FEATURES):
            raise AppError("Feature mismatch: expected exactly CANONICAL_FEATURES", 422)
            
        for i, name in enumerate(CANONICAL_FEATURES):
            try:
                val = float(transaction_dict[name])
                if not np.isfinite(val):
                    raise AppError(f"Feature '{name}' must be finite.", 422)
                features[0, i] = val
            except (ValueError, TypeError):
                raise AppError(f"Invalid numeric value for feature '{name}'", 422)

        # Scale
        X_scaled = self.scaler.transform(features)

        # Base model predictions
        prob_et = self.et_model.predict_proba(X_scaled)
        prob_mlp = self.mlp_model.predict_proba(X_scaled)

        # Meta-learner
        X_meta = self.meta_model.prepare_meta_features(prob_et, prob_mlp)
        final_prob = float(self.meta_model.predict_proba(X_meta)[0])

        # Apply calibration if available
        if self.calibrator is not None:
            final_prob = float(self.calibrator.predict_proba(X_meta)[0])

        if not (0.0 <= final_prob <= 1.0) or not np.isfinite(final_prob):
            raise AppError("Invalid probability calculated by the ensemble.", 500)

        risk_level, action = self._determine_risk(final_prob)

        return {
            "probability": final_prob,
            "risk_level": risk_level,
            "suggested_action": action,
            "base_models": {
                "extra_trees": float(prob_et[0]),
                "mlp": float(prob_mlp[0]),
            },
            "shap_values": {},
            "feature_mode": "full",
        }

    # ------------------------------------------------------------------
    # SHAP Explanations
    # ------------------------------------------------------------------
    def get_shap_explanation(self, transaction_dict: dict):
        """
        Compute real SHAP values for a given transaction using the full ensemble.
        Returns (base_value, shap_values_list).
        """
        from app.ml.explainability.engine import ExplainabilityEngine
        from app.ml.schema import CANONICAL_FEATURES
        from app.core.exceptions import AppError

        features = np.zeros((1, len(CANONICAL_FEATURES)))
        for i, name in enumerate(CANONICAL_FEATURES):
            if name not in transaction_dict:
                raise AppError(f"Incomplete feature vector: missing '{name}'", 422)
            try:
                features[0, i] = float(transaction_dict[name])
            except (ValueError, TypeError):
                raise AppError(f"Invalid value for feature '{name}'", 422)

        # Define the predict_proba pipeline wrapper
        def predict_proba_pipeline(X_raw):
            X_scaled = self.scaler.transform(X_raw)
            prob_et = self.et_model.predict_proba(X_scaled)
            prob_mlp = self.mlp_model.predict_proba(X_scaled)
            X_meta = self.meta_model.prepare_meta_features(prob_et, prob_mlp)
            probs = self.meta_model.predict_proba(X_meta)
            if self.calibrator is not None:
                probs = self.calibrator.predict_proba(X_meta)
            
            # predict_proba for binary classification usually returns shape (N, 2)
            # XGBoostMetaTrainer predict_proba currently returns (N, 1) or a 1D array of probabilities for class 1.
            # We need to reshape it to (N, 2) for KernelExplainer standard interface
            probs = np.array(probs).flatten()
            return np.vstack([1 - probs, probs]).T

        # BACKGROUND DATA STRATEGY:
        # We use the scaler's mean as a deterministic single-point baseline:
        # `scaler.mean_.reshape(1, -1)`
        # This is a technically valid, fast one-point baseline for KernelExplainer.
        # It represents the mathematical average of the training data features.
        # While a larger background dataset (e.g., 100 k-means centroids) would provide
        # a broader population baseline, this single-point approach prioritizes 
        # real-time inference latency and reproducibility over global representativeness.
        background_data = self.scaler.mean_.reshape(1, -1)

        engine = ExplainabilityEngine(
            predict_proba_fn=predict_proba_pipeline,
            background_data=background_data,
            feature_names=CANONICAL_FEATURES
        )

        base_value, shap_values = engine.explain_local_shap(features[0])
        return base_value, shap_values

    # ------------------------------------------------------------------
    # Batch inference
    # ------------------------------------------------------------------
    def predict_batch(self, df) -> list[dict]:
        """
        Vectorized batch inference over a Pandas DataFrame.
        Expects columns exactly matching CANONICAL_FEATURES.
        """
        import pandas as pd
        from app.ml.schema import CANONICAL_FEATURES
        from app.core.exceptions import AppError

        n = len(df)
        if n == 0:
            return []

        features = np.zeros((n, len(CANONICAL_FEATURES)))
        
        if set(df.columns) != set(CANONICAL_FEATURES):
            raise AppError("Batch features do not exactly match CANONICAL_FEATURES", 422)

        for i, name in enumerate(CANONICAL_FEATURES):
            try:
                col_data = df[name].astype(float).to_numpy()
                if not np.isfinite(col_data).all():
                    raise AppError(f"Feature '{name}' contains non-finite values (NaN/Inf).", 422)
                features[:, i] = col_data
            except (ValueError, TypeError):
                raise AppError(f"Invalid values in feature column '{name}'", 422)

        # Scale
        X_scaled = self.scaler.transform(features)

        # Base model predictions
        prob_et = self.et_model.predict_proba(X_scaled)
        prob_mlp = self.mlp_model.predict_proba(X_scaled)

        # Meta-learner
        X_meta = self.meta_model.prepare_meta_features(prob_et, prob_mlp)
        final_probs = self.meta_model.predict_proba(X_meta)

        # Calibrate if available
        if self.calibrator is not None:
            final_probs = self.calibrator.predict_proba(X_meta)

        amounts = df.get("Amount", pd.Series(np.zeros(n))).astype(float).to_numpy()

        results = []
        for i in range(n):
            prob = float(final_probs[i])
            if not (0.0 <= prob <= 1.0) or not np.isfinite(prob):
                raise AppError("Invalid probability calculated by the ensemble.", 500)
            risk_level, action = self._determine_risk(prob)
            results.append({
                "Amount": float(amounts[i]),
                "Probability": round(prob, 4),
                "Risk": risk_level,
                "Action": action
            })

        return results
