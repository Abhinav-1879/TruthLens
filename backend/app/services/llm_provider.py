from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI
from app.core.config import get_settings

class LLMFactory:
    @staticmethod
    def get_llm(temperature=0.0):
        settings = get_settings()
        
        # Priority: OpenAI -> Google -> Groq (to be implemented)
        # Priority: OpenRouter -> OpenAI -> Google
        if settings.OPENROUTER_API_KEY:
            return ChatOpenAI(
                base_url="https://openrouter.ai/api/v1",
                api_key=settings.OPENROUTER_API_KEY,
                model="google/gemma-3-27b-it",
                temperature=temperature,
                max_retries=3,
                request_timeout=60
            )
        elif settings.OPENAI_API_KEY:
            return ChatOpenAI(
                model="gpt-3.5-turbo", 
                temperature=temperature,
                openai_api_key=settings.OPENAI_API_KEY
            )
        elif settings.GOOGLE_API_KEY:
            return ChatGoogleGenerativeAI(
                model="gemini-2.0-flash",
                temperature=temperature,
                google_api_key=settings.GOOGLE_API_KEY,
                convert_system_message_to_human=True,
                max_retries=3,
                request_timeout=60
            )
        else:
            # Fallback or Mock for testing if no keys
            print("Warning: No API keys found. Using Mock LLM behavior might be necessary.")
            raise ValueError("No valid API Key provided. Please set OPENAI_API_KEY or GOOGLE_API_KEY in .env")
