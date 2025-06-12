// src/components/Register.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../Students/styles/Register.module.css';

const Register = () => {
  const { role } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (role === 'student') {
        await axios.post(
          'http://localhost:5000/api/students/register',
          formData,
          { withCredentials: true } // Only needed if backend sets a cookie here
        );
        navigate('/student/login');
      } else {
        setError('Registration for this role is not implemented yet');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  if (role !== 'student') {
    return <h2 className={styles.message}>Registration for "{role}" is not implemented yet.</h2>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>
        {role.charAt(0).toUpperCase() + role.slice(1)} Registration
      </h2>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          className={styles.input}
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          className={styles.input}
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          className={styles.input}
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className={styles.button}>Register</button>
      </form>
      <button
  type="button"
  className={styles.loginRedirect}
  onClick={() => navigate(`/${role}/login`)}
>
  Already registered? Login here
</button>

    </div>
  );
};

export default Register;
