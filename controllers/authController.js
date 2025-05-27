import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const register = async (req, res) => {
  try {
    const { name, email, password, role = 'jobseeker', company } = req.body;

    // Input validation
    if (!name) 
      return res.status(400).json({ message: "Please provide name" });
    if (!email)
      return res.status(400).json({ message: "Please provide email" });
    if (!password)
      return res.status(400).json({ message: "Please provide password" });
    if (role === 'recruiter' && !company)
      return res.status(400).json({ message: "Company name is required for recruiters" });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ message: "Please provide a valid email" });

    // Check if user already exists
    const userExist = await User.findOne({ email });
    if (userExist)
      return res.status(409).json({ message: "User already exists" });

    // Create user with hashed password
    const user = await User.create({
      name,
      email,
      password, // Password will be hashed by the pre-save middleware
      role,
      company,
      notificationPreferences: {
        email: {
          enabled: true,
          address: email
        }
      }
    });

    // Generate token
    const token = user.createJWT();

    // Success response
    return res.status(201).json({ 
      message: "User registered successfully", 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token 
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Something went wrong on the server." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide all required fields"
      });
    }

    // Find user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Compare password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Generate token
    const token = user.createJWT();

    // Remove password from response
    user.password = undefined;

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      message: "Something went wrong on the server." 
    });
  }
};