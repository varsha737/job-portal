import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputFrom from "../components/InputFrom";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import { setUser } from '../redux/features/auth/authSlice';
import axios from "../api/axios";
import Spinner from "../components/Spinner";
import "../styles/Spinner.css";
import "../styles/Banner.css";
import { toast } from "react-toastify";
import { FaUserTie, FaBuilding } from 'react-icons/fa';
import "../styles/Register.css";

const Register = () => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("jobseeker");
  const [company, setCompany] = useState("");

  //redux state
  const { loading } = useSelector((state) => state.alerts);

  //hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Phone number validation
  const validatePhone = (phoneNumber) => {
    if (!phoneNumber) return true; // Empty phone number is valid
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  //form function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!name || !email || !password) {
        return toast.error("Please Provide All Required Fields");
      }
      if (phone && !validatePhone(phone)) {
        return toast.error("Please enter a valid 10-digit phone number");
      }
      if (role === "recruiter" && !company) {
        return toast.error("Company name is required for recruiters");
      }

      const registerData = {
        name,
        lastName,
        email,
        password,
        phone: phone || undefined,
        role,
        company: role === "recruiter" ? company : undefined
      };
      
      console.log('Sending registration data:', registerData);
      dispatch(showLoading());
      
      const { data } = await axios.post("/auth/register", registerData);
      console.log('Registration response:', data);
      
      dispatch(hideLoading());

      if (data.success) {
        localStorage.setItem("token", data.token);
        dispatch(setUser(data.user));
        toast.success("Register Successfully");
        if (role === 'recruiter') {
          navigate("/recruiter-dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        console.log('Registration failed:', data);
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error('Registration error:', error.response || error);
      dispatch(hideLoading());
      toast.error(error.response?.data?.message || "Invalid Form Details Please Try Again");
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
        <>
          <div className="register-banner">
            <div className="register-container">
              <h1>Welcome to <span className="banner-highlight">JobPortal</span></h1>
              <p>Join thousands of job seekers and recruiters in finding the perfect match for your career or team.</p>
            </div>
          </div>
          <div className="register-container">
            <div className="register-content">
              <div className="form-container">
                <form className="login-card" onSubmit={handleSubmit}>
                  <img
                    src="https://static.vecteezy.com/system/resources/previews/052/291/380/non_2x/the-logo-for-job-vector.jpg"
                    alt="logo"
                    height={150}
                    width={200}
                    style={{ display: 'block', margin: '0 auto 2rem auto' }}
                  />

                  <div className="role-buttons">
                    <button
                      type="button"
                      className={`role-button ${role === 'jobseeker' ? 'active' : ''}`}
                      onClick={() => setRole('jobseeker')}
                    >
                      <FaUserTie />
                      <span>Job Seeker</span>
                    </button>
                    <button
                      type="button"
                      className={`role-button ${role === 'recruiter' ? 'active' : ''}`}
                      onClick={() => setRole('recruiter')}
                    >
                      <FaBuilding />
                      <span>Recruiter</span>
                    </button>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex gap-2">
                      <InputFrom
                        htmlFor="name"
                        labelText={"Name"}
                        type="text"
                        value={name}
                        handleChange={(e) => setName(e.target.value)}
                        name="name"
                      />
                      <InputFrom
                        htmlFor="lastName"
                        labelText={"Last Name"}
                        type="text"
                        value={lastName}
                        handleChange={(e) => setLastName(e.target.value)}
                        name="lastName"
                      />
                    </div>
                  </div>

                  <InputFrom
                    htmlFor="email"
                    labelText={"Email"}
                    type="email"
                    value={email}
                    handleChange={(e) => setEmail(e.target.value)}
                    name="email"
                  />

                  <InputFrom
                    htmlFor="phone"
                    labelText={"Phone Number (Optional)"}
                    type={"tel"}
                    value={phone}
                    handleChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      if (value.length <= 10) {
                        setPhone(value);
                      }
                    }}
                    name="phone"
                    placeholder="Enter 10-digit phone number (Optional)"
                    required={false}
                  />

                  <InputFrom
                    htmlFor="password"
                    labelText={"Password"}
                    type="password"
                    value={password}
                    handleChange={(e) => setPassword(e.target.value)}
                    name="password"
                  />

                  {role === "recruiter" && (
                    <InputFrom
                      htmlFor="company"
                      labelText={"Company Name"}
                      type={"text"}
                      value={company}
                      handleChange={(e) => setCompany(e.target.value)}
                      name="company"
                      required={true}
                    />
                  )}

                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <p className="mb-0">
                      Already Registered? <Link to="/login">Login</Link>
                    </p>
                    <button type="submit" className="btn btn-primary">
                      Register
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Register;