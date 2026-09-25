# Database Schema & Data Dictionary

FraudShield AI utilizes MySQL 8.0, interacting through SQLAlchemy ORM and Alembic for migrations.

## 1. `users`
Stores platform operators, analysts, and administrators.
- `id` (INT, PK, Auto-increment)
- `email` (VARCHAR 255, Unique, Indexed)
- `password_hash` (VARCHAR 255, bcrypt hashed)
- `role` (ENUM: 'Administrator', 'Fraud Analyst', 'Customer')
- `created_at` (DATETIME)

## 2. `transactions`
Stores the sanitized financial transaction vectors.
- `txn_id` (VARCHAR 64, PK, UUIDv4)
- `user_id` (INT, FK -> users.id)
- `amount` (FLOAT)
- `timestamp` (DATETIME)
- `v1` through `v28` (FLOAT, PCA transformed features)
- `status` (ENUM: 'Pending', 'Approved', 'Blocked', 'Investigating')

## 3. `predictions`
Stores the ML engine's inference outputs.
- `id` (INT, PK)
- `txn_id` (VARCHAR 64, FK -> transactions.txn_id)
- `model_version` (VARCHAR 32)
- `risk_score` (FLOAT, 0.0 to 1.0)
- `prediction_class` (VARCHAR 16)
- `execution_time_ms` (INT)

## 4. `audit_logs`
Immutable ledger for all critical system actions.
- `id` (INT, PK)
- `user_id` (INT, FK -> users.id)
- `action` (VARCHAR 255) (e.g., 'MODEL_PROMOTED', 'TXN_OVERRIDDEN')
- `ip_address` (VARCHAR 45)
- `timestamp` (DATETIME, Indexed)

## Indexing Strategy
- **B-Tree Indexes** are placed on `transactions.timestamp` and `audit_logs.timestamp` to accelerate the rapid timeseries aggregation queries required by the Analytics and Intelligence Center dashboards.
- `transactions.txn_id` is indexed for instantaneous row retrieval during SHAP computation.
