import numpy as np
import pandas as pd
import shap
import lime.lime_tabular
import matplotlib.pyplot as plt
import json
import os
import joblib
import pickle
import warnings
from sklearn.preprocessing import StandardScaler
warnings.filterwarnings('ignore', category=UserWarning)

def load_model(path):
    with open(path, 'rb') as f:
        return pickle.load(f)

def clean_column_names(df):
    """Clean column names by removing special characters."""
    name_map = {
        'dl_buffer [bytes]': 'dl_buffer',
        'tx_pkts downlink': 'tx_pkts',
        'dl_cqi': 'dl_cqi',
        'sum_requested_prbs': 'sum_requested_prbs',
        'sum_granted_prbs': 'sum_granted_prbs'
    }
    df_clean = df.copy()
    df_clean.columns = [name_map[col] if col in name_map else col for col in df.columns]
    return df_clean

def preprocess_data(df, scaler_path):
    features = ['dl_buffer [bytes]', 'tx_pkts downlink', 'dl_cqi', 
               'sum_requested_prbs', 'sum_granted_prbs']
    target = 'tx_brate downlink [Mbps]'
    
    X = df[features]
    y = (df[target] < 0.01).astype(int)

    scaler = joblib.load(scaler_path)
    X_scaled = pd.DataFrame(scaler.transform(X), columns=X.columns)
    X_scaled_clean = clean_column_names(X_scaled)
    
    return X_scaled_clean, y

def global_explain(model, data, output_dir="Global Explainability"):
    """Generate global explanations using SHAP."""
    os.makedirs(output_dir, exist_ok=True)
    
    feature_descriptions = {
        'dl_buffer': "Buffer size in the downlink direction",
        'tx_pkts': "Number of transmitted packets in downlink",
        'dl_cqi': "Channel Quality Indicator for downlink",
        'sum_requested_prbs': "Sum of requested Physical Resource Blocks",
        'sum_granted_prbs': "Sum of granted Physical Resource Blocks"
    }
    
    class_names = {
        0: 'Normal_Operation',
        1: 'Outage_Risk'
    }
    
    try:
        print("Initializing SHAP explainer...")
        explainer = shap.TreeExplainer(model)
        
        print("Calculating SHAP values...")
        shap_values = explainer.shap_values(data)
        
        for class_idx, class_name in class_names.items():
            print(f"Processing {class_name}...")
            plt.figure(figsize=(12, 8))
            
            if isinstance(shap_values, list):
                class_shap_values = shap_values[class_idx]
            else:
                class_shap_values = shap_values if class_idx == 1 else -shap_values
                
            shap.summary_plot(
                class_shap_values,
                data,
                max_display=10,
                show=False,
                plot_type="dot"
            )
            plt.title(f"Feature Importance for {class_name}")
            plt.tight_layout()
            plt.savefig(os.path.join(output_dir, f"{class_name}.png"), 
                       bbox_inches='tight', dpi=300)
            plt.close()

            feature_importance = np.abs(class_shap_values).mean(axis=0)
            feature_pairs = list(zip(data.columns, feature_importance))
            feature_pairs.sort(key=lambda x: x[1], reverse=True)
            
            importance_dict = {
                'class': class_name,
                'top_features': [
                    {
                        'feature_name': feat_name,
                        'importance': float(imp),
                        'description': feature_descriptions[feat_name]
                    }
                    for feat_name, imp in feature_pairs[:10]
                ]
            }
            
            with open(os.path.join(output_dir, f"{class_name}.json"), 'w') as f:
                json.dump(importance_dict, f, indent=4)
            
            print(f"Completed {class_name}")
        
        print("All explanations generated successfully!")
        
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise

def local_explain(model, data, sample_id, y_true, output_dir="Local Explainability"):
    """Generate local explanation for a specific sample using LIME."""
    os.makedirs(output_dir, exist_ok=True)
    
    feature_descriptions = {
        'dl_buffer': "Buffer size in the downlink direction",
        'tx_pkts': "Number of transmitted packets in downlink",
        'dl_cqi': "Channel Quality Indicator for downlink",
        'sum_requested_prbs': "Sum of requested Physical Resource Blocks",
        'sum_granted_prbs': "Sum of granted Physical Resource Blocks"
    }
    
    class_names = ['Normal_Operation', 'Outage_Risk']
    
    def custom_predict_proba(X):
        probs = model.predict_proba(X)
        adjusted_probs = np.zeros_like(probs)
        adjusted_probs[:, 0] = (probs[:, 1] < 0.2).astype(float)
        adjusted_probs[:, 1] = (probs[:, 1] >= 0.2).astype(float)
        return adjusted_probs
    
    explainer = lime.lime_tabular.LimeTabularExplainer(
        data.values,
        mode="classification",
        feature_names=data.columns,
        class_names=class_names,
        discretize_continuous=True
    )
    
    instance = data.iloc[sample_id]
    prediction_proba = model.predict_proba([instance])[0]
    prediction = 1 if prediction_proba[1] >= 0.2 else 0
    
    exp = explainer.explain_instance(
        instance,
        custom_predict_proba,
        num_features=10,
        top_labels=1
    )
    
    explanation = exp.as_list(label=prediction)
    
    plt.figure(figsize=(10, 6))
    exp.as_pyplot_figure(label=prediction)
    plt.title(f"Local Explanation for Sample {sample_id}")
    
    filename = f"Sample_{sample_id}_Actual_{class_names[y_true[sample_id]]}_Predicted_{class_names[prediction]}"
    plt.savefig(f"{output_dir}/{filename}.png", bbox_inches='tight', dpi=300)
    plt.close()
    
    output = {
        'sample': f"Sample #{sample_id}",
        'top_features': [
            {
                'feature_name': feature_name.split(" <=")[0].split(" >")[0],
                'importance': float(importance),
                'description': feature_descriptions.get(
                    feature_name.split(" <=")[0].split(" >")[0], 
                    "No description available"
                )
            }
            for feature_name, importance in explanation
        ]
    }
    
    with open(f"{output_dir}/{filename}.json", 'w') as f:
        json.dump(output, f, indent=4)
    
    print(f"Local explanation for Sample {sample_id} saved to {output_dir}/")

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Outage Prediction XAI Tool')
    parser.add_argument('--mode', required=True, choices=['global', 'local'],
                      help='Explanation mode: global or local')
    parser.add_argument('--model', required=True,
                      help='Path to the saved model file')
    parser.add_argument('--scaler', required=True,
                      help='Path to the saved scaler file')
    parser.add_argument('--data', required=True,
                      help='Path to the CSV data file')
    parser.add_argument('--output', default='Explainability',
                      help='Output directory for explanations')
    parser.add_argument('--sample-id', type=int,
                      help='Sample ID for local explanation (required for local mode)')
    
    args = parser.parse_args()
    
    df = pd.read_csv(args.data)
    model = load_model(args.model)
    X_scaled, y_true = preprocess_data(df, args.scaler)
    
    if args.mode == 'global':
        global_explain(model, X_scaled, "Global Explainability")
        print(f"Global explanations saved to Global Explainability/")
    else:
        if args.sample_id is None:
            parser.error("--sample-id is required for local explanation mode")
        local_explain(model, X_scaled, args.sample_id, y_true, "Local Explainability")
        print(f"Local explanation for Sample {args.sample_id} saved to Local Explainability/")

if __name__ == "__main__":
    main()