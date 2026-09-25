import logging
logger = logging.getLogger(__name__)
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import brier_score_loss
import joblib
import os


class ProbabilityCalibrator:
    def __init__(self, base_estimator, method="sigmoid"):
        """
        method: 'sigmoid' (Platt Scaling) or 'isotonic'
        """
        self.calibrator = CalibratedClassifierCV(
            estimator=base_estimator,
            method=method,
            cv="prefit",  # Because we fit it on the validation set after training
        )

    def fit(self, X_val, y_val):
        logger.info(f"Calibrating probabilities using {self.calibrator.method}...")
        self.calibrator.fit(X_val, y_val)

        # Calculate Brier Score
        probs = self.predict_proba(X_val)
        brier = brier_score_loss(y_val, probs)
        logger.info(f"Calibration complete. Brier Score: {brier:.4f}")
        return brier

    def predict_proba(self, X):
        return self.calibrator.predict_proba(X)[:, 1]

    def save(self, path):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        joblib.dump(self.calibrator, path)

    @classmethod
    def load(cls, path):
        instance = cls(base_estimator=None)
        instance.calibrator = joblib.load(path)
        return instance
