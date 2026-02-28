from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from app.database import get_session
from app.models.db_models import AnalysisRecord, AnalysisRecordRead, User
from app.deps import get_current_user

router = APIRouter()

@router.get("/", response_model=List[AnalysisRecordRead])
def read_history(
    session: Session = Depends(get_session), 
    current_user: User = Depends(get_current_user),
    offset: int = 0, 
    limit: int = 100
):
    analysis_records = session.exec(
        select(AnalysisRecord)
        .where(AnalysisRecord.user_id == current_user.id)
        .order_by(AnalysisRecord.created_at.desc())
        .offset(offset)
        .limit(limit)
    ).all()
    return analysis_records

@router.delete("/{analysis_id}")
def delete_history_item(
    analysis_id: int, 
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    record = session.get(AnalysisRecord, analysis_id)
    if not record:
        raise HTTPException(status_code=404, detail="Analysis record not found")
    if record.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this record")
        
    session.delete(record)
    session.commit()
    return {"ok": True}

@router.get("/stats")
def get_stats(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # Simple analytics: Group by date and calculate average trust score
    records = session.exec(
        select(AnalysisRecord)
        .where(AnalysisRecord.user_id == current_user.id)
        .order_by(AnalysisRecord.created_at)
    ).all()
    
    if not records:
        return {"trend": [], "risk_distribution": [], "average_trust": 0, "total_scans": 0}
        
    total_trust = sum(r.overall_trust_score for r in records)
    avg_trust = total_trust / len(records)
    
    # Process for Chart (Time Series) & Risk Hotspots
    from collections import defaultdict
    daily_scores = defaultdict(list)
    risk_counts = defaultdict(int)
    
    for r in records:
        date_str = r.created_at.strftime("%Y-%m-%d")
        daily_scores[date_str].append(r.overall_trust_score)
        
        # Analyze Claims Data for Risk Hotspots
        if r.claims_data:
            for claim in r.claims_data:
                # Handle dictionary (JSON) structure
                if isinstance(claim, dict):
                    fingerprint = claim.get('fingerprint')
                    if fingerprint and isinstance(fingerprint, dict):
                        f_type = fingerprint.get('type')
                        if f_type and f_type != 'none':
                            risk_counts[f_type] += 1

    trend_data = []
    for date, scores in daily_scores.items():
        trend_data.append({
            "date": date,
            "score": sum(scores) / len(scores),
            "count": len(scores)
        })
        
    return {
        "trend": trend_data,
        "risk_distribution": [{"name": k.replace("_", " ").title(), "value": v} for k, v in risk_counts.items()],
        "average_trust": round(avg_trust, 1),
        "total_scans": len(records)
    }
