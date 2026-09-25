# Technical Interview Cheat Sheet

When presenting FraudShield AI in a technical interview, expect recruiters and senior engineers to probe *why* you made specific architectural choices. Use this guide to defend your engineering decisions.

## Q: Why use Flask instead of Django or FastAPI?
**Answer:** "I chose Flask to embrace a micro-framework architecture. Django's monolithic ORM and template engine were unnecessary since I was building a strict REST API for a decoupled React frontend. While FastAPI is excellent for async workloads, Flask’s mature ecosystem—specifically `Flask-Migrate` for Alembic migrations and `Flask-JWT-Extended` for robust token refreshing—allowed me to build the security and database foundation much faster."

## Q: Why XGBoost over Deep Learning (Neural Networks)?
**Answer:** "Financial transaction data is highly tabular and suffers from extreme class imbalance (99.8% normal vs 0.2% fraud). Deep learning models are notoriously data-hungry and prone to overfitting on minority classes in tabular datasets. XGBoost (Gradient Boosted Trees) is the industry standard for tabular data because of its high efficiency, resistance to extreme variance, and its seamless compatibility with KernelExplainer for rapid explainability."

## Q: Why did you implement SMOTE?
**Answer:** "If you train a model on a dataset with 99.8% normal transactions, the model can achieve 99.8% accuracy simply by guessing 'Normal' every single time. SMOTE (Synthetic Minority Over-sampling Technique) combats this by mathematically synthesizing new fraud vectors using K-Nearest Neighbors, forcing the model to actually learn the non-linear boundaries of fraudulent behavior rather than just memorizing the majority class."

## Q: How does your MLOps pipeline handle Data Drift?
**Answer:** "The platform incorporates a Model Registry to track 'Champion' and 'Challenger' statuses. The architecture is designed to support future shadow deployments and Kullback-Leibler (KL) Divergence monitoring between the training distribution and the live inference distribution. If the Challenger outperforms the Champion over a rolling window, an Administrator can trigger a manual promotion."

## Q: Why use Celery and Redis?
**Answer:** "Machine Learning retraining pipelines and SHAP matrix calculations are highly CPU-intensive. If I ran these synchronously in the Flask route, the HTTP request would block, causing a timeout and severely degrading the user experience. By offloading these to a Celery worker queue backed by Redis, the API remains highly responsive, and the heavy lifting is done asynchronously in the background."

## Q: Explain your Security and JWT strategy.
**Answer:** "The platform uses short-lived Access Tokens (15 minutes) and long-lived HTTP-Only Refresh Tokens (7 days). This mitigates the risk of XSS attacks stealing tokens via LocalStorage. Furthermore, all endpoints are gated by rigid Role-Based Access Control (RBAC). For example, a `Fraud Analyst` can trigger an explanation, but only an `Administrator` can access the `/api/v1/ml/retrain` endpoint."
