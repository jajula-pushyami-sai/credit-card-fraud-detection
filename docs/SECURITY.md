# Security & Governance

*Last verified against commit: September 2026*

FraudShield AI is designed with relevant enterprise security considerations. The security architecture is designed using a Zero-Trust methodology.

---

## Authentication & Authorization

### JSON Web Tokens (JWT)
The application uses stateless JWTs signed via the **`HS256`** algorithm, which is **explicitly configured** in `settings.py` via `JWT_ALGORITHM = "HS256"`. Implicit library defaults are never used.

- **Access Tokens** are short-lived: **1 hour** (`JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)`).
- **Refresh Tokens** are long-lived: **30 days** (`JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)`).
- Both token types are transmitted in the `Authorization: Bearer <token>` request header (`JWT_TOKEN_LOCATION = ["headers"]`). No cookies are used.

### Refresh Token Rotation
Every call to `POST /api/v1/auth/refresh` performs **full token rotation**:
1. The raw refresh JWT is validated (signature, expiry).
2. The corresponding server-side session row is looked up by its **HMAC-SHA256 hash** — verifying `is_revoked = false` AND `expires_at > now`.
3. The old session is **immediately revoked** in the database.
4. A **new access token** and a **new refresh token** are issued.
5. Only the HMAC-SHA256 hash of the new refresh token is stored in the database. The raw token is never persisted.
6. The client must replace both stored tokens with the new pair.

### Refresh Token Reuse Detection
If a previously rotated (and therefore revoked) refresh token is replayed:
- The session lookup finds no valid session (`is_revoked = true`).
- `401 Unauthorized` is returned without issuing any new tokens.
- No sensitive implementation details are exposed in the error response.

### Session Expiry Enforcement
The `sessions` table stores `expires_at`. The session lookup enforces **both**:
```
is_revoked == false
expires_at > current_time (UTC)
```
This is independent of JWT signature expiry, providing defence-in-depth.

### Logout
`POST /api/v1/auth/logout` performs complete authentication lifecycle termination:
1. **Access token** — blocklisted in Redis (or the in-memory fallback) for its remaining TTL.
2. **All refresh sessions** — every active `Session` row for the authenticated user is revoked in the database, regardless of whether the client sends a refresh token in the request body.

### Password Hashing
All passwords are hashed using **bcrypt** exclusively (`bcrypt.hashpw` / `bcrypt.checkpw`). No Werkzeug or PBKDF2 hashing is used in the authentication path. Bcrypt is configured with a random salt per hash; no two identical passwords produce the same hash.

### Role-Based Access Control (RBAC)
User roles are managed server-side only:
- `Customer` — default role assigned to every public registration. Cannot be overridden by client input.
- `Fraud Analyst` — must be assigned by an administrator.
- `Administrator` — must be assigned by an administrator.

The `@require_role` decorator on Flask routes enforces role checks. Frontend role restrictions are a UX convenience only; all authoritative checks are on the backend.

---

## CORS Configuration

CORS is configured in `app/__init__.py` using `flask-cors`:
- **Development**: allows `http://localhost:5173`, `http://localhost:3000` and related local origins (configurable via `CORS_ORIGINS` env var).
- **Production**: `CORS_ORIGINS` env var **must** be set to a comma-separated list of explicit trusted frontend origins. If unset, the default is an empty list (no cross-origin requests permitted). The wildcard `*` is **never** the production default.

---

## Data Governance & Privacy

### Kaggle Dataset
This platform operates strictly as an academic/portfolio demonstration. The dataset used for model training and simulation is the **Kaggle Credit Card Fraud Detection dataset**, which contains **284,807 real, anonymized transactions**.

### Immutable Audit Logs
All administrative actions are written to an `AUDIT_LOGS` table. This table is **Append-Only** — the application layer prevents `DELETE` operations.

---

## OWASP Top 10 Defenses

- **A01 Broken Access Control**: Mitigated via strict RBAC (`@require_role`) on the Flask API. Public registration cannot create privileged accounts.
- **A02 Cryptographic Failures**: bcrypt is used for password hashing; HS256 is explicitly configured for JWTs; refresh tokens are stored as HMAC-SHA256 hashes only.
- **A03 Injection**: SQLAlchemy ORM prevents SQL injection. React DOM auto-escapes HTML, mitigating XSS.
- **A05 Security Misconfiguration**: CORS is explicitly restricted. Production startup validates that secret keys are non-trivial. JWT algorithm is explicitly configured.
- **A07 Authentication Failures**: Refresh token rotation + reuse detection + session expiry enforcement are all implemented. Rate limiting on login (5/minute per IP+email) and registration (3/hour) endpoints.

---

## Secrets Management
Secrets are injected via Environment Variables (Twelve-Factor App methodology). Production startup (`validate_production_secrets`) raises `RuntimeError` if `SECRET_KEY` or `JWT_SECRET_KEY` are weak or missing. Hardcoded dev-only fallbacks are present in `settings.py` and are blocked from production use.

