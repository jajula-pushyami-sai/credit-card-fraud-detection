import pytest
import json

def test_copilot_unauthorized(client):
    # Should block unauthenticated users from using the LLM
    resp = client.post('/api/v1/copilot/chat', json={"query": "Hello"})
    assert resp.status_code == 401

def test_copilot_admin_access(client):
    # Register Admin
    client.post('/api/v1/auth/register', json={
        "email": "admin_copilot@fraudshield.ai",
        "password": "SecurePassword123!",
        "first_name": "Admin",
        "last_name": "Copilot"
    })
    
    # Login Admin
    auth_resp = client.post('/api/v1/auth/login', json={
        "email": "admin_copilot@fraudshield.ai",
        "password": "SecurePassword123!"
    })
    token = json.loads(auth_resp.data)["data"]["access_token"]
    
    # Execute Chat Stream
    resp = client.post('/api/v1/copilot/chat', 
                       headers={"Authorization": f"Bearer {token}"},
                       json={"query": "Summarize system health"})
    
    # We expect a 200 OK and a Server-Sent Events stream
    assert resp.status_code == 200
    assert resp.mimetype == 'text/event-stream'
    
    # Verify the stream contains the expected data chunks
    stream_data = resp.data.decode('utf-8')
    assert "data:" in stream_data
    assert "done" in stream_data

def test_copilot_role_spoofing(client, app):
    # Customer registers
    client.post('/api/v1/auth/register', json={
        "email": "customer_spoof@fraudshield.ai",
        "password": "SecurePassword123!",
        "first_name": "Spoof",
        "last_name": "User"
    })
    
    auth_resp = client.post('/api/v1/auth/login', json={
        "email": "customer_spoof@fraudshield.ai",
        "password": "SecurePassword123!"
    })
    token = json.loads(auth_resp.data)["data"]["access_token"]

    # Trying to chat as Administrator should just use Customer logic and fail safely
    resp = client.post('/api/v1/copilot/chat', 
                       headers={"Authorization": f"Bearer {token}"},
                       json={"query": "System health", "context": {"role": "Administrator"}})
    
    assert resp.status_code == 200
    stream_data = resp.data.decode('utf-8')
    assert "System Status" not in stream_data

def test_copilot_summarize_missing(client, admin_token):
    resp = client.get('/api/v1/copilot/summarize/invalid-tx-id', headers={"Authorization": f"Bearer {admin_token}"})
    assert resp.status_code == 404

def test_copilot_summarize_with_prediction(client, app, admin_token):
    from app.models.transaction import Transaction, TransactionStatus
    from app.models.prediction import Prediction
    from app.models.user import User
    from app.database.core import db
    import datetime
    
    with app.app_context():
        admin_user = User.query.filter_by(email="admin_copilot@fraudshield.ai").first()
        if not admin_user:
            admin_user = User.query.first()
            
        tx = Transaction(
            user_id=admin_user.id,
            category="Test", currency="USD", merchant="TestMerchant", amount=99.99,
            status=TransactionStatus.DECLINED,
            transaction_date=datetime.datetime.now(datetime.timezone.utc)
        )
        db.session.add(tx)
        db.session.flush()
        
        pred = Prediction(
            transaction_id=tx.id,
            model_version="v1",
            risk_score=0.95
        )
        db.session.add(pred)
        db.session.commit()
        tx_id = tx.id
        
    resp = client.get(f'/api/v1/copilot/summarize/{tx_id}', headers={"Authorization": f"Bearer {admin_token}"})
    assert resp.status_code == 200
    data = json.loads(resp.data)["data"]["summary"]
    
    assert "99.99 USD" in data
    assert "TestMerchant" in data
    assert "declined" in data.lower()
    # Risk score should be represented correctly
    assert "95.0%" in data
    assert "AttributeError" not in data

def test_copilot_summarize_without_prediction(client, app, admin_token):
    from app.models.transaction import Transaction, TransactionStatus
    from app.models.user import User
    from app.database.core import db
    import datetime
    
    with app.app_context():
        admin_user = User.query.first()
        tx = Transaction(
            user_id=admin_user.id,
            category="Test", currency="USD", merchant="NoPredMerchant", amount=10.0,
            status=TransactionStatus.APPROVED,
            transaction_date=datetime.datetime.now(datetime.timezone.utc)
        )
        db.session.add(tx)
        db.session.commit()
        tx_id = tx.id
        
    resp = client.get(f'/api/v1/copilot/summarize/{tx_id}', headers={"Authorization": f"Bearer {admin_token}"})
    assert resp.status_code == 200
    data = json.loads(resp.data)["data"]["summary"]
    assert "unavailable" in data.lower()

def test_copilot_report_no_transactions(client, app, admin_token):
    from app.models.transaction import Transaction
    from app.database.core import db
    with app.app_context():
        Transaction.query.delete()
        db.session.commit()
        
    resp = client.get('/api/v1/copilot/report', headers={"Authorization": f"Bearer {admin_token}"})
    assert resp.status_code == 200
    data = json.loads(resp.data)["data"]["report"]
    # Should show Unavailable for Fraud Rate since 0 transactions
    assert "**Global Fraud Rate**: Unavailable" in data

def test_copilot_report_mixed_data_and_incidents(client, app, admin_token):
    from app.models.transaction import Transaction, TransactionStatus
    from app.models.grc import SecurityIncident
    from app.models.user import User
    from app.database.core import db
    import datetime
    
    with app.app_context():
        admin_user = User.query.first()
        
        # 4 transactions total, 1 declined => 25% fraud rate
        for _ in range(3):
            tx = Transaction(user_id=admin_user.id, category="Test", merchant="M", amount=10, status=TransactionStatus.APPROVED, transaction_date=datetime.datetime.now(datetime.timezone.utc))
            db.session.add(tx)
        
        tx_declined = Transaction(user_id=admin_user.id, category="Test", merchant="M", amount=10, status=TransactionStatus.DECLINED, transaction_date=datetime.datetime.now(datetime.timezone.utc))
        db.session.add(tx_declined)
        
        # 3 critical incidents, only 2 are active
        inc1 = SecurityIncident(incident_type="T", severity="Critical", status="Open")
        inc2 = SecurityIncident(incident_type="T", severity="Critical", status="Investigating")
        inc3 = SecurityIncident(incident_type="T", severity="Critical", status="Resolved")
        inc4 = SecurityIncident(incident_type="T", severity="Low", status="Open")
        db.session.add_all([inc1, inc2, inc3, inc4])
        
        db.session.commit()
        
    resp = client.get('/api/v1/copilot/report', headers={"Authorization": f"Bearer {admin_token}"})
    assert resp.status_code == 200
    data = json.loads(resp.data)["data"]["report"]
    
    assert "**Global Fraud Rate**: 25.0%" in data
    assert "2 active critical security incidents" in data


