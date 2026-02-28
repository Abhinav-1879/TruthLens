import asyncio
from app.services.nli_engine import NLIEngine

async def main():
    nli = NLIEngine()
    text = "Correct Mental Model (THIS IS KEY) Not every unverifiable statement is a hallucination. Type Example Trust Verifiable fact 'Python was released in 1991' High"
    
    print(f"Analyzing text: {text[:50]}...")
    try:
        response = await nli.analyze_text(text)
        print(f"\nOverall Trust Score: {response.overall_trust_score}%")
        print(f"Summary: {response.summary_report}")
        print("\nClaims:")
        for claim in response.claims:
            print(f"- Claim: {claim.atomic_fact}")
            print(f"  Status: {claim.status}")
            print(f"  Confidence: {claim.confidence_score}")
            print(f"  Evidence: {len(claim.evidence)} items")
    except Exception as e:
        print(f"Analysis failed: {e}")

if __name__ == "__main__":
    asyncio.run(main())
