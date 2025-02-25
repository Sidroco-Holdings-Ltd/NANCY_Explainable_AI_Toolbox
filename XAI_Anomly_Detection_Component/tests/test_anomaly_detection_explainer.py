import pytest
import os
import pandas as pd
import numpy as np
import pickle
import joblib
from pathlib import Path
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from anomaly_detection_explainer import load_model, preprocess_data, global_explain, local_explain

@pytest.fixture
def sample_data():
    """Create sample network traffic data for testing"""
    np.random.seed(42)
    n_samples = 50
    
    data = {
        'Flow ID': [f'Flow_{i}' for i in range(n_samples)],
        'Src IP': [f'192.168.1.{i % 255}' for i in range(n_samples)],
        'Src Port': [np.random.randint(1024, 65535) for _ in range(n_samples)],
        'Dst IP': [f'10.0.0.{i % 255}' for i in range(n_samples)],
        'Dst Port': [np.random.randint(1, 1024) for _ in range(n_samples)],
        'Protocol': [np.random.choice(['TCP', 'UDP']) for _ in range(n_samples)],
        'Timestamp': [pd.Timestamp.now() for _ in range(n_samples)],
        'Label': [np.random.randint(0, 7) for _ in range(n_samples)]
    }
    
    features = [
        'Flow Duration', 'Tot Fwd Pkts', 'Tot Bwd Pkts', 'TotLen Fwd Pkts', 
        'TotLen Bwd Pkts', 'Fwd Pkt Len Max', 'Fwd Pkt Len Min', 'Fwd Pkt Len Mean'
    ]
    
    for feature in features:
        data[feature] = np.random.rand(n_samples) * 100
    
    return pd.DataFrame(data)

@pytest.fixture
def mock_model(tmp_path):
    """Create and save a mock model for testing"""
    from sklearn.ensemble import RandomForestClassifier
    
    model = RandomForestClassifier(n_estimators=5, random_state=42)
    X = np.random.randn(20, 8)
    y = np.random.randint(0, 7, 20)
    model.fit(X, y)
    
    model_path = tmp_path / "test_model.pkl"
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    
    return model_path

@pytest.fixture
def mock_scaler(tmp_path):
    """Create and save a mock scaler for testing"""
    from sklearn.preprocessing import StandardScaler
    
    scaler = StandardScaler()
    scaler.fit(np.random.randn(20, 8))
    
    scaler_path = tmp_path / "test_scaler.joblib"
    joblib.dump(scaler, scaler_path)
    
    return scaler_path

def test_load_model(mock_model):
    """Test that a model can be loaded correctly"""
    model = load_model(mock_model)
    assert model is not None
    assert hasattr(model, 'predict')
    assert hasattr(model, 'predict_proba')

def test_preprocess_data(sample_data, mock_scaler):
    """Test data preprocessing function"""
    X_scaled, y_true = preprocess_data(sample_data, mock_scaler)
    
    assert isinstance(X_scaled, pd.DataFrame)
    assert isinstance(y_true, pd.Series)
    
    for col in ['Flow ID', 'Src IP', 'Dst IP', 'Protocol', 'Label']:
        assert col not in X_scaled.columns
    
    assert not X_scaled.isnull().values.any()
    assert not np.isinf(X_scaled.values).any()

def test_global_explain(tmp_path, mock_model, sample_data, mock_scaler):
    """Test global explanation generation (basic check)"""
    X_scaled, _ = preprocess_data(sample_data, mock_scaler)
    model = load_model(mock_model)
    
    output_dir = tmp_path / "global_output"
    
    try:
        global_explain(model, X_scaled, output_dir=output_dir)
        assert True
    except Exception as e:
        pytest.fail(f"global_explain raised an exception: {e}")

def test_local_explain(tmp_path, mock_model, sample_data, mock_scaler):
    """Test local explanation generation (basic check)"""
    X_scaled, y_true = preprocess_data(sample_data, mock_scaler)
    model = load_model(mock_model)
    
    output_dir = tmp_path / "local_output"
    flow_id = 0  
    
    try:
        local_explain(model, X_scaled, flow_id, y_true, output_dir=output_dir)
        assert True
    except Exception as e:
        pytest.fail(f"local_explain raised an exception: {e}")