import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

// Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name Is Required"],
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: [true, " Email is Required"],
      unique: true,
      validate: validator.isEmail,
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
      minlength: [6, "Password length should be greater than 6 character"],
      select: false,
    },
    role: {
      type: String,
      enum: ['jobseeker', 'recruiter', 'admin'],
      default: 'jobseeker'
    },
    company: {
      type: String,
      required: function() {
        return this.role === 'recruiter';
      }
    },
    notificationPreferences: {
      email: {
        enabled: {
          type: Boolean,
          default: true
        },
        address: {
          type: String,
          validate: validator.isEmail
        }
      },
      whatsapp: {
        enabled: {
          type: Boolean,
          default: false
        },
        number: {
          type: String,
          validate: {
            validator: function(v) {
              return /^\+?[1-9]\d{9,14}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
          }
        }
      },
      jobAlerts: {
        type: Boolean,
        default: true
      },
      applicationUpdates: {
        type: Boolean,
        default: true
      },
      interviewReminders: {
        type: Boolean,
        default: true
      }
    },
    location: {
      type: String
    },
    preferredJobTypes: [{
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Contract", "Hybrid", "Remote"]
    }],
    skills: [{
      type: String
    }]
  },
  { timestamps: true }
);

// Hash password 
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.comparePassword = async function (userPassword) {
  console.log('Comparing passwords...');
  const isMatch = await bcrypt.compare(userPassword, this.password);
  console.log('Password match result:', isMatch);
  return isMatch;
};

// Create JWT
userSchema.methods.createJWT = function () {
  return JWT.sign(
    { 
      userId: this._id,
      role: this.role 
    }, 
    process.env.JWT_SECRET, 
    {
      expiresIn: "1d",
    }
  );
};

export default mongoose.model("User", userSchema);

