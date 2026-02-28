import os
import sys
from dotenv import load_dotenv
import urllib.request
import json

# Force reload of .env
load_dotenv(override=True)

def test_google_key(key):
    print(f"\n--- Testing Google API Key ({key[:5]}...) ---")
    url = f"https://generativelanguage.googleapis.com/v1beta/models?key={key}"
    try:
        with urllib.request.urlopen(url) as response:
            if response.status == 200:
                print("[PASS] Google API Key is VALID.")
                return True
    except Exception as e:
        print(f"[FAIL] Google API Key Failed: {e}")
        return False

def test_openai_key(key):
    base_url = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
    print(f"\n--- Testing OpenAI/OpenRouter Key ({key[:5]}...) ---")
    print(f"Target: {base_url}")
    
    url = f"{base_url}/models"
    # OpenRouter requires specific headers sometimes, but usually Authorization is enough
    headers = {
        "Authorization": f"Bearer {key}",
        "HTTP-Referer": "http://localhost:8000", # Optional for OpenRouter
        "X-Title": "TruthLens Local" # Optional for OpenRouter
    }
    
    # Handle basic URL parsing to ensure we don't double slash
    if not url.startswith('http'):
         print(f"❌ Invalid Base URL: {base_url}")
         return False

    req = urllib.request.Request(url, headers=headers)
    req.add_header('User-Agent', 'TruthLens-Verifier/1.0')

    try:
        with urllib.request.urlopen(req) as response:
            if response.status == 200:
                print("[PASS] Key is VALID.")
                data = json.loads(response.read().decode())
                # print(f"Available models: {len(data['data'])}") 
                return True
    except urllib.error.HTTPError as e:
        print(f"[FAIL] Key Failed: HTTP {e.code} - {e.reason}")
        try:
            err_body = e.read().decode()
            print(f"Response: {err_body}")
        except:
            pass
        return False
    except Exception as e:
        print(f"[FAIL] Key Failed: {e}")
        return False

def test_groq_key(key):
    print(f"\n--- Testing Groq API Key ({key[:5]}...) ---")
    url = "https://api.groq.com/openai/v1/models"
    headers = {"Authorization": f"Bearer {key}"}
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            if response.status == 200:
                print("[PASS] Groq API Key is VALID.")
                return True
    except Exception as e:
        print(f"[FAIL] Groq API Key Failed: {e}")
        return False

def main():
    print("Checking for API Keys in environment...")
    
    google_key = os.getenv("GOOGLE_API_KEY")
    openai_key = os.getenv("OPENAI_API_KEY")
    groq_key = os.getenv("GROQ_API_KEY")
    
    keys_found = 0
    
    if google_key:
        test_google_key(google_key)
        keys_found += 1
    
    if openai_key:
        test_openai_key(openai_key)
        keys_found += 1
        
    if groq_key:
        test_groq_key(groq_key)
        keys_found += 1
        
    if keys_found == 0:
        print("⚠️ No API Keys (Google, OpenAI, Groq) found in environment.")

if __name__ == "__main__":
    main()
