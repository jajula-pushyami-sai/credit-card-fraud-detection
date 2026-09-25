# Changelog

All notable changes to the FraudShield AI project will be documented in this file.

## [v1.0.0] - Official Release

### Added
- **Explainable Hybrid Ensemble**: Implemented the core ML pipeline utilizing Extra Trees, Multilayer Perceptron, and XGBoost Stacking, explicitly optimized for PR-AUC to handle severe class imbalance.
- **SHAP XAI**: Integrated feature attributions to provide local interpretability for blocked transactions.
- **Enterprise AI Copilot**: Added an LLM-powered assistant to translate SHAP mathematical vectors into plain-English narratives for human Fraud Analysts.
- **DevSecOps Architecture**: 
  - Created the `SystemHealth.tsx` SRE dashboard.
  - Implemented immutable Audit Logging.
  - Integrated custom JWT authentication utilizing bcrypt hashing and strict header-based transport for OWASP compliance.
- **Premium Frontend UX**:
  - Engineered a custom React Three Fiber 3D globe visualization.
  - Built cinematic page transitions utilizing Framer Motion (`AnimatePresence`).
  - Added an interactive `RecruiterShowcase` drawer to easily present the portfolio architecture.
- **Extensive Documentation**: Generated over 15 markdown files detailing the Database Schema, Deployment pipeline, Architecture, and Career/Interview guides.

### Changed
- Replaced all generic loading spinners with the branded `NeuralLoader` component.
- Overhauled the default React `NotFound` page to a premium 404 experience.

### Security
- Verified zero-trust architecture. No PII or real credit card data is stored.
- Confirmed that environment variables successfully inject all runtime secrets.
