import requests
import pandas as pd
import os
import tempfile

class PredictionClient:
    def __init__(self, prediction_url="http://localhost:5000"):
        self.prediction_url = prediction_url
        
    def predict(self, data_frame, time_index):
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
        try:
            response = requests.get(self.prediction_url, timeout=2)
            return response.status_code == 200
        except requests.exceptions.RequestException:
            return False