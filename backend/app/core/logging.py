import logging
from logging.handlers import RotatingFileHandler
import os
import uuid
from flask import request, g, has_app_context


def setup_logging(app):
    log_dir = os.path.join(os.path.dirname(app.root_path), "logs")
    os.makedirs(log_dir, exist_ok=True)

    file_handler = RotatingFileHandler(
        os.path.join(log_dir, "fraudshield.log"), maxBytes=10240000, backupCount=10
    )

    formatter = logging.Formatter(
        "[%(asctime)s] %(levelname)s in %(module)s [ReqId: %(request_id)s]: %(message)s"
    )

    # Inject request_id into log records
    old_factory = logging.getLogRecordFactory()

    def record_factory(*args, **kwargs):
        record = old_factory(*args, **kwargs)
        if has_app_context():
            record.request_id = getattr(g, "request_id", "SYSTEM")
        else:
            record.request_id = "SYSTEM"
        return record

    logging.setLogRecordFactory(record_factory)

    file_handler.setFormatter(formatter)
    app.logger.addHandler(file_handler)
    app.logger.setLevel(logging.INFO)

    @app.before_request
    def generate_request_id():
        g.request_id = request.headers.get("X-Request-Id", str(uuid.uuid4()))

    @app.after_request
    def log_response(response):
        app.logger.info(f"{request.method} {request.path} - {response.status_code}")
        return response
