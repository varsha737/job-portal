import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [jobData, setJobData] = useState({
        position: '',
        company: '',
        status: '',
        workType: '',
        workLocation: '',
    });

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`/api/v1/job/get-job/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setJobData(res.data.job);
            } catch (error) {
                console.error('Failed to fetch job:', error);
            }
        };

        fetchJob();
    }, [id]);

    const handleChange = (e) => {
        setJobData({ ...jobData, [e.target.name]: e.target.value });
    };

    const handleUpdateJob = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/v1/job/update-job/${id}`, jobData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Job updated successfully!');
            navigate('/jobs'); // Adjust this path based on your routing
        } catch (error) {
            console.error('Failed to update job:', error);
            alert('Failed to update job.');
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Update Job</h2>
            <form onSubmit={handleUpdateJob}>
                <div className="mb-3">
                    <label className="form-label">Position</label>
                    <input
                        type="text"
                        className="form-control"
                        name="position"
                        value={jobData.position}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Company</label>
                    <input
                        type="text"
                        className="form-control"
                        name="company"
                        value={jobData.company}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select
                        className="form-select"
                        name="status"
                        value={jobData.status}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Interview">Interview</option>
                        <option value="Reject">Declined</option>
                        <option value="Hiring">Declined</option>
                        <option value="Open">Declined</option>
                        <option value="Closed">Declined</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Work Type</label>
                    <select
                        className="form-select"
                        name="workType"
                        value={jobData.workType}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Type</option>
                        <option value="Full-time">Full Time</option>
                        <option value="Part-time">Part Time</option>
                        <option value="Internship">Internship</option>
                        <option value="Contract">Contract</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Remote">Remote</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Work Location</label>
                    <input
                        type="text"
                        className="form-control"
                        name="workLocation"
                        value={jobData.workLocation}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-success">
                    Update Job
                </button>
            </form>
        </div>
    );
};

export default UpdateJob;
