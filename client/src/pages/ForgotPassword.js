import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../api/axios';
import InputFrom from '../components/InputFrom';
import { hideLoading, showLoading } from '../redux/features/alertSlice';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import "../styles/Login.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.alerts);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      dispatch(showLoading());
      const { data } = await axios.post('/auth/send-otp', { email });
      dispatch(hideLoading());
      
      if (data.success) {
        toast.success('OTP sent to your email!');
        setStep(2);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      dispatch(showLoading());
      const { data } = await axios.post('/auth/verify-otp', { email, otp });
      dispatch(hideLoading());
      
      if (data.success) {
        toast.success('OTP verified successfully!');
        setStep(3);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error(error.response?.data?.message || 'Invalid OTP');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      dispatch(showLoading());
      const { data } = await axios.post('/auth/reset-password', {
        email,
        otp,
        newPassword
      });
      dispatch(hideLoading());
      
      if (data.success) {
        toast.success('Password reset successful!');
        navigate('/login');
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error(error.response?.data?.message || 'Failed to reset password');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleSendOTP}>
            <h3>Forgot Password</h3>
            <p className="text-muted mb-4">Enter your email to receive an OTP</p>
            <InputFrom
              htmlFor="email"
              labelText={"Email"}
              type="email"
              value={email}
              handleChange={(e) => setEmail(e.target.value)}
              name="email"
              required
            />
            <div className="d-flex justify-content-between align-items-center mt-3">
              <button type="button" className="btn btn-link" onClick={() => navigate('/login')}>
                Back to Login
              </button>
              <button type="submit" className="btn btn-primary">Send OTP</button>
            </div>
          </form>
        );

      case 2:
        return (
          <form onSubmit={handleVerifyOTP}>
            <h3>Enter OTP</h3>
            <p className="text-muted mb-4">Enter the OTP sent to your email</p>
            <InputFrom
              htmlFor="otp"
              labelText={"OTP"}
              type="text"
              value={otp}
              handleChange={(e) => setOtp(e.target.value)}
              name="otp"
              required
            />
            <div className="d-flex justify-content-between align-items-center mt-3">
              <button type="button" className="btn btn-link" onClick={() => setStep(1)}>
                Back
              </button>
              <button type="submit" className="btn btn-primary">Verify OTP</button>
            </div>
          </form>
        );

      case 3:
        return (
          <form onSubmit={handleResetPassword}>
            <h3>Reset Password</h3>
            <p className="text-muted mb-4">Enter your new password</p>
            <InputFrom
              htmlFor="newPassword"
              labelText={"New Password"}
              type="password"
              value={newPassword}
              handleChange={(e) => setNewPassword(e.target.value)}
              name="newPassword"
              required
            />
            <div className="d-flex justify-content-between align-items-center mt-3">
              <button type="button" className="btn btn-link" onClick={() => setStep(2)}>
                Back
              </button>
              <button type="submit" className="btn btn-primary">Reset Password</button>
            </div>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="form-wrapper">
          <div className="form-container">
            <div className="login-card">
              <img
                src="https://static.vecteezy.com/system/resources/previews/052/291/380/non_2x/the-logo-for-job-vector.jpg"
                alt="logo"
                style={{ maxWidth: '200px', marginBottom: '2rem' }}
              />
              {renderStep()}
            </div>
          </div>

          <div className="info-box">
            <h2>Password Recovery</h2>
            <p>Don't worry! We'll help you recover your password securely.</p>
            <img
              src="https://img.freepik.com/free-vector/forgot-password-concept-illustration_114360-1123.jpg"
              alt="Password recovery"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ForgotPassword;