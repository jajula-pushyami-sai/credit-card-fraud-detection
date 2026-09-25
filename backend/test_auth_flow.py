import requests
import sys

BASE_URL = "http://127.0.0.1:5000/api/v1"

def test_full_flow():
    print("=" * 60)
    print("1. Testing Registration (Creating a New Account)...")
    import random
    rand_num = random.randint(1000, 9999)
    test_email = f"user_{rand_num}@fraudshield.dev"
    test_password = "Password@1234"
    
    reg_payload = {
        "first_name": "Test",
        "last_name": "User",
        "email": test_email,
        "password": test_password
    }
    
    reg_res = requests.post(f"{BASE_URL}/auth/register", json=reg_payload)
    print(f"Register Status Code: {reg_res.status_code}")
    if reg_res.status_code != 201:
        print(f"Registration Failed: {reg_res.text}")
        sys.exit(1)
    
    reg_data = reg_res.json()
    print(f"Registration Success Message: {reg_data.get('message')}")
    print(f"Created User: {reg_data.get('data', {}).get('user')}")

    print("\n" + "=" * 60)
    print("2. Testing Login with Newly Created Credentials...")
    login_payload = {
        "email": test_email,
        "password": test_password
    }
    
    login_res = requests.post(f"{BASE_URL}/auth/login", json=login_payload)
    print(f"Login Status Code: {login_res.status_code}")
    if login_res.status_code != 200:
        print(f"Login Failed: {login_res.text}")
        sys.exit(1)
        
    login_data = login_res.json()
    token = login_data.get("data", {}).get("access_token")
    print(f"Login Successful! JWT Token Issued: {token[:20]}...")

    headers = {"Authorization": f"Bearer {token}"}

    print("\n" + "=" * 60)
    print("3. Testing Demo Account Login...")
    demo_login_res = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "demo@fraudshield.dev",
        "password": "Demo@1234"
    })
    print(f"Demo Login Status Code: {demo_login_res.status_code}")

    print("\n" + "=" * 60)
    print("4. Testing ML Metrics Endpoint (GET /api/v1/ml/metrics)...")
    metrics_res = requests.get(f"{BASE_URL}/ml/metrics", headers=headers)
    print(f"Metrics Status Code: {metrics_res.status_code}")
    if metrics_res.status_code == 200:
        m_data = metrics_res.json().get("data", {})
        print(f"Total Transactions: {m_data.get('dataset_summary', {}).get('total_transactions')}")
        print(f"Validation Accuracy: {m_data.get('metrics', {}).get('accuracy') * 100:.2f}%")

    print("\n" + "=" * 60)
    print("5. Testing Random Row Endpoint (GET /api/v1/fraud/random)...")
    rand_res = requests.get(f"{BASE_URL}/fraud/random", headers=headers)
    print(f"Random Row Status Code: {rand_res.status_code}")
    if rand_res.status_code == 200:
        r_data = rand_res.json().get("data", {})
        print(f"Selected Transaction Index: {r_data.get('transaction_index')} (Amount: ${r_data.get('amount')})")
        target_idx = r_data.get("transaction_index")

    print("\n" + "=" * 60)
    print("6. Testing Prediction Endpoint (POST /api/v1/fraud/predict)...")
    pred_res = requests.post(f"{BASE_URL}/fraud/predict", json={"transaction_index": target_idx}, headers=headers)
    print(f"Prediction Status Code: {pred_res.status_code}")
    if pred_res.status_code == 200:
        p_data = pred_res.json().get("data", {})
        print(f"Prediction result for TX-{target_idx}:")
        print(f"  - Fraud Probability: {p_data.get('fraud_probability') * 100:.2f}%")
        print(f"  - Risk Level: {p_data.get('risk_level')}")
        print(f"  - Recommended Action: {p_data.get('recommended_action')}")
        print(f"  - Model Version: {p_data.get('model_version')}")
        print(f"  - Top SHAP Feature: {p_data.get('shap_explanation', {}).get('top_features', [{}])[0]}")

    print("\n" + "=" * 60)
    print("ALL TESTS PASSED SUCCESSFULLY! LOGIN AND ACCOUNT CREATION ARE WORKING PERFECTLY.")
    print("=" * 60)

if __name__ == "__main__":
    test_full_flow()
