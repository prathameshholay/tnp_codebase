import React, { useEffect, useState } from 'react';
import styles from './ProfilePage.module.css';
import ProfileForm from './ProfileForm';
import api from '../api'; // ✅ Using shared axios instance
import { useNavigate } from 'react-router-dom'; // Import useNavigate


const INITIAL_FORM_DATA = {
    fullName: '',
    age: '',
    bio: '',
    avatar: '',
    skills: '', // Stored as a comma-separated string in the form
    education: '',
    experience: '',
    github: '',
    linkedin: ''
};

// const navigate = useNavigate(); // This line was incorrect and has been removed. Hooks must be called inside components.


const ProfilePage = () => {
    const [profileData, setProfileData] = useState(null);
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [viewState, setViewState] = useState('loading'); // 'loading', 'displayProfile', 'editForm', 'createForm', 'showCreateButton', 'error'
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate(); // Correctly initialize useNavigate inside the component

    const fetchProfile = async () => {
        setViewState('loading');
        setErrorMsg('');
        try {
            const res = await api.get('/api/profile/me');

            if (res.data) {
                setProfileData(res.data);
                setFormData({
                    fullName: res.data.fullName || '',
                    age: res.data.age || '',
                    bio: res.data.bio || '',
                    avatar: res.data.avatar || '',
                    skills: (res.data.skills || []).join(', '),
                    education: res.data.education || '', // Assuming these are single string fields
                    experience: res.data.experience || '', // If they are objects/arrays, adjust accordingly
                    github: res.data.github || '',
                    linkedin: res.data.linkedin || '',
                });
                setViewState('displayProfile');
            } else {
                // This case might not be hit if API returns 404 for no profile
                setProfileData(null);
                setFormData(INITIAL_FORM_DATA);
                setViewState('showCreateButton');
            }
        } catch (err) {
            if (err.response?.status === 404) {
                setProfileData(null);
                setFormData(INITIAL_FORM_DATA);
                setViewState('showCreateButton');
            } else if (err.response?.status === 401) {
                setProfileData(null);
                setErrorMsg('Please login to view your profile.');
                setViewState('error');
            } else {
                setProfileData(null);
                setErrorMsg(err.response?.data?.msg || 'Failed to fetch profile. Please try again.');
                setViewState('error');
            }
        }
    };

    const handleBackToDashboard = () => {
        navigate('/dashboard/student'); // Or whatever your dashboard route is
    };

    useEffect(() => {
        fetchProfile();
    }, []);
    // No dependencies needed if fetchProfile doesn't rely on props/state outside its own closure

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete your profile?')) return;

        try {
            await api.delete('/api/profile');
            setProfileData(null);
            setFormData(INITIAL_FORM_DATA);
            setViewState('showCreateButton');
            setErrorMsg(''); // Clear any previous errors
        } catch (err) {
            setErrorMsg(err.response?.data?.msg || 'Failed to delete profile. Please try again.');
            // The viewState might remain 'displayProfile' if deletion failed but profile still exists
        }
    };

    const handleFormSubmitSuccess = async () => {
        // Called by ProfileForm upon successful submission (create or update)
        await fetchProfile(); // Refetch to get the latest data and reset view
    };

    const handleEditClick = () => {
        // FormData should already be populated from profileData
        setViewState('editForm');
        setErrorMsg('');
    };

    const handleCreateNewClick = () => {
        setFormData(INITIAL_FORM_DATA); // Ensure form is blank for creation
        setViewState('createForm');
        setErrorMsg('');
    };

    const handleCancelForm = () => {
        setErrorMsg('');
        if (profileData) {
            // If canceling edit, revert formData to match current profileData
            setFormData({
                fullName: profileData.fullName || '',
                age: profileData.age || '',
                bio: profileData.bio || '',
                avatar: profileData.avatar || '',
                skills: (profileData.skills || []).join(', '),
                education: profileData.education || '',
                experience: profileData.experience || '',
                github: profileData.github || '',
                linkedin: profileData.linkedin || ''
            });
            setViewState('displayProfile');
        } else {
            // If canceling create (and no profile existed)
            setFormData(INITIAL_FORM_DATA);
            setViewState('showCreateButton');
        }
    };

    return (
        <div className={styles.profileContainer}>
            <button onClick={handleBackToDashboard} className={styles.backButton}>
                &larr; Back to Dashboard
            </button>
            <h2>Your Profile</h2>
            {errorMsg && <p className={styles.error}>{errorMsg}</p>}

            {viewState === 'loading' && <p>Loading profile...</p>}

            {viewState === 'displayProfile' && profileData && (
                <div className={styles.profileView}>
                    <p><strong>Full Name:</strong> {profileData.fullName || 'Not specified'}</p>
                    <p><strong>Age:</strong> {profileData.age || 'Not specified'}</p>
                    <p><strong>Bio:</strong> {profileData.bio || 'Not specified'}</p>
                    <p><strong>Skills:</strong> {profileData.skills?.join(', ') || 'Not specified'}</p>
                    <p><strong>Education:</strong> {profileData.education || 'Not specified'}</p>
                    <p><strong>Experience:</strong> {profileData.experience || 'Not specified'}</p>
                    <p><strong>GitHub:</strong> {profileData.github ? <a href={profileData.github} target="_blank" rel="noopener noreferrer">{profileData.github}</a> : 'Not specified'}</p>
                    <p><strong>LinkedIn:</strong> {profileData.linkedin ? <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer">{profileData.linkedin}</a> : 'Not specified'}</p>
                    <p><strong>Avatar URL:</strong> {profileData.avatar ? <a href={profileData.avatar} target="_blank" rel="noopener noreferrer">{profileData.avatar}</a> : 'Not specified'}</p>
                    {/* Consider displaying avatar as an image if it's an image URL: <img src={profileData.avatar} alt="Avatar" /> */}

                    <div className={styles.profileViewActions}>
                        <button onClick={handleEditClick}>Edit Profile</button>
                        <button onClick={handleDelete} className={styles.deleteButton}>Delete Profile</button>
                    </div>
                </div>
            )}

            {(viewState === 'editForm' || viewState === 'createForm') && (
                <div>
                    <ProfileForm
                        defaultData={formData}
                        onComplete={handleFormSubmitSuccess}
                        formMode={viewState === 'editForm' ? 'edit' : 'create'}
                    />
                    <div className={styles.formActions}>
                        <button type="button" onClick={handleCancelForm} className={styles.cancelButton}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {viewState === 'showCreateButton' && !profileData && (
                <div className={styles.actionsContainer}>
                    <button onClick={handleCreateNewClick} className={styles.createButton}>
                        Create New Profile
                    </button>
                </div>
            )}

            {viewState === 'error' && errorMsg && !errorMsg.toLowerCase().includes('login') && (
                <div className={styles.actionsContainer}>
                    <button onClick={fetchProfile}>Try Again</button>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
