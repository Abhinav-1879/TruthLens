import asyncio
import json
from app.services.nli_engine import NLIEngine

async def verify_json_output():
    engine = NLIEngine()
    # The input text that was causing the issue
    text = "A 67.4% success rate was reported across three continents and two lunar research facilities."
    
    print(f"Analyzing text: {text}")
    print("Running analysis with FORCED NO EVIDENCE to verify logic fix...")

    # Mocking search to return empty list to simulate "No Search Results"
    original_search = engine.search_service.get_evidence
    engine.search_service.get_evidence = lambda q: asyncio.sleep(0.1) or [] # Returns awaitable []
    
    # We need to wrap the lambda to be awaitable since get_evidence is async
    async def mock_search(q): return []
    engine.search_service.get_evidence = mock_search
    
    try:
        result = await engine.analyze_text(text)
        
        # Convert Pydantic model to dict/json for inspection
        json_output = result.model_dump()
        
        print("\n--- RAW JSON RESPONSE (SIMULATED) ---")
        print(json.dumps(json_output, indent=2))
        
        # Explicit checks for the user's points
        print("\n--- DIAGNOSTIC CHECK ---")
        
        # 1. Check The "Zero" Paradox
        if result.overall_trust_score < 10 and result.risk_score < 10:
            print("[FAIL] The 'Zero' Paradox exists: Low Integrity AND Low Risk.")
        elif result.overall_trust_score < 10 and result.risk_score > 50:
             print("[PASS] The 'Zero' Paradox RESOLVED: Low Integrity correctly paired with HIGH Risk.")
        else:
            print(f"[INFO] Scores: Integrity={result.overall_trust_score}, Risk={result.risk_score}")

        # 2. Check "No Evidence" Handling
        unverified_claims = [c for c in result.claims if c.status == "unverified"]
        if unverified_claims:
            claim = unverified_claims[0]
            if claim.assertiveness_score > 0.7:
                 print(f"[PASS] Assertiveness detected ({claim.assertiveness_score}). Claim is linguistically confident.")
            else:
                 print(f"[FAIL] Assertiveness NOT detected ({claim.assertiveness_score}).")
                 
            if "lunar research facilities" in claim.atomic_fact or "67.4%" in claim.atomic_fact:
                print("[PASS] Atomic fact extracted correctly.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(verify_json_output())
