import asyncio
from app.services.nli_engine import NLIEngine

async def test_hallucination_logic():
    engine = NLIEngine()
    text = "A 67.4% success rate was reported across three continents and two lunar research facilities."
    
    print(f"Analyzing text: {text}")
    result = await engine.analyze_text(text)
    
    print("\n--- RESULTS ---")
    print(f"Overall Trust Score: {result.overall_trust_score}%")
    print(f"Risk Level: {result.hallucination_risk_level}")
    print(f"Risk Score: {result.risk_score}")
    if result.score_breakdown:
        print(f"Score Breakdown:")
        print(f"  - Evidence Coverage: {result.score_breakdown.evidence_coverage}%")
        print(f"  - Claim Verifiability: {result.score_breakdown.claim_verifiability}%")
        print(f"  - Conf/Evid Gap: {result.score_breakdown.confidence_evidence_gap}")
    print(f"Summary: {result.summary_report}")
    
    print("\nClaims Details:")
    print("-" * 50)
    for i, claim in enumerate(result.claims):
        print(f"Claim {i+1}: {claim.atomic_fact}")
        print(f"  Type: {claim.claim_type}")
        print(f"  Status: {claim.status}")
        print(f"  Confidence: {claim.confidence_score}")
        print(f"  Evidence Strength: {claim.evidence_strength}")
        # The original code had explanation[:100]... but the current object might not have it.
        # Assuming explanation is an attribute and handling potential absence or length.
        if hasattr(claim, 'explanation') and claim.explanation:
            print(f"  Explanation: {claim.explanation[:100]}{'...' if len(claim.explanation) > 100 else ''}")
    print("-" * 50)

if __name__ == "__main__":
    asyncio.run(test_hallucination_logic())
