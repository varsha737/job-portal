import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import { useSelector } from 'react-redux';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);

    const handleUpdate = (jobId) => {
        navigate(`/update-job/${jobId}`);
    };

    const fetchJobs = async () => {
        try {
            const res = await axios.get("/job/jobs");
            if (res.data && Array.isArray(res.data.jobs)) {
                // Sort jobs by creation date (newest first)
                const sortedJobs = res.data.jobs.sort((a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
                );
                setJobs(sortedJobs);
            } else {
                setJobs([]);
                console.error("Invalid jobs data format:", res.data);
            }
        } catch (error) {
            console.error("Failed to load jobs:", error);
            toast.error(error.response?.data?.message || "Failed to load jobs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleApply = async (jobId) => {
        try {
            // Check if user is logged in
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login to apply for jobs');
                navigate('/login');
                return;
            }

            const response = await axios.post(`/job/apply-job/${jobId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                toast.success('Successfully applied for the job!');
                // Refresh the jobs list to update the status
                fetchJobs();
            } else {
                toast.error(response.data.message || 'Failed to apply for the job');
            }
        } catch (error) {
            console.error("Failed to apply for job:", error.response?.data || error.message);
            if (error.response?.status === 401) {
                toast.error('Please login as a job seeker to apply');
                navigate('/login');
            } else {
                toast.error(error.response?.data?.message || "Failed to apply for the job");
            }
        }
    };

    const handleDelete = async (jobId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this job?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`/job/delete-job/${jobId}`);
            setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
            toast.success("Job deleted successfully");
        } catch (error) {
            console.error("Failed to delete job:", error);
            toast.error(error.response?.data?.message || "Failed to delete job");
        }
    };

    if (loading) {
        return <Spinner />;
    }

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="container mt-5">
            <h2 className="latest-jobs-heading text-center mb-4">✨ Latest Jobs</h2>
            <div className="row">
                {jobs.map((job) => (
                    <div key={job._id} className="col-md-6 mb-4">
                        <div className="card mb-3 shadow-sm job-card">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h5 className="card-title">{job.position}</h5>
                                        <h6 className="card-subtitle mb-2 text-muted">{job.company}</h6>
                                    </div>
                                    <span className="badge bg-primary">{job.workType}</span>
                                </div>
                                <p className="card-text">
                                    <strong>Status:</strong> <span className={`badge ${job.status === 'Open' ? 'bg-success' : 'bg-secondary'}`}>{job.status}</span><br />
                                    <strong>Location:</strong> {job.workLocation}<br />
                                    <strong>Posted:</strong> {formatDate(job.createdAt)}
                                </p>
                                <div className="d-flex justify-content-between align-items-center">
                                    <button
                                        className={`btn ${job.hasApplied ? 'btn-success' : 'btn-primary'} btn-sm`}
                                        onClick={() => handleApply(job._id)}
                                        disabled={job.hasApplied || job.status === 'Closed'}
                                    >
                                        {job.hasApplied ? '✓ Applied' : 'Apply Now'}
                                    </button>
                                    {user?.role === 'recruiter' && (
                                        <div className="btn-group">
                                            <button
                                                className="btn btn-warning btn-sm"
                                                onClick={() => handleUpdate(job._id)}
                                                title="Edit Job"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(job._id)}
                                                title="Delete Job"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Jobs;

