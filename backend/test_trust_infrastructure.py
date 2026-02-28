import asyncio
from app.services.nli_engine import NLIEngine

async def test_trust_infrastructure():
    print("Initializing TruthLens Trust Infrastructure...")
    engine = NLIEngine()
    
    # Test text with mixed truth and obvious hallucination
    # Known hallucination: Elon Musk buying Twitter in 2015 (False, it was 2022)
    text = "Elon Musk acquired Twitter in 2015 for $44 billion. The deal was finalized in San Francisco."
    
    print(f"\nAnalyzing Text: \"{text}\"")
    
    try:
        result = await engine.analyze_text(text)
        
        print("\n=== EXECUTIVE BRIEF ===")
        if result.executive_brief:
            print(f"Verdict: {result.executive_brief.action_recommendation}")
            print(f"Headline: {result.executive_brief.headline_risk_assessment}")
            print(f"Impact: {result.executive_brief.business_impact}")
        else:
            print("No Executive Brief generated.")
        
        print("\n=== HALLUCINATION FINGERPRINTS ===")
        found_fingerprint = False
        for c in result.claims:
            print(f"\nClaim: {c.atomic_fact}")
            print(f"Status: {c.status}")
            print(f"Explanation: {c.explanation}")
            if c.fingerprint:
                found_fingerprint = True
                print(f"Fingerprint: {c.fingerprint.type.upper()} ({c.fingerprint.impact_level} impact)")
                print(f"   Description: {c.fingerprint.description}")
            else:
                print("   Fingerprint: None")

        if found_fingerprint:
            print("\nSUCCESS: Hallucination Fingerprinting System is Active.")
        else:
            print("\nABNORMAL: No fingerprints found for a hallucinated text.")

    except Exception as e:
        print(f"\nFATAL ERROR: {str(e)}")
        import traceback
        traceback.print_exc()

    # --- DB Verification Step ---
    print("\n=== DATABASE PERSISTENCE CHECK ===")
    from sqlmodel import Session, select
    from app.database import engine as db_engine
    from app.models.db_models import AnalysisRecord

    try:
        with Session(db_engine) as session:
            statement = select(AnalysisRecord).order_by(AnalysisRecord.id.desc()).limit(1)
            record = session.exec(statement).first()
            
            if record:
                print(f"Latest Record ID: {record.id}")
                print(f"Stored Audit Decision: {record.audit_decision}")
                print(f"Stored Risk Score: {record.risk_score}")
                
                if record.executive_brief:
                    print("✅ Executive Brief is present in DB.")
                else:
                    print("❌ Executive Brief MINING in DB.")
                    
                if record.audit_decision != "PENDING":
                    print("✅ Audit Decision is persisted.")
                else:
                    print("⚠️ Audit Decision is PENDING (might be default).")
            else:
                print("❌ No records found in DB.")
    except Exception as e:
        print(f"❌ DB Check Failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_trust_infrastructure())
