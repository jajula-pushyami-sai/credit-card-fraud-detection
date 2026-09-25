import os
import json
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import precision_score, recall_score, average_precision_score, roc_auc_score
from app.ml.training.extra_trees import ExtraTreesTrainer
from app.ml.training.mlp import MLPTrainer
from app.ml.training.xgboost_meta import XGBoostMetaTrainer
from app.ml.preprocessing.smote import SMOTEGenerator
import joblib


def main():
    base_dir = os.path.dirname(os.path.dirname(__file__))
    # Load from raw dataset
    data_path = os.path.join(base_dir, "data", "raw", "creditcard.csv")
    models_dir = os.path.join(base_dir, "models", "saved")

    print(f"Loading raw dataset from {data_path}...")
    df = pd.read_csv(data_path).dropna()

    from app.ml.schema import CANONICAL_FEATURES
    
    # Enforce exact ordering of the 30 canonical features
    X = df[CANONICAL_FEATURES].copy()
    y = df["Class"].values

    # Fix 1: Split data BEFORE scaling and SMOTE
    print("Splitting data into Train and Validation sets (80/20)...")
    X_train_raw, X_val_raw, y_train, y_val = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # Fix 5 (Best practice): Simple leakage check to ensure no raw val rows exist in raw train rows
    train_hashes = set(pd.util.hash_pandas_object(X_train_raw, index=False))
    val_hashes = set(pd.util.hash_pandas_object(X_val_raw, index=False))
    overlap = train_hashes.intersection(val_hashes)
    if overlap:
        print(f"WARNING: Found {len(overlap)} exact duplicate rows between train and val. This might be natural in the dataset, but ensure it's not due to preprocessing leakage.")

    # Fix 2: Fit scaler ONLY on training data, then transform both
    print("Scaling features (fit on Train only)...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train_raw)
    X_val_scaled = scaler.transform(X_val_raw)  # Only transform validation set!

    os.makedirs(models_dir, exist_ok=True)
    joblib.dump(scaler, os.path.join(models_dir, "scaler.pkl"))
    print("Saved feature scaler.")
    
    # Save the canonical schema alongside artifacts
    schema_path = os.path.join(models_dir, "schema.json")
    with open(schema_path, "w") as f:
        json.dump({"features": CANONICAL_FEATURES}, f, indent=2)
    print("Saved feature schema.")

    # Fix 3: Apply SMOTE only to the training fold
    print("Applying SMOTE to training fold...")
    smote_gen = SMOTEGenerator(random_seed=42)
    # Convert back to DataFrame temporarily for SMOTE compatibility if needed, or pass array
    X_train_resampled, y_train_resampled = smote_gen.apply_smote(X_train_scaled, y_train)

    print(f"Train shapes (after SMOTE): X={X_train_resampled.shape}, y={y_train_resampled.shape}")
    print(f"Val shapes: X={X_val_scaled.shape}, y={y_val.shape}")

    # 1. Train Extra Trees Base Model
    print("\n--- Training Extra Trees Base Model ---")
    et_trainer = ExtraTreesTrainer(random_seed=42)
    et_trainer.train(X_train_resampled, y_train_resampled)
    et_trainer.save(os.path.join(models_dir, "extra_trees.pkl"))

    # 2. Train Keras MLP Base Model
    print("\n--- Training Keras MLP Base Model ---")
    mlp_trainer = MLPTrainer(input_dim=X_train_resampled.shape[1], random_seed=42)
    mlp_path = os.path.join(models_dir, "mlp.keras")
    mlp_trainer.train(
        X_train_resampled, y_train_resampled, X_val_scaled, y_val, batch_size=256, epochs=10, save_path=mlp_path
    )
    mlp_trainer = MLPTrainer.load(mlp_path)

    # 3. Generate Meta Features
    print("\n--- Generating Meta-features for Meta Model ---")
    prob_et_train = et_trainer.predict_proba(X_train_resampled)
    prob_mlp_train = mlp_trainer.predict_proba(X_train_resampled)

    prob_et_val = et_trainer.predict_proba(X_val_scaled)
    prob_mlp_val = mlp_trainer.predict_proba(X_val_scaled)

    xgb_trainer = XGBoostMetaTrainer(random_seed=42)
    X_meta_train = xgb_trainer.prepare_meta_features(prob_et_train, prob_mlp_train)
    X_meta_val = xgb_trainer.prepare_meta_features(prob_et_val, prob_mlp_val)

    # 4. Train XGBoost Meta Model
    print("\n--- Training XGBoost Meta Model ---")
    xgb_trainer.train(X_meta_train, y_train_resampled, X_meta_val, y_val)
    xgb_trainer.save(os.path.join(models_dir, "xgboost_meta.pkl"))

    # 5. Evaluate and save metrics
    print("\n--- Evaluating Models and Generating Metrics ---")
    # Predict on validation set
    y_val_pred_proba = xgb_trainer.predict_proba(X_meta_val)
    y_val_pred = (y_val_pred_proba >= 0.5).astype(int)

    metrics = {
        "roc_auc": float(roc_auc_score(y_val, y_val_pred_proba)),
        "pr_auc": float(average_precision_score(y_val, y_val_pred_proba)),
        "precision": float(precision_score(y_val, y_val_pred)),
        "recall": float(recall_score(y_val, y_val_pred))
    }
    
    # Calculate F1
    p = metrics["precision"]
    r = metrics["recall"]
    metrics["f1"] = 2 * (p * r) / (p + r) if (p + r) > 0 else 0.0

    print("\nValidation Metrics:")
    for k, v in metrics.items():
        print(f"  {k}: {v:.4f}")

    eval_artifact = {
        "evaluation_type": "validation",
        "model": "ET + MLP + XGBoost Meta-Ensemble",
        "dataset": "creditcard.csv",
        "split": "validation (20% stratify)",
        "metrics": metrics
    }

    metrics_path = os.path.join(models_dir, "eval_metrics.json")
    with open(metrics_path, "w") as f:
        json.dump(eval_artifact, f, indent=2)
    print(f"\nSaved evaluation metrics to {metrics_path}")

    print("\nAll models trained and saved successfully!")


if __name__ == "__main__":
    main()
