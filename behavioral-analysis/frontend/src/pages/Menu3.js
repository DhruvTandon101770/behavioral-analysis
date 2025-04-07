import React from "react";
import "../styles/Menu3.css"; 

const Menu3 = ({ appointments }) => {
  return (
    <div>
      <h2>Appointments</h2>
      <table>
        <thead>
          <tr>
            <th>Appointment ID</th>
            <th>Doctor ID</th>
            <th>Patient ID</th>
            <th>Date</th>
            <th>Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.AppointmentID}>
              <td>{appointment.AppointmentID}</td>
              <td>{appointment.DoctorID}</td>
              <td>{appointment.PatientID}</td>
              <td>{appointment.Date}</td>
              <td>{appointment.Time}</td>
              <td>
                <button onClick={() => alert("Update appointment")}>Update</button>
                <button onClick={() => alert("Delete appointment")}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Menu3;
