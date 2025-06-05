import { Routes, Route, Navigate } from "react-router-dom";
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
import JobView from './pages/JobView';
import Footer from './components/Footer';
import PrivateRoute from './components/routes/PrivateRoute';
import PublicRoute from './components/routes/PublicRoute';

function App() {
  return ( 
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer />
      <div style={{ minHeight: '100vh', paddingBottom: '80px' }}>
        <Routes>
          <Route path="/job-portal" element={<Navigate to="/" replace />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          <Route path="/forgot-password" element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          } />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/recruiter-dashboard" element={
            <PrivateRoute>
              <RecruiterDashboard />
            </PrivateRoute>
          } />
          <Route path="/spinner" element={<Spinner />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/jobs" element={
            <PrivateRoute>
              <Jobs />
            </PrivateRoute>
          } />
          <Route path="/update-job/:id" element={
            <PrivateRoute>
              <UpdateJob />
            </PrivateRoute>
          } />
          <Route path="/update-profile" element={
            <PrivateRoute>
              <UpdateProfile />
            </PrivateRoute>
          } />
          <Route path="/user/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/job/:id" element={
            <PrivateRoute>
              <JobView />
            </PrivateRoute>
          } />
        </Routes>
      </div>
      <Footer />
    </ThemeProvider>
  );
}

export default App;


