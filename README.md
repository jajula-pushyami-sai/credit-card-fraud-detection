# FraudShield AI

<div align="center">
  <img src="./frontend/public/favicon.svg" alt="FraudShield AI Logo" width="120" />
  <br/>
  <h3>Explainable Hybrid Ensemble Framework for Intelligent Credit Card Fraud Detection</h3>
  
  <p>
    <b>An academic and portfolio demonstration of full-stack machine learning and DevSecOps concepts.</b>
  </p>
  
  <p>
    <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" /></a>
    <a href="https://www.framer.com/motion/"><img src="https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=blue" alt="Framer Motion" /></a>
    <a href="https://flask.palletsprojects.com/"><img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask" /></a>
    <a href="https://xgboost.ai/"><img src="https://img.shields.io/badge/XGBoost-1D9D58?style=for-the-badge&logo=xgboost&logoColor=white" alt="XGBoost" /></a>
    <a href="https://www.docker.com/"><img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" /></a>
  </p>
</div>

---

## 📖 Project Overview

**FraudShield AI** is a comprehensive, full-stack portfolio project demonstrating the end-to-end lifecycle of an enterprise Machine Learning product. It solves the complex problem of **Credit Card Fraud Detection** in highly imbalanced datasets (0.1% positive class) by utilizing a Stacking Ensemble architecture (Extra Trees + MLP + XGBoost Meta-Learner).

Unlike typical Jupyter Notebook data science projects, FraudShield AI wraps the predictive models in a **simulated DevSecOps ecosystem**, featuring:
- A luxury React/Framer Motion frontend with 3D WebGL visualizations.
- A Flask-based API layer simulating Gunicorn/NGINX deployments.
- Explainable AI (XAI) via SHAP to support interpretability workflows.
- A simulated enterprise environment with RBAC, JWTs, and Audit Logging.

> **Note**: This is an academic/portfolio demonstration. The platform operates strictly on mathematically generated **Synthetic Data**. No real financial information, credit cards, or PII are used or stored.

---

## ✨ Key Features

1. **Stacking Ensemble Engine**: Achieves optimal PR-AUC on imbalanced data by stacking Extra Trees, a Multilayer Perceptron, utilizing XGBoost as the Meta-Learner.
2. **Explainable AI (SHAP)**: Financial models cannot be "black boxes". We utilize SHAP (KernelExplainer) to provide local feature attributions for supported transactions.
3. **Enterprise AI Copilot**: A hybrid assistant for fraud analysts. The conversational Chat Assistant is a real Google Gemini 1.5 Flash LLM integration (with graceful fallbacks), while the Executive Reports and Transaction Summaries are deterministically generated via templates for guaranteed accuracy.
4. **DevSecOps & Governance**: Features a live Security Operations Center (SOC) dashboard, OWASP Top 10 defenses (strict header-based JWTs, bcrypt), and an immutable Audit Log.
5. **Premium Motion UI**: Cinematic route transitions, branded neural loading experiences, and interactive ECharts data visualization.

---

## 🏗️ Architecture

```mermaid
graph TD
    Client[Web Client - React/Vite] -->|HTTPS| Frontend[Frontend NGINX Container]
    Frontend -->|Static Assets| Browser[(User Browser)]
    Frontend -->|/api on Port 5000| Gateway[Flask Backend]
    Gateway --> Auth[Auth Service - JWT/bcrypt]
    Gateway --> Inference[ML Inference Service]
    Gateway --> Explain[XAI Engine - SHAP]
    
    Inference --> Redis[(Redis Cache)]
    Auth --> MySQL[(MySQL 8)]
    Inference --> Model[(Joblib Ensembles)]
```

*For deep dives into the architecture, see the [`docs/`](./docs) folder.*

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- Docker & Docker Compose (Optional, for containerized run)

### Local Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/fraudshield-ai.git
cd fraudshield-ai
```

2. **Backend Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
cp .env.example .env
flask db upgrade
python scripts/seed_dev_db.py
flask run
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install
npm run dev
```

4. **Access the Application**
Navigate to `http://localhost:5173` in your browser.

### Database Migrations

This project uses Flask-Migrate (Alembic) to handle database schema changes.

- **`flask db upgrade`**: Applies all pending migrations to the database. Run this whenever you pull new code that changes the schema.
- **`flask db downgrade`**: Reverts the last applied migration.
- **`flask db check`**: Verifies that the current database schema matches the SQLAlchemy models (used in CI to prevent drift).

5. **Provision the First Admin Account**

   No default credentials are seeded. Use the Flask CLI to create the first administrator:

   ```bash
   cd backend
   # Activate your virtualenv first, then:
   flask create-admin
   ```

   The command will interactively prompt for email, name, and a strong password
   (minimum 12 characters, mixed case, digit, and special character).

   > ⚠️ **Security note:** Never commit credentials to the repository.
   > If the app logs `[SECURITY] No active Administrator accounts found`, run
   > `flask create-admin` to resolve it.

---

## 📚 Documentation Directory

The project is extensively documented to support open-source contributions and portfolio review:

### Technical Documentation
- [Architecture Details](docs/ARCHITECTURE.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)
- [Machine Learning Pipeline](docs/ML_PIPELINE.md)
- [API Reference](docs/API_REFERENCE.md)
- [Security & Governance](docs/SECURITY.md)
- [Deployment & DevOps](docs/DEPLOYMENT.md)

### Career & Reviewer Assets
Are you a Recruiter or Hiring Manager? Start here:
- [Recruiter Executive Summary](docs/career/RECRUITER_GUIDE.md)
- [Interview Prep & STAR Answers](docs/career/INTERVIEW_GUIDE.md)

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on our branch strategy, coding standards, and pull request process.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
