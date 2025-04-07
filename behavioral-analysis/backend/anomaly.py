import numpy as np
import pickle
from flask import request, jsonify
from database import get_db_connection

# Load Pretrained Model & Scaler
with open("behavioral-analysis/backend/isolation_forest_model.pkl", "rb") as f:
    model = pickle.load(f)

with open("behavioral-analysis/backend/scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

def detect_anomaly(data):
    try:
        key_times = [k["time"] for k in data["keyData"]]
        mouse_speeds = [
            np.sqrt((data["mouseData"][i]["x"] - data["mouseData"][i - 1]["x"]) ** 2 +
                    (data["mouseData"][i]["y"] - data["mouseData"][i - 1]["y"]) ** 2)
            for i in range(1, len(data["mouseData"]))
        ]

        # Extract Features
        key_intervals = np.diff(key_times).tolist() if len(key_times) > 1 else [0]
        avg_mouse_speed = np.mean(mouse_speeds) if mouse_speeds else 0
        feature_vector = key_intervals + [avg_mouse_speed]

        # Normalize and Predict
        feature_vector = scaler.transform([feature_vector])
        anomaly_score = model.predict(feature_vector)

        return anomaly_score[0] == -1
    except Exception as e:
        print("Anomaly detection error:", e)
        return False
    
def log_anomaly(user, is_anomalous):
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO anomalies (user, anomaly_detected) VALUES (%s, %s)", (user, is_anomalous))
        conn.commit()
        cursor.close()
        conn.close()

# API Endpoint
def validate_captcha():
    data = request.json
    is_anomalous = detect_anomaly(data)
    return jsonify({"anomaly": is_anomalous})
