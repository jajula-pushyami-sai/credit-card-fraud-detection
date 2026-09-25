import logging
logger = logging.getLogger(__name__)
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import RobustScaler
import joblib
import os


class DataPipeline:
    def __init__(self, random_seed=42):
        self.random_seed = random_seed
        self.scaler = RobustScaler()

    def process(self, df: pd.DataFrame, target_col="Class"):
        logger.info("Starting data preprocessing pipeline...")

        # 1. Duplicate Removal
        initial_len = len(df)
        df = df.drop_duplicates()
        logger.info(f"Removed {initial_len - len(df)} duplicate rows.")

        # 2. Features and Target
        from app.ml.schema import CANONICAL_FEATURES
        X = df[CANONICAL_FEATURES].copy()
        y = df[target_col]

        # 3. Train-Validation-Test Split (70-15-15)
        logger.info("Splitting data into Train/Validation/Test sets...")
        X_temp, X_test, y_temp, y_test = train_test_split(
            X, y, test_size=0.15, stratify=y, random_state=self.random_seed
        )
        X_train, X_val, y_train, y_val = train_test_split(
            X_temp,
            y_temp,
            test_size=0.1765,
            stratify=y_temp,
            random_state=self.random_seed,
        )  # 0.1765 of 0.85 is ~0.15 of total

        # 4. Feature Scaling (Fit only on Train to prevent leakage)
        # Assuming 'Time' and 'Amount' need scaling. V1-V28 are already PCA transformed.
        cols_to_scale = ["Time", "Amount"]

        logger.info("Scaling features...")
        X_train.loc[:, cols_to_scale] = self.scaler.fit_transform(
            X_train[cols_to_scale]
        )
        X_val.loc[:, cols_to_scale] = self.scaler.transform(X_val[cols_to_scale])
        X_test.loc[:, cols_to_scale] = self.scaler.transform(X_test[cols_to_scale])

        return X_train, X_val, X_test, y_train, y_val, y_test

    def save_scaler(self, path: str):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        joblib.dump(self.scaler, path)
        logger.info(f"Scaler saved to {path}")
