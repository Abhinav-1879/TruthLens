import os
import openai
from tenacity import retry, stop_after_attempt, wait_random_exponential, retry_if_exception_type
from langchain_openai import ChatOpenAI
from app.core.config import get_settings

settings = get_settings()

def get_resilient_llm(provider="openrouter"):
    if provider == "openrouter":
        return ChatOpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=settings.OPENROUTER_API_KEY,
            model="google/gemma-2-9b-it:free",
            temperature=0,
            max_retries=1, # We handle retries manually
            request_timeout=30,
            default_headers={
                "HTTP-Referer": "http://localhost:5173",
                "X-Title": "TruthLens"
            }
        )
    elif provider == "groq":
        return ChatOpenAI(
            base_url="https://api.groq.com/openai/v1",
            api_key=settings.GROQ_API_KEY,
            model="llama-3.3-70b-versatile",
            temperature=0,
            max_retries=1,
            request_timeout=30
        )
    return None

@retry(
    wait=wait_random_exponential(min=1, max=10), 
    stop=stop_after_attempt(3),
    retry=retry_if_exception_type((openai.RateLimitError, openai.APIConnectionError, openai.InternalServerError))
)
async def resilient_generate(messages):
    """
    Tries OpenRouter first. If it fails (Rate Limit/Connection), automatically falls back to Groq.
    """
    try:
        # 1. Try Primary (OpenRouter - Gemma 3)
        client = get_resilient_llm("openrouter")
        return await client.ainvoke(messages)
    except (openai.RateLimitError, openai.APIConnectionError, openai.InternalServerError, Exception) as e:
        print(f"OpenRouter failed ({type(e).__name__}). Switching to Groq Fallback...")
        
        # 2. Fallback to Groq (Llama 3.3)
        try:
            client = get_resilient_llm("groq")
            return await client.ainvoke(messages)
        except Exception as e2:
            print(f"Groq fallback also failed: {e2}")
            # If both fail, raise the original error or the new one
            raise e2
