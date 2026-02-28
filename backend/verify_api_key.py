import os
import urllib.request
import json
import sys

# Load env manually to avoid dependency issues
try:
    with open('.env', 'r') as f:
        for line in f:
            if line.startswith('GOOGLE_API_KEY='):
                os.environ['GOOGLE_API_KEY'] = line.strip().split('=', 1)[1]
except Exception as e:
    print(f"Error reading .env: {e}")

api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    print("Error: GOOGLE_API_KEY not found in .env")
    sys.exit(1)

print(f"Testing API Key: {api_key[:5]}...{api_key[-5:]}")

url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"

try:
    with urllib.request.urlopen(url) as response:
        if response.status == 200:
            data = json.loads(response.read().decode())
            print("Successfully connected to Google API!")
            print("Available generation models:")
            found_any = False
            for model in data.get('models', []):
                if 'generateContent' in model.get('supportedGenerationMethods', []):
                    print(f" - {model['name']}")
                    found_any = True
            if not found_any:
                print("No models found with 'generateContent' support.")
        else:
            print(f"Error: API returned status code {response.status}")
            print(response.read().decode())

except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code} {e.reason}")
    print(e.read().decode())
except Exception as e:
    print(f"Connection Error: {e}")
