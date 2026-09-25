import os
from celery import Celery, Task

# Create a global celery instance that is configured later during app creation
celery = Celery("fraudshield_tasks")

def celery_init_app(app):
    class FlaskTask(Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery_app = Celery(app.name, task_cls=FlaskTask)
    # Configure celery based on flask config if available, fallback to env
    redis_url = os.environ.get("REDIS_URL", "redis://localhost:6379/0")
    
    celery_app.conf.update(
        broker_url=redis_url,
        result_backend=redis_url,
        task_serializer="json",
        accept_content=["json"],
        result_serializer="json",
        timezone="UTC",
        enable_utc=True,
        # Ensure we don't accidentally consume too much memory in production workers
        worker_max_tasks_per_child=50,
    )
    celery_app.set_default()
    app.extensions["celery"] = celery_app
    
    # Also update the global celery instance for decorators
    global celery
    celery = celery_app
    return celery_app


@celery.task(name="process_batch_predictions")
def process_batch_predictions(file_path: str):
    import pandas as pd
    import os
    import logging
    from app.ml.inference.predict import InferenceService
    
    logger = logging.getLogger(__name__)

    try:
        df = pd.read_csv(file_path)
        engine = InferenceService(
            config_path=None,  # Uses default absolute path derived from __file__
        )
        
        results = engine.predict_batch(df)
        
        return {
            "status": "completed", 
            "batch_results": results, 
            "row_count": len(results)
        }
    except Exception as e:
        logger.error(f"Batch task failed: {e}")
        return {"status": "failed", "error": str(e)}
    finally:
        # Secure deletion: ensure file path is actually in the batch directory
        # and doesn't contain path traversal tokens
        from flask import current_app
        batch_dir = current_app.config.get("BATCH_DATA_DIR", "/app/batch_data")
        abs_file_path = os.path.abspath(file_path)
        abs_batch_dir = os.path.abspath(batch_dir)
        
        if os.path.exists(file_path):
            if abs_file_path.startswith(abs_batch_dir):
                os.remove(file_path)
            else:
                logger.warning(f"Attempted to delete file outside batch directory: {file_path}")


@celery.task(name="dispatch_high_risk_email")
def dispatch_high_risk_email(analyst_email: str, tx_id: str):
    import time

    # Simulate SMTP handshake and dispatch
    time.sleep(2)
    return {"status": "sent", "recipient": analyst_email, "tx_id": tx_id}
