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
    """Load a model from file."""
    with open(path, 'rb') as f:
        return pickle.load(f)

def preprocess_data(df, scaler_path):
    """Preprocess the data using the provided scaler."""
    columns_to_drop = ['Flow ID', 'Src IP', 'Src Port', 'Dst IP', 'Dst Port',
                      'Protocol', 'Timestamp', 'Label']
    
    y_true = df['Label']
    df_reduced = df.drop(columns_to_drop, axis=1)

    df_reduced.replace([np.inf, -np.inf], np.nan, inplace=True)
    df_no_na = df_reduced.dropna(axis=0)

    scaler = joblib.load(scaler_path)
    df_scaled = scaler.transform(df_no_na)
    df_scaled = pd.DataFrame(df_scaled, columns=df_no_na.columns)
    
    return df_scaled, y_true

def global_explain(model, data, output_dir="Global_Explainability"):
    """Generate global explanations using SHAP."""
    os.makedirs(output_dir, exist_ok=True)
    
    feature_descriptions = {
        'Flow Duration': "Duration of the flow in Microsecond",
        'Tot Fwd Pkts': "Total packets in the forward direction",
        'Tot Bwd Pkts': "Total packets in the backward direction",
        'TotLen Fwd Pkts': "Total size of packet in forward direction",
        'TotLen Bwd Pkts': "Total size of packet in backward direction",
        'Fwd Pkt Len Max': "Maximum size of packet in forward direction",
        'Fwd Pkt Len Min': "Minimum size of packet in forward direction",
        'Fwd Pkt Len Mean': "Mean size of packet in forward direction",
        'Fwd Pkt Len Std': "Standard deviation size of packet in forward direction",
        'Bwd Pkt Len Max': "Maximum size of packet in backward direction",
        'Bwd Pkt Len Min': "Minimum size of packet in backward direction",
        'Bwd Pkt Len Mean': "Mean size of packet in backward direction",
        'Bwd Pkt Len Std': "Standard deviation size of packet in backward direction",
        'Flow Byts/s': "Number of flow bytes per second",
        'Flow Pkts/s': "Number of flow packets per second",
        'Flow IAT Mean': "Mean time between two packets sent in the flow",
        'Flow IAT Std': "Standard deviation time between two packets sent in the flow",
        'Flow IAT Max': "Maximum time between two packets sent in the flow",
        'Flow IAT Min': "Minimum time between two packets sent in the flow",
        'Fwd IAT Tot': "Total time between two packets sent in the forward direction",
        'Fwd IAT Mean': "Mean time between two packets sent in the forward direction",
        'Fwd IAT Std': "Standard deviation time between two packets sent in the forward direction",
        'Fwd IAT Max': "Maximum time between two packets sent in the forward direction",
        'Fwd IAT Min': "Minimum time between two packets sent in the forward direction",
        'Bwd IAT Tot': "Total time between two packets sent in the backward direction",
        'Bwd IAT Mean': "Mean time between two packets sent in the backward direction",
        'Bwd IAT Std': "Standard deviation time between two packets sent in the backward direction",
        'Bwd IAT Max': "Maximum time between two packets sent in the backward direction",
        'Bwd IAT Min': "Minimum time between two packets sent in the backward direction",
        'Fwd PSH Flags': "Number of times the PSH flag was set in packets travelling in the forward direction (0 for UDP)",
        'Bwd PSH Flags': "Number of times the PSH flag was set in packets travelling in the backward direction (0 for UDP)",
        'Fwd URG Flags': "Number of times the URG flag was set in packets travelling in the forward direction (0 for UDP)",
        'Bwd URG Flags': "Number of times the URG flag was set in packets travelling in the backward direction (0 for UDP)",
        'Fwd Header Len': "Total bytes used for headers in the forward direction",
        'Bwd Header Len': "Total bytes used for headers in the backward direction",
        'Fwd Pkts/s': "Number of forward packets per second",
        'Bwd Pkts/s': "Number of backward packets per second",
        'Pkt Len Min': "Minimum length of a packet",
        'Pkt Len Max': "Maximum length of a packet",
        'Pkt Len Mean': "Mean length of a packet",
        'Pkt Len Std': "Standard deviation length of a packet",
        'Pkt Len Var': "Variance length of a packet",
        'FIN Flag Cnt': "Number of packets with FIN",
        'SYN Flag Cnt': "Number of packets with SYN",
        'RST Flag Cnt': "Number of packets with RST",
        'PSH Flag Cnt': "Number of packets with PUSH",
        'ACK Flag Cnt': "Number of packets with ACK",
        'URG Flag Cnt': "Number of packets with URG",
        'CWE Flag Count': "Number of packets with CWE",
        'ECE Flag Cnt': "Number of packets with ECE",
        'Down/Up Ratio': "Download and upload ratio",
        'Pkt Size Avg': "Average size of packet",
        'Fwd Seg Size Avg': "Average size observed in the forward direction",
        'Bwd Seg Size Avg': "Average size observed in the backward direction",
        'Fwd Byts/b Avg': "Average number of bytes bulk rate in the forward direction",
        'Fwd Pkts/b Avg': "Average number of packets bulk rate in the forward direction",
        'Fwd Blk Rate Avg': "Average number of bulk rate in the forward direction",
        'Bwd Byts/b Avg': "Average number of bytes bulk rate in the backward direction",
        'Bwd Pkts/b Avg': "Average number of packets bulk rate in the backward direction",
        'Bwd Blk Rate Avg': "Average number of bulk rate in the backward direction",
        'Subflow Fwd Pkts': "The average number of packets in a sub flow in the forward direction",
        'Subflow Fwd Byts': "The average number of bytes in a sub flow in the forward direction",
        'Subflow Bwd Pkts': "The average number of packets in a sub flow in the backward direction",
        'Subflow Bwd Byts': "The average number of bytes in a sub flow in the backward direction",
        'Init Fwd Win Byts': "The total number of bytes sent in initial window in the forward direction",
        'Init Bwd Win Byts': "The total number of bytes sent in initial window in the backward direction",
        'Fwd Act Data Pkts': "Count of packets with at least 1 byte of TCP data payload in the forward direction",
        'Fwd Seg Size Min': "Minimum segment size observed in the forward direction",
        'Active Mean': "Mean time a flow was active before becoming idle",
        'Active Std': "Standard deviation time a flow was active before becoming idle",
        'Active Max': "Maximum time a flow was active before becoming idle",
        'Active Min': "Minimum time a flow was active before becoming idle",
        'Idle Mean': "Mean time a flow was idle before becoming active",
        'Idle Std': "Standard deviation time a flow was idle before becoming active",
        'Idle Max': "Maximum time a flow was idle before becoming active",
        'Idle Min': "Minimum time a flow was idle before becoming active"
    }
    
    class_names = {
        0: 'Benign Traffic',
        1: 'Reconnaissance Attack',
        2: 'TCP Scan',
        3: 'SYN Scan',
        4: 'SYN Flood',
        5: 'HTTP Flood',
        6: 'Slowrate DoS'
    }
    
    try:
        print("Initializing SHAP explainer...")
        explainer = shap.TreeExplainer(model)
        
        print("Calculating SHAP values...")
        sample_size = 5000
        data_sample = data.sample(n=sample_size, random_state=42)
        shap_values = explainer.shap_values(data_sample)
        shap_values = np.array([values.reshape(sample_size, -1) for values in np.array(shap_values).T])
        
        class_names = {
            0: 'Benign Traffic',
            1: 'Reconnaissance Attack',
            2: 'TCP Scan',
            3: 'SYN Scan',
            4: 'SYN Flood',
            5: 'HTTP Flood',
            6: 'Slowrate DoS'
        }
        
        for class_idx, class_name in class_names.items():
            print(f"Processing {class_name}...")
            plt.figure(figsize=(12, 8))
            class_shap_values = shap_values[class_idx]
            shap.summary_plot(
                class_shap_values,
                data_sample,
                feature_names=data.columns,
                max_display=10,
                show=False,
                plot_type="dot"
            )
            plt.title(f"Feature Importance for {class_name}")
            plt.tight_layout()
            plt.savefig(os.path.join(output_dir, f"{class_name.replace(' ', '_')}.png"), 
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
                        'description': feature_descriptions.get(feat_name, "No description available")
                    }
                    for feat_name, imp in feature_pairs[:10]
                ]
            }
            with open(os.path.join(output_dir, f"{class_name.replace(' ', '_')}.json"), 'w') as f:
                json.dump(importance_dict, f, indent=4)
            
            print(f"Completed {class_name}")
        
        print("All explanations generated successfully!")
        
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise
        
    except Exception as e:
        print(f"Error: {str(e)}")
        raise

def local_explain(model, data, flow_id, y_true, output_dir="Local_Explainability"):
    """Generate local explanation for a specific flow using LIME."""
    os.makedirs(output_dir, exist_ok=True)
    feature_descriptions = {
        'Flow Duration': "Duration of the flow in Microsecond",
        'Tot Fwd Pkts': "Total packets in the forward direction",
        'Tot Bwd Pkts': "Total packets in the backward direction",
        'TotLen Fwd Pkts': "Total size of packet in forward direction",
        'TotLen Bwd Pkts': "Total size of packet in backward direction",
        'Fwd Pkt Len Max': "Maximum size of packet in forward direction",
        'Fwd Pkt Len Min': "Minimum size of packet in forward direction",
        'Fwd Pkt Len Mean': "Mean size of packet in forward direction",
        'Fwd Pkt Len Std': "Standard deviation size of packet in forward direction",
        'Bwd Pkt Len Max': "Maximum size of packet in backward direction",
        'Bwd Pkt Len Min': "Minimum size of packet in backward direction",
        'Bwd Pkt Len Mean': "Mean size of packet in backward direction",
        'Bwd Pkt Len Std': "Standard deviation size of packet in backward direction",
        'Flow Byts/s': "Number of flow bytes per second",
        'Flow Pkts/s': "Number of flow packets per second",
        'Flow IAT Mean': "Mean time between two packets sent in the flow",
        'Flow IAT Std': "Standard deviation time between two packets sent in the flow",
        'Flow IAT Max': "Maximum time between two packets sent in the flow",
        'Flow IAT Min': "Minimum time between two packets sent in the flow",
        'Fwd IAT Tot': "Total time between two packets sent in the forward direction",
        'Fwd IAT Mean': "Mean time between two packets sent in the forward direction",
        'Fwd IAT Std': "Standard deviation time between two packets sent in the forward direction",
        'Fwd IAT Max': "Maximum time between two packets sent in the forward direction",
        'Fwd IAT Min': "Minimum time between two packets sent in the forward direction",
        'Bwd IAT Tot': "Total time between two packets sent in the backward direction",
        'Bwd IAT Mean': "Mean time between two packets sent in the backward direction",
        'Bwd IAT Std': "Standard deviation time between two packets sent in the backward direction",
        'Bwd IAT Max': "Maximum time between two packets sent in the backward direction",
        'Bwd IAT Min': "Minimum time between two packets sent in the backward direction",
        'Fwd PSH Flags': "Number of times the PSH flag was set in packets travelling in the forward direction (0 for UDP)",
        'Bwd PSH Flags': "Number of times the PSH flag was set in packets travelling in the backward direction (0 for UDP)",
        'Fwd URG Flags': "Number of times the URG flag was set in packets travelling in the forward direction (0 for UDP)",
        'Bwd URG Flags': "Number of times the URG flag was set in packets travelling in the backward direction (0 for UDP)",
        'Fwd Header Len': "Total bytes used for headers in the forward direction",
        'Bwd Header Len': "Total bytes used for headers in the backward direction",
        'Fwd Pkts/s': "Number of forward packets per second",
        'Bwd Pkts/s': "Number of backward packets per second",
        'Pkt Len Min': "Minimum length of a packet",
        'Pkt Len Max': "Maximum length of a packet",
        'Pkt Len Mean': "Mean length of a packet",
        'Pkt Len Std': "Standard deviation length of a packet",
        'Pkt Len Var': "Variance length of a packet",
        'FIN Flag Cnt': "Number of packets with FIN",
        'SYN Flag Cnt': "Number of packets with SYN",
        'RST Flag Cnt': "Number of packets with RST",
        'PSH Flag Cnt': "Number of packets with PUSH",
        'ACK Flag Cnt': "Number of packets with ACK",
        'URG Flag Cnt': "Number of packets with URG",
        'CWE Flag Count': "Number of packets with CWE",
        'ECE Flag Cnt': "Number of packets with ECE",
        'Down/Up Ratio': "Download and upload ratio",
        'Pkt Size Avg': "Average size of packet",
        'Fwd Seg Size Avg': "Average size observed in the forward direction",
        'Bwd Seg Size Avg': "Average size observed in the backward direction",
        'Fwd Byts/b Avg': "Average number of bytes bulk rate in the forward direction",
        'Fwd Pkts/b Avg': "Average number of packets bulk rate in the forward direction",
        'Fwd Blk Rate Avg': "Average number of bulk rate in the forward direction",
        'Bwd Byts/b Avg': "Average number of bytes bulk rate in the backward direction",
        'Bwd Pkts/b Avg': "Average number of packets bulk rate in the backward direction",
        'Bwd Blk Rate Avg': "Average number of bulk rate in the backward direction",
        'Subflow Fwd Pkts': "The average number of packets in a sub flow in the forward direction",
        'Subflow Fwd Byts': "The average number of bytes in a sub flow in the forward direction",
        'Subflow Bwd Pkts': "The average number of packets in a sub flow in the backward direction",
        'Subflow Bwd Byts': "The average number of bytes in a sub flow in the backward direction",
        'Init Fwd Win Byts': "The total number of bytes sent in initial window in the forward direction",
        'Init Bwd Win Byts': "The total number of bytes sent in initial window in the backward direction",
        'Fwd Act Data Pkts': "Count of packets with at least 1 byte of TCP data payload in the forward direction",
        'Fwd Seg Size Min': "Minimum segment size observed in the forward direction",
        'Active Mean': "Mean time a flow was active before becoming idle",
        'Active Std': "Standard deviation time a flow was active before becoming idle",
        'Active Max': "Maximum time a flow was active before becoming idle",
        'Active Min': "Minimum time a flow was active before becoming idle",
        'Idle Mean': "Mean time a flow was idle before becoming active",
        'Idle Std': "Standard deviation time a flow was idle before becoming active",
        'Idle Max': "Maximum time a flow was idle before becoming active",
        'Idle Min': "Minimum time a flow was idle before becoming active"
    }
    
    class_names = ['Benign Traffic', 'Reconnaissance Attack', 'TCP Scan', 
                  'SYN Scan', 'SYN Flood', 'HTTP Flood', 'Slowrate DoS']
    explainer = lime.lime_tabular.LimeTabularExplainer(
        data.values,
        mode="classification",
        feature_names=data.columns,
        class_names=class_names,
        discretize_continuous=True
    )
    instance = data.iloc[flow_id]
    prediction = model.predict([instance])[0]
    exp = explainer.explain_instance(
        instance,
        model.predict_proba,
        num_features=10,
        top_labels=1
    )
    explanation = exp.as_list(label=prediction)
    plt.figure(figsize=(10, 6))
    exp.as_pyplot_figure(label=prediction)
    plt.title(f"Local Explanation for Flow ID {flow_id}")
    filename = f"Flow_ID_{flow_id}_Actual_{class_names[y_true[flow_id]]}_Predicted_{class_names[prediction]}"
    plt.savefig(f"{output_dir}/{filename}.png", bbox_inches='tight', dpi=300)
    plt.close()
    output = {
        'class': f"Flow ID #{flow_id}",
        'top_features': [
            {
                'feature_name': feature_name.split(" <=")[0].split(" >")[0],  # Clean feature name
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
    
    print(f"Local explanation for Flow ID {flow_id} saved to {output_dir}/")

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Network Traffic XAI Tool')
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
    parser.add_argument('--flow-id', type=int,
                      help='Flow ID for local explanation (required for local mode)')
    
    args = parser.parse_args()
    df = pd.read_csv(args.data)
    model = load_model(args.model)
    print("Model type:", type(model))
    X_scaled, y_true = preprocess_data(df, args.scaler)
    
    if args.mode == 'global':
        global_explain(model, X_scaled, args.output)
        print(f"Global explanations saved to {args.output}/")
    else:
        if args.flow_id is None:
            parser.error("--flow-id is required for local explanation mode")
        local_explain(model, X_scaled, args.flow_id, y_true, args.output)
        print(f"Local explanation for Flow ID {args.flow_id} saved to {args.output}/")

if __name__ == "__main__":
    main()