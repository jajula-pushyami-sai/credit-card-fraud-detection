import json
import pytest
from app import create_app
from app.database.core import db

@pytest.fixture
def app():
    app = create_app('testing')
    app.config['PROPAGATE_EXCEPTIONS'] = True
    with app.app_context():
        from flask_migrate import upgrade
        import os
        
        backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        migrations_dir = os.path.join(backend_dir, "migrations")
        if not os.path.isdir(migrations_dir):
            raise RuntimeError(f"Test migration directory not found: {migrations_dir}")
            
        upgrade(directory=migrations_dir)
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def token(client):
    register_payload = {
        "email": "testuser@example.com",
        "password": "SecurePassword123!",
        "first_name": "Test",
        "last_name": "User"
    }
    client.post('/api/v1/auth/register', json=register_payload)
    auth_resp = client.post('/api/v1/auth/login', json={
        "email": register_payload["email"],
        "password": register_payload["password"]
    })
    return json.loads(auth_resp.data)["data"]["access_token"]

@pytest.fixture
def admin_token(client, app):
    # Register user
    client.post('/api/v1/auth/register', json={
        "email": "admin_xai@fraudshield.ai",
        "password": "SecurePassword123!",
        "first_name": "Admin",
        "last_name": "User"
    })
    
    # Change role directly in DB
    from app.models.user import User, RoleEnum
    from app.database.core import db
    with app.app_context():
        user = User.query.filter_by(email="admin_xai@fraudshield.ai").first()
        user.role = RoleEnum.ADMIN
        db.session.commit()

    # Login
    auth_resp = client.post('/api/v1/auth/login', json={
        "email": "admin_xai@fraudshield.ai",
        "password": "SecurePassword123!"
    })
    return json.loads(auth_resp.data)["data"]["access_token"]
