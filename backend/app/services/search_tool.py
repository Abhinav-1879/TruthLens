from duckduckgo_search import DDGS
import asyncio

class SearchService:
    def __init__(self):
        pass

    async def get_evidence(self, query: str) -> list[str]:
        """
        Searches the web for evidence related to the query.
        Returns a list of snippets.
        """
        try:
            # Running synchronous tool in async loop
            results = await asyncio.to_thread(self._search, query)
            return results
        except Exception as e:
            print(f"Search failed for query '{query}': {e}")
            return []

    def _search(self, query: str) -> list[str]:
        # Use DDGS as context manager for fresh sessions
        for backend in ["html", "lite"]:
            try:
                with DDGS() as ddgs:
                    # backend='html' and 'lite' are often more lenient with rate limits
                    # than the default api backend.
                    results = ddgs.text(query, region="wt-wt", max_results=3, backend=backend)
                    
                    snippets = []
                    if results:
                        for res in results:
                            # DDG results are generators, convert to list or iterate
                            body = res.get('body', '') or res.get('snippet', '')
                            if body:
                                snippets.append(body)
                    
                    if snippets:
                        print(f"Successfully found {len(snippets)} snippets using backend '{backend}'")
                        return snippets
            except Exception as e:
                print(f"Search backend '{backend}' failed for query '{query}': {e}")
                continue
        
        return []
