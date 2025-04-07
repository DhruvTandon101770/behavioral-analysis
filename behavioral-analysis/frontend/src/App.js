import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";  // ✅ Use "Home.js" instead of "Index.js"
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Menu1 from "./pages/Menu1";
import Menu2 from "./pages/Menu2";
import Menu3 from "./pages/Menu3";
import Audit from "./pages/Audit";
import Admin from "./pages/Admin";
import CaptchaTest from "./components/CaptchaTest";
import "./styles/style.css"; 

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />   {/* ✅ Updated to "Home.js" */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/menu1" element={<Menu1 />} />
        <Route path="/menu2" element={<Menu2 />} />
        <Route path="/menu3" element={<Menu3 />} />
        <Route path="/audit" element={<Audit />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/captcha" element={<CaptchaTest />} />
      </Routes>
    </>
  );
}

export default App;
