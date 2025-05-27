import express from "express";
import {
  createJobController,
  updateJobController,
  getAllJobsController,
  deleteJobController,
  getJobStats,
  applyJobController,
  getRecruiterJobs
} from "../controllers/jobController.js";

import userAuth from "../middlewares/authMiddleware.js";
import checkRole from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Public routes
router.get("/get-job", getAllJobsController);

// Job seeker routes
router.patch("/apply-job/:id", userAuth, applyJobController);

// Recruiter routes
router.get("/recruiter-jobs", userAuth, checkRole('recruiter', 'admin'), getRecruiterJobs);
router.post("/create-job", userAuth, checkRole('recruiter', 'admin'), createJobController);
router.patch("/update-job/:id", userAuth, checkRole('recruiter', 'admin'), updateJobController);
router.delete("/delete-job/:id", userAuth, checkRole('recruiter', 'admin'), deleteJobController);

// Stats route
router.get("/job-stats", userAuth, getJobStats);

export default router;
