import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../api/axios';
import { toast } from 'react-toastify';

// Job status options
const JOB_STATUS = {
    OPEN: 'Open',
    CLOSED: 'Closed',
    INACTIVE: 'Inactive',
    EXPIRED: 'Expired'
};

const UpdateJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [jobData, setJobData] = useState({
        position: '',
        company: '',
        status: '',
        workType: '',
        workLocation: ''
    });

    useEffect(() => {
        const fetchJob = async () => {
            try {
                console.log('Fetching job with ID:', id);
                const response = await axios.get(`/job/get-job/${id}`);
                console.log('Response:', response.data);
                if (response.data.success) {
                    setJobData(response.data.job);
                }
            } catch (error) {
                console.error('Failed to fetch job:', error);
                toast.error('Failed to fetch job details');
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
            const response = await axios.patch(`/job/update-job/${id}`, jobData);
            if (response.data.success) {
                toast.success('Job updated successfully!');
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Failed to update job:', error);
            toast.error(error.response?.data?.message || 'Failed to update job');
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
                        <option value={JOB_STATUS.OPEN}>{JOB_STATUS.OPEN}</option>
                        <option value={JOB_STATUS.INACTIVE}>{JOB_STATUS.INACTIVE}</option>
                        <option value={JOB_STATUS.CLOSED}>{JOB_STATUS.CLOSED}</option>
                        <option value={JOB_STATUS.EXPIRED}>{JOB_STATUS.EXPIRED}</option>
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
