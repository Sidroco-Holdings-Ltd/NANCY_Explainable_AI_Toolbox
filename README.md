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

## Dataset

The model was trained on the [NANCY SNS JU Project - Cyberattacks on O-RAN 5G Testbed Dataset](https://zenodo.org/records/14811122) available on Zenodo. This dataset contains network traffic flows with various features including packet lengths, inter-arrival times, flag counts, and other network-specific metrics.

## Explainability Approaches

The tool provides both global and local explainability for the model's predictions:

### Global Explainability
Uses SHAP (SHapley Additive exPlanations) to provide overall feature importance for each class of traffic. This helps understand what features the model generally considers most important when identifying each type of traffic or attack.

### Local Explainability
Uses LIME (Local Interpretable Model-agnostic Explanations) to explain individual predictions. This helps understand why the model classified a specific network flow the way it did.

## Installation

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
