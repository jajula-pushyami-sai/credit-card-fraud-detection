# Architecture

FraudShield AI utilizes a modern, decoupled modular backend architecture designed to simulate an enterprise DevSecOps environment.

## High-Level System Architecture

```mermaid
graph TD
    Client[Web Client - React] -->|HTTPS / WAF| Frontend[Frontend NGINX Container]
    
    subgraph Frontend Layer
        Frontend -->|Static Assets| Browser[(User Browser)]
    end
    
    subgraph Gateway Layer
        Frontend -->|/api on Port 5000| Gateway[Flask Backend]
    end
    
    subgraph Core Services
        Gateway --> Auth[Auth Service]
        Gateway --> Inference[ML Inference Service]
        Gateway --> Explain[XAI Engine - SHAP]
        Gateway --> Copilot[LLM Integration Service]
    end
    
    subgraph Data Layer
        Auth --> Postgres[(MySQL 8.0)]
        Inference --> Redis[(Redis Cache)]
        Explain --> Redis
    end
```

## Frontend Architecture
- **Framework**: React 19 + Vite for lightning-fast HMR and optimized builds.
- **Styling**: Tailwind CSS for utility-first styling, ensuring a consistent design system.
- **Motion & 3D**: `framer-motion` for cinematic page transitions and micro-interactions. `@react-three/fiber` for rendering the complex WebGL globes and particles.
- **State Management**: Context API for global states (Academic Mode, Theme) and React Query for server state caching and optimistic UI updates.

## Backend Architecture
- **Framework**: Flask (Python) served via Gunicorn.
- **Concurrency**: Gunicorn runs with asynchronous workers to handle long-running ML inference requests without blocking the event loop for auth requests.
- **Security**: 
  - JWTs are generated via `Flask-JWT-Extended` and signed with HS256.
  - Refresh tokens are stored strictly in `HttpOnly, SameSite=Strict` cookies to prevent XSS exfiltration.

## Machine Learning Pipeline (Training Architecture)

```mermaid
sequenceDiagram
    participant Data as Raw Data
    participant Pre as Preprocessor
    participant Smote as SMOTE
    participant Base as Base Models (Extra Trees, MLP)
    participant Meta as Meta-Learner (Logistic Reg)
    
    Data->>Pre: Scaling (RobustScaler)
    Pre->>Data: Train/Test Split
    Note over Pre,Smote: Crucial: SMOTE applied ONLY to Train Set
    Pre->>Smote: Imbalanced Train Data
    Smote->>Base: Balanced Train Data
    Base->>Meta: Out-of-fold Predictions
    Meta->>Meta: Optimize for PR-AUC
```

## Deployment Architecture
See [DEPLOYMENT.md](DEPLOYMENT.md) for specifics on Docker containerization and CI/CD pipelines.
