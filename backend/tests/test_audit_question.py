import asyncio
from app.services.nli_engine import NLIEngine
from app.models.schemas import ClaimType

async def test_audit_question():
    engine = NLIEngine()
    text = "The new drug variant X-99 was approved by the FDA yesterday."
    question = "Is this drug actually approved?"
    
    print(f"Analyzing with Question: '{question}'")
    try:
        result = await engine.analyze_text(text, question=question)
        print("\n--- Success ---")
        print(f"Risk Score: {result.risk_score}")
        print(f"Question Echoed: {result.question}")
        print(f"Claims Found: {len(result.claims)}")
        for c in result.claims:
            print(f"- {c.atomic_fact} ({c.status})")
    except Exception as e:
        print(f"Failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_audit_question())
