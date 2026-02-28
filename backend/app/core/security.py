from datetime import datetime, timedelta
from typing import Optional, Any, Union
from jose import jwt
from passlib.context import CryptContext

# Configuration (In production, load these from environment variables!)
SECRET_KEY = "CHANGE_THIS_TO_A_REAL_SECRET_KEY_IN_PRODUCTION" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 24 * 60  # 30 Days for easier dev

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"sub": str(subject), "exp": expire}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

import secrets
import hashlib

def generate_api_key() -> str:
    """Generates a random API key starting with 'tl_live_'"""
    return f"tl_live_{secrets.token_urlsafe(32)}"

def get_api_key_hash(api_key: str) -> str:
    """Hashes the API key using SHA256 for storage"""
    return hashlib.sha256(api_key.encode()).hexdigest()
