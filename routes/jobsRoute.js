import express from "express";
import {
  createJobController,
  updateJobController,
  getAllJobsController,
  deleteJobController,
  getJobStats,
  applyJobController,
  getRecruiterJobs,
  getRecruiterAnalytics,
  scheduleInterview,
  updateJobStatus,
  getJobById
} from "../controllers/jobController.js";

import userAuth from "../middlewares/authMiddleware.js";
import checkRole from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Public routes
router.get("/jobs", getAllJobsController);
router.get("/get-job/:id", getJobById);

// Protected routes - require authentication
router.use(userAuth);

// Job seeker routes
router.post("/apply-job/:id", checkRole('jobseeker'), applyJobController);
router.get("/job-stats", checkRole('jobseeker'), getJobStats);

// Recruiter routes
router.get("/recruiter-analytics", checkRole('recruiter', 'admin'), getRecruiterAnalytics);
router.get("/recruiter-jobs", checkRole('recruiter', 'admin'), getRecruiterJobs);
router.post("/create-job", checkRole('recruiter', 'admin'), createJobController);
router.patch("/update-job/:id", checkRole('recruiter', 'admin'), updateJobController);
router.delete("/delete-job/:id", checkRole('recruiter', 'admin'), deleteJobController);
router.patch("/update-status/:id", checkRole('recruiter', 'admin'), updateJobStatus);
router.post("/schedule-interview", checkRole('recruiter', 'admin'), scheduleInterview);

export default router;
