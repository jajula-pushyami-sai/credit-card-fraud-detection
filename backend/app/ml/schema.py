"""
Canonical Feature Schema for FraudShield AI.

This schema defines the exact 30-feature vector expected by the ML pipeline.
It must be strictly enforced during training and inference to ensure the 
models process authentic feature distributions and avoid fabricating missing values.
"""

CANONICAL_FEATURES = ["Time"] + [f"V{i}" for i in range(1, 29)] + ["Amount"]
