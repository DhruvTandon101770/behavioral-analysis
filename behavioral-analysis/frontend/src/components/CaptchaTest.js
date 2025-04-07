import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import API_BASE_URL from "../api";

const socket = io(API_BASE_URL);

function CaptchaTest() {
  const navigate = useNavigate();
  const [keyData, setKeyData] = useState([]);
  const [mouseData, setMouseData] = useState([]);
  const [sessionStartTime] = useState(Date.now());
  const [scrollSpeed, setScrollSpeed] = useState(0);
  const [learningPhase, setLearningPhase] = useState(true); // ✅ Learning phase state
  const [phrase] = useState("Type this phrase exactly!");
  const [inputText, setInputText] = useState("");

  let lastMousePos = { x: 0, y: 0, time: Date.now() };
  let lastScrollTime = Date.now();

  useEffect(() => {
    // ✅ Learning Phase: Allow 1 min before detecting anomalies
    const learningTimer = setTimeout(() => {
      setLearningPhase(false); // Stop learning after 1 minute
    }, 60000); // 60,000 ms = 1 minute

    return () => clearTimeout(learningTimer);
  }, []);

  useEffect(() => {
    socket.on("anomaly_detected", (data) => {
      if (!learningPhase) {
        alert("Anomaly detected! Logging you out.");
        navigate("/logout");
      }
    });

    return () => socket.off("anomaly_detected");
  }, [navigate, learningPhase]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const now = Date.now();
      setKeyData((prev) => [
        ...prev,
        { key: event.key, time: now },
      ]);
    };

    const handleMouseMove = (event) => {
      const now = Date.now();
      const timeDiff = now - lastMousePos.time;
      const dx = event.clientX - lastMousePos.x;
      const dy = event.clientY - lastMousePos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const speed = timeDiff > 0 ? distance / timeDiff : 0;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      setMouseData((prev) => [
        ...prev,
        { speed, angle, distance, time: now },
      ]);

      lastMousePos = { x: event.clientX, y: event.clientY, time: now };
    };

    const handleScroll = () => {
      const now = Date.now();
      const timeDiff = now - lastScrollTime;
      const speed = timeDiff > 0 ? window.scrollY / timeDiff : 0;
      setScrollSpeed(speed);
      lastScrollTime = now;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSubmit = async () => {
    if (inputText !== phrase) {
      alert("Please type the phrase correctly.");
      return;
    }

    const sessionTime = (Date.now() - sessionStartTime) / 1000; // Convert to seconds

    const requestBody = {
      username: localStorage.getItem("username") || "unknown_user",
      keyData,
      mouseData,
      sessionTime,
      scrollSpeed,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/validate_captcha`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      if (data.anomaly) {
        alert("Anomaly detected! Logging you out.");
        navigate("/logout");
      } else {
        alert("Behavior recorded. Redirecting...");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error submitting CAPTCHA data:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <h2>Behavioral CAPTCHA</h2>
      <p>Type this phrase: <strong>{phrase}</strong></p>
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <button onClick={handleSubmit} disabled={learningPhase}>
        {learningPhase ? "Learning in Progress..." : "Submit"}
      </button>
      {learningPhase && <p>Learning your behavior... Please wait.</p>}
    </div>
  );
}

export default CaptchaTest;