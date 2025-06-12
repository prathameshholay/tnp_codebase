import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";
import { Menu, X } from "lucide-react";
import api from "../components/api"; // Use centralized API layer

const Dashboard = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profile, setProfile] = useState(null);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const logout = async () => {
    try {
      await api.post("/api/students/logout");
      navigate("/student/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
    try {
      const res = await api.get("/api/profile/me");
      setProfile(res.data);
    } catch (err) {
      if (err.response?.status === 404 && err.response?.data?.msg === "Profile not found") {
        console.warn("Profile missing, redirecting to create profile");
        navigate("/profile"); // ✅ redirect to profile creation
      } else if (err.response?.status === 401) {
        console.warn("Session expired or unauthorized");
        navigate("/student/login");
      } else {
        console.error("Unexpected error fetching profile:", err);
      }
    }
  };
    fetchProfile();
  }, [navigate]);

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <button
          onClick={toggleMenu}
          className={styles.menuButton}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h1 className={styles.title}>
          {(role ? role.charAt(0).toUpperCase() + role.slice(1) : "User")} Dashboard
        </h1>
      </header>

      <div className={styles.main}>
        <aside className={`${styles.sidebar} ${menuOpen ? styles.open : ""}`}>
          <ul>
            <li>
              <button onClick={() => navigate("/profile")}>Profile</button>
            </li>
            <li>
              <button onClick={() => navigate("/settings")}>Settings</button>
            </li>
            <li>
              <button onClick={logout}>Logout</button>
            </li>
          </ul>
        </aside>

        <section className={styles.content}>
          <h2>Welcome, {profile?.fullName || "Loading..."}</h2>
          <p>This is a protected area accessible only after login.</p>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
