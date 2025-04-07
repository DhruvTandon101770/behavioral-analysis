import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import API_BASE_URL from "../api";
import AnomalyChart from "../components/AnomalyChart";

const socket = io(API_BASE_URL, { transports: ["websocket", "polling"] });

function Dashboard() {
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch initial anomaly data
    const fetchAnomalies = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/get_anomalies`);
        if (!response.ok) throw new Error("Failed to fetch anomalies");
        const data = await response.json();
        setAnomalies(data);
      } catch (err) {
        console.error("Error fetching anomalies:", err);
        setError("Failed to load anomalies.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnomalies();

    // Socket event listener for real-time anomaly detection
    socket.on("anomaly_detected", (data) => {
      alert(data.message);
      setAnomalies((prev) => [
        ...prev,
        { timestamp: new Date().toISOString(), is_anomaly: 1 },
      ]);
    });

    return () => {
      socket.off("anomaly_detected");
    };
  }, []);

  return (
    <div>
      <h2>Real-Time Anomaly Monitoring</h2>
      {loading ? <p>Loading...</p> : error ? <p>{error}</p> : <AnomalyChart data={anomalies} />}
    </div>
  );
}

export default Dashboard;
