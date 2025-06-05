// packages imports
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";

//routes import
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import jobsRoute from "./routes/jobsRoute.js";
import resumeRoutes from './routes/resumeRoutes.js';

//Dotenv config
dotenv.config();

//mongodb connection
connectDB();

//rest object
const app = express();

//middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

//routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Job Portal API' });
});

app.get('/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/job", jobsRoute);
app.use('/api/v1/resume', resumeRoutes);

//error middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: err.message || 'Something went wrong!'
  });
});

//port
const PORT = process.env.PORT || 5000;

//listen
app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});
