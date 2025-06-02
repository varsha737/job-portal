import express from "express";
import {
  registerController,
  loginController,
  sendOTP,
  verifyOTP,
  resetPassword,
} from "../controllers/authController.js";

// router object
const router = express.Router();

// routes
// REGISTER || POST
router.post("/register", registerController);

// LOGIN || POST
router.post("/login", loginController);

// FORGOT PASSWORD ROUTES
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

export default router;
