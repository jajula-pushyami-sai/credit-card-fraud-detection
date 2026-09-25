# Contributing to FraudShield AI

Thank you for your interest in contributing to FraudShield AI! This document provides guidelines for contributing to this academic demonstration platform.

## Code of Conduct

By participating in this project, you are expected to uphold a welcoming, inclusive, and professional environment. 

## Branching Strategy

We follow a simplified GitFlow workflow:
- `main`: Stable branch.
- `develop`: Integration branch for new features.
- `feature/<name>`: For new features (e.g., `feature/dashboard-polish`).
- `bugfix/<name>`: For resolving bugs.

## Commit Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation only changes
- `style:` Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `refactor:` A code change that neither fixes a bug nor adds a feature
- `perf:` A code change that improves performance
- `test:` Adding missing tests or correcting existing tests

Example: `feat: add animated neural loader to Suspense fallbacks`

## Local Development

Please refer to the `README.md` for standard local setup. Ensure that:
1. You have run `npm run lint` on the frontend before submitting.
2. You have run `black` or `flake8` on the backend Python code.
3. Your code does not introduce new TypeScript `any` types unless strictly necessary.

## Pull Request Process

1. Fork the repo and create your branch from `develop`.
2. Update the README.md or relevant `docs/` files with details of changes to the interface, this includes new environment variables, exposed ports, useful file locations and container parameters.
3. Open a Pull Request against the `develop` branch.
4. Ensure your PR description clearly explains the **Problem** and your **Solution**. Attach screenshots or GIFs for any UI changes.

## Security Constraints

Because this project demonstrates enterprise security principles (OWASP):
- **Never commit secrets**.
- Always use the `AcademicTooltip` component when adding new UI features to explain the enterprise/academic reasoning behind the feature.
- Maintain the strict separation of concerns between the Flask Backend and the Inference Engine.
