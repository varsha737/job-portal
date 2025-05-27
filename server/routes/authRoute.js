const express = require("express");
const { registerController, loginController, sendOTP, verifyOTP, resetPassword } = require("../controllers/authController");

//router object
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

module.exports = router; 