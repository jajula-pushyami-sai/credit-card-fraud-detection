import json
import pytest
from app.models.user import User
from app.database.core import db

def test_get_profile(client, token, app):
    resp = client.get('/api/v1/settings/profile', headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    data = resp.json
    assert data["status"] == "success"
    assert "data" in data
    assert "email" in data["data"]
    assert "fullName" in data["data"]

def test_update_profile(client, token, app):
    payload = {
        "fullName": "Jane Doe",
        "organization": "New Org",
        "department": "Engineering",
        "employeeId": "EMP-001",
        "phone": "555-0000",
        "location": "San Francisco"
    }
    resp = client.put('/api/v1/settings/profile', headers={"Authorization": f"Bearer {token}"}, json=payload)
    assert resp.status_code == 200
    assert resp.json["status"] == "success"

    # Verify update
    with app.app_context():
        user = User.query.first()
        assert user.first_name == "Jane"
        assert user.last_name == "Doe"
        assert user.organization == "New Org"
        assert user.department == "Engineering"
        assert user.employee_id == "EMP-001"
        assert user.phone == "555-0000"
        assert user.location == "San Francisco"

def test_get_notifications(client, token, app):
    resp = client.get('/api/v1/settings/notifications', headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    data = resp.json
    assert data["status"] == "success"
    assert "highRisk" in data["data"]

def test_update_notifications(client, token, app):
    payload = {
        "highRisk": False,
        "suspiciousLogin": False
    }
    resp = client.put('/api/v1/settings/notifications', headers={"Authorization": f"Bearer {token}"}, json=payload)
    assert resp.status_code == 200
    assert resp.json["status"] == "success"

    with app.app_context():
        user = User.query.first()
        assert user.notification_preferences["highRisk"] is False
