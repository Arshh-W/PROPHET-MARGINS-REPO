import requests

# 1. SETUP
url = "http://127.0.0.1:5000/predict"

print("--- TESTING PROPHET MARGINS API ---\n")

# 2. DEFINE THE TEST PAYLOAD
payload = {
    "option": 1,
    "col_map": {
        "date": "DateTime",
        "demand": "Daily_Demand",
        "category": "ProductCategory"
    },
    "data": {
        # This will test if the server can find ds1.pkl
        "dataset": "ds1.pkl", 
        # Change this if 'Electronics' doesn't exist in your file
        "category": "Electronics" 
    }
}

# 3. SEND REQUEST
try:
    response = requests.post(url, json=payload)
    
    if response.status_code == 200:
        data = response.json()
        print("✅ SUCCESS!")
        print(f"Type: {data.get('type')}")
        print(f"Inference: {data.get('inference')}")
        print("\nFirst 3 Predictions:")
        for row in data.get('results', [])[:3]:
            print(row)
    else:
        print(f"❌ ERROR {response.status_code}")
        print("Server Response:", response.text)

except Exception as e:
    print(f"❌ CONNECTION FAILED: {e}")
    print("Make sure 'python app.py' is running in a separate terminal!")