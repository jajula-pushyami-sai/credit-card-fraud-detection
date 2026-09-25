import os
import time
from app.models.transaction import Transaction
from app.models.grc import SecurityIncident
from app.models.mlops import MLModel

# ---------------------------------------------------------------------------
# Real LLM Service — uses Google Gemini if GEMINI_API_KEY is configured.
# Falls back to MockLLMService when no key is present.
# ---------------------------------------------------------------------------

_SYSTEM_PROMPT = """You are FraudShield Copilot, an expert AI assistant embedded in the
FraudShield AI fraud detection platform. You assist fraud analysts, administrators,
and customers with concise, accurate answers about:
- Transaction risk analysis and SHAP explainability
- Fraud patterns, thresholds, and model behaviour
- Account security and compliance
- Platform telemetry and model drift

Always be professional, concise (3-5 sentences max), and ground answers in the
context of a real-time ML fraud detection system using Extra Trees + Keras MLP
stacked with an XGBoost meta-learner.

Use only the provided verified context.
Do not invent missing values.
If a requested value is absent, state that it is unavailable.
"""


class GeminiLLMService:
    """Real LLM service backed by Google Gemini 1.5 Flash."""

    def __init__(self):
        import google.generativeai as genai

        api_key = os.getenv("GEMINI_API_KEY")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            system_instruction=_SYSTEM_PROMPT,
        )

    @staticmethod
    def generate_chat_response(query: str, role: str) -> str:
        """Generate a real AI response via Gemini API."""
        try:
            import google.generativeai as genai

            api_key = os.getenv("GEMINI_API_KEY")
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel(
                model_name="gemini-1.5-flash",
                system_instruction=_SYSTEM_PROMPT,
            )
            context = f"User role: {role}. Query: {query}"
            response = model.generate_content(context)
            return response.text
        except Exception:
            # Fallback to mock on any API error
            return MockLLMService.generate_chat_response(query, role)

    @staticmethod
    def stream_tokens(text: str):
        """Stream word-by-word for SSE."""
        words = text.split(" ")
        for i, word in enumerate(words):
            token = word + (" " if i < len(words) - 1 else "")
            time.sleep(0.002)
            yield token


class MockLLMService:
    @staticmethod
    def generate_chat_response(query: str, role: str):
        """
        Safe deterministic fallback when GEMINI_API_KEY is not configured.
        """
        return "AI Copilot is temporarily unavailable because the configured language-model service could not be reached. Please try again later."

    @staticmethod
    def stream_tokens(text: str):
        """Simulates fast token-by-token streaming of an LLM via SSE (<0.1s total delay)."""
        words = text.split(" ")
        for i, word in enumerate(words):
            token = word + (" " if i < len(words) - 1 else "")
            time.sleep(0.002)
            yield token


def get_llm_service():
    """
    Returns the best available LLM service:
    - GeminiLLMService if GEMINI_API_KEY is set and google-generativeai is installed
    - MockLLMService otherwise (zero config required)
    """
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if api_key:
        try:
            import google.generativeai  # noqa: F401

            return GeminiLLMService
        except ImportError:
            pass
    return MockLLMService
