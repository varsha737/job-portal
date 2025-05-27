import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../api/axios';
import '../styles/UpdateProfile.css';

const UpdateProfile = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        location: '',
        skills: '',
        education: '',
        experience: '',
        phone: '',
        about: '',
        linkedin: '',
        github: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        // Fetch current user profile
        const fetchProfile = async () => {
            try {
                const response = await axios.get('/user/profile');
                const userData = response.data.user;
                setFormData(prev => ({
                    ...prev,
                    name: userData.name || '',
                    email: userData.email || '',
                    location: userData.location || '',
                    skills: userData.skills?.join(', ') || '',
                    education: userData.education || '',
                    experience: userData.experience || '',
                    phone: userData.phone || '',
                    about: userData.about || '',
                    linkedin: userData.social?.linkedin || '',
                    github: userData.social?.github || ''
                }));
            } catch (error) {
                toast.error('Failed to fetch profile data');
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Convert skills string to array
            const updatedData = {
                ...formData,
                skills: formData.skills.split(',').map(skill => skill.trim()),
                social: {
                    linkedin: formData.linkedin,
                    github: formData.github
                }
            };

            await axios.put('/user/update-profile', updatedData);
            toast.success('Profile updated successfully');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        }
    };

    return (
        <div className="update-profile-container">
            <h2>Update Profile</h2>
            <form onSubmit={handleSubmit} className="update-profile-form">
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-control"
                        disabled
                    />
                </div>

                <div className="form-group">
                    <label>Location</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="City, Country"
                    />
                </div>

                <div className="form-group">
                    <label>Skills (comma-separated)</label>
                    <input
                        type="text"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="React, Node.js, MongoDB"
                    />
                </div>

                <div className="form-group">
                    <label>Education</label>
                    <textarea
                        name="education"
                        value={formData.education}
                        onChange={handleChange}
                        className="form-control"
                        rows="3"
                        placeholder="Your educational background"
                    />
                </div>

                <div className="form-group">
                    <label>Experience</label>
                    <textarea
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className="form-control"
                        rows="3"
                        placeholder="Your work experience"
                    />
                </div>

                <div className="form-group">
                    <label>Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="+1234567890"
                    />
                </div>

                <div className="form-group">
                    <label>About</label>
                    <textarea
                        name="about"
                        value={formData.about}
                        onChange={handleChange}
                        className="form-control"
                        rows="4"
                        placeholder="Tell us about yourself"
                    />
                </div>

                <div className="form-group">
                    <label>LinkedIn Profile</label>
                    <input
                        type="url"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="https://linkedin.com/in/yourprofile"
                    />
                </div>

                <div className="form-group">
                    <label>GitHub Profile</label>
                    <input
                        type="url"
                        name="github"
                        value={formData.github}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="https://github.com/yourusername"
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                        Update Profile
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate('/dashboard')}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateProfile; 