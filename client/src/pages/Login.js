import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../api/axios';
import InputFrom from '../components/InputFrom';
import { hideLoading, showLoading } from '../redux/features/alertSlice';
import { setUser } from '../redux/features/auth/authSlice';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import "../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.alerts);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(showLoading());
      const { data } = await axios.post("/auth/login", { email, password });
      dispatch(hideLoading());

      if (data.success) {
        localStorage.setItem("token", data.token);
        dispatch(setUser(data.user));
        toast.success("Login Successfully");
        if (data.user.role === 'recruiter') {
          navigate('/recruiter-dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error('Login error:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Invalid credentials, please try again!');
    }
  };

  return (
    <>
      <div className="back-button-container">
        <button 
          className="back-button" 
          onClick={() => navigate('/')}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            padding: '10px 20px',
            backgroundColor: '#4776E6',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <i className="fas fa-arrow-left"></i> Back to Home
        </button>
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <div className="form-wrapper">
          {/* Login Form Box */}
          <div className="form-container">
            <form className="login-card" onSubmit={handleSubmit}>
              <img
                src="https://static.vecteezy.com/system/resources/previews/052/291/380/non_2x/the-logo-for-job-vector.jpg"
                alt="logo"
              />

              <InputFrom
                htmlFor="email"
                labelText={"Email"}
                type="email"
                value={email}
                handleChange={(e) => setEmail(e.target.value)}
                name="email"
              />

              <InputFrom
                htmlFor="password"
                labelText={"Password"}
                type="password"
                value={password}
                handleChange={(e) => setPassword(e.target.value)}
                name="password"
              />

              <div className="d-flex flex-column gap-2">
                <div className="d-flex justify-content-between align-items-center">
                  <p className="mb-0">
                    Not a user? <Link to="/register">Register Here!</Link>
                  </p>
                  <button type="submit" className="btn btn-primary">Login</button>
                </div>
                <div className="text-end">
                  <Link to="/forgot-password" className="text-primary text-decoration-none">
                    Forgot Password?
                  </Link>
                </div>
              </div>
            </form>
          </div>

          {/* Image Box */}
          <div className="info-box">
            <h2>Welcome Back!</h2>
            <p>Log in to continue exploring career opportunities and managing your profile.</p>
            <img
              src="https://img.freepik.com/free-vector/job-hunting-concept-illustration_114360-4797.jpg"
              alt="Info visual"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
