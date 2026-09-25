# Administrator's Manual & Operations Guide

## 1. Role-Based Access Control (RBAC)
The system utilizes rigid JWT-based role verification.
- **Customers**: Can only view their own transactions and dispute flags.
- **Fraud Analysts**: Can view all transactions, trigger SHAP explainability, and manually override blocked transactions.
- **Administrators**: Possess super-user capabilities. Only administrators can access the `MLOps Center`, `Security Center`, and `Audit Logs`. Only administrators can trigger a model retraining pipeline.

## 2. Infrastructure & Deployment
The platform is containerized using Docker and orchestrated via Docker Compose.
- **Backend**: `docker-compose up backend` (Flask running on Gunicorn/Waitress)
- **Frontend**: `docker-compose up frontend` (Vite production bundle served via Nginx)
- **Celery**: `docker-compose up celery_worker` (Consumes background tasks from Redis)

## 3. Handling Model Drift
If the `Drift Detection` dashboard flags a KL-Divergence spike:
1. Navigate to the **MLOps Center**.
2. Select the **Retraining Pipeline**.
3. The system will dispatch an asynchronous Celery task to re-fit the XGBoost Meta-Ensemble on the newest transaction batches.
4. The new model will be registered as 'Available' in the Model Registry.
5. Review the Model Registry. Admins can manually promote models to active production status.

## 4. Incident Management
If the `Security Center` detects abnormal JWT refresh requests or rate-limit violations:
1. Identify the offending IP address in the `Incident Management` Kanban board.
2. The Redis middleware automatically blocks IPs exceeding 100 req/min.
3. Review the `Audit Ledger` to trace any actions taken by the compromised account before the block was instantiated.
