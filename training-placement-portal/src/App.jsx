// App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/home";
import Login from "./components/Students/studentLogin";
import Dashboard from "./components/Dashboard";
import Register from "./components/Students/studentRegister"; // ✅ Updated import path
import "./App.css";
import ProfilePage from './components/profiles/StudentProfilePage';
import SettingsPage from './components/Settings/settingsPage'; // Import the new page


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register/:role" element={<Register />} /> {/* Role-based register */}
        <Route path="/student/login" element={<Login />} />
        <Route path="/dashboard/:role" element={<Dashboard />} />
        <Route path="/settings" element={<SettingsPage />} /> {/* Add this line */}

        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
};

export default App;
