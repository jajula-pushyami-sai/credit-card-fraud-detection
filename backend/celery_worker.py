from app import create_app

# Create a full Flask application context
flask_app = create_app()

# Extract the initialized celery application
celery = flask_app.extensions["celery"]
