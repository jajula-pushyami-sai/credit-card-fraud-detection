from flasgger import Swagger


def setup_swagger(app):
    """Set up Flasgger Swagger UI configuration for API documentation."""
    swagger_config = {
        "headers": [],
        "specs": [
            {
                "endpoint": "apispec_1",
                "route": "/apispec_1.json",
                "rule_filter": lambda rule: True,  # all in
                "model_filter": lambda tag: True,  # all in
            }
        ],
        "static_url_path": "/flasgger_static",
        "swagger_ui": True,
        "specs_route": "/apidocs/",
    }

    template = {
        "swagger": "2.0",
        "info": {
            "title": "FraudShield AI API Documentation",
            "description": "API for explainable credit card fraud detection system.",
            "contact": {
                "responsibleOrganization": "FraudShield AI",
                "responsibleDeveloper": "Principal Software Architect",
                "email": "dev@fraudshield.ai",
                "url": "https://fraudshield.ai",
            },
            "termsOfService": "https://fraudshield.ai/terms",
            "version": "1.0.0",
        },
        "host": "localhost:5000",  # Overridden by dev/prod domains
        "basePath": "/api/v1",  # base bash for blueprint routing
        "schemes": ["http", "https"],
        "securityDefinitions": {
            "Bearer": {
                "type": "apiKey",
                "name": "Authorization",
                "in": "header",
                "description": 'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}"',
            }
        },
    }

    # Initialize flasgger
    Swagger(app, config=swagger_config, template=template)
