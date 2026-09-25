import pytest
from flask_jwt_extended import create_access_token
from unittest.mock import patch

def test_get_model_registry_empty(client, admin_token):
    """Test that an empty model registry does not seed fake data but uses eval_metrics if available."""
    # Mock os.path.exists to simulate no eval_metrics.json
    with patch('os.path.exists', return_value=False):
        response = client.get(
            "/api/v1/ml/registry",
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        assert response.status_code == 200
        data = response.get_json()["data"]
        assert "registry" in data
        # Without eval_metrics and empty DB, registry should be empty
        assert len(data["registry"]) == 0

def test_get_experiments_empty(client, admin_token):
    """Test that an empty experiments table does not seed fake data."""
    response = client.get(
        "/api/v1/ml/experiments",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert response.status_code == 200
    data = response.get_json()["data"]
    assert "experiments" in data
    assert len(data["experiments"]) == 0

def test_get_drift_empty(client, admin_token):
    """Test that an empty drift table does not seed fake data and returns unavailable."""
    response = client.get(
        "/api/v1/ml/drift",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert response.status_code == 200
    data = response.get_json()["data"]
    assert data["status"] == "unavailable"
    assert len(data["features"]) == 0
    assert data["concept_drift"]["status"] == "unavailable"
