import React from "react";
import "../styles/Audit.css";  // In Audit.js

const Audit = ({ auditLogs }) => {
  return (
    <div>
      <h1>Audit Logs</h1>
      <table border="1">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>UserID</th>
            <th>Action</th>
            <th>TableName</th>
            <th>RecordID</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {auditLogs.map((log) => (
            <tr key={log.Timestamp}>
              <td>{log.Timestamp}</td>
              <td>{log.UserID}</td>
              <td>{log.Action}</td>
              <td>{log.TableName}</td>
              <td>{log.RecordID}</td>
              <td>{log.Details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Audit;
