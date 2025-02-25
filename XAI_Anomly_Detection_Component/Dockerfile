FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY anomaly_detection_explainer.py .
COPY model/ ./model/
COPY Scaler/ ./Scaler/

EXPOSE 8000

CMD ["python", "anomaly_detection_explainer.py"]