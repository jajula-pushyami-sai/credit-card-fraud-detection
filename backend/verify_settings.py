import sys
import json
import logging
from app import create_app
from app.database.core import db
from app.models.user import User

logging.basicConfig(level=logging.INFO)

app = create_app()

with app.app_context():
    # 1. Create a dummy user for testing
    user = User.query.filter_by(email="test_settings@example.com").first()
    if not user:
        user = User(
            email="test_settings@example.com",
            password_hash="fake",
            first_name="Test",
            last_name="User"
        )
        db.session.add(user)
        db.session.commit()
    
    # 2. Get JWT token
    from flask_jwt_extended import create_access_token
    token = create_access_token(identity=str(user.id))

    client = app.test_client()
    headers = {"Authorization": f"Bearer {token}"}

    # 3. Test Profile GET
    print("Testing GET /api/v1/settings/profile...")
    resp = client.get('/api/v1/settings/profile', headers=headers)
    assert resp.status_code == 200
    data = resp.json
    print(f"Profile: {data['data']}")

    # 4. Test Profile PUT
    print("\nTesting PUT /api/v1/settings/profile...")
    payload = {
        "fullName": "Updated User",
        "organization": "Updated Org",
        "department": "Engineering",
        "employeeId": "EMP-001",
        "phone": "555-1234",
        "location": "Seattle"
    }
    resp = client.put('/api/v1/settings/profile', headers=headers, json=payload)
    assert resp.status_code == 200
    
    user_updated = User.query.get(user.id)
    print(f"User saved in DB: First={user_updated.first_name}, Last={user_updated.last_name}, Org={user_updated.organization}, Phone={user_updated.phone}")
    
    # 5. Test Notifications GET
    print("\nTesting GET /api/v1/settings/notifications...")
    resp = client.get('/api/v1/settings/notifications', headers=headers)
    assert resp.status_code == 200
    data = resp.json
    print(f"Notifications: {data['data']}")

    # 6. Test Notifications PUT
    print("\nTesting PUT /api/v1/settings/notifications...")
    payload = {
        "highRisk": False,
        "suspiciousLogin": False,
        "desktop": False
    }
    resp = client.put('/api/v1/settings/notifications', headers=headers, json=payload)
    assert resp.status_code == 200
    
    user_updated = User.query.get(user.id)
    print(f"Notifications saved in DB: {user_updated.notification_preferences}")
    
    print("\nALL VERIFICATIONS PASSED SUCCESSFULLY!")
