# FraudShield AI: System Architecture Diagrams

This document contains high-fidelity Mermaid.js diagrams representing the internal architecture, data flow, and deployment topology of FraudShield AI.

## 1. High-Level System Architecture

```mermaid
graph TD
    Client[Web Client - React 19]
    Nginx[Nginx Reverse Proxy]
    API[Flask Flask Backend]
    Auth[JWT Auth Service]
    ML[ML Inference Engine]
    Celery[Celery Task Queue]
    Redis[Redis Cache / Broker]
    DB[(MySQL 8 Database)]

    Client -->|HTTPS| Nginx
    Nginx --> API
    API <--> Auth
    API --> ML
    API --> Celery
    Celery <--> Redis
    API <--> DB
    ML <--> DB
```

## 2. Authentication Flow (Sequence Diagram)

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant DB

    User->>Frontend: Enter Credentials
    Frontend->>API: POST /api/v1/auth/login
    API->>DB: Validate Hash (bcrypt)
    DB-->>API: Match True
    API->>API: Generate Access & Refresh JWTs
    API-->>Frontend: Return 200 OK + Tokens
    Frontend->>Frontend: Store in Zustand & LocalStorage
    Frontend-->>User: Redirect to Dashboard
```

## 3. Model Registry Architecture (Designed for Shadow Workflows)

```mermaid
stateDiagram-v2
    [*] --> Ingest: Live Transaction
    Ingest --> ActiveModel: Route to Active Model


    ActiveModel --> Decision: Return Prediction to User
    Decision --> [*]


    Telemetry --> DriftAnalyzer: (Designed for future drift comparison)
    DriftAnalyzer --> Registry: Update Metrics Matrix
```

## 4. Explainability Studio (Activity Diagram)

```mermaid
graph LR
    A[Fraud Analyst Workspace] --> B{Select Transaction}
    B --> C[Fetch Metadata]
    B --> D[Trigger SHAP Explainer]
    D --> E[Calculate Base Value]
    E --> F[Calculate Feature Contributions]
    C --> G[Render Transaction Details]
    F --> G[Render Waterfall Chart]
    G --> H[Human Approval/Rejection]
```

## 5. Entity Relationship (ER) Diagram

```mermaid
erDiagram
    USER ||--o{ TRANSACTION : creates
    USER {
        int id PK
        string email
        string role
        string password_hash
    }
    TRANSACTION ||--o{ PREDICTION : generates
    TRANSACTION {
        string txn_id PK
        float amount
        datetime timestamp
        string status
    }
    PREDICTION ||--|| EXPLANATION : requires
    PREDICTION {
        int id PK
        float risk_score
        string model_version
    }
    EXPLANATION {
        int id PK
        json shap_values
    }
```
