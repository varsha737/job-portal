import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const register = async (req, res) => {
  try {
    console.log('Register request received with body:', req.body);
    const { name, email, password, role = 'jobseeker', company } = req.body;

    // Input validation
    if (!name) {
      console.log('Name missing');
      return res.status(400).json({ message: "Please provide name" });
    }
    if (!email) {
      console.log('Email missing');
      return res.status(400).json({ message: "Please provide email" });
    }
    if (!password) {
      console.log('Password missing');
      return res.status(400).json({ message: "Please provide password" });
    }
    if (role === 'recruiter' && !company) {
      console.log('Company missing for recruiter role');
      return res.status(400).json({ message: "Company name is required for recruiters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      return res.status(400).json({ message: "Please provide a valid email" });
    }

    // Check if user already exists
    console.log('Checking if user exists with email:', email);
    const userExist = await User.findOne({ email });
    if (userExist) {
      console.log('User already exists with email:', email);
      return res.status(409).json({ message: "User already exists" });
    }

    // Create user with hashed password
    console.log('Creating new user...');
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
    console.log('Generating JWT token...');
    const token = user.createJWT();

    // Success response
    console.log('User registered successfully:', user._id);
    return res.status(201).json({ 
      success: true,
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
    console.error("Registration error details:", error);
    return res.status(500).json({ message: "Something went wrong on the server." });
  }
};

export const login = async (req, res) => {
  try {
    console.log('Login attempt with:', { email: req.body.email });
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      console.log('Missing credentials:', { email: !!email, password: !!password });
      return res.status(400).json({
        message: "Please provide all required fields"
      });
    }

    // Find user
    const user = await User.findOne({ email }).select("+password");
    console.log('User found in database:', !!user);
    
    if (!user) {
      console.log('No user found with email:', email);
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Compare password
    const isPasswordCorrect = await user.comparePassword(password);
    console.log('Password comparison result:', isPasswordCorrect);
    
    if (!isPasswordCorrect) {
      console.log('Incorrect password for user:', email);
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Generate token
    const token = user.createJWT();
    console.log('JWT token generated successfully');

    // Remove password from response
    user.password = undefined;

    res.status(200).json({
      success: true,
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
      success: false,
      message: "Something went wrong on the server." 
    });
  }
};