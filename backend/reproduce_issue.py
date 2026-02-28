from duckduckgo_search import DDGS
import asyncio

async def test_specific_query():
    query = "Modern AI systems often make factually incorrect or unverifiable claims."
    ddgs = DDGS()
    
    for backend in ["html", "lite"]:
        print(f"Testing backend: {backend}")
        try:
            results = ddgs.text(query, region="wt-wt", max_results=3, backend=backend)
            results_list = list(results)
            print(f"Backend {backend} found {len(results_list)} results.")
            for r in results_list:
                print(f"- {r.get('body')[:100]}...")
        except Exception as e:
            print(f"Backend {backend} failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_specific_query())
