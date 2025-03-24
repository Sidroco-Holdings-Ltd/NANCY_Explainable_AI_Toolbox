FROM python:3.8-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install requests flask flask_cors

COPY . .

EXPOSE 5001

ENV MODEL_PATH=""
ENV SCALER_PATH=""
ENV PREDICTION_URL="http://outage-prediction:5000"

CMD ["python", "-m", "integration_with_ainqm.api"]