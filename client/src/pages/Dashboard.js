import React, { useEffect, useState } from 'react';
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
        const jobsResponse = await axios.get('/job/jobs', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (jobsResponse.data.success) {
          setJobs(jobsResponse.data.jobs);
        }

        // Fetch applied jobs and resume for job seekers
        if (user?.role === 'jobseeker') {
          const appliedResponse = await axios.get('/job/applied-jobs', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (appliedResponse.data.success) {
            setAppliedJobs(appliedResponse.data.jobs || []);
          }

          // Fetch resume data
          const resumeResponse = await axios.get('/resume/get-resume', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (resumeResponse.data.success) {
            setResumeData(resumeResponse.data.resume);
            setPreviewUrl(resumeResponse.data.previewUrl);
          }
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, user?.role]);

  const handleApply = async (jobId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to apply for jobs');
        navigate('/login');
        return;
      }

      const response = await axios.post(`/job/apply-job/${jobId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setAppliedJobs(prev => [...prev, response.data.job]);
        toast.success('Successfully applied for the job!');
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      toast.error(error.response?.data?.message || 'Failed to apply for the job');
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
                <p className="stat-number">{appliedJobs.length}</p>
              </div>
              <div className="stat-card">
                <h3>Under Review</h3>
                <p className="stat-number">
                  {appliedJobs.filter(job => job.status === 'under-review').length}
                </p>
              </div>
              <div className="stat-card">
                <h3>Interviews</h3>
                <p className="stat-number">
                  {appliedJobs.filter(job => job.status === 'interview').length}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Jobs Section */}
          <div className="dashboard-section jobs-section">
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
                      className={`apply-btn ${appliedJobs.some(aj => aj._id === job._id) ? 'applied' : ''}`}
                      onClick={() => handleApply(job._id)}
                      disabled={appliedJobs.some(aj => aj._id === job._id)}
                    >
                      {appliedJobs.some(aj => aj._id === job._id) ? '✓ Applied' : 'Apply Now'}
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
