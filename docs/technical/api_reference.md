# FraudShield AI: REST API Reference

The FraudShield backend is built on Flask 3.x and structured using Blueprints. All protected routes require a JWT Bearer Token in the Authorization header.

## Authentication (`/api/v1/auth`)

### `POST /login`
Authenticates a user and returns JWT access and refresh tokens.
- **Payload**: `{"email": "admin@fraudshield.ai", "password": "password"}`
- **Response (200)**: `{"access_token": "ey...", "refresh_token": "ey...", "user": {...}}`

---

## Inference & Prediction (`/api/v1/predict`)

### `POST /`
Submit a transaction vector for real-time anomaly inference.
- **Headers**: `Authorization: Bearer <token>`
- **Payload**: 
  ```json
  {
    "V1": 0.4, "V2": -1.2, "Amount": 450.00, ...
  }
  ```
- **Response (200)**:
  ```json
  {
    "risk_score": 0.89,
    "prediction": "Fraud",
    "latency_ms": 42
  }
  ```

---

## Explainability (`/api/v1/explainability`)

### `GET /shap/:txn_id`
Generates SHAP values for a specific transaction to explain the model's decision.
- **Response (200)**:
  ```json
  {
    "base_value": 0.12,
    "features": [
      {"name": "Amount", "value": 450.00, "contribution": 0.45},
      {"name": "V4", "value": 2.1, "contribution": 0.32}
    ]
  }
  ```

---

## MLOps & Telemetry (`/api/v1/ml`)

### `GET /registry`
Returns the status of Champion, Challenger, and Retired models.
### `GET /drift`
Returns model registry metrics and tracks statuses.

---

## Governance, Risk & Compliance (`/api/v1/grc`)

### `GET /compliance_scores`
Returns the platform's adherence to OWASP, NIST, and GDPR standards.
### `GET /incidents`
Returns a list of escalated security and machine learning anomalies.
