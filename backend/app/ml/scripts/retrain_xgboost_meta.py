r"""
Retrain only the XGBoost meta-learner using the already-saved base models.
Run when XGBoost pickle becomes incompatible after a version upgrade.

Usage (from backend/ directory):
    C:\FraudShieldVenv\Scripts\python.exe -m app.ml.scripts.retrain_xgboost_meta
"""

import os
import sys
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split

_SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
_BACKEND_ROOT = os.path.normpath(os.path.join(_SCRIPT_DIR, "..", "..", ".."))
if _BACKEND_ROOT not in sys.path:
    sys.path.insert(0, _BACKEND_ROOT)

from app.ml.training.extra_trees import ExtraTreesTrainer  # noqa: E402
from app.ml.training.xgboost_meta import XGBoostMetaTrainer  # noqa: E402


def main():
    base_dir = os.path.normpath(os.path.join(_SCRIPT_DIR, ".."))
    models_dir = os.path.join(base_dir, "models", "saved")
    data_path = os.path.join(base_dir, "data", "raw", "creditcard.csv")

    print(f"[retrain_xgboost_meta] Loading dataset from: {data_path}")
    df = pd.read_csv(data_path)
    from app.ml.schema import CANONICAL_FEATURES
    X = df[CANONICAL_FEATURES].values
    y = df["Class"].values

    print("[retrain_xgboost_meta] Loading scaler ...")
    scaler = joblib.load(os.path.join(models_dir, "scaler.pkl"))
    X_scaled = scaler.transform(X)

    print("[retrain_xgboost_meta] Splitting data (80/20, stratified) ...")
    X_train, X_val, y_train, y_val = train_test_split(
        X_scaled, y, test_size=0.2, random_state=42, stratify=y
    )

    print("[retrain_xgboost_meta] Loading Extra Trees base model ...")
    et_model = ExtraTreesTrainer.load(os.path.join(models_dir, "extra_trees.pkl"))

    print("[retrain_xgboost_meta] Loading MLP base model ...")
    from app.ml.training.mlp import MLPTrainer

    mlp_model = MLPTrainer.load(os.path.join(models_dir, "mlp.keras"))

    print("[retrain_xgboost_meta] Generating meta-features ...")
    prob_et_train = et_model.predict_proba(X_train)
    prob_mlp_train = mlp_model.predict_proba(X_train)
    prob_et_val = et_model.predict_proba(X_val)
    prob_mlp_val = mlp_model.predict_proba(X_val)

    xgb_trainer = XGBoostMetaTrainer(random_seed=42)
    X_meta_train = xgb_trainer.prepare_meta_features(prob_et_train, prob_mlp_train)
    X_meta_val = xgb_trainer.prepare_meta_features(prob_et_val, prob_mlp_val)

    print("[retrain_xgboost_meta] Training XGBoost meta-learner ...")
    xgb_trainer.train(X_meta_train, y_train, X_meta_val, y_val)

    save_path = os.path.join(models_dir, "xgboost_meta.pkl")
    xgb_trainer.save(save_path)
    print(f"[retrain_xgboost_meta] Saved to: {save_path}")
    print("[retrain_xgboost_meta] Done!")


if __name__ == "__main__":
    main()
