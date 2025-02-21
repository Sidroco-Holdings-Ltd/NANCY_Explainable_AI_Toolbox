# 🌟 NANCY Explainable AI Toolbox 🌟

![Nancy Dashboard](https://github.com/Sidroco-Holdings-Ltd/NANCY_XAI_Dashboard/blob/main/public/logo/logo.png)

Welcome to the NANCY Explainable AI Toolbox!

## XAI Anomaly Detection Component

This sub-folder contains tools for explaining predictions made by an XGBoost model trained to detect various types of network traffic anomalies and attacks. The model classifies network flows into seven categories:
- Benign Traffic
- Reconnaissance Attack
- TCP Scan
- SYN Scan
- SYN Flood
- HTTP Flood
- Slowrate DoS

### Dataset

The model was trained on the [NANCY SNS JU Project - Cyberattacks on O-RAN 5G Testbed Dataset](https://zenodo.org/records/14811122) available on Zenodo. This dataset contains network traffic flows with various features including packet lengths, inter-arrival times, flag counts, and other network-specific metrics.

### Explainability Approaches

The tool provides both global and local explainability for the model's predictions:

### Global Explainability
Uses SHAP (SHapley Additive exPlanations) to provide overall feature importance for each class of traffic. This helps understand what features the model generally considers most important when identifying each type of traffic or attack.

### Local Explainability
Uses LIME (Local Interpretable Model-agnostic Explanations) to explain individual predictions. This helps understand why the model classified a specific network flow the way it did.

### Installation

1. Clone this repository and move to the *XAI_Anomly_Detection_Component folder*.
2. Install the required packages:
```bash
pip install -r requirements.txt
```
3. Global Explainability generates global explanations for all classes:
```bash
python anomaly_detection_explainer.py 
--mode global --model model/xgboost_model.pkl \
--scaler Scaler/testbed.joblib \
--data your_data.csv \
--output Global_Explainability
```
4. Local Explainability explains a specific prediction:
```bash
python anomaly_detection_explainer.py 
--mode local \
--model model/xgboost_model.pkl \
--scaler Scaler/testbed.joblib \
--data your_data.csv \
--flow-id 0 \
--output Local_Explainability
```
### Command Arguments

| Argument | Description | Required |
|----------|-------------|----------|
| `--mode` | Either 'global' or 'local' | Yes |
| `--model` | Path to saved XGBoost model | Yes |
| `--scaler` | Path to saved StandardScaler | Yes |
| `--data` | Path to CSV file with network flow data | Yes | 
| `--output` | Output directory for explanations | No (default: Explainability) |
| `--flow-id` | ID of flow to explain (only for local mode) | Only for local mode |

### Output Files

#### Global Explainability
For each traffic class generates:
- `{class_name}.png`: SHAP feature importance visualization
- `{class_name}.json`: Top 10 important features with descriptions

#### Local Explainability  
For each analyzed flow generates:
- `Flow_ID_{id}_Actual_{actual}_Predicted_{predicted}.png`: LIME visualization
- `Flow_ID_{id}_Actual_{actual}_Predicted_{predicted}.json`: Feature contributions

All outputs are formatted to be compatible with the NANCY XAI Dashboard.

## XAI Outage Prediction Component

This sub-folder contains tools for explaining predictions made by an XGBoost model trained to detect outages in 5G networks. The model performs binary classification based on the URLLC (Ultra-Reliable Low-Latency Communication) threshold of 0.01 Mbps, categorizing network states into:
- Normal Operation (>= 0.01 Mbps)
- Outage Risk (< 0.01 Mbps)

The model uses a specific subset of features from the dataset:
- dl_buffer [bytes]: Buffer size in the downlink direction
- tx_pkts downlink: Number of transmitted packets in downlink
- dl_cqi: Channel Quality Indicator for downlink
- sum_requested_prbs: Sum of requested Physical Resource Blocks
- sum_granted_prbs: Sum of granted Physical Resource Blocks

Target Variable:
- tx_brate downlink [Mbps]: Transmission bit rate in downlink

### Dataset

The model was trained on the GitHub Colosseum Oran Dataset and specifically in [this subset](https://github.com/wineslab/colosseum-oran-commag-dataset/blob/main/slice_traffic/rome_slow_close/tr0/exp1/bs1/slices_bs1/1010123456002_metrics.csv). This dataset contains 5G network metrics including buffer sizes, packet counts, channel quality indicators (CQI), and physical resource block (PRB) utilization.

### Explainability Approaches

The tool provides both global and local explainability for the model's predictions:

### Global Explainability
Uses SHAP (SHapley Additive exPlanations) to provide overall feature importance for both normal operation and outage risk states. This helps understand what features the model generally considers most important when predicting potential outages.

### Local Explainability
Uses LIME (Local Interpretable Model-agnostic Explanations) to explain individual predictions. This helps understand why the model classified a specific network state as normal or at risk of outage.

### Installation

1. Clone this repository and move to the *XAI_Outage_Prediction_Component folder*.
2. Install the required packages:
```bash
pip install -r requirements.txt
```
3. Global Explainability generates global explanations for both classes:
```bash
python outage_prediction_explainer.py --mode global --model model/xgboost_outage_model.pkl --scaler Scaler/scaler.joblib --data your_dataset.csv --output Global_Explainability
```
4. Local Explainability explains a specific prediction:
```bash
python outage_prediction_explainer.py --mode local --model model/xgboost_outage_model.pkl --scaler Scaler/scaler.joblib --data your_dataset.csv --sample-id 0 --output Local_Explainability
```
### Command Arguments

| Argument | Description | Required |
|----------|-------------|----------|
| `--mode` | Either 'global' or 'local' | Yes |
| `--model` | Path to saved XGBoost model | Yes |
| `--scaler` | Path to saved StandardScaler | Yes |
| `--data` | Path to CSV file with 5G metrics data | Yes | 
| `--output` | Output directory for explanations | No |
| `--flow-id` | ID of flow to explain (only for local mode) | Only for local mode |

### Output Files

#### Global Explainability
For each traffic class generates:
- `{class_name}.png`: SHAP feature importance visualization
- `{class_name}.json`: Top 10 important features with descriptions

#### Local Explainability  
For each analyzed flow generates:
- `Sample_{id}_Actual_{actual}_Predicted_{predicted}.png`: LIME visualization
- `Sample_{id}_Actual_{actual}_Predicted_{predicted}.json`: Feature contributions

All outputs are formatted to be compatible with the NANCY XAI Dashboard.

*Note: The model uses a confidence threshold of 0.2 for binary classification, meaning a sample is classified as "Outage Risk" when the probability exceeds 20%.*


## LLM-Powered Analysis Component

This component leverages a Large Language Model (LLM) to analyze SHAP values produced by an explainable AI component. It aids in understanding why the classifier has made specific predictions by providing explanations in a beginner-friendly manner.

### Overview

The `LLM-Powered-Analysis` module utilizes the **Mistral-7B-cybersecurity-rules** model, which is fine-tuned for threat and intrusion detection rules generation. This model is based on the Mistral-7B-Instruct-v0.2 architecture and has been trained on a curated corpus of 950 cybersecurity rules from SIGMA, YARA, and Suricata repositories. It is designed to automate the creation of rules in cybersecurity systems, making it an effective tool for analyzing network traffic and identifying potential threats. For more details, visit the [Mistral-7B-cybersecurity-rules model page](https://huggingface.co/jcordon5/Mistral-7B-cybersecurity-rules).


### Installation

1. **Navigate to the LLM-Powered-Analysis Directory:**
    ```bash
    cd LLM-Powered-Analysis
    ```

2. **Install Required Packages:**
    ```bash
    pip install -r requirements.env
    ```

### Usage
Go to the `main.py` file change the given SHAP values to the ones you want to analyze and run the `main.py` script to start the analysis.

## Nancy Dashboard

NANCY Dashboard for XAI, a multi-app project is using Next.js 14 app routing and Tailwind CSS, built with PNPM. Follow the instructions below to set up and customize your dashboard!

## 🚀 Getting Started

### Prerequisites

Before you begin, you need PNPM installed on your machine. Here's how to get it:

- **Install Node.js**: PNPM requires Node.js. Download it from [nodejs.org](https://nodejs.org/).
- **Install PNPM**: Run the following command in your terminal:
  ```bash
  npm install -g pnpm
  ```

For more details, visit the [official PNPM installation guide](https://pnpm.io/installation).

### Installation

Clone the repository and install dependencies:
```bash
git clone https://github.com/Sidroco-Holdings-Ltd/NANCY_XAI_Dashboard.git
cd nancy-dashboard
pnpm install
```

### Running the Application

To start the development server, run:
```bash
pnpm dev
```
Navigate to `http://localhost:3000/dashboard` to view the dashboard.

## 📁 File Structure

To manage your images for the dashboard, follow these guidelines:

- **Create Image Folders**: Inside the `public/images` directory, create a folder for each module name.
  - Each module folder should have at least one subfolder named either `global` or `local`.
  - Place your `.png` or `.jpg` images within these subfolders.

  Example structure:
  
``` 
public/
└─ images/
   └─ module1/
      ├─ global/
      │  └─ attack_type_1.png
      └─ local/
         └─ attack_type_2.jpg 
  ```
  

  - **Image Naming**: Name the images like `feature_type_description.format`. They will appear as options in the dropdown menu in your UI.

## 🎨 Customizing Styles

To customize your color themes:

- **Tailwind Configuration**: Edit the `tailwind.config.ts` file to add new colors. Learn more about this from [Tailwind CSS configuration](https://tailwindcss.com/docs/configuration).
- **Apply Colors in Components**: Add your color as a className in your component to use it. Check out the [Tailwind CSS documentation](https://tailwindcss.com/docs) for how to apply these classes.

## 🔗 Multi-App Navigation

This project is structured as a multi-app dashboard. Each app operates under:
```
http://localhost:3000/dashboard/<folder_name>
```

## 📜 License & Usage

All rights reserved by Sidroco Holdings Ltd and MetaMinds Innovations. 

**Powered by:** TailAdmin Next.js Free is 100% free and open-source. Feel free to use it in your personal and commercial projects!
