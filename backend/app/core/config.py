from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "TruthLens API"
    
    # LLM Keys
    OPENROUTER_API_KEY: str = ""
    OPENROUTER_API_KEYS: str = "" # Comma separated for rotation
    
    OPENAI_API_KEY: str = ""
    GOOGLE_API_KEY: str = ""
    
    GROQ_API_KEY: str = ""
    GROQ_API_KEYS: str = "" # Comma separated for rotation
    
    OPENAI_BASE_URL: str = ""
    GROQ_BASE_URL: str = ""
    
    def get_openrouter_keys(self) -> list[str]:
        """Returns a list of OpenRouter keys from either plural (comma-sep) or singular env var."""
        keys = []
        if self.OPENROUTER_API_KEYS:
            keys.extend([k.strip() for k in self.OPENROUTER_API_KEYS.split(",") if k.strip()])
        elif self.OPENROUTER_API_KEY:
            keys.append(self.OPENROUTER_API_KEY)
        return keys

    def get_groq_keys(self) -> list[str]:
        """Returns a list of Groq keys from either plural (comma-sep) or singular env var."""
        keys = []
        if self.GROQ_API_KEYS:
            keys.extend([k.strip() for k in self.GROQ_API_KEYS.split(",") if k.strip()])
        elif self.GROQ_API_KEY:
            keys.append(self.GROQ_API_KEY)
        return keys
    
    # Search Keys (Optional if using DuckDuckGo)
    TAVILY_API_KEY: str = ""

    # Auth
    SECRET_KEY: str = "changethis"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database
    DATABASE_URL: str = "sqlite:///./database.db"
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()
