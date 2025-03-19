import shutil
import subprocess
import sys
import numpy as np
import pickle
import os
from sklearn.ensemble import RandomForestClassifier

# Build the XAI component Docker image
# cd path to NANCY_Explainable_AI_Toolbox\XAI_Anomly_Detection_Component
# docker build -t nancy-xai .

# Build the FL framework Docker image
# cd path to nancy_federated_learning_framework
# docker build -f docker/server.Dockerfile -t nancy-fl .

# Change these paths to match your system
FL_REPO_PATH = "C:/Users/30697/Desktop/NANCY/GitHub/nancy_federated_learning_framework"
XAI_REPO_PATH = "C:/Users/30697/Desktop/NANCY/GitHub/NANCY_Explainable_AI_Toolbox/XAI_Anomly_Detection_Component"

def create_and_save_model():
    print("\n=== Step 1: Creating FL Model ===")
    os.makedirs(os.path.join(FL_REPO_PATH, "models"), exist_ok=True)
    X = np.random.rand(100, 76)
    y = np.random.randint(0, 7, 100)
    
    model = RandomForestClassifier(n_estimators=10, random_state=42)
    model.fit(X, y)
    

    model_path = os.path.join(FL_REPO_PATH, "models", "xgboost_model.pkl")
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    
    print(f"Model saved succesfully")
    return model_path

def copy_model_to_xai(model_path):
    print("\n=== Step 2: Transfering FL Model to XAI Component ===")
    dest_dir = os.path.join(XAI_REPO_PATH, "model")
    os.makedirs(dest_dir, exist_ok=True)
    dest_path = os.path.join(dest_dir, os.path.basename(model_path))
    shutil.copy(model_path, dest_path)
    
    print(f"Model copied to {dest_path}")
    return True

def verify_model_exists():
    print("\n=== Step 3: Verifying FL Model Exists in XAI Component ===")
    
    model_path = os.path.join(XAI_REPO_PATH, "model", "xgboost_model.pkl")
    
    if os.path.exists(model_path):
        try:
            with open(model_path, 'rb') as f:
                model = pickle.load(f)
            print(f"Success: FL Model loaded successfully")
            return True
        except Exception as e:
            print(f"Error: Failed to load model - {e}")
            return False
    else:
        print(f"Error: Model not found at {model_path}")
        return False

def main():
    print("=== NANCY FL_IDS to XAI Integration Test ===")
    model_path = create_and_save_model()
    if not copy_model_to_xai(model_path):
        print("Failed to copy model")
        return False
    if not verify_model_exists():
        print("Failed to verify model")
        return False
    
    print("\n=== Integration Test Completed Successfully ===")
    return True

if __name__ == "__main__":
    main()