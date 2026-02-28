from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session
from app.models.schemas import AnalysisRequest, AnalysisResponse
from app.models.db_models import AnalysisRecord, User
from app.services.nli_engine import NLIEngine
from app.database import get_session
from app.deps import get_current_user

router = APIRouter()

# Initialize Engine (Singleton-ish pattern for module)
nli_engine = NLIEngine()

@router.post("/", response_model=AnalysisResponse)
async def analyze_text(
    request: AnalysisRequest, 
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    try:
        # 1. Perform Analysis
        result = await nli_engine.analyze_text(request.text, question=request.question, session=session, user_id=current_user.id)
        
            # 2. Save to Database
        # Convert Pydantic models to dicts for JSON storage
        claims_data = [claim.dict() for claim in result.claims]
        
        # Determine risk level for compat
        if result.hallucination_score > 60: risk_level = "Critical"
        elif result.hallucination_score > 35: risk_level = "High"
        elif result.hallucination_score > 15: risk_level = "Medium"
        else: risk_level = "Low"

        db_record = AnalysisRecord(
            text_content=request.text,
            overall_trust_score=int(result.integrity_score),
            hallucination_risk_level=risk_level,
            risk_score=int(result.hallucination_score),
            claims_data=claims_data,
            executive_brief=result.executive_brief.dict() if result.executive_brief else {},
            audit_decision=result.executive_brief.action_recommendation if result.executive_brief else "PENDING",
            user_id=current_user.id
        )
        session.add(db_record)
        session.commit()
        session.refresh(db_record)
        
        return result
    except ValueError as ve:
        raise HTTPException(status_code=500, detail=str(ve))
    except Exception as e:
        print(f"Error during analysis: {e}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
