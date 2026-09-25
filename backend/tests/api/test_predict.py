"""Tests for the /api/v1/predict endpoints.

Uses unittest.mock to isolate the API layer from real ML artifacts.

NOTE: The `redis` package import may fail with OSError on some Windows
environments. We pre-load a mock redis_client into sys.modules so
jwt_manager.check_if_token_revoked never hits the broken import path.
"""
import sys
import types
import pytest
import json
from unittest.mock import patch, MagicMock

from app.core.exceptions import ModelNotReadyError


# ---------------------------------------------------------------------------
# Auth helper
# ---------------------------------------------------------------------------

def _get_auth_token(client):
    """Register + login a test user, return the JWT access token."""
    client.post('/api/v1/auth/register', json={
        "email": "analyst_test@fraudshield.ai",
        "password": "SecurePassword123!",
        "first_name": "Test",
        "last_name": "Analyst"
    })
    auth_resp = client.post('/api/v1/auth/login', json={
        "email": "analyst_test@fraudshield.ai",
        "password": "SecurePassword123!"
    })
    return json.loads(auth_resp.data)["data"]["access_token"]


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

SAMPLE_PAYLOAD = {
    "V1": -1.2, "V2": 2.3, "V3": -0.5, "V4": 1.1, "V5": 0.0,
    "V6": -0.1, "V7": -0.2, "V8": 0.3, "V9": -0.4, "V10": -0.5,
    "V11": 0.6, "V12": -0.7, "V13": 0.8, "V14": -0.9, "V15": 1.0,
    "V16": -1.1, "V17": 1.2, "V18": -1.3, "V19": 1.4, "V20": -1.5,
    "V21": 0.1, "V22": -0.2, "V23": 0.3, "V24": -0.4, "V25": 0.5,
    "V26": -0.6, "V27": 0.7, "V28": -0.8, "Amount": 150.00, "Time": 1000
}

MOCK_ML_RESULT = {
    "probability": 0.12,
    "risk_level": "Low Risk",
    "suggested_action": "approve",
    "base_models": {"extra_trees": 0.10, "mlp": 0.14},
    "shap_values": {},
    "feature_mode": "full",
}


# ---------------------------------------------------------------------------
# Tests — authorization
# ---------------------------------------------------------------------------

def test_predict_realtime_unauthorized(client):
    """Attempting to predict without a JWT should fail with 401."""
    resp = client.post('/api/v1/predict/single', json={})
    assert resp.status_code == 401


# ---------------------------------------------------------------------------
# Tests — 503 MODEL_NOT_READY
# ---------------------------------------------------------------------------

def test_predict_returns_503_when_model_not_ready(client):
    """When InferenceService cannot load, the API must return 503 with
    the structured MODEL_NOT_READY error body."""
    token = _get_auth_token(client)

    with patch(
        "app.api.v1.predict.get_inference_service",
        side_effect=ModelNotReadyError("Fraud detection model is not available."),
    ):
        resp = client.post(
            '/api/v1/predict/single',
            headers={"Authorization": f"Bearer {token}"},
            json=SAMPLE_PAYLOAD,
        )

    assert resp.status_code == 503
    body = json.loads(resp.data)
    assert body["success"] is False
    assert body["error"]["code"] == "MODEL_NOT_READY"
    assert "not available" in body["error"]["message"]


# ---------------------------------------------------------------------------
# Tests — successful prediction (mocked ML)
# ---------------------------------------------------------------------------

def test_predict_realtime_success(client):
    """With a mocked InferenceService, the endpoint must return 200 with
    the expected response shape (transaction_id + risk_assessment)."""
    token = _get_auth_token(client)

    mock_engine = MagicMock()
    mock_engine.predict_single.return_value = MOCK_ML_RESULT
    mock_engine.active_record = {"version_id": "v1.0.0"}

    with patch(
        "app.api.v1.predict.get_inference_service",
        return_value=mock_engine,
    ):
        resp = client.post(
            '/api/v1/predict/single',
            headers={"Authorization": f"Bearer {token}"},
            json=SAMPLE_PAYLOAD,
        )

    assert resp.status_code == 200
    data = json.loads(resp.data)["data"]

    assert "transaction_id" in data
    assert "risk_assessment" in data

    ra = data["risk_assessment"]
    assert ra["probability"] == 0.12
    assert ra["risk_level"] == "Low Risk"
    assert ra["suggested_action"] == "approve"
    assert "base_models" in ra
