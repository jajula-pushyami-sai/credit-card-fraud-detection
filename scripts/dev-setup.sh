#!/usr/bin/env bash
# ==============================================================================
# FraudShield AI — Local Environment Setup Script
# ==============================================================================

set -euo pipefail

echo "======================================================"
echo "Initializing FraudShield AI Workspace Foundation..."
echo "======================================================"

# 1. Check prerequisites
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    echo "OK ($(node -v))"
else
    echo "FAILED! Node.js is required to build/run the frontend client."
    exit 1
fi

echo -n "Checking Python... "
if command -v python3 &> /dev/null; then
    echo "OK ($(python3 -V))"
elif command -v python &> /dev/null; then
    echo "OK ($(python -V))"
else
    echo "FAILED! Python 3.11+ is required for ML and backend services."
    exit 1
fi

echo -n "Checking Docker... "
if command -v docker &> /dev/null; then
    echo "OK ($(docker -v))"
else
    echo "Warning: Docker not found. Container execution will be unavailable, but local runs will work."
fi

# 2. Replicate environmental variables
if [ ! -f .env ]; then
    echo "Copying .env.example -> .env..."
    cp .env.example .env
else
    echo ".env configuration already exists. Skipping copy."
fi

# 3. Setup Frontend dependencies
echo "Installing frontend client dependencies..."
cd frontend
npm install --legacy-peer-deps
cd ..

echo "======================================================"
echo "Setup Complete! You can run the following commands:"
echo "  - docker-compose up --build  (Starts database, backend, and frontend)"
echo "  - npm run dev:frontend       (Runs Vite frontend locally)"
echo "  - npm run dev:backend        (Runs Flask backend locally)"
echo "======================================================"
