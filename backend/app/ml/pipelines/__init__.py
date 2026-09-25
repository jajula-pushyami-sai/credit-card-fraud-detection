import abc
import pandas as pd
import numpy as np


class BaseDataPreprocessor(abc.ABC):
    """Abstract base class defining interface for data cleaning, transformation, and feature engineering."""

    @abc.abstractmethod
    def fit(self, df: pd.DataFrame) -> "BaseDataPreprocessor":
        """Fit preprocessor parameters on training data."""

    @abc.abstractmethod
    def transform(self, df: pd.DataFrame) -> np.ndarray:
        """Transform input dataframe into model-ready numpy array."""

    def fit_transform(self, df: pd.DataFrame) -> np.ndarray:
        """Helper to fit and transform in one step."""
        return self.fit(df).transform(df)
