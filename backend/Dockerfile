# ---------------------------------------------------------
# Stage 1: Build & Dependencies
# ---------------------------------------------------------
FROM python:3.12-slim as builder

WORKDIR /app

# Install system dependencies required for compiling Python packages (e.g. numpy, scikit-learn)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies into a virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ---------------------------------------------------------
# Stage 2: Production Runtime
# ---------------------------------------------------------
FROM python:3.12-slim

WORKDIR /app

# Copy the pre-built virtual environment from the builder stage
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
ENV FLASK_APP=run.py

# Create a non-root user for security
RUN groupadd -r fraudshield && useradd -r -g fraudshield fraudshield_user

# Copy application files BEFORE chown so they are not root-owned
COPY . .

# Set correct permissions
RUN chown -R fraudshield_user:fraudshield /app

# Ensure the ML models directory has the correct permissions
RUN mkdir -p /app/ml_models && chown -R fraudshield_user:fraudshield /app/ml_models

# Make entrypoint executable
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

USER fraudshield_user

EXPOSE 5000

ENTRYPOINT ["/entrypoint.sh"]

# The default command runs the Gunicorn WSGI server for production
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "--worker-class", "gevent", "run:app"]
