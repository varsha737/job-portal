import { trusted } from "mongoose";
import jobsModel from "../models/jobsModels.js";
import mongoose from "mongoose";

// Cache duration in milliseconds (5 seconds)
const CACHE_DURATION = 5000;
let jobsCache = {
    data: null,
    lastUpdated: null
};

let analyticsCache = {
    data: null,
    lastUpdated: null
};

// Helper function to check if user is authorized to modify job
const isAuthorizedToModifyJob = (job, userId) => {
    return job.createdBy.toString() === userId.toString();
};

// ======== CREATE JOB ========
export const createJobController = async (req, res, next) => {
  try {
    const { company, position } = req.body;
    if (!company || !position) {
      return next("Please Provide All Fields");
    }
    req.body.createdBy = req.user.userId;
    const job = await jobsModel.create(req.body);
    clearCache();
    res.status(201).json({ job });
  } catch (error) {
    next(error);
  }
};

// ======== GET JOBS ========
export const getAllJobsController = async (req, res, next) => {
  try {
    const { status, workType, workLocation, search } = req.query;
    
    // Build query object
    const queryObject = {};

    // Add filters if they exist
    if (status && status !== 'all') {
      queryObject.status = status;
    }

    if (workType && workType !== 'all') {
      queryObject.workType = workType;
    }

    if (workLocation && workLocation !== 'all') {
      queryObject.workLocation = workLocation;
    }

    // Search by company or position
    if (search) {
      queryObject.$or = [
        { company: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } }
      ];
    }

    // Get jobs with filters
    const jobs = await jobsModel.find(queryObject).sort({ createdAt: -1 });

    // Get unique locations and types for filters
    const totalJobs = jobs.length;
    const uniqueLocations = [...new Set(jobs.map(job => job.workLocation))];
    const uniqueTypes = [...new Set(jobs.map(job => job.workType))];

    // Add hasApplied field to each job if user is authenticated
    let jobsWithApplyStatus = jobs;
    if (req.user) {
      jobsWithApplyStatus = jobs.map(job => {
        const hasApplied = job.applicants?.some(applicant => 
          applicant.userId.toString() === req.user.userId
        );
        return {
          ...job.toObject(),
          hasApplied
        };
      });
    }

    res.status(200).json({
      success: true,
      totalJobs,
      jobs: jobsWithApplyStatus,
      uniqueLocations,
      uniqueTypes
    });
  } catch (error) {
    console.error("Error in getAllJobsController:", error);
    next(error);
  }
};

// ======== APPLY FOR JOB ========
export const applyJobController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    console.log('Applying for job:', { jobId: id, userId });

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('Invalid Job ID format');
      return res.status(400).json({
        success: false,
        message: `Invalid Job ID: ${id}`
      });
    }

    // Find job
    const job = await jobsModel.findById(id);
    console.log('Found job:', job);

    if (!job) {
      console.log('No job found with ID:', id);
      return res.status(404).json({
        success: false,
        message: `No job found with ID ${id}`
      });
    }

    // Check if job is closed
    if (job.status === 'Closed') {
      console.log('Job is closed');
      return res.status(400).json({
        success: false,
        message: 'This job is no longer accepting applications'
      });
    }

    // Check if user has already applied
    const hasApplied = job.applicants && job.applicants.some(applicant => 
      applicant.userId.toString() === userId
    );

    if (hasApplied) {
      console.log('User has already applied');
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    // Initialize applicants array if it doesn't exist
    if (!job.applicants) {
      job.applicants = [];
    }

    // Create application object
    const application = {
      userId: new mongoose.Types.ObjectId(userId),
      status: 'Pending',
      appliedAt: new Date()
    };

    console.log('Adding application:', application);

    // Add user to applicants array
    job.applicants.push(application);

    // Save with validation
    const updatedJob = await job.save({ validateBeforeSave: true });
    console.log('Job updated successfully');

    res.status(200).json({ 
      success: true,
      message: 'Job application successful',
      job: updatedJob
    });
  } catch (error) {
    console.error('Error in applyJobController:', {
      error: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid data provided for job application',
        details: error.message
      });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format',
        details: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Internal server error while applying for job',
      details: error.message
    });
  }
};

// ======== UPDATE JOBS =========
export const updateJobController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { company, position } = req.body;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(`Invalid Job ID: ${id}`);
        }

        // Validate fields
        if (!company || !position) {
            return next("Please Provide All Fields");
        }

        // Find job
        const job = await jobsModel.findById(id);
        if (!job) {
            return next(`No job found with this ID ${id}`);
        }

        // Update job
        const updateJob = await jobsModel.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        clearCache();
        res.status(200).json({ updateJob });

    } catch (error) {
        next(error);
    }
};

//===== DELETE JOBS =======
export const deleteJobController = async (req, res, next) => {
    try {
        const { id } = req.params;

        //find job
        const job = await jobsModel.findOne({ _id: id });

        //validation
        if (!job) {
            return next(`No Job Found With This ID ${id}`);
        }
        
        await job.deleteOne();
        clearCache();
        res.status(200).json({ message: "Success, Job Deleted!" });
    } catch (error) {
        next(error);
    }
};

//===== GET JOBS STATS =======
export const getJobStats = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Get total jobs applied (count jobs where user appears in applicants array)
    const appliedJobs = await jobsModel.find({
      'applicants.userId': userId
    });

    // Count total applications
    const totalJobs = appliedJobs.length;
    
    // Count jobs by status
    const jobsByStatus = appliedJobs.reduce((acc, job) => {
      const userApplication = job.applicants.find(app => 
        app.userId.toString() === userId
      );
      if (userApplication) {
        acc[userApplication.status] = (acc[userApplication.status] || 0) + 1;
      }
      return acc;
    }, {});

    // Get specific counts
    const interviews = jobsByStatus['Interview'] || 0;
    const pending = jobsByStatus['Pending'] || 0;
    const rejected = jobsByStatus['Reject'] || 0;
    const hired = jobsByStatus['Hired'] || 0;

    res.status(200).json({
      success: true,
      stats: {
        totalJobs,
        interviews,
        pending,
        rejected,
        hired
      }
    });
  } catch (error) {
    console.error('Error in getJobStats:', error);
    res.status(500).json({
      success: false,
      message: 'Error while fetching job stats'
    });
  }
};

//===== GET RECRUITER JOBS =======
export const getRecruiterJobs = async (req, res, next) => {
    try {
        // Check if cache is valid
        const now = Date.now();
        if (jobsCache.data && jobsCache.lastUpdated && (now - jobsCache.lastUpdated < CACHE_DURATION)) {
            return res.status(200).json(jobsCache.data);
        }

        // If cache is invalid or doesn't exist, fetch fresh data
        const jobs = await jobsModel.find()
            .sort({ createdAt: -1 })
            .lean(); // Use lean() for better performance

        const response = {
            success: true,
            total: jobs.length,
            jobs
        };

        // Update cache
        jobsCache = {
            data: response,
            lastUpdated: now
        };

        res.status(200).json(response);
    } catch (error) {
        console.error("Error in getRecruiterJobs:", error);
        next(error);
    }
};

// ======== GET RECRUITER ANALYTICS ========
export const getRecruiterAnalytics = async (req, res, next) => {
    try {
        // Check if cache is valid
        const now = Date.now();
        if (analyticsCache.data && analyticsCache.lastUpdated && (now - analyticsCache.lastUpdated < CACHE_DURATION)) {
            return res.status(200).json(analyticsCache.data);
        }

        // If cache is invalid or doesn't exist, fetch fresh data
        const jobs = await jobsModel.find().lean();

        // Calculate analytics
        const analytics = {
            totalJobs: jobs.length,
            activeJobs: jobs.filter(job => job.status === 'Open').length,
            totalApplications: jobs.reduce((acc, job) => acc + (job.applicants?.length || 0), 0),
            applicationsByStatus: [
                { 
                    name: 'Pending', 
                    value: jobs.reduce((acc, job) => 
                        acc + (job.applicants?.filter(app => app.status === 'Pending').length || 0), 0
                    )
                },
                { 
                    name: 'Shortlisted', 
                    value: jobs.reduce((acc, job) => 
                        acc + (job.applicants?.filter(app => app.status === 'Shortlisted').length || 0), 0
                    )
                },
                { 
                    name: 'Interview', 
                    value: jobs.reduce((acc, job) => 
                        acc + (job.applicants?.filter(app => app.status === 'Interview').length || 0), 0
                    )
                },
                { 
                    name: 'Rejected', 
                    value: jobs.reduce((acc, job) => 
                        acc + (job.applicants?.filter(app => app.status === 'Reject').length || 0), 0
                    )
                }
            ],
            recentApplications: jobs.flatMap(job => 
                (job.applicants || []).map(app => ({
                    jobId: job._id,
                    jobTitle: job.position,
                    company: job.company,
                    applicantId: app.userId,
                    status: app.status,
                    appliedAt: app.appliedAt
                }))
            ).sort((a, b) => b.appliedAt - a.appliedAt).slice(0, 10)
        };

        const response = {
            success: true,
            analytics
        };

        // Update cache
        analyticsCache = {
            data: response,
            lastUpdated: now
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error in getRecruiterAnalytics:', error);
        next(error);
    }
};

//===== SCHEDULE INTERVIEW =======
export const scheduleInterview = async (req, res) => {
  try {
    const { jobId, applicantId, date, type, location, notes, meetingLink } = req.body;
    
    // Find the job and update the applicant's status
    const job = await jobsModel.findById(jobId);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Find the applicant in the job's applicants array
    const applicantIndex = job.applicants.findIndex(
      app => app.userId.toString() === applicantId
    );

    if (applicantIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Applicant not found'
      });
    }

    // Update the applicant's status and add interview details
    job.applicants[applicantIndex] = {
      ...job.applicants[applicantIndex],
      status: 'Interview',
      interviewDetails: {
        date,
        type,
        location,
        notes,
        meetingLink
      }
    };

    await job.save();

    // Send email notification (you can implement this later)

    res.status(200).json({
      success: true,
      message: 'Interview scheduled successfully'
    });
  } catch (error) {
    console.error('Error in scheduleInterview:', error);
    res.status(500).json({
      success: false,
      message: 'Error while scheduling interview'
    });
  }
};

//===== UPDATE JOB STATUS =======
export const updateJobStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: `Invalid Job ID: ${id}`
            });
        }

        // Find job
        const job = await jobsModel.findById(id);
        
        if (!job) {
            return res.status(404).json({
                success: false,
                message: `No job found with ID ${id}`
            });
        }

        // Update status
        job.status = status;
        await job.save();

        clearCache();
        res.status(200).json({
            success: true,
            message: `Job status updated to ${status}`,
            job
        });

    } catch (error) {
        console.error('Error in updateJobStatus:', error);
        res.status(500).json({
            success: false,
            message: 'Error while updating job status',
            error: error.message
        });
    }
};

//===== GET SINGLE JOB =======
export const getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid Job ID: ${id}`
      });
    }

    // Find job and populate applicant details
    const job = await jobsModel.findById(id)
      .populate('applicants.userId', 'name email');
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: `No job found with ID ${id}`
      });
    }

    // Add hasApplied field if user is authenticated
    let jobWithApplyStatus = job;
    if (req.user) {
      const hasApplied = job.applicants?.some(applicant => 
        applicant.userId._id.toString() === req.user.userId
      );
      jobWithApplyStatus = {
        ...job.toObject(),
        hasApplied
      };
    }

    res.status(200).json({
      success: true,
      job: jobWithApplyStatus
    });

  } catch (error) {
    console.error('Error in getJobById:', error);
    res.status(500).json({
      success: false,
      message: 'Error while fetching job details',
      error: error.message
    });
  }
};

// Clear cache when jobs are modified
const clearCache = () => {
    jobsCache = {
        data: null,
        lastUpdated: null
    };
    analyticsCache = {
        data: null,
        lastUpdated: null
    };
};


