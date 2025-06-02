import React, { useState, useEffect } from 'react';
import { Box, Button, Container, Typography, Card, CardContent, Grid, Dialog, DialogTitle, DialogContent, TextField, MenuItem, DialogActions } from '@mui/material';
import axios from '../api/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const RecruiterDashboard = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [newJob, setNewJob] = useState({
        company: '',
        position: '',
        workType: 'Full-time',
        workLocation: 'Mumbai',
        status: 'Open'
    });
    // Fetch recruiter's jobs
    const fetchJobs = async () => {
        try {
            const response = await axios.get('/job/recruiter-jobs');
            setJobs(response.data.jobs);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error fetching jobs');
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    // Handle job creation
    const handleCreateJob = async () => {
        try {
            // Validate required fields
            if (!newJob.company || !newJob.position || !newJob.workLocation) {
                toast.error('Please fill in all required fields');
                return;
            }

            await axios.post('/job/create-job', newJob);
            toast.success('Job created successfully!');
            setOpenDialog(false);
            // Navigate to Latest-Jobs page
            navigate('/jobs');
        } catch (error) {
            console.error('Error creating job:', error.response?.data || error);
            toast.error(error.response?.data?.message || 'Error creating job');
        }
    };

    // Handle job deletion
    const handleDeleteJob = async (jobId) => {
        if (window.confirm('Are you sure you want to delete this job?')) {
            try {
                await axios.delete(`/job/delete-job/${jobId}`);
                toast.success('Job deleted successfully!');
                fetchJobs(); // Refresh jobs list
            } catch (error) {
                toast.error(error.response?.data?.message || 'Error deleting job');
            }
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                <Typography variant="h4" component="h1">
                    Recruiter Dashboard
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenDialog(true)}
                >
                    Create New Job
                </Button>
            </Box>

            <Grid container spacing={3}>
                {jobs.map((job) => (
                    <Grid item xs={12} md={6} key={job._id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" component="h2">
                                    {job.position}
                                </Typography>
                                <Typography color="textSecondary" gutterBottom>
                                    {job.company}
                                </Typography>
                                <Typography variant="body2" component="p">
                                    Location: {job.workLocation}
                                </Typography>
                                <Typography variant="body2" component="p">
                                    Type: {job.workType}
                                </Typography>
                                <Typography variant="body2" component="p">
                                    Status: {job.status}
                                </Typography>
                                <Typography variant="body2" component="p">
                                    Applications: {job.applicants?.length || 0}
                                </Typography>
                                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => window.location.href = `/job/${job._id}`}
                                    >
                                        View Details
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleDeleteJob(job._id)}
                                    >
                                        Delete
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Create Job Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Create New Job</DialogTitle>
                <DialogContent>
                    <TextField
                        required
                        autoFocus
                        margin="dense"
                        label="Position"
                        fullWidth
                        value={newJob.position}
                        onChange={(e) => setNewJob({ ...newJob, position: e.target.value })}
                        error={!newJob.position}
                        helperText={!newJob.position ? "Position is required" : ""}
                    />
                    <TextField
                        required
                        margin="dense"
                        label="Company"
                        fullWidth
                        value={newJob.company}
                        onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                        error={!newJob.company}
                        helperText={!newJob.company ? "Company name is required" : ""}
                    />
                    <TextField
                        required
                        margin="dense"
                        label="Location"
                        fullWidth
                        value={newJob.workLocation}
                        onChange={(e) => setNewJob({ ...newJob, workLocation: e.target.value })}
                        error={!newJob.workLocation}
                        helperText={!newJob.workLocation ? "Location is required" : ""}
                    />
                    <TextField
                        select
                        margin="dense"
                        label="Work Type"
                        fullWidth
                        value={newJob.workType}
                        onChange={(e) => setNewJob({ ...newJob, workType: e.target.value })}
                    >
                        <MenuItem value="Full-time">Full-time</MenuItem>
                        <MenuItem value="Part-time">Part-time</MenuItem>
                        <MenuItem value="Internship">Internship</MenuItem>
                        <MenuItem value="Contract">Contract</MenuItem>
                        <MenuItem value="Hybrid">Hybrid</MenuItem>
                        <MenuItem value="Remote">Remote</MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button
                        onClick={handleCreateJob}
                        variant="contained"
                        color="primary"
                        disabled={!newJob.company || !newJob.position || !newJob.workLocation}
                    >
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default RecruiterDashboard; 