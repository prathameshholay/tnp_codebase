// src/pages/StudentLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './StudentLogin.module.css';

const StudentLogin = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/students/login', credentials, {
        withCredentials: true,
      });
      navigate('/dashboard/student');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleLogin} className={styles.form}>
        <h2 className={styles.title}>Student Login</h2>
        {error && <p className={styles.error}>{error}</p>}
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          value={credentials.email}
          required
          className={styles.input}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          value={credentials.password}
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Login</button>
      </form>
      <button onClick={() => navigate('/register/student')} className={styles.registerButton}>No account? Register here</button>
    </div>
  );
};

export default StudentLogin;
