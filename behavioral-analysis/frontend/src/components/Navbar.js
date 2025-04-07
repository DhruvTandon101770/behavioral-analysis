import React from "react";
import { Link } from "react-router-dom";
import "../styles/style.css"; // Ensure correct CSS import

function Navbar({ isAdmin }) {
  return (
    <nav>
      <ul className="nav-list">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/menu1">Menu 1</Link></li>
        <li><Link to="/menu2">Menu 2</Link></li>
        <li><Link to="/menu3">Menu 3</Link></li>
        {isAdmin && <li><Link to="/admin">Admin</Link></li>}
        {isAdmin && <li><Link to="/audit">Audit</Link></li>}
        {isAdmin && <li><Link to="/dashboard">Anomaly Chart</Link></li>}
        <li className="logout-container">
          <Link to="/logout" className="logout-btn">Logout</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
