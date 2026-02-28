from duckduckgo_search import DDGS
import json

def test_search():
    ddgs = DDGS()
    query = "Python programming language"
    
    backends = ["api", "html", "lite", None]
    
    for backend in backends:
        print(f"--- Testing backend: {backend} ---")
        try:
            if backend:
                results = ddgs.text(query, region="wt-wt", max_results=3, backend=backend)
            else:
                results = ddgs.text(query, region="wt-wt", max_results=3)
            
            # consumed generator
            results_list = list(results) if results else []
            
            print(f"Success! Found {len(results_list)} results.")
            if results_list:
                print(f"Sample: {results_list[0].get('body', '')[:50]}...")
        except Exception as e:
            print(f"Failed: {e}")

if __name__ == "__main__":
    test_search()
