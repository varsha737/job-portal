import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputFrom from "../components/InputFrom";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import axios from "../api/axios";
import Spinner from "../components/Spinner";
import "../styles/Spinner.css";
import "../styles/Banner.css";
import { toast } from "react-toastify";
import { FaUserTie, FaBuilding } from 'react-icons/fa';

const Register = () => {
  const [name, setName] = useState("");
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
      dispatch(showLoading());
      const { data } = await axios.post("/auth/register", {
        name,
        email,
        password,
        phone: phone || undefined, // Only send phone if it's provided
        role,
        company: role === "recruiter" ? company : undefined
      });
      dispatch(hideLoading());

      if (data.success) {
        toast.success("Register Successfully");
        navigate("/login");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error(error.response?.data?.message || "Invalid Form Details Please Try Again");
      console.log(error);
    }
  };

  return (
    <>
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

                  <InputFrom
                    htmlFor="name"
                    labelText={"Name"}
                    type={"text"}
                    value={name}
                    handleChange={(e) => setName(e.target.value)}
                    name="name"
                    required={true}
                  />

                  <InputFrom
                    htmlFor="email"
                    labelText={"Email"}
                    type={"email"}
                    value={email}
                    handleChange={(e) => setEmail(e.target.value)}
                    name="email"
                    required={true}
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
                    type={"password"}
                    value={password}
                    handleChange={(e) => setPassword(e.target.value)}
                    name="password"
                    required={true}
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