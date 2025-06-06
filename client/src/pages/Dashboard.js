import React, { useEffect, useState, useRef } from 'react';
import Layout from '../components/Layout/Layout';
import ResumeBuilder from '../components/Resume/ResumeBuilder';
import '../styles/Dashboard.css';
import axios from '../api/axios';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [resumeData, setResumeData] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const fetchDataRef = useRef(null);

  const handleApply = async (jobId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to apply for jobs');
        navigate('/login');
        return;
      }

      const response = await axios.post(`/job/apply-job/${jobId}`);

      if (response.data.success) {
        toast.success('Successfully applied for the job!');
        if (fetchDataRef.current) {
          fetchDataRef.current();
        }
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      toast.error(error.response?.data?.message || 'Failed to apply for the job');
    }
  };

  useEffect(() => {
    if (user?.role === 'recruiter') {
      navigate('/recruiter-dashboard');
      return;
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Fetch jobs
        const jobsResponse = await axios.get('/job/jobs');

        if (jobsResponse.data.success) {
          setJobs(jobsResponse.data.jobs);
        }

        // Fetch applied jobs and resume for job seekers
        if (user?.role === 'jobseeker') {
          const appliedResponse = await axios.get('/job/job-stats');
          if (appliedResponse.data.success) {
            setAppliedJobs(appliedResponse.data.stats || []);
          }

          // Fetch resume data
          const resumeResponse = await axios.get('/resume/get-resume');
          if (resumeResponse.data.success) {
            setResumeData(resumeResponse.data.resume);
            setPreviewUrl(resumeResponse.data.previewUrl);
          }
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        // toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    // Store fetchData in ref so it can be accessed by handleApply
    fetchDataRef.current = fetchData;

    fetchData();
  }, [navigate, user?.role]);

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
        <div className="jobseeker-dashboard">
          <div className="dashboard-header">
            <h1>Job Seeker Dashboard</h1>
            <p>Manage your job applications and professional profile</p>
          </div>

          {/* Resume Section */}
          <div className="dashboard-section resume-section">
            <div className="section-header">
              <h2>Resume Management</h2>
              <p>Create and manage your professional resume</p>
            </div>
            <div className="resume-container">
              <div className="resume-builder">
                <ResumeBuilder 
                  resumeData={resumeData}
                  setResumeData={setResumeData}
                  setPreviewUrl={setPreviewUrl}
                />
              </div>
              {previewUrl && (
                <div className="resume-preview">
                  <h3>Resume Preview</h3>
                  <div className="preview-container">
                    <iframe
                      src={previewUrl}
                      title="Resume Preview"
                      className="resume-iframe"
                    />
                  </div>
                  <a 
                    href={previewUrl}
                    download="resume.pdf"
                    className="download-button"
                  >
                    Download Resume
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Job Applications Section */}
          <div className="dashboard-section applications-section">
            <div className="section-header">
              <h2>Your Job Applications</h2>
              <p>Track your application status</p>
            </div>
            <div className="applications-grid">
              <div className="stat-card">
                <h3>Total Applications</h3>
                <p className="stat-number">{appliedJobs.totalJobs || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Under Review</h3>
                <p className="stat-number">
                  {appliedJobs.pending || 0}
                </p>
              </div>
              <div className="stat-card">
                <h3>Interviews</h3>
                <p className="stat-number">
                  {appliedJobs.interviews || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Jobs Section */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Job Opportunities</h2>
              <button className="view-all-btn" onClick={() => navigate('/jobs')}>
                View All Jobs
              </button>
            </div>
            <div className="jobs-grid">
              {jobs.slice(0, 4).map((job) => (
                <div key={job._id} className="job-card">
                  <div className="job-card-header">
                    <h3>{job.position}</h3>
                    <span className="company-name">{job.company}</span>
                  </div>
                  <div className="job-card-body">
                    <p><strong>Location:</strong> {job.workLocation}</p>
                    <p><strong>Type:</strong> {job.workType}</p>
                    <p><strong>Salary:</strong> {job.salary}</p>
                  </div>
                  <div className="job-card-footer">
                    <button
                      className={`apply-btn ${job.hasApplied ? 'applied' : ''}`}
                      onClick={() => handleApply(job._id)}
                      disabled={job.hasApplied}
                    >
                      {job.hasApplied ? '✓ Applied' : 'Apply Now'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
