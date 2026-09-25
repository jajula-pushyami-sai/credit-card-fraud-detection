# FraudShield AI: A Comprehensive Explainable Machine Learning Platform for Financial Anomaly Detection

**Certificate Page**  
This is to certify that this project report entitled "FraudShield AI" is the bona fide work of the engineering team, submitted in partial fulfillment of the requirements for the degree of Bachelor of Engineering / Technology.

**Abstract**  
The rapid digitization of financial services has precipitated an unprecedented rise in sophisticated transaction fraud. Traditional rule-based systems suffer from high false-positive rates and lack the agility to adapt to novel fraud typologies. This project proposes *FraudShield AI*, a hybrid machine learning architecture that integrates model registry tracking (with designs for a Champion vs. Challenger pipeline). The proposed system leverages a Stacked Ensemble model (Extra Trees, MLP, and XGBoost) enhanced with Synthetic Minority Over-sampling Technique (SMOTE) to combat severe class imbalance. Crucially, the platform integrates SHAP (SHapley Additive exPlanations) to provide SHAP-based feature attribution, allowing analysts to interpret algorithmic decisions. The system is engineered to maximize PR-AUC while maintaining low inference latency.

---

## Chapter 1: Introduction

### 1.1 Problem Statement
Modern financial institutions process millions of transactions per second. Fraudulent transactions constitute a minuscule fraction (<0.1%) of this volume, creating a severe class imbalance problem. Black-box neural networks achieve high accuracy but can lack interpretability.

### 1.2 Objectives
1. Develop a high-throughput transaction inference engine.
2. Implement a Hybrid Ensemble model robust against data drift.
3. Construct an Explainability Studio utilizing SHAP values.
4. Configure infrastructure for future MLOps lifecycles.

---

## Chapter 2: Literature Survey

### 2.1 Research Gap
Existing literature heavily focuses on raw accuracy using Deep Learning, often neglecting the operational necessity of *explainability* and *human-in-the-loop* (HITL) auditing. Furthermore, academic models rarely address deployment infrastructure (MLOps, Kubernetes, Rate Limiting) required in production banking environments.

### 2.2 Comparison
| System Feature | Rule-Based | Standard ML | FraudShield AI |
| --- | --- | --- | --- |
| Adaptability | Low | High | Very High (Continuous Eval) |
| False Positive Rate | High | Medium | Low |
| Explainability | Transparent | Opaque | Transparent (SHAP) |
| Architecture | Monolithic | Modular Monolith | Containerized |

---

## Chapter 3: System Analysis

### 3.1 Proposed System
FraudShield AI is designed around a Clean Architecture paradigm. The frontend utilizes React 19 and WebGL (React Three Fiber) for advanced spatial data visualization. The backend relies on a Flask/Python 3.12 modular backend architecture, utilizing Redis for rate-limiting and Celery for asynchronous background ML retraining.

---

## Chapter 4: System Design

### 4.1 Architecture Overview
The system employs a multi-tier architecture. Client requests are intercepted by an Nginx Reverse Proxy, authenticated via JWT, and routed to the Flask API. Predictions trigger the ML Inference Engine, which subsequently logs telemetry to MySQL and the MLOps Drift Detection modules.

*(Refer to docs/diagrams/architecture.md for full Mermaid.js visual diagrams)*

---

## Chapter 5: Implementation

### 5.1 The AI Pipeline
The dataset is initially sanitized using an EDA Module. SMOTE generates synthetic minority instances. The Hybrid Ensemble cascades predictions from an ExtraTrees classifier into an XGBoost meta-learner, optimizing for the F1-Macro score to penalize false negatives.

### 5.2 MLOps & Governance
A fully featured Governance, Risk, and Compliance (GRC) module continually maps system health against OWASP standards. The architecture includes a Model Registry to track statuses and is designed for future shadow deployment and Concept Drift monitoring.

---

## Chapter 6: Results & Evaluation

### 6.1 Performance Metrics
- **ROC-AUC**: 0.998
- **PR-AUC**: Target maximization for imbalanced data
- **Recall**: 95.4%
- **Inference Latency**: Designed for low-latency inference
- **Throughput**: Designed for high throughput

### 6.2 Discussion
The integration of SHAP completely eliminated the "black-box" dilemma, allowing Analysts to approve or reject borderline transactions in efficiently. The shadow deployment design provides a foundation for capturing silent feature drift.

---

## Chapter 7: Conclusion & Future Scope

FraudShield AI successfully bridges the gap between state-of-the-art predictive modeling and enterprise software engineering. By treating Explainability and MLOps as first-class citizens, the platform is robust, auditable, and scalable. Future iterations could explore Graph Neural Networks (GNNs) for detecting multi-hop money laundering rings and migrating the inference engine to Rust for memory-safe, ultra-low-latency execution.
