// packages imports
import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import cors from "cors";
import morgan from "morgan";
import fs from 'fs';

//security packages
import helmet from "helmet";
//files imports
import connectDB from "./config/db.js";

//routesimport
import authRoutes from "./routes/authRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import jobsRoute from "./routes/jobsRoute.js";
import userRoutes from "./routes/userRoutes.js";
import resumeRoutes from './routes/resumeRoutes.js';

//Dotenv config
dotenv.config();

//mongodb connection
connectDB();

//rest object
const app = express();
app.use(express.json());
//middlewares
app.use(helmet());

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(morgan("dev"));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}
if (!fs.existsSync('./uploads/resumes')) {
  fs.mkdirSync('./uploads/resumes');
}

//routes
app.use("/api/v1/test", testRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/job", jobsRoute);
app.use('/api/v1/resume', resumeRoutes);

//port
const PORT = process.env.PORT || 5000;

//listen
app.listen(PORT, () => {
  console.log(
    `Node Server Running In ${process.env.DEV_MODE} Mode on port no ${PORT}`
      .rainbow.white
  );
});
