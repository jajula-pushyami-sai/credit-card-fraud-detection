import pytest
import numpy as np

try:
    import pandas as pd
except Exception as e:
    pd = None
    pytest.skip(f"Skipping pandas-dependent SMOTE tests: {e}", allow_module_level=True)

from app.ml.preprocessing.smote import SMOTEGenerator

def test_smote_leakage_prevention():
    generator = SMOTEGenerator()
    
    # Dummy data
    X_val = pd.DataFrame(np.random.rand(10, 5), columns=[f'f{i}' for i in range(5)])
    y_val = pd.Series([0, 1, 0, 0, 0, 1, 0, 0, 0, 0])
    
    with pytest.raises(ValueError, match="CRITICAL LEAKAGE PREVENTED"):
        generator.apply_smote(X_val, y_val, is_validation=True)

def test_smote_training_application():
    generator = SMOTEGenerator()
    
    # Highly imbalanced dummy data
    X_train = pd.DataFrame(np.random.rand(100, 5), columns=[f'f{i}' for i in range(5)])
    y_train = pd.Series([0]*90 + [1]*10)
    
    X_res, y_res = generator.apply_smote(X_train, y_train, is_validation=False)
    
    assert len(X_res) > len(X_train)
    # SMOTE balances the classes
    assert y_res.value_counts()[0] == y_res.value_counts()[1]
