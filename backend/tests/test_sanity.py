import pytest
from app import create_app
from app.database.core import db

@pytest.fixture
def app():
    """Setup app context fixture in testing mode."""
    app = create_app("testing")
    with app.app_context():
        from flask_migrate import upgrade
        import os
        
        backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        migrations_dir = os.path.join(backend_dir, "migrations")
        if not os.path.isdir(migrations_dir):
            raise RuntimeError(f"Test migration directory not found: {migrations_dir}")
            
        upgrade(directory=migrations_dir)
        yield app
        db.drop_all()


@pytest.fixture
def client(app):
    """Setup testing client wrapper."""
    return app.test_client()


def test_health_check(client):
    """Ensure health check routes respond properly."""
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json['status'] == 'healthy'
