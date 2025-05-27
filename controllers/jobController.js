import { trusted } from "mongoose";
import jobsModel from "../models/jobsModels.js";
import mongoose from "mongoose";

// ======== CREATE JOB ========
export const createJobController = async (req, res, next) => {
  try {
    const { company, position } = req.body;
    if (!company || !position) {
      return next("Please Provide All Fields");
    }
    req.body.createdBy = req.user.userId;
    const job = await jobsModel.create(req.body);
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

    res.status(200).json({ updateJob });

  } catch (error) {
    next(error);
  }
};

//===== DELETE JOBS =======
export const deleteJobController = async (req, res, next) => {
  const { id } = req.params;

  //find job
  const job = await jobsModel.findOne({_id: id });

  //validation
  if (!job) {
    next(`No Job Found With This ID ${id}`);
  }
  
  await job.deleteOne();
  res.status(200).json({ message: "Success, Job Deleted!" });
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
    const jobs = await jobsModel.find({ createdBy: req.user.userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: jobs.length,
      jobs
    });
  } catch (error) {
    console.error("Error in getRecruiterJobs:", error);
    next(error);
  }
};


