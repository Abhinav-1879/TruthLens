import asyncio
from app.services.nli_engine import NLIEngine

async def main():
    print("Initializing NLI Engine...")
    nli = NLIEngine()
    print(f"LLM Provider: {nli.llm.__class__.__name__}")
    if hasattr(nli.llm, 'model_name'):
        print(f"Model: {nli.llm.model_name}")
    text = "Python was released in 1991."
    print(f"Analyzing: {text}")
    try:
        response = await nli.analyze_text(text)
        print(f"Trust Score: {response.overall_trust_score}%")
        print(f"Summary: {response.summary_report}")
        for c in response.claims:
            print(f"- {c.atomic_fact}: {c.status} ({c.explanation})")
    except Exception as e:
        print(f"Test Failed: {e}")

if __name__ == "__main__":
    asyncio.run(main())
