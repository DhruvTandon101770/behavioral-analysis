import React, { useEffect } from "react";

function Home() {
  useEffect(() => {
    console.log("✅ Home page loaded successfully!");
  }, []);

  return (
    <div>
      <h1>Welcome to the Behavioral Analysis System</h1>
      <p>Monitor user behavior and detect anomalies using AI.</p>
    </div>
  );
}

export default Home;

/*
import React from "react";
import "./Index.css";

const Index = () => {
  return (
    <div>
      <header>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/menu1">Patients</a></li>
            <li><a href="/menu2">Doctors</a></li>
            <li><a href="/menu3">Appointments</a></li>
            <li><a href="/audit">Audit Log</a></li>
            <li><a href="/logout" className="logout-btn">Logout</a></li>
          </ul>
        </nav>
      </header>

      <section className="cover">
        <img src="img/hospital-management-system.png" alt="TrueCare Hospital" />
        <div className="overlay"></div>
      </section>

      <main>
        <h1>Welcome to TrueCare Hospital</h1>
        <p>Your health, our promise.</p>
      </main>

      <footer>
        <p>&copy; 2024 TrueCare. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
*/