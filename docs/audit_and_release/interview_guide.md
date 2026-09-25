# Technical Interview Guide: Deep-Dive Questions

Use this guide to prepare for technical interviews (Software Engineering, Machine Learning Engineering, or Data Science) using FraudShield AI as your capstone defense.

## Section 1: System Design & Architecture
**Q: How did you ensure your system could handle high throughput without dropping transactions?**
**A:** "I decoupled the heavy Machine Learning inference from the standard web traffic. While the Flask API processes the immediate REST request, any intensive background calculation—like retraining the model or computing SHAP dependency plots—is offloaded to a Celery worker queue backed by Redis. This ensures the main API thread remains unblocked and highly responsive."

**Q: Explain your authentication strategy.**
**A:** "I implemented a stateless JSON Web Token (JWT) architecture. When a user logs in, they receive a short-lived Access Token (15 mins) and a long-lived Refresh Token (7 days) stored as an HTTP-Only cookie. This protects against Cross-Site Scripting (XSS) attacks while maintaining seamless sessions. The tokens encode the user's Role, which enforces strict Role-Based Access Control (RBAC) at the API endpoint level."

## Section 2: Machine Learning & Explainability
**Q: Why didn't you just use a Deep Neural Network?**
**A:** "Neural Networks are incredibly powerful for unstructured data (vision, audio), but they frequently underperform on highly tabular datasets compared to Gradient Boosted Trees (like XGBoost). Furthermore, Neural Nets are strict black boxes. In finance, blocking a transaction without an explanation is a regulatory violation. XGBoost, paired with KernelExplainer, allowed me to optimize PR-AUC while providing local feature attribution explanations for every single decision."

**Q: What is Concept Drift, and how does your system handle it?**
**A:** "Concept drift occurs when the statistical properties of the target variable change over time (e.g., fraudsters invent a new technique). FraudShield AI's architecture is designed to monitor Kullback-Leibler (KL) Divergence between training data and live inferences. (Note: Shadow deployment and automated drift retraining are designed but not fully operational). An Admin can promote verified models to Champion status via the Model Registry."

## Section 3: Frontend & UX
**Q: Why React 19 over Angular, and why Zustand over Redux?**
**A:** "React 19 offers exceptional performance through the new concurrent rendering engine and automated memoization. I chose Zustand over Redux because Redux introduces immense boilerplate. Zustand provided a fast, un-opinionated, and minimal global store that was perfect for managing the complex JWT authentication state and the dark-mode theme context."

**Q: How did you integrate the 3D graphics without tanking the framerate?**
**A:** "I used React Three Fiber (R3F) to bind Three.js directly into the React component lifecycle. To maintain 60 FPS, I avoided heavy geometries and instead used `Points` (particle systems) and basic `BufferGeometries` with simple materials. By rendering them inside a `<Canvas>` that only updates via `useFrame` deltas, the GPU overhead remained minimal."
