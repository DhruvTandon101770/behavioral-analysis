from flask import Flask, request, jsonify, session
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import random
import time
import numpy as np
import pickle
from database import get_db_connection
import joblib
from threading import Timer
from database import save_behavior_data

# Load Pretrained Model & Scaler
with open("scaler.pkl", "rb") as f:
    scaler = joblib.load(f)

with open("isolation_forest_model.pkl", "rb") as f:
    model = joblib.load(f)

# Ensure the model is fitted
if not hasattr(model, "estimators_"):
    raise ValueError("ERROR: The IsolationForest model is not fitted. Train and save it correctly before using.")

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
CORS(app, supports_credentials=True)
socketio = SocketIO(app, cors_allowed_origins="*")

# Simulated user database
users = {"admin": "password123"}

def extract_features(data):
    """Extracts features for anomaly detection."""
    key_times = [k["time"] for k in data["keyData"]]
    mouse_speeds = [m["speed"] for m in data["mouseData"]]
    mouse_angles = [m["angle"] for m in data["mouseData"]]
    mouse_distances = [m["distance"] for m in data["mouseData"]]

    if len(key_times) > 1:
        H1 = np.mean(np.diff(key_times))  # Time between press & release
        H2 = np.mean(np.diff(key_times, n=2))  # Successive key presses
    else:
        H1, H2 = 0, 0

    RP = H1 / 2
    PP = H2 / 2
    RR = RP / 2
    PR = PP / 2

    avg_mouse_speed = np.mean(mouse_speeds) if mouse_speeds else 0
    avg_mouse_angle = np.mean(mouse_angles) if mouse_angles else 0
    avg_mouse_distance = np.mean(mouse_distances) if mouse_distances else 0
    session_time = data.get("sessionTime", 0)
    scroll_speed = data.get("scrollSpeed", 0)

    feature_vector = np.array([H1, H2, RP, PP, RR, PR, avg_mouse_speed, avg_mouse_angle, avg_mouse_distance, session_time, scroll_speed]).reshape(1, -1)
    return feature_vector

learning_phase = {}  # Dictionary to store user learning status

@app.route("/validate_captcha", methods=["POST"])
def validate_captcha():
    try:
        data = request.json
        username = data.get("username", "unknown_user")
        key_data = data.get("keyData", [])
        mouse_data = data.get("mouseData", [])
        session_time = data.get("sessionTime", 0)
        scroll_speed = data.get("scrollSpeed", 0)

        # Ensure at least 1 minute has passed before detecting anomaly
        if "login_time" not in session:
            session["login_time"] = time.time()

        if time.time() - session["login_time"] < 60:
            save_behavior_data(username, key_data, mouse_data, session_time, scroll_speed, is_anomaly=0)
            return jsonify({"message": "Behavioral data collected. Learning in progress.", "anomaly": False})

        # Extract features
        feature_vector = [
            np.mean([k["time"] for k in key_data]) if key_data else 0,
            np.std([k["time"] for k in key_data]) if key_data else 0,
            np.mean([m["speed"] for m in mouse_data]) if mouse_data else 0,
            np.std([m["angle"] for m in mouse_data]) if mouse_data else 0,
            np.mean([m["distance"] for m in mouse_data]) if mouse_data else 0,
            session_time,
            scroll_speed
        ]

        # Normalize & Predict
        feature_vector = np.array(feature_vector).reshape(1, -1)
        feature_vector = scaler.transform(feature_vector)
        is_anomalous = model.predict(feature_vector)[0]

        save_behavior_data(username, key_data, mouse_data, session_time, scroll_speed, is_anomaly=int(is_anomalous))

        return jsonify({"anomaly": bool(is_anomalous)})

    except Exception as e:
        print(f"🔥 ERROR in validate_captcha: {e}")
        return jsonify({"error": "Server error"}), 500

def warn_if_anomalous(username):
    """ Check if user behavior remains anomalous after 1 minute. """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM behavioral_data WHERE user = %s AND is_anomaly = 1", (username,))
    anomaly_count = cursor.fetchone()[0]
    
    if anomaly_count > 5:  # Threshold for warning
        socketio.emit("anomaly_detected", {"message": f"Warning: Anomalous behavior detected for {username}!"})
    
    cursor.close()
    conn.close()
    learning_phase.pop(username, None)  # Remove from tracking

# Function to simulate anomaly detection
def detect_anomaly(data):
    """Processes behavior data and detects anomalies."""
    key_times = [k["time"] for k in data["keyData"]]
    mouse_speeds = [
        np.sqrt((data["mouseData"][i]["x"] - data["mouseData"][i - 1]["x"]) ** 2 +
                (data["mouseData"][i]["y"] - data["mouseData"][i - 1]["y"]) ** 2)
        for i in range(1, len(data["mouseData"]))
    ]

    key_intervals = np.diff(key_times).tolist() if len(key_times) > 1 else [0]
    avg_mouse_speed = np.mean(mouse_speeds) if mouse_speeds else 0
    feature_vector = np.array(key_intervals + [avg_mouse_speed]).reshape(1, -1)  # Ensure proper shape

    # Check if scaler is valid
    if not hasattr(scaler, "transform"):
        raise ValueError("Scaler object is invalid. Ensure 'scaler.pkl' is a trained StandardScaler.")

    feature_vector = scaler.transform(feature_vector)  # Normalize
    anomaly_score = model.predict(feature_vector)

    is_anomalous = anomaly_score[0] == -1
    if is_anomalous:
        socketio.emit("anomaly_detected", {"message": "Anomaly detected!"})  # Notify frontend

    return is_anomalous


from database import get_db_connection

def log_anomaly(user, is_anomalous):
    """Logs anomaly detection results into MySQL."""
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            cursor.execute("INSERT INTO anomalies (user, anomaly_detected) VALUES (%s, %s)", (user, is_anomalous))
            conn.commit()
        except Exception as e:
            print("Error logging anomaly:", e)
        finally:
            cursor.close()
            conn.close()


@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username, password = data.get("username"), data.get("password")

    if username in users and users[username] == password:
        session["username"] = username  # Store session
        return jsonify({"message": "Login successful", "username": username}), 200
    else:
        return jsonify({"message": "Invalid username or password"}), 401


@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user', None)
    return jsonify({"success": True})

@app.route('/collect_data', methods=['POST'])
def collect_data():
    if 'user' not in session:
        return jsonify({"error": "Unauthorized"}), 401

    user_data = request.json
    anomaly_detected = detect_anomaly(user_data)
    
    if anomaly_detected:
        socketio.emit('anomaly_detected', {"message": "Anomaly detected! Logging out."})

    return jsonify({"anomaly": anomaly_detected})

@app.route("/get_anomalies", methods=["GET"])
def get_anomalies():
    """Fetches stored anomaly data from MySQL."""
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT timestamp, is_anomaly FROM behavioral_data ORDER BY timestamp DESC LIMIT 100")
    anomalies = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(anomalies)



@socketio.on('connect')
def handle_connect():
    print("Client connected")

if __name__ == "__main__":
    from flask_socketio import SocketIO

    socketio = SocketIO(app, cors_allowed_origins="*")
    socketio.run(app, host="0.0.0.0", port=5500, debug=True)

