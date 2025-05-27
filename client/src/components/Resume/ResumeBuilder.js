import React, { useState } from 'react';
import axios from '../../api/axios';
import { toast } from 'react-toastify';
import './ResumeBuilder.css';

const ResumeBuilder = () => {
  const [file, setFile] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAIBuilder, setShowAIBuilder] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    education: '',
    experience: '',
    skills: ''
  });

  const handleFileUpload = async (e) => {
    try {
      const file = e.target.files[0];
      setFile(file);
      
      const formData = new FormData();
      formData.append('resume', file);
      
      setLoading(true);
      const response = await axios.post('/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setResumeData(response.data);
      toast.success('Resume uploaded successfully!');
      setLoading(false);
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast.error(error.response?.data?.message || 'Error uploading resume');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateAIResume = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/resume/generate', formData);
      setResumeData(response.data);
      toast.success('Resume generated successfully!');
      setLoading(false);
    } catch (error) {
      console.error('Error generating resume:', error);
      toast.error(error.response?.data?.message || 'Error generating resume');
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!resumeData) {
      toast.error('No resume data available to download');
      return;
    }

    try {
      // Create a blob with the resume content
      const blob = new Blob([resumeData.resume || resumeData.content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'resume.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Resume downloaded successfully!');
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast.error('Failed to download resume');
    }
  };

  return (
    <div className="resume-builder">
      <div className="resume-options">
        <div className="upload-section">
          <h3>Upload Your Resume</h3>
          <input 
            type="file" 
            accept=".pdf,.doc,.docx" 
            onChange={handleFileUpload}
            className="file-input"
          />
          <p className="file-info">
            {file ? `Selected file: ${file.name}` : 'Supported formats: PDF, DOC, DOCX'}
          </p>
        </div>

        <div className="divider">OR</div>

        <div className="ai-builder-section">
          <h3>AI Resume Builder</h3>
          <button 
            className="toggle-ai-btn"
            onClick={() => setShowAIBuilder(!showAIBuilder)}
          >
            {showAIBuilder ? 'Hide AI Builder' : 'Use AI Builder'}
          </button>

          {showAIBuilder && (
            <div className="ai-form">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
              <textarea
                name="education"
                placeholder="Education (e.g., Degree, University, Year)"
                value={formData.education}
                onChange={handleInputChange}
                required
              />
              <textarea
                name="experience"
                placeholder="Work Experience"
                value={formData.experience}
                onChange={handleInputChange}
                required
              />
              <textarea
                name="skills"
                placeholder="Skills (comma separated)"
                value={formData.skills}
                onChange={handleInputChange}
                required
              />
              <button 
                className="generate-btn"
                onClick={generateAIResume}
                disabled={loading || !formData.fullName || !formData.email || !formData.education || !formData.experience || !formData.skills}
              >
                {loading ? 'Generating...' : 'Generate Resume'}
              </button>
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Processing your resume...</p>
        </div>
      )}

      {resumeData && (
        <div className="resume-preview">
          <h3>Resume Preview</h3>
          <div className="preview-content">
            <pre>{resumeData.resume || resumeData.content}</pre>
          </div>
          <button 
            className="download-btn"
            onClick={handleDownload}
          >
            Download Resume
          </button>
        </div>
      )}
    </div>
  );
};

export default ResumeBuilder; 