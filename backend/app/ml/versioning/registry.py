import logging
logger = logging.getLogger(__name__)
import json
import os
import uuid
from datetime import datetime, timezone


class ModelRegistry:
    def __init__(self, registry_path="../models/model_registry.json"):
        self.registry_path = registry_path
        os.makedirs(os.path.dirname(self.registry_path), exist_ok=True)
        if not os.path.exists(self.registry_path):
            with open(self.registry_path, "w") as f:
                json.dump({"active_model": None, "history": []}, f, indent=4)

    def log_model(self, paths: dict, metrics: dict, hyperparameters: dict):
        version_id = str(uuid.uuid4())
        record = {
            "version_id": version_id,
            "training_date": datetime.now(timezone.utc).isoformat(),
            "paths": paths,
            "metrics": metrics,
            "hyperparameters": hyperparameters,
            "status": "staged",  # Can be updated to 'production' manually or via admin
        }

        with open(self.registry_path, "r") as f:
            registry = json.load(f)

        registry["history"].append(record)
        # Auto-promote for testing if it's the first model
        if not registry["active_model"]:
            registry["active_model"] = version_id
            record["status"] = "production"

        with open(self.registry_path, "w") as f:
            json.dump(registry, f, indent=4)

        logger.info(f"Model version {version_id} logged to registry.")
        return version_id

    def get_active_model(self):
        with open(self.registry_path, "r") as f:
            registry = json.load(f)

        active_id = registry.get("active_model")
        if not active_id:
            raise ValueError("No active model deployed in registry.")

        for record in registry["history"]:
            if record["version_id"] == active_id:
                return record
        raise ValueError(f"Active model {active_id} not found in history.")
