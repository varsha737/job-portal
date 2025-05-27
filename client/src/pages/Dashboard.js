import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import ResumeBuilder from '../components/Resume/ResumeBuilder';
import JobFilters from '../components/JobFilters/JobFilters';
import '../styles/Dashboard.css';
import axios from '../api/axios';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    interviews: 0,
    pending: 0,
    rejected: 0,
    hired: 0
  });
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [uniqueLocations, setUniqueLocations] = useState([]);
  const [uniqueTypes, setUniqueTypes] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    workType: 'all',
    workLocation: 'all'
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/job/job-stats');
        if (response.data.success) {
          setStats(response.data.stats);
        } else {
          toast.error('Failed to fetch job stats');
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast.error(error.response?.data?.message || 'Error fetching job stats');
      } finally {
        setLoading(false);
      }
    };

    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        // Build query string from filters
        const queryParams = new URLSearchParams();
        if (filters.search) queryParams.append('search', filters.search);
        if (filters.status !== 'all') queryParams.append('status', filters.status);
        if (filters.workType !== 'all') queryParams.append('workType', filters.workType);
        if (filters.workLocation !== 'all') queryParams.append('workLocation', filters.workLocation);

        const res = await axios.get(`/api/jobs/get-job?${queryParams.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setJobs(res.data.jobs);
        setUniqueLocations(res.data.uniqueLocations);
        setUniqueTypes(res.data.uniqueTypes);
      } catch (error) {
        console.error('Error fetching jobs', error);
      }
    };

    fetchStats();
    fetchJobs();
  }, [filters]); // Re-fetch when filters change

  const handleSaveJob = async (jobId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/jobs/update-job/${jobId}`, 
        { status: 'Pending' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Refresh stats and jobs after saving
      const statsRes = await axios.get('/api/jobs/job-stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error saving job', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="dashboard-container">
        <h2 className="dashboard-title">Your Job Application Stats</h2>
        <div className="stats-grid">
          <div className="stat-card total-applications">
            <h3>Total Applications</h3>
            <p className="stat-number">{stats.totalJobs}</p>
          </div>
          <div className="stat-card pending">
            <h3>Pending</h3>
            <p className="stat-number">{stats.pending}</p>
          </div>
          <div className="stat-card interviews">
            <h3>Interviews</h3>
            <p className="stat-number">{stats.interviews}</p>
          </div>
          <div className="stat-card rejected">
            <h3>Rejected</h3>
            <p className="stat-number">{stats.rejected}</p>
          </div>
          <div className="stat-card hired">
            <h3>Hired</h3>
            <p className="stat-number">{stats.hired}</p>
          </div>
        </div>

        {/* Resume Section */}
        <div className="section">
          <h2>Resume Management</h2>
          <ResumeBuilder />
        </div>

        {/* Job Search Section */}
        <div className="section">
          <h2>Available Jobs</h2>
          <JobFilters 
            filters={filters}
            setFilters={setFilters}
            uniqueLocations={uniqueLocations}
            uniqueTypes={uniqueTypes}
          />
          <div className="job-list">
            {jobs.map((job) => (
              <div key={job._id} className="job-item">
                <div className="job-info">
                  <h3>{job.position} @ {job.company}</h3>
                  <p>{job.workLocation} • {job.workType}</p>
                  <span className={`status-badge status-${job.status.toLowerCase()}`}>
                    {job.status}
                  </span>
                </div>
                <button 
                  onClick={() => handleSaveJob(job._id)}
                  className="save-btn"
                  disabled={job.status === 'Pending'}
                >
                  {job.status === 'Pending' ? 'Saved' : 'Save Job'}
                </button>
              </div>
            ))}
            {jobs.length === 0 && (
              <div className="no-jobs">
                <p>No jobs found matching your filters</p>
              </div>
            )}
          </div>
        </div>

        {/* Resume Progress */}
        <div className="section">
          <h2>Resume Completion</h2>
          <div className="progress-bar">
            <div className="progress" style={{ width: '70%' }}>70%</div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
