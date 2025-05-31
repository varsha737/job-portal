import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../api/axios';
import { toast } from 'react-toastify';
import {
    Container,
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    Chip,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import {
    Work as WorkIcon,
    LocationOn as LocationIcon,
    Business as BusinessIcon,
    Schedule as ScheduleIcon,
    Description as DescriptionIcon,
    Assignment as AssignmentIcon,
    AttachMoney as SalaryIcon,
    Event as DeadlineIcon,
    Person as PersonIcon,
} from '@mui/icons-material';

const JobView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await axios.get(`/job/get-job/${id}`);
                if (response.data.success) {
                    setJob(response.data.job);
                } else {
                    toast.error('Failed to fetch job details');
                }
            } catch (error) {
                console.error('Error fetching job:', error);
                toast.error(error.response?.data?.message || 'Error fetching job details');
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [id]);

    const handleApply = async () => {
        try {
            const response = await axios.patch(`/job/apply-job/${id}`);
            if (response.data.success) {
                toast.success('Successfully applied for the job!');
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Error applying for job:', error);
            toast.error(error.response?.data?.message || 'Error applying for job');
        }
    };

    const handleEdit = () => {
        navigate(`/update-job/${id}`);
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this job?')) {
            try {
                await axios.delete(`/job/delete-job/${id}`);
                toast.success('Job deleted successfully');
                navigate('/recruiter-dashboard');
            } catch (error) {
                console.error('Error deleting job:', error);
                toast.error(error.response?.data?.message || 'Error deleting job');
            }
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!job) {
        return <div>Job not found</div>;
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Card elevation={3}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 3 }}>
                        <Box>
                            <Typography variant="h4" component="h1" gutterBottom>
                                {job.position}
                            </Typography>
                            <Typography variant="h6" color="textSecondary" gutterBottom>
                                {job.company}
                            </Typography>
                        </Box>
                        <Box>
                            <Chip
                                label={job.status}
                                color={job.status === 'Open' ? 'success' : 'default'}
                                sx={{ mb: 1 }}
                            />
                        </Box>
                    </Box>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                            <List>
                                <ListItem>
                                    <ListItemIcon>
                                        <BusinessIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Company"
                                        secondary={job.company}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <LocationIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Location"
                                        secondary={job.workLocation}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <WorkIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Work Type"
                                        secondary={job.workType}
                                    />
                                </ListItem>
                                {job.salary && (
                                    <ListItem>
                                        <ListItemIcon>
                                            <SalaryIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Salary Range"
                                            secondary={job.salary}
                                        />
                                    </ListItem>
                                )}
                                {job.deadline && (
                                    <ListItem>
                                        <ListItemIcon>
                                            <DeadlineIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Application Deadline"
                                            secondary={formatDate(job.deadline)}
                                        />
                                    </ListItem>
                                )}
                            </List>

                            <Divider sx={{ my: 2 }} />

                            {job.description && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="h6" gutterBottom>
                                        <DescriptionIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                        Job Description
                                    </Typography>
                                    <Typography variant="body1" paragraph>
                                        {job.description}
                                    </Typography>
                                </Box>
                            )}

                            {job.requirements && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="h6" gutterBottom>
                                        <AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                        Requirements
                                    </Typography>
                                    <Typography variant="body1" paragraph>
                                        {job.requirements}
                                    </Typography>
                                </Box>
                            )}
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Card variant="outlined" sx={{ mb: 2 }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                        Applications
                                    </Typography>
                                    <Typography variant="body1">
                                        {job.applicants?.length || 0} applications received
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        Posted on {formatDate(job.createdAt)}
                                    </Typography>
                                </CardContent>
                            </Card>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {user?.role === 'recruiter' ? (
                                    <>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            onClick={handleEdit}
                                        >
                                            Edit Job
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            fullWidth
                                            onClick={handleDelete}
                                        >
                                            Delete Job
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        onClick={handleApply}
                                        disabled={job.hasApplied || job.status !== 'Open'}
                                    >
                                        {job.hasApplied ? 'Already Applied' : 'Apply Now'}
                                    </Button>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Container>
    );
};

export default JobView; 