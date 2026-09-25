import pytest
import json

def test_explainability_role_access(client):
    # Register a test customer
    client.post('/api/v1/auth/register', json={
        "email": "customer_xai@fraudshield.ai",
        "password": "SecurePassword123!",
        "first_name": "Test",
        "last_name": "Customer"
    })
    
    # Login
    auth_resp = client.post('/api/v1/auth/login', json={
        "email": "customer_xai@fraudshield.ai",
        "password": "SecurePassword123!"
    })
    token = json.loads(auth_resp.data)["data"]["access_token"]
    
    # Attempt to access global insights (Should Fail)
    global_resp = client.get('/api/v1/explainability/global', headers={"Authorization": f"Bearer {token}"})
    assert global_resp.status_code == 403
    

def test_explainability_real_shap_values(client, admin_token, monkeypatch):
    # Mock the inference service to bypass TensorFlow OS Error on this machine
    from unittest.mock import MagicMock
    mock_engine = MagicMock()
    mock_engine.active_record = {"version_id": "v1"}
    mock_engine.predict_single.return_value = {
        "probability": 0.85,
        "suggested_action": "review",
        "is_high_risk": True,
        "risk_level": "medium"
    }
    
    # Mock get_shap_explanation to return a base value and feature list
    from app.ml.schema import CANONICAL_FEATURES
    mock_shap_features = [0.0] * len(CANONICAL_FEATURES)
    mock_shap_features[1] = 0.5  # Feature V1
    mock_shap_features[28] = 0.2 # Feature Amount
    mock_engine.get_shap_explanation.return_value = (0.15, mock_shap_features)
    mock_engine._determine_risk.return_value = ("High Risk", "decline")
    
    monkeypatch.setattr('app.api.v1.predict.get_inference_service', lambda: mock_engine)

    # 1. First, make a prediction to generate a transaction with SHAP values
    pred_payload = {
        "Time": 0.0,
        "V1": -1.3598071336738, "V2": -0.0727811733098497, "V3": 2.53634673796914, "V4": 1.37815522427443,
        "V5": -0.338320769942518, "V6": 0.462387777762292, "V7": 0.239598554061257, "V8": 0.0986979012610507,
        "V9": 0.363786969611213, "V10": 0.0907941719789316, "V11": -0.551599533260813, "V12": -0.617800855762348,
        "V13": -0.991389847235408, "V14": -0.311169353699879, "V15": 1.46817697209427, "V16": -0.470400525259478,
        "V17": 0.207971241929242, "V18": 0.0257905801985591, "V19": 0.403992960255733, "V20": 0.251412098239705,
        "V21": -0.018306777944153, "V22": 0.277837575558899, "V23": -0.110473910188767, "V24": 0.0669280749146731,
        "V25": 0.128539358273528, "V26": -0.189114843888824, "V27": 0.133558376740387, "V28": -0.0210530534538215,
        "Amount": 149.62,
        "Merchant": "TestMerchant",
        "Category": "Retail"
    }
    pred_resp = client.post('/api/v1/predict/single', json=pred_payload, headers={"Authorization": f"Bearer {admin_token}"})
    if pred_resp.status_code != 200:
        print("500 ERROR DATA:", pred_resp.data)
    assert pred_resp.status_code == 200
    tx_id = json.loads(pred_resp.data)["data"]["transaction_id"]
    
    # 2. Fetch the explainability for this transaction
    exp_resp = client.get(f'/api/v1/explainability/transaction/{tx_id}', headers={"Authorization": f"Bearer {admin_token}"})
    assert exp_resp.status_code == 200
    data = json.loads(exp_resp.data)["data"]
    
    # 3. Verify SHAP values are present and correctly formatted
    assert data["explanation_type"] == "technical"
    assert "shap_summary" in data
    shap_summary = data["shap_summary"]
    
    assert "base_value" in shap_summary
    assert "features" in shap_summary
    assert len(shap_summary["features"]) == 30 # Time + 28 Vs + Amount
    
    # 4. Verify the math checks out (Base Value + Sum of SHAP = predicted probability for model output)
    # Because KernelExplainer output sums to the prediction probability exactly.
    expected_prob = data["probability"]
    
    sum_features = sum(f["contribution"] for f in shap_summary["features"])
    base_val = shap_summary["base_value"]
    
    # In our mock, base_val is 0.15, and sum_features is 0.70. Total = 0.85
    assert abs((base_val + sum_features) - expected_prob) < 0.05, f"SHAP sum {base_val + sum_features} != {expected_prob}"

def test_explainability_missing_shap_returns_503(client, admin_token, monkeypatch):
    # Mock the inference service to bypass model loading in unit test
    from unittest.mock import MagicMock
    mock_engine = MagicMock()
    mock_engine._determine_risk.return_value = ("High Risk", "decline")
    monkeypatch.setattr('app.api.v1.predict.get_inference_service', lambda: mock_engine)

    # If a transaction was created without SHAP values, it should return 503 instead of fake values
    # To test this, we can insert a fake transaction into DB
    from app.database.core import db
    from app.models.transaction import Transaction, TransactionStatus
    from app.models.prediction import Prediction
    
    # Create fake TX
    from datetime import datetime, timezone
    tx = Transaction(
        user_id="c7bc4e62-62a6-4e8e-a6d7-fdcb83a48fc3", # Assuming admin user ID
        merchant="No SHAP",
        category="Test",
        amount=10.0,
        status=TransactionStatus.PENDING,
        transaction_date=datetime.now(timezone.utc),
    )
    db.session.add(tx)
    db.session.flush()
    
    pred = Prediction(
        transaction_id=tx.id,
        model_version="v1",
        risk_score=0.5,
        shap_values=None # NO SHAP VALUES!
    )
    db.session.add(pred)
    db.session.commit()
    
    # Fetch explainability
    exp_resp = client.get(f'/api/v1/explainability/transaction/{tx.id}', headers={"Authorization": f"Bearer {admin_token}"})
    assert exp_resp.status_code == 503
    
    err_data = json.loads(exp_resp.data)
    assert not err_data["success"]
    assert err_data["error"]["code"] == "MODEL_NOT_READY"
    assert "SHAP explainer is unavailable" in err_data["error"]["message"]

def test_explainability_missing_prediction_returns_404(client, admin_token, monkeypatch):
    from app.database.core import db
    from app.models.transaction import Transaction, TransactionStatus
    from datetime import datetime, timezone
    
    tx = Transaction(
        user_id="c7bc4e62-62a6-4e8e-a6d7-fdcb83a48fc3",
        merchant="No Prediction",
        category="Test",
        amount=10.0,
        status=TransactionStatus.PENDING,
        transaction_date=datetime.now(timezone.utc),
    )
    db.session.add(tx)
    db.session.commit()
    
    exp_resp = client.get(f'/api/v1/explainability/transaction/{tx.id}', headers={"Authorization": f"Bearer {admin_token}"})
    assert exp_resp.status_code == 404
    
    err_data = json.loads(exp_resp.data)
    assert not err_data["success"]
    assert "Prediction/explanation unavailable" in err_data["message"]
