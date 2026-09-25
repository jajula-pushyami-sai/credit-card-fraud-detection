import logging
logger = logging.getLogger(__name__)
import xgboost as xgb
import numpy as np
import joblib
import os


class XGBoostMetaTrainer:
    def __init__(self, random_seed=42):
        self.model = xgb.XGBClassifier(
            n_estimators=100,
            learning_rate=0.05,
            max_depth=3,
            subsample=0.8,
            colsample_bytree=0.8,
            gamma=0.0,
            random_state=random_seed,
            eval_metric="aucpr",
            early_stopping_rounds=10,
        )

    def prepare_meta_features(self, prob_et, prob_mlp):
        """Stacks probabilities from base models"""
        return np.column_stack((prob_et, prob_mlp))

    def train(self, X_meta_train, y_train, X_meta_val, y_val):
        logger.info("Training XGBoost Meta Model...")
        self.model.fit(
            X_meta_train, y_train, eval_set=[(X_meta_val, y_val)], verbose=False
        )
        logger.info("Meta Model Training complete.")

    def predict_proba(self, X_meta):
        # Use genuine XGBoost meta model probabilities for maximum stacking accuracy
        return self.model.predict_proba(X_meta)[:, 1]

    def save(self, path):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        joblib.dump(self.model, path)
        logger.info(f"XGBoost Meta Model saved to {path}")

    @classmethod
    def load(cls, path):
        instance = cls()
        instance.model = joblib.load(path)
        if hasattr(instance.model, "n_jobs"):
            instance.model.n_jobs = 1
        return instance
