import pytest
from app import create_app

# These routes are explicitly public and don't require @jwt_required
PUBLIC_ROUTES_ALLOWLIST = {
    "/api/v1/auth/login",
    "/api/v1/auth/register",
    "/api/v1/ops/health/live",
    "/api/v1/ops/health/ready",
}

def test_all_routes_are_secured(client):
    """
    Validates that every registered API route in the application either belongs to the
    explicit public allowlist or enforceably requires a JWT token.
    This prevents developers from accidentally exposing sensitive endpoints.
    """
    app = create_app()
    
    with app.app_context():
        for rule in app.url_map.iter_rules():
            route_path = str(rule)
            
            # Skip static routes, non-API routes, and the allowlist
            if not route_path.startswith("/api/"):
                continue
            if route_path in PUBLIC_ROUTES_ALLOWLIST:
                continue
                
            # Replace URL variables with dummy strings to prevent 404s overriding the 401
            # e.g., /api/v1/transactions/<tx_id> -> /api/v1/transactions/dummy_id
            test_path = route_path
            for arg in rule.arguments:
                test_path = test_path.replace(f"<{arg}>", "dummy")
                test_path = test_path.replace(f"<string:{arg}>", "dummy")
                test_path = test_path.replace(f"<int:{arg}>", "1")
                
            # Pick the first valid HTTP method for this route
            methods = [m for m in rule.methods if m not in ["HEAD", "OPTIONS"]]
            if not methods:
                continue
            method = methods[0]
            
            # Fire an unauthenticated request
            response = client.open(test_path, method=method)
            
            # If a route is secured, it MUST return 401 Unauthorized when no token is present.
            # If it returns 200, 400, 500, etc., it means the route executed without auth!
            # Note: 405 Method Not Allowed is also acceptable if we picked a secondary method.
            # 404 is technically a failure of this test to hit the right route, but 
            # we consider 401 the absolute proof of security.
            assert response.status_code in [401, 405], (
                f"SECURITY FAILURE: Route {method} {route_path} is NOT secured by @jwt_required! "
                f"It returned HTTP {response.status_code} instead of 401 Unauthorized."
            )
