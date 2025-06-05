import React, { useState, useEffect } from 'react';
import {
    Box, Button, Container, Typography, Card, CardContent, Grid, Dialog,
    DialogTitle, DialogContent, TextField, MenuItem, DialogActions,
    Tabs, Tab, Chip, Avatar, Divider
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Visibility as ViewIcon,
    Person as PersonIcon,
    Work as WorkIcon,
    LocationOn as LocationIcon,
    Schedule as ScheduleIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import axios from '../api/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import InterviewSchedule from './InterviewSchedule';

// Constants for status options
const JOB_STATUS = {
    OPEN: 'Open',
    CLOSED: 'Closed'
};

const APPLICATION_STATUS = {
    PENDING: 'Pending',
    SHORTLISTED: 'Shortlisted',
    INTERVIEW: 'Interview',
    REJECTED: 'Rejected',
    HIRED: 'Hired'
};

const WORK_TYPES = [
    'Full-time',
    'Part-time',
    'Contract',
    'Internship',
    'Hybrid',
    'Remote'
];

const POLLING_INTERVAL = 30000; // Poll every 30 seconds

const RecruiterDashboard = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentTab, setCurrentTab] = useState(0);
    const [jobFilter, setJobFilter] = useState('all');
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [stats, setStats] = useState({
        totalJobs: 0,
        activeJobs: 0,
        totalApplications: 0,
        interviewScheduled: 0
    });
    const [newJob, setNewJob] = useState({
        company: '',
        position: '',
        workType: WORK_TYPES[0],
        workLocation: 'Mumbai',
        status: JOB_STATUS.OPEN,
        description: '',
        requirements: '',
        salary: '',
        deadline: ''
    });
    const [openInterviewDialog, setOpenInterviewDialog] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [selectedJobId, setSelectedJobId] = useState(null);

    // Fetch recruiter's jobs and stats
    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);
            const jobsResponse = await axios.get('/job/recruiter-jobs');
            const analyticsResponse = await axios.get('/job/recruiter-analytics');

            setJobs(jobsResponse.data.jobs);
            if (analyticsResponse.data.success) {
                const analytics = analyticsResponse.data.analytics;
                setStats({
                    totalJobs: analytics.totalJobs,
                    activeJobs: analytics.activeJobs,
                    totalApplications: analytics.totalApplications,
                    interviewScheduled: analytics.applicationsByStatus.find(s => s.name === 'Interview')?.value || 0
                });
            }
            setLastUpdate(new Date());
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error fetching dashboard data');
        } finally {
            setIsLoading(false);
        }
    };

    // Set up polling
    useEffect(() => {
        // Initial fetch
        fetchDashboardData();

        // Set up polling interval
        const pollInterval = setInterval(fetchDashboardData, POLLING_INTERVAL);

        // Cleanup on component unmount
        return () => clearInterval(pollInterval);
    }, []);

    // Manual refresh function
    const handleManualRefresh = () => {
        fetchDashboardData();
    };

    const handleCreateJob = async () => {
        try {
            if (!newJob.company || !newJob.position || !newJob.workLocation) {
                toast.error('Please fill in all required fields');
                return;
            }

            await axios.post('/job/create-job', newJob);
            toast.success('Job created successfully!');
            setOpenDialog(false);
            fetchDashboardData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error creating job');
        }
    };

    const handleDeleteJob = async (jobId) => {
        if (window.confirm('Are you sure you want to delete this job?')) {
            try {
                await axios.delete(`/job/delete-job/${jobId}`);
                toast.success('Job deleted successfully!');
                fetchDashboardData();
            } catch (error) {
                toast.error(error.response?.data?.message || 'Error deleting job');
            }
        }
    };

    const handleScheduleInterview = (jobId, applicant) => {
        setSelectedJobId(jobId);
        setSelectedApplicant(applicant);
        setOpenInterviewDialog(true);
    };

    const handleCloseInterviewDialog = () => {
        setOpenInterviewDialog(false);
        setSelectedApplicant(null);
        setSelectedJobId(null);
        fetchDashboardData();
    };

    // Update the filteredJobs function
    const filteredJobs = jobs.filter(job => {
        if (jobFilter === 'all') return true;
        if (jobFilter === 'open') return job.status === JOB_STATUS.OPEN;
        if (jobFilter === 'closed') return job.status === JOB_STATUS.CLOSED;
        return true;
    });

    // Update handleToggleJobStatus
    const handleToggleJobStatus = async (jobId, currentStatus) => {
        try {
            const newStatus = currentStatus === JOB_STATUS.OPEN ? JOB_STATUS.CLOSED : JOB_STATUS.OPEN;
            const response = await axios.patch(`/job/update-status/${jobId}`, { status: newStatus });

            if (response.data.success) {
                toast.success(response.data.message);
                fetchDashboardData();
            } else {
                toast.error('Failed to update job status');
            }
        } catch (error) {
            console.error('Error updating job status:', error);
            toast.error(error.response?.data?.message || 'Error updating job status');
        }
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            {/* Dashboard Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                <Box>
                    <Typography variant="h4" component="h1">
                        Recruiter Dashboard
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Last updated: {lastUpdate.toLocaleTimeString()}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={handleManualRefresh}
                        disabled={isLoading}
                    >
                        Refresh
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenDialog(true)}
                    >
                        Post New Job
                    </Button>
                </Box>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: 'primary.light' }}>
                        <CardContent>
                            <Typography color="white" gutterBottom>
                                Total Jobs Posted
                            </Typography>
                            <Typography variant="h4" color="white">
                                {stats.totalJobs}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: 'success.light' }}>
                        <CardContent>
                            <Typography color="white" gutterBottom>
                                Active Jobs
                            </Typography>
                            <Typography variant="h4" color="white">
                                {stats.activeJobs}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: 'info.light' }}>
                        <CardContent>
                            <Typography color="white" gutterBottom>
                                Total Applications
                            </Typography>
                            <Typography variant="h4" color="white">
                                {stats.totalApplications}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: 'warning.light' }}>
                        <CardContent>
                            <Typography color="white" gutterBottom>
                                Interview Scheduled
                            </Typography>
                            <Typography variant="h4" color="white">
                                {stats.interviewScheduled}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
                    <Tab label="Posted Jobs" />
                    <Tab label="Applications" />
                </Tabs>
            </Box>

            {/* Posted Jobs Tab */}
            {currentTab === 0 && (
                <>
                    <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                        <Button
                            variant={jobFilter === 'all' ? 'contained' : 'outlined'}
                            onClick={() => setJobFilter('all')}
                        >
                            All Jobs
                        </Button>
                        <Button
                            variant={jobFilter === 'open' ? 'contained' : 'outlined'}
                            onClick={() => setJobFilter('open')}
                            color="success"
                        >
                            Active Jobs
                        </Button>
                        <Button
                            variant={jobFilter === 'closed' ? 'contained' : 'outlined'}
                            onClick={() => setJobFilter('closed')}
                            color="error"
                        >
                            Closed Jobs
                        </Button>
                    </Box>
                    <Grid container spacing={3}>
                        {filteredJobs.map((job) => (
                            <Grid item xs={12} md={6} key={job._id}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                                            <Typography variant="h6" component="h2">
                                                {job.position}
                                            </Typography>
                                            <Chip
                                                label={job.status}
                                                color={job.status === JOB_STATUS.OPEN ? 'success' : 'error'}
                                                size="small"
                                            />
                                        </Box>
                                        <Typography color="textSecondary" gutterBottom>
                                            <WorkIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                                            {job.company}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            <LocationIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                                            {job.workLocation}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            <ScheduleIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                                            {job.workType}
                                        </Typography>
                                        <Divider sx={{ my: 2 }} />
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <PersonIcon sx={{ mr: 1 }} />
                                            <Typography variant="body2">
                                                {job.applicants?.length || 0} Applications
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                startIcon={<ViewIcon />}
                                                onClick={() => navigate(`/job/${job._id}`)}
                                            >
                                                View
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="primary"
                                                startIcon={<EditIcon />}
                                                onClick={() => navigate(`/update-job/${job._id}`)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color={job.status === JOB_STATUS.OPEN ? 'error' : 'success'}
                                                onClick={() => handleToggleJobStatus(job._id, job.status)}
                                            >
                                                {job.status === JOB_STATUS.OPEN ? 'Close Job' : 'Reopen Job'}
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="error"
                                                startIcon={<DeleteIcon />}
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
                </>
            )}

            {/* Applications Tab */}
            {currentTab === 1 && (
                <Grid container spacing={3}>
                    {jobs.flatMap(job =>
                        (job.applicants || []).map(applicant => (
                            <Grid item xs={12} key={`${job._id}-${applicant.userId}`}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar>{applicant.name?.[0] || 'A'}</Avatar>
                                                <Box>
                                                    <Typography variant="h6">{applicant.name || 'Applicant'}</Typography>
                                                    <Typography color="textSecondary">
                                                        Applied for: {job.position}
                                                    </Typography>
                                                    <Chip
                                                        label={applicant.status || APPLICATION_STATUS.PENDING}
                                                        color={applicant.status === APPLICATION_STATUS.INTERVIEW ? 'success' :
                                                            applicant.status === APPLICATION_STATUS.REJECTED ? 'error' : 'default'}
                                                        size="small"
                                                        sx={{ mt: 1 }}
                                                    />
                                                </Box>
                                            </Box>
                                            <Box>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() => handleScheduleInterview(job._id, applicant)}
                                                    disabled={applicant.status === APPLICATION_STATUS.REJECTED}
                                                >
                                                    Schedule Interview
                                                </Button>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    )}
                </Grid>
            )}

            {/* Create Job Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Post New Job</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
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
                        </Grid>
                        <Grid item xs={12} sm={6}>
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
                        </Grid>
                        <Grid item xs={12} sm={6}>
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
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                margin="dense"
                                label="Work Type"
                                fullWidth
                                value={newJob.workType}
                                onChange={(e) => setNewJob({ ...newJob, workType: e.target.value })}
                            >
                                {WORK_TYPES.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="dense"
                                label="Job Description"
                                fullWidth
                                multiline
                                rows={4}
                                value={newJob.description}
                                onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="dense"
                                label="Requirements"
                                fullWidth
                                multiline
                                rows={4}
                                value={newJob.requirements}
                                onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="dense"
                                label="Salary Range"
                                fullWidth
                                value={newJob.salary}
                                onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="dense"
                                label="Application Deadline"
                                type="date"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                value={newJob.deadline}
                                onChange={(e) => setNewJob({ ...newJob, deadline: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button
                        onClick={handleCreateJob}
                        variant="contained"
                        color="primary"
                        disabled={!newJob.company || !newJob.position || !newJob.workLocation}
                    >
                        Post Job
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Interview Schedule Dialog */}
            {openInterviewDialog && (
                <InterviewSchedule
                    open={openInterviewDialog}
                    handleClose={handleCloseInterviewDialog}
                    jobId={selectedJobId}
                    applicantId={selectedApplicant?.userId}
                    applicantName={selectedApplicant?.name || 'Applicant'}
                />
            )}
        </Container>
    );
};

export default RecruiterDashboard; 