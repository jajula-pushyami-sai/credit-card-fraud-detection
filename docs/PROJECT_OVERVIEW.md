# Project Overview

## The Business Problem
In 2023, global credit card fraud losses exceeded $33 billion. Financial institutions face a two-fold problem:
1. **The Imbalance Problem**: Fraudulent transactions make up less than 0.17% of all credit card swipes. Traditional Machine Learning models struggle to learn the minority class, resulting in high False Negative rates (missed fraud) or high False Positive rates (blocking legitimate customers).
2. **The "Black Box" Problem**: Regulatory bodies (like the CFPB in the US or GDPR in Europe) require financial institutions to explain *why* an automated decision was made. You cannot legally deny a transaction using a deep neural network if you cannot explain the features that triggered the denial.

## The FraudShield AI Solution
FraudShield AI is an academic demonstration of an **Explainable Hybrid Ensemble Framework** designed to solve both problems simultaneously.

1. **Handling Imbalance**: We utilize SMOTE (Synthetic Minority Over-sampling Technique) exclusively on the training set to prevent data leakage. We then train a diverse ensemble of models: Extra Trees (variance reduction), MLP, and a Multilayer Perceptron (non-linear relationships).
2. **Meta-Learning**: A XGBoost meta-learner aggregates the predictions, optimizing specifically for **PR-AUC (Precision-Recall Area Under Curve)** rather than standard ROC-AUC.
3. **Explainability**: We utilize **SHAP-based feature attribution** on top of the ensemble to help explain decisions.
4. **Human-in-the-Loop AI**: The SHAP values are fed into an **Enterprise AI Copilot** (LLM), which translates the complex mathematical vectors into a plain-English explanation for a human Fraud Analyst to review.

## Target Users (Personas)
- **The Customer**: Needs rapid transaction approvals and a beautiful, transparent dashboard to review their history.
- **The Fraud Analyst**: Needs high-density data tables, explainability graphs, and AI assistance to manually review flagged transactions.
- **The Data Scientist (MLOps)**: Needs to monitor model drift, retraining pipelines, and feature importance over time.
- **The Security Officer**: Needs to ensure the platform is secure, auditable, and designed with relevant security considerations.
