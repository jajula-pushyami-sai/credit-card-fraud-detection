import json

def test_user_registration(client):
    response = client.post('/api/v1/auth/register', json={
        "email": "analyst@fraudshield.ai",
        "password": "SecurePassword123!",
        "first_name": "Jane",
        "last_name": "Doe"
    })
    
    data = json.loads(response.data)
    assert response.status_code == 201
    assert data["success"] is True
    assert data["data"]["user"]["email"] == "analyst@fraudshield.ai"

def test_user_login(client):
    # Register first
    client.post('/api/v1/auth/register', json={
        "email": "login@fraudshield.ai",
        "password": "SecurePassword123!",
        "first_name": "John",
        "last_name": "Doe"
    })
    
    # Then Login
    response = client.post('/api/v1/auth/login', json={
        "email": "login@fraudshield.ai",
        "password": "SecurePassword123!"
    })
    
    data = json.loads(response.data)
    assert response.status_code == 200
    assert data["success"] is True
    assert "access_token" in data["data"]
    assert "refresh_token" in data["data"]

def test_login_invalid_credentials(client):
    response = client.post('/api/v1/auth/login', json={
        "email": "wrong@fraudshield.ai",
        "password": "wrong"
    })
    assert response.status_code == 401
