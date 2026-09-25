import logging
logger = logging.getLogger(__name__)
import json
import os


class ModelCardGenerator:
    def __init__(
        self,
        registry_path="../models/model_registry.json",
        output_path="../documentation/Model_Card.md",
    ):
        self.registry_path = registry_path
        self.output_path = output_path
        os.makedirs(os.path.dirname(self.output_path), exist_ok=True)

    def generate(self):
        try:
            with open(self.registry_path, "r") as f:
                registry = json.load(f)
        except FileNotFoundError:
            logger.info("No registry found. Train a model first.")
            return

        active_id = registry.get("active_model")
        if not active_id:
            logger.info("No active model deployed.")
            return

        active_record = next(
            r for r in registry["history"] if r["version_id"] == active_id
        )
        metrics = active_record.get("metrics", {})

        card = f"""# Model Card: FraudShield AI Hybrid Ensemble

## 1. Model Details
- **Version ID:** `{active_id}`
- **Training Date:** `{active_record.get('training_date')}`
- **Architecture:** Extra Trees & Keras MLP stacked into XGBoost, calibrated via Isotonic/Platt.

## 2. Intended Use
- **Primary Use Case:** Real-time credit card fraud probability scoring.
- **Out of Scope:** This model does not automatically execute bans; it flags transactions for human review based on configurable thresholds.

## 3. Performance Metrics
- **ROC AUC:** `{metrics.get('roc_auc', 'N/A')}`
- **PR AUC:** `{metrics.get('pr_auc', 'N/A')}`
- **Brier Score:** `{metrics.get('brier_score', 'N/A')}`

## 4. Ethical Considerations
- The model employs SMOTE synthetics during training to offset severe class imbalance. Synthetic sampling is verified via unit testing to exclusively apply to training data, preventing data leakage and ensuring fair evaluation on real distributions.
- Explainability (SHAP) is integrated to allow analysts to audit why a transaction was flagged, reducing opaque algorithmic bias.
"""
        with open(self.output_path, "w") as f:
            f.write(card)
        logger.info(f"Model card generated at {self.output_path}")


if __name__ == "__main__":
    ModelCardGenerator().generate()
