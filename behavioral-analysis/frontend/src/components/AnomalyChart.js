import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import API_BASE_URL from "../api";

// ✅ Register required scales and elements
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const socket = io(API_BASE_URL);

function AnomalyChart() {
  const [anomalies, setAnomalies] = useState([]);

  // Fetch anomalies from backend
  useEffect(() => {
    const fetchAnomalies = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/get_anomalies`);
        const data = await response.json();
        setAnomalies(data);
      } catch (error) {
        console.error("Error fetching anomaly data:", error);
      }
    };

    fetchAnomalies();

    // Listen for real-time anomalies
    socket.on("anomaly_detected", (data) => {
      setAnomalies((prev) => [
        ...prev,
        { timestamp: new Date().toISOString(), is_anomaly: 1 },
      ]);
    });

    return () => socket.off("anomaly_detected");
  }, []);

  const chartData = {
    labels: anomalies.map((entry) => new Date(entry.timestamp).toLocaleTimeString()), // Format time for X-axis
    datasets: [
      {
        label: "Anomalies Detected",
        data: anomalies.map((entry) => (entry.is_anomaly ? 1 : 0)), // Y-axis: 1 (Anomaly) or 0 (Normal)
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.5)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: true } },
    scales: {
      x: { type: "category", title: { display: true, text: "Timestamp" } },
      y: { type: "linear", title: { display: true, text: "Anomaly (0=Normal, 1=Anomaly)" } },
    },
  };

  return (
    <div>
      <h3>Anomaly Monitoring</h3>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default AnomalyChart;
