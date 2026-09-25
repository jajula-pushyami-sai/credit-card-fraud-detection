# API Reference

The FraudShield API is a RESTful Flask service. All requests and responses are JSON encoded. 

## Base URL
`http://localhost:5000/api/v1`

## Authentication Flow

### `POST /auth/login`
Authenticates a user and establishes a secure session.

**Request Body:**
```json
{
  "email": "admin@fraudshield.ai",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "usr_123",
    "role": "admin"
  }
}
```
*Note: Both a short-lived `access_token` and a long-lived `refresh_token` are returned directly in the JSON response payload.*

## Core ML Endpoints

### `POST /predict/fraud`
Accepts a transaction payload and returns a fraud probability score and explanation.

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "transaction_id": "tx_8921",
  "features": [1.4, -0.2, 3.1, 85.50, 2]
}
```

**Response (200 OK):**
```json
{
  "prediction": "FRAUD",
  "probability": 0.982,
  "shap_values": {
    "V14": 0.42,
    "Amount": 0.15,
    "V4": 0.31
  },
  "explanation": "Transaction blocked due to unusually high value of feature V14 combined with the transaction amount."
}
```

## Security Controls
- **Rate Limiting**: All endpoints are rate-limited via Redis (e.g., 5 requests per minute for `/auth/login`).
- **Authorization**: The `@require_role('admin')` decorator enforces RBAC on specific routes (e.g., MLOps configuration endpoints).
