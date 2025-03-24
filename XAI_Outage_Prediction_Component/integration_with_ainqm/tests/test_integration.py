import unittest
import os
import sys
import tempfile
import pandas as pd
import numpy as np
from unittest.mock import patch, MagicMock
import json


parent_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(parent_dir)
sys.path.append(os.path.dirname(parent_dir))


from integrated_explainer import IntegratedExplainer
from prediction_client import PredictionClient

class MockResponse:
    def __init__(self, json_data, status_code):
        self.json_data = json_data
        self.status_code = status_code
        self.text = json.dumps(json_data)
        
    def json(self):
        return self.json_data

def mocked_requests_get(*args, **kwargs):
    if args[0] == 'http://localhost:5000':
        return MockResponse({"status": "ok"}, 200)
    return MockResponse({"error": "Not found"}, 404)

def mocked_requests_post(*args, **kwargs):
    if '/predict' in args[0]:
        time_index = kwargs.get('data', {}).get('time_index', 0)
        return MockResponse({
            "time_index": time_index, 
            "Outage Probability": 0.75,
            "Binary_Outage": 1,
            "Classification": "Outage_Risk"
        }, 200)
    return MockResponse({"error": "Not found"}, 404)

class TestIntegration(unittest.TestCase):
    def setUp(self):
        print("\n=== Setting up test environment ===")
        
        self.temp_dir = tempfile.mkdtemp()
        
        data = {
            'dl_buffer [bytes]': [1000, 2000, 3000, 4000, 5000],
            'tx_pkts downlink': [500, 600, 700, 800, 900],
            'dl_cqi': [8, 10, 12, 9, 7],
            'sum_requested_prbs': [50, 60, 70, 80, 90],
            'sum_granted_prbs': [48, 58, 65, 75, 85],
            'tx_brate downlink [Mbps]': [5.0, 6.0, 0.005, 7.0, 0.009]
        }
        
        self.test_df = pd.DataFrame(data)
        self.test_csv = os.path.join(self.temp_dir, 'test_data.csv')
        self.test_df.to_csv(self.test_csv, index=False)
        
    @patch('requests.get', side_effect=mocked_requests_get)
    def test_ainqm_connection(self, mock_get):
        print("\n=== Testing AINQM Component Connection ===")
        
        client = PredictionClient("http://localhost:5000")
        is_available = client.is_available()
        self.assertTrue(is_available)
        print("✓ Successfully connected to AINQM prediction service")
        
    @patch('requests.post', side_effect=mocked_requests_post)
    def test_outage_prediction(self, mock_post):
        print("\n=== Testing Outage Prediction with AINQM ===")
        
        client = PredictionClient()
        time_index = 2
        result = client.predict(self.test_df, time_index)
        
        self.assertEqual(result["time_index"], time_index)
        self.assertEqual(result["Outage Probability"], 0.75)
        print("✓ Successfully obtained outage prediction from AINQM component")
        
    @patch('requests.post', side_effect=mocked_requests_post)
    def test_xai_integration(self, mock_post):
        print("\n=== Testing XAI Integration ===")
        
        explainer = IntegratedExplainer(prediction_url="http://localhost:5000")
        result = explainer.predict(self.test_df, 2)
        
        self.assertIn("Outage Probability", result)
        self.assertIn("Binary_Outage", result)
        self.assertIn("Classification", result)
        print("✓ XAI integration successfully processes prediction results")
        
    def test_shap_global_explanations(self):
        print("\n=== Testing SHAP Global Explanations ===")
        
        try:
            explainer = IntegratedExplainer()
            import xgboost as xgb
            from sklearn.datasets import make_classification
            X, y = make_classification(n_samples=20, n_features=5, random_state=42)
            mock_df = pd.DataFrame({
                'dl_buffer [bytes]': X[:, 0],
                'tx_pkts downlink': X[:, 1],
                'dl_cqi': X[:, 2],
                'sum_requested_prbs': X[:, 3],
                'sum_granted_prbs': X[:, 4],
                'tx_brate downlink [Mbps]': np.where(y > 0.5, 5.0, 0.005)
            })
            
            model = xgb.XGBClassifier()
            model.fit(X, y)
            with patch('integration_with_ainqm.integrated_explainer.preprocess_data_robust') as mock_preprocess:
                cleaned_data = pd.DataFrame({
                    'dl_buffer': X[:, 0],
                    'tx_pkts': X[:, 1],
                    'dl_cqi': X[:, 2],
                    'sum_requested_prbs': X[:, 3],
                    'sum_granted_prbs': X[:, 4]
                })
                mock_preprocess.return_value = (cleaned_data, y)
                
                with patch.object(explainer, 'model', model):
                    output_dir = os.path.join(self.temp_dir, 'Global_Explainability')
                    with patch('outage_prediction_explainer.global_explain') as mock_global:
                        mock_global.return_value = {"status": "success"}
                        result = explainer.explain_global(mock_df, output_dir)
                        
                        self.assertEqual(result["status"], "success")
                        self.assertEqual(result["output_directory"], output_dir)
                        print("✓ SHAP global explanation successfully generated")
        except ImportError:
            self.skipTest("XGBoost not available for testing")
            
    def test_lime_local_explanations(self):
        print("\n=== Testing LIME Local Explanations ===")
        
        try:
            explainer = IntegratedExplainer()
            import xgboost as xgb
            from sklearn.datasets import make_classification
            X, y = make_classification(n_samples=20, n_features=5, random_state=42)
            mock_df = pd.DataFrame({
                'dl_buffer [bytes]': X[:, 0],
                'tx_pkts downlink': X[:, 1],
                'dl_cqi': X[:, 2],
                'sum_requested_prbs': X[:, 3],
                'sum_granted_prbs': X[:, 4],
                'tx_brate downlink [Mbps]': np.where(y > 0.5, 5.0, 0.005)
            })
            
            model = xgb.XGBClassifier()
            model.fit(X, y)
            with patch('integration_with_ainqm.integrated_explainer.preprocess_data_robust') as mock_preprocess:
                cleaned_data = pd.DataFrame({
                    'dl_buffer': X[:, 0],
                    'tx_pkts': X[:, 1],
                    'dl_cqi': X[:, 2],
                    'sum_requested_prbs': X[:, 3],
                    'sum_granted_prbs': X[:, 4]
                })
                mock_preprocess.return_value = (cleaned_data, y)
                
                with patch.object(explainer, 'model', model):
                    output_dir = os.path.join(self.temp_dir, 'Local_Explainability')
                    

                    with patch('outage_prediction_explainer.local_explain') as mock_local:
                        mock_local.return_value = {"status": "success"}
                        result = explainer.explain_local(mock_df, 2, output_dir)
                        
                        self.assertEqual(result["status"], "success")
                        self.assertEqual(result["output_directory"], output_dir)
                        print("✓ LIME local explanation successfully generated")
        except ImportError:
            self.skipTest("XGBoost not available for testing")
        
    def tearDown(self):
        import shutil
        if os.path.exists(self.temp_dir):
            shutil.rmtree(self.temp_dir)
            
        for dir_name in ["Global_Explainability", "Local_Explainability"]:
            if os.path.exists(dir_name):
                shutil.rmtree(dir_name)

if __name__ == '__main__':
    print("\n=== OUTAGE PREDICTION XAI INTEGRATION TEST SUITE ===")
    print("Testing key functionality:")
    print("1. Connection to AINQM prediction component")
    print("2. Outage prediction processing")
    print("3. XAI integration")
    print("4. SHAP global explanations")
    print("5. LIME local explanations")
    
    unittest.main(verbosity=2)