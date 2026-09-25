import abc
from typing import Dict, Any


class BaseExplainer(abc.ABC):
    """Abstract base class representing XAI models."""

    @abc.abstractmethod
    def explain(self, model, instance, feature_names) -> Dict[str, Any]:
        """Generate local attribution explaining model decisions on a single credit transaction.

        Returns:
            Dict containing feature-level contribution details.
        """
