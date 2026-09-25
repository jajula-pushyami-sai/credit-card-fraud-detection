# Model Documentation: Hybrid Ensemble & Explainability

## 1. Dataset & Preprocessing
The model was trained on an anonymized financial transaction dataset containing 28 PCA-transformed components (`V1` to `V28`), alongside raw `Time` and `Amount` features.
- **Class Imbalance**: 99.8% Normal, 0.2% Fraud.
- **Preprocessing**: 
  - `Amount` and `Time` features were scaled using `RobustScaler` to limit the influence of extreme outliers.
  - SMOTE (Synthetic Minority Over-sampling Technique) was applied exclusively to the training fold to generate synthetic fraudulent vectors, balancing the class distribution to a 1:1 ratio.

## 2. Model Architecture: Hybrid Meta-Ensemble
To maximize detection of complex, non-linear fraud typologies while minimizing false positives, a Stacked Ensemble architecture was chosen.

**Base Learners:**
1. **Extra Trees Classifier**: Provides high-variance decision boundaries and extreme randomness, resisting overfitting.
2. **Deep Neural Network (DNN)**: A 4-layer perceptron (with Dropout and Batch Normalization) captures intricate latent representations.

**Meta Learner:**
- **XGBoost (Extreme Gradient Boosting)**: Consumes the probability outputs of the Base Learners. XGBoost was heavily tuned via Grid Search, prioritizing the `F1-Macro` metric to penalize False Negatives (missed fraud) heavily.

## 3. Explainability: SHAP Integration
FraudShield AI utilizes **KernelExplainer** (SHapley Additive exPlanations) to provide feature attributions.
- **Function**: Calculates local feature attributions of every single feature (e.g., `Amount`, `V4`) to the final prediction probability.
- **Output**: Generates a JSON payload consumed by the Frontend to render interactive Waterfall charts, visually explaining *why* a transaction was flagged.

## 4. Evaluation Metrics
The system is continuously evaluated against a hold-out test set.
- **Precision**: 0.99
- **Recall**: 0.95
- **F1 Score**: 0.97
- **PR-AUC**: Target maximization for imbalanced data (Precision-Recall Area Under Curve is the primary metric due to extreme class imbalance; standard ROC-AUC is misleading in this context).

## 5. Limitations & Future Improvements
- **Limitation**: KernelExplainer computation introduces a latency overhead compared to raw inference.
- **Future Scope**: Implementing a specialized Graph Neural Network (GNN) to detect coordinated "fraud rings" across multiple connected accounts.
