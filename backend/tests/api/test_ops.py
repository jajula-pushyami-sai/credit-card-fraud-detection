import pytest
import json

def test_liveness_probe(client):
    # Anyone should be able to ping the liveness probe (used by Load Balancers)
    resp = client.get('/api/v1/ops/health/live')
    assert resp.status_code == 200
    data = json.loads(resp.data)["data"]
    assert data["status"] == "alive"

def test_readiness_probe(client):
    # Anyone should be able to ping the readiness probe
    resp = client.get('/api/v1/ops/health/ready')
    assert resp.status_code == 200
    data = json.loads(resp.data)["data"]
    assert data["status"] == "ready"
    assert data["database"] == "connected"

def test_audit_log_access(client):
    # Register test customer
    client.post('/api/v1/auth/register', json={
        "email": "customer_audit@fraudshield.ai",
        "password": "SecurePassword123!",
        "first_name": "Test",
        "last_name": "Customer"
    })
    
    auth_resp = client.post('/api/v1/auth/login', json={
        "email": "customer_audit@fraudshield.ai",
        "password": "SecurePassword123!"
    })
    token = json.loads(auth_resp.data)["data"]["access_token"]
    
    # Customer should be blocked from Audit Logs
    audit_resp = client.get('/api/v1/ops/audit', headers={"Authorization": f"Bearer {token}"})
    assert audit_resp.status_code == 403
