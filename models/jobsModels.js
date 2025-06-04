import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Company name is require"],
    },
    position: {
      type: String,
      required: [true, "Job Position is required"],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["Pending", "Reject", "Interview","Hiring","Open","Closed","Offer Received","Shortlisted"],
      default: "Open",
    },
    workType: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Contract","Hybrid","Remote"],
      default: "Full-time",
    },
    workLocation: {
      type: String,
      default: "Mumbai",
      required: [true, "work location is required"],
    },
    schedule: {
      type: String,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    applicants: [{
      userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
      },
      status: {
        type: String,
        enum: ["Pending", "Reject", "Interview", "Hired"],
        default: "Pending"
      },
      appliedAt: {
        type: Date,
        default: Date.now
      },
      interviewDetails: {
        date: Date,
        type: {
          type: String,
          enum: ["online", "in-person", "phone"]
        },
        location: String,
        notes: String,
        meetingLink: String
      }
    }]
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
