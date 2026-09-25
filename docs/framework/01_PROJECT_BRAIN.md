# 01: PROJECT BRAIN

## Conceptual Architecture

FraudShield AI operates on a hybrid architecture bridging traditional real-time systems (React, WebSockets, REST APIs) with compute-heavy analytical engines (XGBoost, SHAP).

### 1. The Core Entities
- **Transaction:** The atomic unit of work. Includes metadata (Time, Amount) and encrypted PII.
- **Inference Engine:** The ML pipeline that receives a transaction and returns a `risk_score` (0.0 to 1.0).
- **Explanation (SHAP):** The artifact generated alongside an inference, explaining *why* the model assigned a specific score.
- **Analyst:** The human-in-the-loop (HITL) who reviews flagged transactions.

### 2. The Data Flow
1. **Ingestion:** A transaction arrives via API (`/api/v1/predict/single`).
2. **Preprocessing:** Data is scaled using the pre-trained robust scaler.
3. **Base Models:** `ExtraTrees` and `Multilayer Perceptron (MLP)` process the scaled data, generating base probabilities.
4. **Meta-Learner:** `XGBoost` takes the base probabilities and raw features to make the final prediction.
5. **Explainability (Async):** SHAP calculates feature importance asynchronously to avoid blocking the API response.
6. **Decisioning:** Based on thresholds (`app/ml/config/risk_thresholds.yaml`), the transaction is Auto-Approved, Flagged for Review, or Auto-Declined.
7. **Storage:** The result is stored in the MySQL database.
8. **Real-time Push:** Redis/WebSockets pushes the update to the connected Analyst Dashboard.

### 3. Key Terminology
- **Champion/Challenger:** A deployment strategy where the primary model (Champion) routes traffic, but a secondary model (Challenger) makes shadow predictions for comparison.
- **Data Drift:** The phenomenon where the distribution of incoming transaction data shifts away from the training distribution, requiring model retraining.
- **Glassmorphism:** The UI design language utilizing semi-transparent, frosted-glass effects (using `backdrop-filter: blur()`).
- **P99 Latency:** The requirement that 99% of API requests must complete within a specific time bound (e.g., <200ms).

### 4. Technical Stack
- **Frontend:** React 18, Vite, Tailwind CSS, shadcn/ui, Framer Motion, Zustand, React Query.
- **Backend:** Python 3.12+, Flask, SQLAlchemy, Celery, Marshmallow.
- **Machine Learning:** Scikit-Learn, XGBoost, SHAP, Pandas, NumPy.
- **Infrastructure:** Docker, Docker Compose, MySQL 8, Redis 7.
