import os
import logging
from logging.handlers import RotatingFileHandler


def setup_logger(app):
    """Set up application logger with rotating file handler and stream handler."""
    log_level_name = app.config.get("LOG_LEVEL", "INFO").upper()
    log_level = getattr(logging, log_level_name, logging.INFO)

    # Create logs directory if it doesn't exist
    log_file_path = app.config.get("LOG_FILE_PATH", "logs/app.log")
    log_dir = os.path.dirname(log_file_path)
    if log_dir and not os.path.exists(log_dir):
        os.makedirs(log_dir, exist_ok=True)

    formatter = logging.Formatter(
        "[%(asctime)s] %(levelname)s in %(module)s (%(threadName)s): %(message)s"
    )

    # Stream Handler (console)
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    console_handler.setLevel(log_level)

    # File Handler (rotating logs, max 10MB each, keep 5 logs)
    file_handler = RotatingFileHandler(
        log_file_path, maxBytes=10 * 1024 * 1024, backupCount=5
    )
    file_handler.setFormatter(formatter)
    file_handler.setLevel(log_level)

    # Root logger configuration
    root_logger = logging.getLogger()
    root_logger.setLevel(log_level)

    # Clear existing handlers to avoid double logging
    root_logger.handlers = []

    root_logger.addHandler(console_handler)
    root_logger.addHandler(file_handler)

    # Configure Flask logger to propagate or share same handlers
    app.logger.setLevel(log_level)

    app.logger.info("Logging initialized with level: %s", log_level_name)
