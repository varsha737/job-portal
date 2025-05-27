import express from "express";
import {
  login,
  register,
} from "../controllers/authController.js";
import rateLimit from "express-rate-limit";

// ip limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: "Too many requests from this IP, please try again later.",
});

//router object
const router = express.Router();

//routes

// REGISTER || POST
router.post("/register", register);

// LOGIN || POST
router.post("/login", login);

//export
export default router;
