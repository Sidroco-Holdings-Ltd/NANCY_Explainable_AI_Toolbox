import os
import sys
import pandas as pd
import numpy as np
import pickle
import joblib
from sklearn.preprocessing import StandardScaler
import traceback

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from outage_prediction_explainer import clean_column_names, global_explain, local_explain, load_model

def preprocess_data_robust(df, scaler_path=None):
    features = ['dl_buffer [bytes]', 'tx_pkts downlink', 'dl_cqi', 
               'sum_requested_prbs', 'sum_granted_prbs']
    target = 'tx_brate downlink [Mbps]'
    
    X = df[features]
    y = (df[target] < 0.01).astype(int)
    try:
        if scaler_path and os.path.exists(scaler_path):
            scaler = joblib.load(scaler_path)
            X_scaled = pd.DataFrame(scaler.transform(X), columns=X.columns)
        else:
            scaler = StandardScaler()
            X_scaled = pd.DataFrame(scaler.fit_transform(X), columns=X.columns)
    except Exception as e:
        print(f"Error loading scaler: {str(e)}. Creating a new scaler.")
        scaler = StandardScaler()
        X_scaled = pd.DataFrame(scaler.fit_transform(X), columns=X.columns)
    
    X_scaled_clean = clean_column_names(X_scaled)
    
    return X_scaled_clean, y

class PredictionClient:
    def __init__(self, prediction_url="http://localhost:5000"):
        self.prediction_url = prediction_url
        
    def predict(self, data_frame, time_index):
        import requests
        import tempfile
        
        with tempfile.NamedTemporaryFile(suffix='.csv', delete=False) as tmp_file:
            data_frame.to_csv(tmp_file.name, index=False)
            tmp_filename = tmp_file.name
            
        try:
            with open(tmp_filename, 'rb') as f:
                files = {'file': f}
                data = {'time_index': time_index}
                response = requests.post(
                    f"{self.prediction_url}/predict",
                    files=files,
                    data=data
                )
            
            if response.status_code == 200:
                return response.json()
            else:
                raise Exception(f"Error from prediction service: {response.text}")
        finally:
            if os.path.exists(tmp_filename):
                os.remove(tmp_filename)
                
    def is_available(self):
        import requests
        try:
            response = requests.get(self.prediction_url, timeout=2)
            return response.status_code == 200
        except requests.exceptions.RequestException:
            return False

class IntegratedExplainer:
    def __init__(self, model_path=None, scaler_path=None, prediction_url="http://localhost:5000", outage_threshold=0.5):
        self.prediction_client = PredictionClient(prediction_url)
        self.outage_threshold = outage_threshold
        
        self.model_path = model_path or os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
                                                   "model", "xgboost_outage_model.pkl")
        self.scaler_path = scaler_path or os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
                                                     "Scaler", "scaler.joblib")
        
        if os.path.exists(self.model_path):
            self.model = load_model(self.model_path)
        else:
            self.model = None
            print(f"Warning: Model file not found at {self.model_path}")
            
    def check_prediction_service(self):
        return self.prediction_client.is_available()
    
    def predict(self, df, time_index):
        result = self.prediction_client.predict(df, time_index)
        
        if "Outage Probability" in result:
            result["Binary_Outage"] = 1 if result["Outage Probability"] >= self.outage_threshold else 0
            result["Classification"] = "Outage_Risk" if result["Binary_Outage"] == 1 else "Normal_Operation"
            
        return result
    
    def prepare_data_for_explanation(self, df):
        features = ['dl_buffer [bytes]', 'tx_pkts downlink', 'dl_cqi', 
                   'sum_requested_prbs', 'sum_granted_prbs']
        missing_features = [f for f in features if f not in df.columns]
        if missing_features:
            raise ValueError(f"Input data is missing required features: {missing_features}")
        target = 'tx_brate downlink [Mbps]'
        if target not in df.columns:

            df = df.copy()

            df[target] = 1.0
            if self.model:
                try:
                    X = df[features]
                    scaler = StandardScaler()
                    X_scaled = pd.DataFrame(scaler.fit_transform(X), columns=X.columns)
                    X_scaled_clean = clean_column_names(X_scaled)
                    y_proba = self.model.predict_proba(X_scaled_clean)
                    outage_mask = y_proba[:, 1] >= self.outage_threshold

                    df.loc[outage_mask, target] = 0.005  
                    df.loc[~outage_mask, target] = 1.0   
                except Exception as e:
                    print(f"Error making predictions: {str(e)}. Using default values.")
                    df[target] = 1.0
        
        return df
        
    def explain_global(self, df, output_dir="Global_Explainability"):
        if not self.model:
            raise ValueError("Model not loaded. Please provide a valid model path.")
        
 
        df = self.prepare_data_for_explanation(df)
        
        try:

            X_scaled, y = preprocess_data_robust(df, None)  
            global_explain(self.model, X_scaled, output_dir)
            
            return {
                "status": "success",
                "output_directory": output_dir
            }
        except Exception as e:
            error_msg = str(e)
            stack_trace = traceback.format_exc()
            raise Exception(f"Error in global explanation: {error_msg}\n{stack_trace}")
        
    def explain_local(self, df, sample_id, output_dir="Local_Explainability"):
        if not self.model:
            raise ValueError("Model not loaded. Please provide a valid model path.")
        df = self.prepare_data_for_explanation(df)
        
        try:

            X_scaled, y = preprocess_data_robust(df, None)  
            
            if sample_id >= len(X_scaled):
                raise ValueError(f"Sample ID {sample_id} out of range (max is {len(X_scaled)-1})")
                
            local_explain(self.model, X_scaled, sample_id, y, output_dir)
            
            return {
                "status": "success",
                "output_directory": output_dir,
                "sample_id": sample_id
            }
        except Exception as e:
            error_msg = str(e)
            stack_trace = traceback.format_exc()
            raise Exception(f"Error in local explanation: {error_msg}\n{stack_trace}")