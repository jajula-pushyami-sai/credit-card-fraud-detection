"""
HISTORICAL / EXPERIMENTAL TEST SCRIPT
This script tests the historical LightGBM `FraudDetectionModel` which is not 
used in the production API routes. It is preserved for reference.
"""

import sys
import os
import pandas as pd

# Add backend directory to sys.path
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(base_dir)

from app.services.fraud_model import FraudDetectionModel

def run_tests():
    data_path = os.path.join(base_dir, "app", "ml", "data", "raw", "creditcard.csv")
        
    print(f"Loading test data from {data_path}...")
    df = pd.read_csv(data_path)
    
    # Get a mix of normal and fraud transactions
    normal_tx = df[df['Class'] == 0].head(3)
    fraud_tx = df[df['Class'] == 1].head(2)
    
    test_df = pd.concat([normal_tx, fraud_tx])
    
    print("Initializing FraudDetectionModel...")
    model = FraudDetectionModel()
    
    expected_features = [
        "Amount", "V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9", "V10", 
        "V11", "V12", "V13", "V14", "V15", "V16", "V17", "V18", "V19", "V20", 
        "V21", "V22", "V23", "V24", "V25", "V26", "V27", "V28"
    ]
    
    print("\n--- Running Tests ---")
    
    for idx, row in test_df.iterrows():
        actual_class = row['Class']
        features_dict = {f: row[f] for f in expected_features}
        
        result = model.predict_fraud(features_dict)
        
        print(f"Transaction: {idx}")
        print(f"Actual: {actual_class}")
        print(f"Probability: {result['fraud_probability']:.6f}")
        print(f"Prediction: {result['prediction']}")
        print(f"Threshold: {result['threshold']}")
        print("-" * 30)

if __name__ == '__main__':
    run_tests()
