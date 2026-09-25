import pytest
import json
import datetime
from app.models.transaction import Transaction, TransactionStatus
from app.models.user import User
from app.database.core import db

def test_telemetry_role_access(client):
    # Register test customer
    client.post('/api/v1/auth/register', json={
        "email": "customer_ops@fraudshield.ai",
        "password": "SecurePassword123!",
        "first_name": "Test",
        "last_name": "Customer"
    })
    
    auth_resp = client.post('/api/v1/auth/login', json={
        "email": "customer_ops@fraudshield.ai",
        "password": "SecurePassword123!"
    })
    token = json.loads(auth_resp.data)["data"]["access_token"]
    
    # Customer should be blocked from System Health
    health_resp = client.get('/api/v1/telemetry/health', headers={"Authorization": f"Bearer {token}"})
    assert health_resp.status_code == 403
    
    # Customer should be blocked from Enterprise KPIs
    kpi_resp = client.get('/api/v1/telemetry/kpi', headers={"Authorization": f"Bearer {token}"})
    assert kpi_resp.status_code == 403


def test_telemetry_trends_empty_db(client, admin_token):
    # Case 2 - empty database
    resp = client.get('/api/v1/telemetry/trends', headers={"Authorization": f"Bearer {admin_token}"})
    assert resp.status_code == 200
    data = json.loads(resp.data)["data"]
    assert data["status"] == "unavailable"
    assert data["is_synthetic"] is False
    assert len(data["labels"]) == 0
    assert len(data["legitimate"]) == 0


def test_telemetry_trends_real_data(client, app, admin_token):
    # Case 1 - real data
    with app.app_context():
        # Get the admin user created by the admin_token fixture
        admin_user = User.query.filter_by(email="admin_xai@fraudshield.ai").first()
        
        # Seed some data
        tx1 = Transaction(
            user_id=admin_user.id,
            category="Test Category 1",
            currency="USD",
            merchant="Test Merchant 1",
            amount=100.0,
            status=TransactionStatus.APPROVED,
            transaction_date=datetime.datetime.now()
        )
        tx2 = Transaction(
            user_id=admin_user.id,
            category="Test Category 2",
            currency="USD",
            merchant="Test Merchant 2",
            amount=200.0,
            status=TransactionStatus.DECLINED,
            transaction_date=datetime.datetime.now()
        )
        db.session.add(tx1)
        db.session.add(tx2)
        db.session.commit()
        
    resp = client.get('/api/v1/telemetry/trends', headers={"Authorization": f"Bearer {admin_token}"})
    assert resp.status_code == 200
    data = json.loads(resp.data)["data"]
    
    # Case 3 - frontend contract
    assert "labels" in data
    assert "legitimate" in data
    assert "fraudulent" in data
    assert "flagged" in data
    assert "hourly_volume" not in data
    
    # Case 4 - no fake arrays
    assert data["status"] == "available"
    assert data["is_synthetic"] is False
    assert len(data["labels"]) == 30
    assert data["legitimate"][-1] >= 1
    assert data["fraudulent"][-1] >= 1


def test_telemetry_kpi(client, app, admin_token):
    with app.app_context():
        admin_user = User.query.filter_by(email="admin_xai@fraudshield.ai").first()
        
        # Add transactions for today and yesterday
        today = datetime.datetime.now(datetime.timezone.utc)
        yesterday = today - datetime.timedelta(days=1)
        
        tx1 = Transaction(
            user_id=admin_user.id,
            category="Test", currency="USD", merchant="M1", amount=10.0,
            status=TransactionStatus.APPROVED,
            transaction_date=today
        )
        tx2 = Transaction(
            user_id=admin_user.id,
            category="Test", currency="USD", merchant="M2", amount=20.0,
            status=TransactionStatus.DECLINED,
            transaction_date=yesterday
        )
        db.session.add(tx1)
        db.session.add(tx2)
        db.session.commit()
        
    resp = client.get('/api/v1/telemetry/kpi', headers={"Authorization": f"Bearer {admin_token}"})
    assert resp.status_code == 200
    data = json.loads(resp.data)["data"]
    
    # 2 total transactions, 1 fraud = 50.0% fraud rate
    assert data["fraud_rate"] == 50.0
    # 1 transaction today
    assert data["transactions_today"] == 1
    assert data["detection_accuracy"] is None
    assert data["avg_decision_time_ms"] is None
    # At least 1 active user (the admin who logged in)
    assert data["active_users"] >= 1
    assert "is_synthetic" not in data


def test_telemetry_health(client, admin_token):
    resp = client.get('/api/v1/telemetry/health', headers={"Authorization": f"Bearer {admin_token}"})
    assert resp.status_code == 200
    data = json.loads(resp.data)["data"]
    
    assert data["database_status"] == "Online"
    assert data["active_model_version"] is None
    assert data["smtp_status"] is None
    assert data["cpu_usage"] is None
    assert "is_synthetic" not in data
