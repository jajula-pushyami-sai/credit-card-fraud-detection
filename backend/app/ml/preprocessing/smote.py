import logging
logger = logging.getLogger(__name__)
from imblearn.over_sampling import SMOTE
import pandas as pd


class SMOTEGenerator:
    def __init__(self, random_seed=42):
        self.random_seed = random_seed
        self.smote = SMOTE(random_state=random_seed)

    def apply_smote(self, X_train, y_train, is_validation=False):
        """
        Applies SMOTE strictly to the training set.
        CRITICAL: Never pass validation or test sets here.
        """
        if is_validation:
            raise ValueError(
                "CRITICAL LEAKAGE PREVENTED: Attempted to apply SMOTE to non-training data."
            )

        logger.info(f"Applying SMOTE to training set. Original shape: {X_train.shape}")

        # Determine if input is pandas or numpy and keep track of columns
        is_df = isinstance(X_train, pd.DataFrame)
        cols = X_train.columns if is_df else None

        X_resampled, y_resampled = self.smote.fit_resample(X_train, y_train)

        if is_df:
            X_resampled = pd.DataFrame(X_resampled, columns=cols)
            y_resampled = pd.Series(y_resampled)

        logger.info(f"SMOTE complete. New shape: {X_resampled.shape}")
        return X_resampled, y_resampled
