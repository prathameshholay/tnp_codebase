import React, { useState, useEffect } from 'react';
import styles from './ProfileForm.module.css'; // Assuming you have a ProfileForm.module.css
import api from '../api';

const ProfileForm = ({ defaultData, onComplete, formMode = 'create' }) => { // formMode can be 'create' or 'edit'
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    bio: '',
    avatar: '',
    skills: '', // Keep as string for form input
    education: '',
    experience: '',
    github: '',
    linkedin: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (defaultData) {
      setFormData({
        fullName: defaultData.fullName || '',
        age: defaultData.age || '',
        bio: defaultData.bio || '',
        avatar: defaultData.avatar || '',
        skills: defaultData.skills || '', // defaultData.skills is already a string here
        education: defaultData.education || '',
        experience: defaultData.experience || '',
        github: defaultData.github || '',
        linkedin: defaultData.linkedin || ''
      });
    }
  }, [defaultData]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        // Convert skills string to array for the API, filter out empty strings
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        // Ensure age is a number if your backend expects it
        age: formData.age ? Number(formData.age) : undefined,
      };

      // Use POST for both create and update, as backend upsert handles it.
      const res = await api.post('/api/profile', payload);


      if (res.status === 200 || res.status === 201) {
        onComplete?.(); // Call the callback passed from ProfilePage
      }
    } catch (err) {
      setError(err.response?.data?.msg || err.response?.data?.error || 'Something went wrong. Please check your input.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>{formMode === 'edit' ? 'Edit Your Profile' : 'Create Your Profile'}</h2>
      {error && <p className={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="fullName" className={styles.label}>Full Name</label>
        <input id="fullName" type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" className={styles.input} required />

        <label htmlFor="age" className={styles.label}>Age</label>
        <input id="age" type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Age" className={styles.input} />

        <label htmlFor="avatar" className={styles.label}>Avatar URL</label>
        <input id="avatar" type="url" name="avatar" value={formData.avatar} onChange={handleChange} placeholder="https://example.com/avatar.jpg" className={styles.input} />

        <label htmlFor="bio" className={styles.label}>Bio</label>
        <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} placeholder="A short bio about yourself" className={styles.textarea} rows={3} />

        <label htmlFor="skills" className={styles.label}>Skills (comma-separated)</label>
        <input id="skills" type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="e.g., React, Node.js, Python" className={styles.input} />

        <label htmlFor="education" className={styles.label}>Education</label>
        <textarea id="education" name="education" value={formData.education} onChange={handleChange} placeholder="Your educational background" className={styles.textarea} rows={2} />

        <label htmlFor="experience" className={styles.label}>Experience</label>
        <textarea id="experience" name="experience" value={formData.experience} onChange={handleChange} placeholder="Your work experience" className={styles.textarea} rows={2} />

        <label htmlFor="github" className={styles.label}>GitHub URL</label>
        <input id="github" type="url" name="github" value={formData.github} onChange={handleChange} placeholder="https://github.com/yourusername" className={styles.input} />

        <label htmlFor="linkedin" className={styles.label}>LinkedIn URL</label>
        <input id="linkedin" type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/yourusername" className={styles.input} />

        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? 'Saving...' : (formMode === 'edit' ? 'Update Profile' : 'Save Profile')}
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
