import asyncio
from app.services.search_tool import SearchService

async def main():
    search_service = SearchService()
    query = "Python programming language"
    print(f"Searching for: {query}")
    
    # Test the main method which now implements the fallback logic
    results = await search_service.get_evidence(query)
    
    print(f"Results found: {len(results)}")
    for res in results:
        print(f"- {res[:100]}...")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except Exception as e:
        print(f"An error occurred: {e}")
