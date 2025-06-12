// SettingsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SettingsPage.module.css';
import api from '../api'; // Assuming you have a shared api instance

const SettingsPage = () => {
    const navigate = useNavigate();

    // --- State for Settings ---
    // Change Password
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

    // Notification Preferences
    const [allowNotifications, setAllowNotifications] = useState(true); // Default to true

    // Theme
    const [selectedTheme, setSelectedTheme] = useState(() => {
        const savedTheme = localStorage.getItem('appTheme');
        return savedTheme || 'light';
    });
    // --- Effects ---
    // Load settings from backend or local storage on component mount (placeholder)
    useEffect(() => {
        // Example: Load theme from localStorage
        const savedTheme = localStorage.getItem('appTheme');
        if (savedTheme) {
            setSelectedTheme(savedTheme);
        }
    }, []);

    // Apply theme when selectedTheme changes
    useEffect(() => {
        document.body.classList.remove('theme-light', 'theme-dark');
        document.body.classList.add(`theme-${selectedTheme}`);
        localStorage.setItem('appTheme', selectedTheme); // Save theme
    }, [selectedTheme]);


    // --- Handlers ---
    const handleBackToDashboard = () => {
        navigate(-1); // Navigates back to the previous page (Dashboard)
    };

    const handleChangePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordMessage({ type: '', text: '' });
        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
            return;
        }
        if (newPassword.length < 6) {
            setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters long.' });
            return;
        }

        try {
            // Placeholder for API call
            // const response = await api.post('/api/auth/change-password', { currentPassword, newPassword });
            console.log('API Call: Change Password', { currentPassword, newPassword });
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

            setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            setPasswordMessage({ type: 'error', text: error.response?.data?.msg || 'Failed to change password.' });
        }
    };

    const handleNotificationToggle = async () => {
        const newPreference = !allowNotifications;
        setAllowNotifications(newPreference);
        try {
            // Placeholder for API call
            // await api.put('/api/settings/notifications', { allowNotifications: newPreference });
            console.log('API Call: Update Notification Preference', { allowNotifications: newPreference });
            // Optionally show a success message
        } catch (error) {
            console.error("Failed to update notification preference", error);
            setAllowNotifications(!newPreference); // Revert on error
            // Optionally show an error message
        }
    };

    const handleThemeChange = (e) => {
        setSelectedTheme(e.target.value);
        // Placeholder: Save theme preference to backend if needed
        // api.put('/api/settings/theme', { theme: e.target.value });
    };

    return (
        <div className={styles.settingsContainer}>
            <button onClick={handleBackToDashboard} className={styles.backButton}>
                &larr; Back to Dashboard
            </button>
            <h2>Settings</h2>

            <div className={styles.settingsContent}>
                {/* Change Password Section */}
                <div className={styles.settingItem}>
                    <h4>Change Password</h4>
                    <form onSubmit={handleChangePasswordSubmit} className={styles.settingsForm}>
                        <div className={styles.formGroup}>
                            <label htmlFor="currentPassword">Current Password</label>
                            <input type="password" id="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="newPassword">New Password</label>
                            <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="confirmPassword">Confirm New Password</label>
                            <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        </div>
                        {passwordMessage.text && (
                            <p className={passwordMessage.type === 'error' ? styles.errorMessage : styles.successMessage}>
                                {passwordMessage.text}
                            </p>
                        )}
                        <button type="submit" className={styles.saveButton}>Change Password</button>
                    </form>
                </div>

                {/* Notification Preferences Section */}
                <div className={styles.settingItem}>
                    <h4>Notification Preferences</h4>
                    <div className={styles.toggleSwitch}>
                        <label htmlFor="allowNotifications">Allow Notifications</label>
                        <input type="checkbox" id="allowNotifications" checked={allowNotifications} onChange={handleNotificationToggle} />
                        <span className={styles.slider}></span>
                    </div>
                </div>

                {/* Theme Section */}
                <div className={styles.settingItem}>
                    <h4>Theme</h4>
                    <div className={styles.themeOptions}>
                        <label>
                            <input type="radio" name="theme" value="light" checked={selectedTheme === 'light'} onChange={handleThemeChange} /> Light
                        </label>
                        <label>
                            <input type="radio" name="theme" value="dark" checked={selectedTheme === 'dark'} onChange={handleThemeChange} /> Dark
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
