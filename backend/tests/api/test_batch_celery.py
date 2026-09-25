import io
import json
import pandas as pd
from app.ml.schema import CANONICAL_FEATURES

def test_batch_celery_processing(client, admin_token, monkeypatch, app):
    app.config['PROPAGATE_EXCEPTIONS'] = True
    import sys
    from unittest.mock import MagicMock
    
    # Mock celery module completely to avoid OS Error [Errno 22] on Windows during test
    mock_celery_app = MagicMock()
    mock_task = MagicMock()
    mock_task.id = "mock-task-123"
    mock_celery_app.process_batch_predictions.delay.return_value = mock_task
    sys.modules['app.core.celery_app'] = mock_celery_app

    # Mock InferenceService to avoid TF initialization issues in test
    from unittest.mock import MagicMock
    mock_engine = MagicMock()
    mock_engine.active_record = {"version_id": "v1"}
    
    # We need predict_batch to return a list of dictionaries for 501 rows
    def mock_predict_batch(df):
        return [
            {
                "transaction_id": None, # In batch, typically generated if not provided
                "probability": 0.1,
                "is_high_risk": False,
                "suggested_action": "approve",
                "risk_level": "low"
            } for _ in range(len(df))
        ]
        
    mock_engine.predict_batch.side_effect = mock_predict_batch
    monkeypatch.setattr('app.api.v1.predict.get_inference_service', lambda: mock_engine)

    # Generate a CSV with > 500 rows to trigger async path (MAX_ROWS_SYNC = 500)
    rows = 501
    
    # Create dummy data matching CANONICAL_FEATURES
    data = {}
    for feature in CANONICAL_FEATURES:
        data[feature] = [0.0] * rows
    
    df = pd.DataFrame(data)
    
    # Write DataFrame to a string buffer
    csv_buffer = io.StringIO()
    df.to_csv(csv_buffer, index=False)
    csv_content = csv_buffer.getvalue()
    
    # Prepare the multipart/form-data payload
    data = {
        'file': (io.BytesIO(csv_content.encode('utf-8')), 'test_batch.csv')
    }

    # POST to /batch endpoint
    response = client.post(
        '/api/v1/predict/batch',
        data=data,
        content_type='multipart/form-data',
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    
    # Since CELERY={"task_always_eager": True} is set in TestingConfig,
    # the task runs synchronously and completes before the response is returned.
    # However, the endpoint still returns 202 Accepted with a task_id
    if response.status_code != 202:
        print("500 ERROR IN BATCH:", response.data)
    assert response.status_code == 202
    resp_data = json.loads(response.data)
    assert resp_data["success"] is True
    assert "task_id" in resp_data["data"]
    
    task_id = resp_data["data"]["task_id"]
    
    # Verify the task status via the status endpoint
    mock_async_result = MagicMock()
    mock_async_result.state = 'SUCCESS'
    mock_async_result.result = {"row_count": rows}
    
    mock_async_result_class = MagicMock(return_value=mock_async_result)
    import celery.result
    monkeypatch.setattr(celery.result, 'AsyncResult', mock_async_result_class)
    
    status_resp = client.get(
        f'/api/v1/predict/batch/task/{task_id}',
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert status_resp.status_code == 200
    status_data = json.loads(status_resp.data)
    assert status_data["success"] is True
    assert status_data["data"]["state"] == "SUCCESS"
    assert status_data["data"]["result"]["row_count"] == rows
