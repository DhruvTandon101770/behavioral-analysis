import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../api"; // Ensure this points to `http://127.0.0.1:5500`

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        await fetch(`${API_BASE_URL}/logout`, {
          method: "POST",
          credentials: "include", // Ensures session cookies are cleared
        });

        localStorage.removeItem("username");
        navigate("/login");
      } catch (error) {
        console.error("Logout error:", error);
      }
    };

    logoutUser();
  }, [navigate]);

  return (
    <div>
      <h2>Logging Out...</h2>
      <p>Redirecting to login page...</p>
    </div>
  );
}

export default Logout;
