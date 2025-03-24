from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import pandas as pd
import traceback
from .integrated_explainer import IntegratedExplainer

app = Flask(__name__)
CORS(app)

MODEL_PATH = os.getenv('MODEL_PATH', None)
SCALER_PATH = os.getenv('SCALER_PATH', None)
PREDICTION_URL = os.getenv('PREDICTION_URL', 'http://localhost:5000')

explainer = IntegratedExplainer(MODEL_PATH, SCALER_PATH, PREDICTION_URL)

@app.route('/status', methods=['GET'])
def status():
    prediction_available = explainer.check_prediction_service()
    model_loaded = explainer.model is not None
    
    return jsonify({
        'status': 'ok',
        'prediction_service': 'available' if prediction_available else 'unavailable',
        'model_loaded': model_loaded,
        'model_path': explainer.model_path,
        'prediction_url': PREDICTION_URL
    })

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    data_file = request.files.get('file')
    
    if data_file is None:
        return jsonify({'error': 'No files selected'}), 400

    time_index = request.form.get('time_index', type=int)
    if time_index is None:
        return jsonify({'error': 'time_index is required and must be an integer'}), 400
    
    try:
        df = pd.read_csv(data_file)
        result = explainer.predict(df, time_index)
        return jsonify(result)
    except Exception as e:
        return jsonify({
            'error': str(e),
            'traceback': traceback.format_exc()
        }), 500

@app.route('/explain/global', methods=['POST'])
def explain_global():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    data_file = request.files.get('file')
    
    if data_file is None:
        return jsonify({'error': 'No files selected'}), 400
    
    output_dir = request.form.get('output_dir', 'Global_Explainability')
    
    try:
        df = pd.read_csv(data_file)
        results = explainer.explain_global(df, output_dir)
        
        return jsonify(results)
    except Exception as e:
        return jsonify({
            'error': str(e),
            'traceback': traceback.format_exc()
        }), 500

@app.route('/explain/local', methods=['POST'])
def explain_local():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    data_file = request.files.get('file')
    
    if data_file is None:
        return jsonify({'error': 'No files selected'}), 400

    sample_id = request.form.get('sample_id', type=int)
    if sample_id is None:
        return jsonify({'error': 'sample_id is required and must be an integer'}), 400
    
    output_dir = request.form.get('output_dir', 'Local_Explainability')
    
    try:
        df = pd.read_csv(data_file)
        results = explainer.explain_local(df, sample_id, output_dir)
        
        return jsonify(results)
    except Exception as e:
        return jsonify({
            'error': str(e),
            'traceback': traceback.format_exc()
        }), 500

@app.route('/', methods=['GET'])
def index():
    return 'XAI Outage Prediction Integration API'

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)