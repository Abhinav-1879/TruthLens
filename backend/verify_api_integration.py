import requests
import json
import time

def verify_api():
    url = "http://localhost:8000/api/v1/analyze/"
    
    payload = {
        "text": "The Eiffel Tower was constructed in 1889 in Berlin, Germany." # Mixed truth (date) and halluncination (location)
    }
    
    print(f"Sending request to {url}...")
    try:
        start_time = time.time()
        response = requests.post(url, json=payload)
        duration = time.time() - start_time
        
        if response.status_code == 200:
            data = response.json()
            print(f"Success! Response received in {duration:.2f}s")
            
            print("\n--- RESPONSE DATA ---")
            print(f"Risk Level: {data.get('hallucination_risk_level')}")
            print(f"Risk Score: {data.get('risk_score')}")
            
            # Check for Executive Brief
            brief = data.get('executive_brief')
            if brief:
                print(f"Executive Brief received: {brief.get('headline_risk_assessment')}")
                print(f"   Verdict: {brief.get('action_recommendation')}")
            else:
                print("Executive Brief missing from response.")
                
            # Check for Claims
            claims = data.get('claims', [])
            print(f"\n--- CLAIMS ({len(claims)}) ---")
            for c in claims:
                print(f"- {c.get('atomic_fact')} [{c.get('status')}]")
                fingerprint = c.get('fingerprint')
                if fingerprint:
                    print(f"  Fingerprint: {fingerprint.get('type')} ({fingerprint.get('impact_level')})")
            
        else:
            print(f"Failed with status {response.status_code}")
            print(response.text)
            
    except requests.exceptions.ConnectionError:
        print("Could not connect to localhost:8000. Is the backend running?")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    verify_api()
