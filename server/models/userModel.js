const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    phone: {
      type: String,
    },
    location: {
      type: String,
    },
    role: {
      type: String,
      enum: ['job-seeker', 'recruiter'],
      default: 'job-seeker'
    },
    resetPasswordOTP: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema); 