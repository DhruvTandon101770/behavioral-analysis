import React from "react";
import "../styles/Admin.css";  // In Admin.js

const Admin = ({ stats, users, auditLogs }) => {
  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>

      <div className="stats-container">
        <h3>System Statistics</h3>
        <div className="stats-grid">
          <div className="stat-box">
            <h4>Patients</h4>
            <p>{stats.patientCount}</p>
          </div>
          <div className="stat-box">
            <h4>Doctors</h4>
            <p>{stats.doctorCount}</p>
          </div>
          <div className="stat-box">
            <h4>Appointments</h4>
            <p>{stats.appointmentCount}</p>
          </div>
          <div className="stat-box">
            <h4>Users</h4>
            <p>{stats.userCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
