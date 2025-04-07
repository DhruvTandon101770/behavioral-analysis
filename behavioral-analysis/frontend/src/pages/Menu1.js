import React from "react";
import "../styles/Menu1.css"; 

const Menu1 = ({ patients }) => {
  return (
    <div>
      <h2>Patients List</h2>
      <table>
        <thead>
          <tr>
            <th>Patient ID</th>
            <th>Name</th>
            <th>Contact</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.PatientID}>
              <td>{patient.PatientID}</td>
              <td>{patient.Name}</td>
              <td>{patient.Contact}</td>
              <td>
                <button onClick={() => alert("Update patient")}>Update</button>
                <button onClick={() => alert("Delete patient")}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Menu1;
