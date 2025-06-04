import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    Typography
} from '@mui/material';
import axios from '../api/axios';
import { toast } from 'react-toastify';

const InterviewSchedule = ({ open, handleClose, jobId, applicantId, applicantName }) => {
    const [interviewData, setInterviewData] = useState({
        date: '',
        time: '',
        type: 'online',
        location: '',
        notes: '',
        meetingLink: ''
    });

    const handleChange = (field, value) => {
        setInterviewData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            // Combine date and time
            const dateTime = new Date(interviewData.date + 'T' + interviewData.time);

            const response = await axios.post('/job/schedule-interview', {
                jobId,
                applicantId,
                ...interviewData,
                date: dateTime.toISOString()
            });

            if (response.data.success) {
                toast.success('Interview scheduled successfully!');
                handleClose();
            }
        } catch (error) {
            console.error('Error scheduling interview:', error);
            toast.error(error.response?.data?.message || 'Error scheduling interview');
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Typography variant="h6">Schedule Interview</Typography>
                <Typography variant="subtitle2" color="textSecondary">
                    for {applicantName}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 2 }}>
                    {/* Date and Time Selection */}
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                            <InputLabel>Date</InputLabel>
                            <input
                                type="date"
                                value={interviewData.date}
                                onChange={(e) => handleChange('date', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    fontSize: '16px'
                                }}
                            />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <InputLabel>Time</InputLabel>
                            <input
                                type="time"
                                value={interviewData.time}
                                onChange={(e) => handleChange('time', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    fontSize: '16px'
                                }}
                            />
                        </Box>
                    </Box>

                    {/* Interview Type */}
                    <FormControl fullWidth>
                        <InputLabel>Interview Type</InputLabel>
                        <Select
                            value={interviewData.type}
                            label="Interview Type"
                            onChange={(e) => handleChange('type', e.target.value)}
                        >
                            <MenuItem value="online">Online Interview</MenuItem>
                            <MenuItem value="in-person">In-Person Interview</MenuItem>
                            <MenuItem value="phone">Phone Interview</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Conditional Fields */}
                    {interviewData.type === 'online' && (
                        <Box>
                            <InputLabel>Meeting Link</InputLabel>
                            <input
                                type="text"
                                placeholder="Enter meeting URL"
                                value={interviewData.meetingLink}
                                onChange={(e) => handleChange('meetingLink', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    fontSize: '16px'
                                }}
                            />
                        </Box>
                    )}

                    {interviewData.type === 'in-person' && (
                        <Box>
                            <InputLabel>Location</InputLabel>
                            <input
                                type="text"
                                placeholder="Enter interview location"
                                value={interviewData.location}
                                onChange={(e) => handleChange('location', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    fontSize: '16px'
                                }}
                            />
                        </Box>
                    )}

                    {/* Notes */}
                    <Box>
                        <InputLabel>Additional Notes</InputLabel>
                        <textarea
                            value={interviewData.notes}
                            onChange={(e) => handleChange('notes', e.target.value)}
                            placeholder="Enter any additional information"
                            style={{
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontSize: '16px',
                                minHeight: '100px',
                                fontFamily: 'inherit'
                            }}
                        />
                    </Box>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={!interviewData.date || !interviewData.time}
                >
                    Schedule Interview
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default InterviewSchedule;