from flask import Blueprint, request, current_app
from flask_jwt_extended import jwt_required, get_current_user
from app.core.responses import success_response
from app.core.exceptions import AppError, ModelNotReadyError
from app.database.core import db
from app.models.transaction import Transaction, TransactionStatus
from app.models.prediction import Prediction
from app.models.audit import AuditLog
from app.models.misc import Notification
from app.ml.inference.predict import InferenceService

predict_bp = Blueprint("predict", __name__)
inference_service = None


def get_inference_service():
    """Return the cached InferenceService, or create one.

    Raises ModelNotReadyError if model artifacts are missing, corrupt,
    or incompatible — the Flask error handler will return HTTP 503.
    """
    global inference_service
    if inference_service is None:
        # ModelNotReadyError propagates directly to the caller / error handler.
        inference_service = InferenceService(
            config_path=None,  # Uses default absolute path derived from __file__
        )
    return inference_service


@predict_bp.route("/single", methods=["POST"])
@jwt_required()
def predict_single():
    data = request.get_json(silent=True) or {}
    user = get_current_user()

    # 1. Extract ML features
    from app.ml.schema import CANONICAL_FEATURES
    feature_dict = {k: v for k, v in data.items() if k in CANONICAL_FEATURES}

    # 2. Run ML Inference
    engine = get_inference_service()
    result = engine.predict_single(feature_dict)

    # 2. Determine initial transaction status based on ML Risk action
    status_mapping = {
        "approve": TransactionStatus.APPROVED,
        "flag": TransactionStatus.FLAGGED,
        "decline": TransactionStatus.DECLINED,
    }
    tx_status = status_mapping.get(
        result["suggested_action"], TransactionStatus.PENDING
    )

    # 3. Create Transaction Record
    from datetime import datetime, timezone
    tx = Transaction(
        user_id=user.id,
        merchant=data.get("Merchant", "Unknown"),
        category=data.get("Category", "General"),
        amount=data.get("Amount", 0.0),
        status=tx_status,
        transaction_date=datetime.now(timezone.utc),
    )
    db.session.add(tx)
    db.session.flush()  # To get tx.id

    # 4. Create Prediction Record
    # Compute real SHAP values for storage
    shap_values_dict = {}
    try:
        base_value, shap_features = engine.get_shap_explanation(data)
        from app.ml.schema import CANONICAL_FEATURES
        shap_values_dict = {
            "base_value": base_value,
            "features": {CANONICAL_FEATURES[i]: float(shap_features[i]) for i in range(len(CANONICAL_FEATURES))}
        }
    except Exception as e:
        current_app.logger.warning(f"Failed to compute SHAP values at inference time: {e}")

    pred = Prediction(
        transaction_id=tx.id,
        model_version=engine.active_record["version_id"],
        risk_score=result["probability"],
        shap_values=shap_values_dict if shap_values_dict else None,
    )
    db.session.add(pred)

    # 5. Create Audit Log & Notifications
    audit = AuditLog(
        user_id=user.id,
        action="AI_PREDICTION_GENERATED",
        entity_type="Transaction",
        entity_id=tx.id,
        details={
            "risk_level": result["risk_level"],
            "action": result["suggested_action"],
        },
    )
    db.session.add(audit)

    if result["suggested_action"] != "approve":
        note = Notification(
            user_id=user.id,
            title=f"Transaction {result['risk_level']}",
            message=f"Your transaction at {tx.merchant} requires attention.",
            type="alert",
        )
        db.session.add(note)

    db.session.commit()

    return success_response(
        data={"transaction_id": tx.id, "risk_assessment": result},
        message="Prediction completed successfully.",
    )


@predict_bp.route("/batch", methods=["POST"])
@jwt_required()
def predict_batch():
    import os
    import uuid
    from werkzeug.utils import secure_filename
    from app.core.celery_app import process_batch_predictions
    
    MAX_FILE_BYTES = 50 * 1024 * 1024  # Increased to 50 MB for async processing
    MAX_ROWS_SYNC = 500
    MAX_ROWS_ASYNC = 100_000

    if "file" not in request.files:
        raise AppError("No file provided", 400)

    file = request.files["file"]

    file.seek(0, 2)
    file_size = file.tell()
    file.seek(0)
    if file_size > MAX_FILE_BYTES:
        raise AppError(f"File too large ({file_size // (1024 * 1024)} MB). Maximum allowed is 50 MB.", 413)

    try:
        import pandas as pd
    except ImportError as e:
        current_app.logger.error(f"Batch prediction unavailable: {e}")
        raise AppError("Batch prediction requires pandas. Please install it on the server.", 503)

    df = pd.read_csv(file)
    row_count = len(df)

    if row_count > MAX_ROWS_ASYNC:
        raise AppError(f"Too many rows ({row_count:,}). Maximum allowed is {MAX_ROWS_ASYNC:,}.", 413)

    if row_count <= MAX_ROWS_SYNC:
        # Synchronous vectorized processing for small batches
        engine = get_inference_service()
        results = engine.predict_batch(df)
        return success_response(
            data={"batch_results": results, "row_count": len(results)},
            message=f"Batch processed: {len(results)} transactions.",
        )
    else:
        # Asynchronous processing for large batches
        batch_dir = current_app.config.get("BATCH_DATA_DIR", "/app/batch_data")
        os.makedirs(batch_dir, exist_ok=True)
        
        # Use secure_filename just in case, though we generate the uuid ourselves
        safe_filename = secure_filename(f"batch_{uuid.uuid4().hex}.csv")
        temp_path = os.path.join(batch_dir, safe_filename)
        
        df.to_csv(temp_path, index=False)
        task = process_batch_predictions.delay(temp_path)
        
        return success_response(
            data={"task_id": task.id, "row_count": row_count},
            message=f"Batch accepted for background processing. Poll /batch/task/{task.id} for status.",
            status_code=202
        )


@predict_bp.route("/batch/task/<task_id>", methods=["GET"])
@jwt_required()
def get_batch_task_status(task_id):
    from celery.result import AsyncResult
    from flask import jsonify
    
    task_result = AsyncResult(task_id)
    
    if task_result.state == 'PENDING':
        return success_response(data={"state": task_result.state, "status": "Task is waiting to be processed or is currently running..."})
    elif task_result.state == 'SUCCESS':
        return success_response(data={"state": task_result.state, "result": task_result.result})
    elif task_result.state == 'FAILURE':
        return success_response(data={"state": task_result.state, "error": str(task_result.info)}, status=500)
    else:
        return success_response(data={"state": task_result.state, "status": str(task_result.info)})
