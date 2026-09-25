import pandas as pd
import hashlib
import numpy as np
from app.ml.inference.predict import InferenceService
from app.ml.schema import CANONICAL_FEATURES

df = pd.read_csv('app/ml/data/raw/creditcard.csv')
service = InferenceService()

indices = [541, 10492, 88307, 150000, 280000]

print("=" * 100)
print(f"{'Idx':<7} | {'Amount':<10} | {'Feature Fingerprint':<20} | {'ET Prob':<8} | {'MLP Prob':<8} | {'Meta Prob':<10} | {'Calib Prob':<10} | {'Risk Level':<15} | {'Action':<10}")
print("=" * 100)

for idx in indices:
    row = df.iloc[idx]
    feat_dict = {k: float(row[k]) for k in CANONICAL_FEATURES}
    feat_bytes = str([feat_dict[k] for k in CANONICAL_FEATURES]).encode('utf-8')
    fingerprint = hashlib.sha256(feat_bytes).hexdigest()[:16]
    
    # Trace inside predict_single manual steps
    features = np.zeros((1, len(CANONICAL_FEATURES)))
    for i, name in enumerate(CANONICAL_FEATURES):
        features[0, i] = float(feat_dict[name])
    
    X_scaled = service.scaler.transform(features)
    prob_et = float(service.et_model.predict_proba(X_scaled)[0])
    prob_mlp = float(service.mlp_model.predict_proba(X_scaled)[0])
    X_meta = service.meta_model.prepare_meta_features(np.array([[prob_et]]), np.array([[prob_mlp]]))
    raw_meta_prob = float(service.meta_model.predict_proba(X_meta)[0])
    
    calib_prob = None
    if service.calibrator is not None:
        calib_prob = float(service.calibrator.predict_proba(X_meta)[0])
        
    res = service.predict_single(feat_dict)
    prob = res['probability']
    risk = res['risk_level']
    action = res['suggested_action']
    
    calib_str = f"{calib_prob:.6f}" if calib_prob is not None else "N/A"
    print(f"{idx:<7} | ${row['Amount']:<9.2f} | {fingerprint:<20} | {prob_et:<8.4f} | {prob_mlp:<8.4f} | {raw_meta_prob:<10.6f} | {calib_str:<10} | {risk:<15} | {action:<10}")

print("=" * 100)
