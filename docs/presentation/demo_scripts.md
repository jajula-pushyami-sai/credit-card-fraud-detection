# FraudShield AI: Presentation & Demo Scripts

This document provides structured narration for presenting the project in various technical and non-technical environments.

## 1. The 5-Minute Pitch (Hackathon / Executive Summary)

**[Slide 1: Title & Hook]**
"Good morning. Did you know that global transaction fraud is projected to cost the industry $40 billion by 2027? Current systems are black-boxes—they block legitimate customers and frustrate analysts. We built FraudShield AI to fix this."

**[Slide 2: The Solution]**
"FraudShield AI demonstrates a fraud detection platform. We built a foundation for an MLOps ecosystem. Our hybrid XGBoost ensemble is designed for low-latency inference."

**[Slide 3: The Secret Weapon - Explainability]**
"But accuracy isn't enough. Regulators require transparency. We integrated SHAP explainability directly into a stunning React Three Fiber 3D interface. Analysts no longer guess *why* the AI flagged a transaction; the AI visually proves it to them."

**[Slide 4: Conclusion]**
"Secure, compliant, and devastatingly accurate. FraudShield AI is the future of transparent financial security. Thank you."

---

## 2. The 15-Minute Technical Defense (Academic / Final Year Project)

**[Introduction: 2 mins]**
- Introduce the team and the problem of class imbalance in financial datasets.
- State the research objective: Building a robust ML pipeline with human-interpretable outputs.

**[Architecture Deep Dive: 4 mins]**
- Open the System Architecture slide.
- Explain the separation of concerns: React 19 Frontend, Flask Backend, Celery Background Workers, and Redis for caching and rate-limiting.
- Highlight the GRC (Governance, Risk, Compliance) modules that map to OWASP standards.

**[The Machine Learning Engine: 4 mins]**
- Discuss the data pipeline: EDA, outlier capping, and SMOTE for minority oversampling.
- Explain the Hybrid Meta-Ensemble: How stacking MLPs with XGBoost penalizes false negatives.
- Transition into the MLOps suite: Model Registry and drift metrics design.

**[Live Demonstration: 3 mins]**
- Log in as 'Administrator'.
- Route to the **Fraud Intelligence Center**. Show the transaction metrics.
- Route to the **Explainability Studio**. Select a flagged transaction and demonstrate how the SHAP waterfall chart breaks down the exact algorithmic logic.
- Route to the **3D MLOps Center**. Show the 'Model Galaxy' and 'Experiment Orbit' WebGL meshes.

**[Conclusion & Q&A: 2 mins]**
- Summarize achievements: Model interpretability and security controls.
- Open the floor to the evaluation panel.

---

## 3. Recruiter / Portfolio Demo (Video Storyboard)

**Length**: 2 Minutes
**Music**: Clean, modern, subtle electronic.

**Scene 1 [0:00 - 0:15]**: 
*Visual*: Fast pan across the Landing Page, clicking "Launch Platform". Smooth transition to the Analytics Dashboard.
*Voiceover*: "FraudShield AI is a full-stack, enterprise machine learning platform built to detect financial anomalies in real-time."

**Scene 2 [0:15 - 0:45]**:
*Visual*: Hovering over the SHAP Waterfall charts in the Explainability Studio.
*Voiceover*: "Built with React and Flask, the platform moves beyond black-box AI by utilizing SHapley Additive exPlanations to provide SHAP-based feature attribution for every blocked transaction."

**Scene 3 [0:45 - 1:15]**:
*Visual*: Navigating the MLOps Center, showing the Model Registry Dashboard and the 3D Model Galaxy.
*Voiceover*: "It features a Model Registry and configured infrastructure that form the foundation for future shadow evaluation and automated drift workflows."

**Scene 4 [1:15 - 2:00]**:
*Visual*: Showing the Security Center and Audit Ledger. Fade out to the GitHub repository URL.
*Voiceover*: "Secured via strict JWT authentication, RBAC, and rate-limiting, FraudShield AI is designed with relevant security considerations. Check out the source code and documentation on GitHub."
