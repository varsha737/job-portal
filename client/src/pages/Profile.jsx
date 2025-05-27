import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import '../styles/Profile.css';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('/user/profile');
                setProfile(response.data.user);
                setLoading(false);
            } catch (error) {
                toast.error('Failed to fetch profile data');
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) {
        return <div className="profile-loading">Loading...</div>;
    }

    if (!profile) {
        return <div className="profile-error">Failed to load profile</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>{profile.name}</h1>
                <p className="location">{profile.location}</p>
            </div>

            <div className="profile-grid">
                <div className="profile-section">
                    <h2>About</h2>
                    <p>{profile.about || 'No information provided'}</p>
                </div>

                <div className="profile-section">
                    <h2>Contact Information</h2>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Phone:</strong> {profile.phone || 'Not provided'}</p>
                </div>

                <div className="profile-section">
                    <h2>Skills</h2>
                    <div className="skills-container">
                        {profile.skills && profile.skills.length > 0 ? (
                            profile.skills.map((skill, index) => (
                                <span key={index} className="skill-tag">{skill}</span>
                            ))
                        ) : (
                            <p>No skills listed</p>
                        )}
                    </div>
                </div>

                <div className="profile-section">
                    <h2>Education</h2>
                    <p>{profile.education || 'No education details provided'}</p>
                </div>

                <div className="profile-section">
                    <h2>Experience</h2>
                    <p>{profile.experience || 'No experience details provided'}</p>
                </div>

                <div className="profile-section">
                    <h2>Social Links</h2>
                    <div className="social-links">
                        {profile.social?.linkedin && (
                            <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                                LinkedIn
                            </a>
                        )}
                        {profile.social?.github && (
                            <a href={profile.social.github} target="_blank" rel="noopener noreferrer" className="social-link">
                                GitHub
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <div className="profile-actions">
                <Link to="/update-profile" className="edit-profile-btn">
                    Edit Profile
                </Link>
            </div>
        </div>
    );
};

export default Profile; 