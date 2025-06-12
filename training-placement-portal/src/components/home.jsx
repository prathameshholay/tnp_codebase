import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

const Home = () => {
  return (
    <div className="home-page">
      <header>
        <nav className="navbar">
          <a href="#">Home</a>
          <a href="#">About Us</a>
          <a href="#">Pages</a>
          <a href="#">Courses</a>
          <a href="#">Blog</a>
        </nav>

        <div className="social-icons" aria-label="Social media links">
          <a href="#" aria-label="Facebook"><FaFacebook /></a>
          <a href="#" aria-label="Twitter"><FaTwitter /></a>
          <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
          <a href="#" aria-label="Instagram"><FaInstagram /></a>
        </div>
      </header>

      <main>
        <h1>Training and Placement Portal</h1>

        <section className="card-container">
          <Link to="/register/student" className="card">Student</Link>
          <Link to="/register/admin" className="card">Admin</Link>
          <Link to="/register/tpo" className="card">TPO</Link>
          <Link to="/register/company" className="card">Company</Link>
        </section>
      </main>
    </div>
  );
};

export default Home;
