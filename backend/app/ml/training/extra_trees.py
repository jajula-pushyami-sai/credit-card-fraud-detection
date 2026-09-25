import logging
logger = logging.getLogger(__name__)
from sklearn.ensemble import ExtraTreesClassifier
import joblib
import os


class ExtraTreesTrainer:
    def __init__(self, random_seed=42, n_estimators=100):
        self.model = ExtraTreesClassifier(
            n_estimators=n_estimators,
            max_depth=None,
            min_samples_split=2,
            min_samples_leaf=1,
            max_features="sqrt",
            class_weight="balanced",
            n_jobs=-1,
            random_state=random_seed,
        )

    def train(self, X_train, y_train):
        logger.info("Training Extra Trees Base Model...")
        self.model.fit(X_train, y_train)
        logger.info("Training complete.")

    def predict_proba(self, X):
        return self.model.predict_proba(X)[:, 1]

    def save(self, path):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        joblib.dump(self.model, path)
        logger.info(f"Extra Trees model saved to {path}")

    @classmethod
    def load(cls, path):
        instance = cls()
        instance.model = joblib.load(path)
        if hasattr(instance.model, "n_jobs"):
            instance.model.n_jobs = 1
        return instance
