from app.models.transaction import Transaction, TransactionStatus
from app.models.user import User, RoleEnum
from app.database.core import db
from flask_jwt_extended import create_access_token
from app.security.hashing import hash_password
import datetime

def test_transactions_heatmap(app, client):
    """
    Test that the heatmap endpoint handles database-agnostic 'extract' functions
    properly on SQLite (the test suite's default DB), and correctly normalizes the output.
    """
    with app.app_context():
        # Create an admin user to access the endpoint
        admin = User(
            email="admin@example.com",
            password_hash=hash_password("hash"),
            first_name="Admin",
            last_name="User",
            role=RoleEnum.ADMIN
        )
        db.session.add(admin)
        db.session.commit()
        
        # October 1, 2023 was a Sunday
        tx1 = Transaction(
            user_id=admin.id,
            merchant="Test Merchant",
            category="Test Category",
            amount=100.0,
            status=TransactionStatus.DECLINED,
            transaction_date=datetime.datetime(2023, 10, 1, 14, 30, 0)
        )
        # October 2, 2023 was a Monday
        tx2 = Transaction(
            user_id=admin.id,
            merchant="Test Merchant",
            category="Test Category",
            amount=200.0,
            status=TransactionStatus.DECLINED,
            transaction_date=datetime.datetime(2023, 10, 2, 9, 15, 0)
        )
        
        db.session.add_all([tx1, tx2])
        db.session.commit()
        
        # Log in to get the token properly
        login_resp = client.post('/api/v1/auth/login', json={
            "email": "admin@example.com",
            "password": "hash"
        })
        admin_token = login_resp.json["data"]["access_token"]

    response = client.get(
        "/api/v1/transactions/heatmap", headers={"Authorization": f"Bearer {admin_token}"}
    )

    assert response.status_code == 200
    data = response.json["data"]["heatmap"]
    
    # We expect some data in the heatmap.
    assert len(data) > 0
    
    # Check that our specific times are mapped correctly.
    # Sunday (14:00) -> Echarts 6
    sunday_point = [14, 6, 1]
    # Monday (09:00) -> Echarts 5
    monday_point = [9, 5, 1]
    
    # Check if they are in the result
    assert sunday_point in data
    assert monday_point in data
