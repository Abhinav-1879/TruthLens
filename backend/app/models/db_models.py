from sqlmodel import SQLModel, Field, JSON
from typing import Optional, List, Dict, Any
from datetime import datetime

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    full_name: Optional[str] = None
    is_active: bool = True
    is_superuser: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AnalysisRecord(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    text_content: str
    overall_trust_score: int
    hallucination_risk_level: str
    risk_score: int
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Store complex JSON data as a dictionary
    claims_data: List[Dict[str, Any]] = Field(default=[], sa_type=JSON) 
    executive_brief: Dict[str, Any] = Field(default={}, sa_type=JSON)
    audit_decision: str = Field(default="PENDING") # SHIP / HOLD / REJECT

    # Ownership
    user_id: Optional[int] = Field(default=None, foreign_key="user.id")

class AnalysisRecordCreate(SQLModel):
    text_content: str
    overall_trust_score: int
    hallucination_risk_level: str
    risk_score: int
    claims_data: List[Dict[str, Any]]
    executive_brief: Dict[str, Any]
    audit_decision: str

class AnalysisRecordRead(SQLModel):
    id: int
    text_content: str
    overall_trust_score: int
    hallucination_risk_level: str
    risk_score: int
    created_at: datetime
    claims_data: List[Dict[str, Any]]
    executive_brief: Dict[str, Any]
    audit_decision: str
    user_id: Optional[int]

class UserCreate(SQLModel):
    email: str
    password: str
    full_name: Optional[str] = None

class UserRead(SQLModel):
    id: int
    email: str
    full_name: Optional[str]
    is_active: bool

class APIKey(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    key_hash: str = Field(index=True)
    name: str
    user_id: int = Field(foreign_key="user.id")
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_used_at: Optional[datetime] = None

class APIKeyCreate(SQLModel):
    name: str

class APIKeyRead(SQLModel):
    id: int
    name: str
    key_prefix: str  # Only return the first few chars, never the full key
    created_at: datetime
    is_active: bool
