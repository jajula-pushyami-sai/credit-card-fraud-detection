import os
from dotenv import load_dotenv
from app import create_app

# Load environment configuration variables
load_dotenv()

env = os.getenv("FLASK_ENV", "development")
app = create_app(env)

if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("DEBUG", "true").lower() in ("true", "1", "yes")
    
    app.logger.info(f"Starting FraudShield AI Backend in {env} mode...")
    app.run(host=host, port=port, debug=debug)
