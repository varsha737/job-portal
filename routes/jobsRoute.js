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

// Protected routes
router.use(userAuth);

// Recruiter routes
router.use(checkRole('recruiter', 'admin'));
router.get("/recruiter-analytics", getRecruiterAnalytics);
router.get("/recruiter-jobs", getRecruiterJobs);
router.post("/create-job", createJobController);
router.patch("/update-job/:id", updateJobController);
router.delete("/delete-job/:id", deleteJobController);
router.patch("/update-status/:id", updateJobStatus);
router.post("/schedule-interview", scheduleInterview);

// Job seeker routes
router.post("/apply-job/:id", checkRole('candidate'), applyJobController);
router.get("/job-stats", checkRole('candidate'), getJobStats);

export default router;
