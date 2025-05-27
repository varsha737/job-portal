import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "./components/Spinner.js";
import Jobs from "./pages/Jobs.jsx";
import './styles/Jobs.css';
import UpdateJob from "./components/UpdateJob.jsx";
import UpdateProfile from "./pages/UpdateProfile";
import Profile from "./pages/Profile";
import RecruiterDashboard from "./components/RecruiterDashboard";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return ( 
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
        <Route path="/spinner" element={<Spinner />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/update-job/:id" element={<UpdateJob />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/user/profile" element={<Profile />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;


