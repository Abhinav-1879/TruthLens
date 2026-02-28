from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from datetime import datetime

from app.database import get_session
from app.models.db_models import User, APIKey, APIKeyCreate, APIKeyRead
from app.deps import get_current_user
from app.core import security

router = APIRouter()

@router.post("/", response_model=dict)
def create_api_key(
    key_in: APIKeyCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new API key. Returns the full key only once.
    """
    raw_key = security.generate_api_key()
    key_hash = security.get_api_key_hash(raw_key)
    
    db_key = APIKey(
        key_hash=key_hash,
        name=key_in.name,
        user_id=current_user.id
    )
    session.add(db_key)
    session.commit()
    session.refresh(db_key)
    
    return {
        "id": db_key.id,
        "name": db_key.name,
        "key": raw_key, # Show full key
        "created_at": db_key.created_at
    }

@router.get("/", response_model=List[APIKeyRead])
def list_api_keys(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    keys = session.exec(
        select(APIKey)
        .where(APIKey.user_id == current_user.id)
        .where(APIKey.is_active == True)
        .order_by(APIKey.created_at.desc())
    ).all()
    
    # Transform to Read model (masking handled by logic or model, here manually)
    return [
        APIKeyRead(
            id=k.id,
            name=k.name,
            key_prefix="tl_live_...", # Static prefix for now, or store prefix in DB
            created_at=k.created_at,
            is_active=k.is_active
        ) for k in keys
    ]

@router.delete("/{key_id}")
def revoke_api_key(
    key_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    key = session.get(APIKey, key_id)
    if not key or key.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="API Key not found")
        
    session.delete(key) # Hard delete for now, or set is_active=False
    session.commit()
    return {"ok": True}
