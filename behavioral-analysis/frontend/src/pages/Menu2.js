import React from "react";
import "../styles/Menu2.css"; 

const Menu2 = ({ doctors }) => {
  return (
    <div>
      <h2>Doctors</h2>
      <table>
        <thead>
          <tr>
            <th>Doctor ID</th>
            <th>Name</th>
            <th>Speciality</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => (
            <tr key={doctor.DoctorID}>
              <td>{doctor.DoctorID}</td>
              <td>{doctor.Name}</td>
              <td>{doctor.Speciality}</td>
              <td>
                <button onClick={() => alert("Update doctor")}>Update</button>
                <button onClick={() => alert("Delete doctor")}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Menu2;
