import os
import logging

try:
    if os.environ.get("FLASK_ENV") == "testing":
        REDIS_AVAILABLE = False
    else:
        import redis
        REDIS_AVAILABLE = True
except Exception as e:
    logging.warning(f"Failed to import redis library: {e}")
    REDIS_AVAILABLE = False

# Initialize a lazy Redis client for blocklisting and caching
redis_url = os.environ.get("REDIS_URL", "").strip()
if not redis_url or redis_url.startswith("memory://"):
    redis_url = "redis://localhost:6379/0"

class InMemoryRedisMock:
    """A simple in-memory mock for Redis to support local dev without a running Redis server."""
    def __init__(self):
        self.store = {}
    def get(self, key):
        return self.store.get(key)
    def setex(self, key, ttl, value):
        self.store[key] = value

try:
    if REDIS_AVAILABLE:
        redis_client = redis.from_url(redis_url, decode_responses=True)
        redis_client.ping() # Force connection attempt
    else:
        raise Exception("Redis library not available")
except Exception as e:
    logging.warning(f"Failed to connect to Redis at '{redis_url}': {e}. Falling back to in-memory dict for local dev.")
    redis_client = InMemoryRedisMock()
