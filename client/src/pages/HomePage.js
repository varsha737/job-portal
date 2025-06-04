import React from "react";
import {Link}  from "react-router-dom";
import "../styles/Homepage.css";
import bgVideo from "../assets/videos/bg.mp4";

const HomePage = () => {
    return (
        <>
           <div className="video-container">
               <video autoPlay muted loop id="myVideo">
                   <source src={bgVideo} type="video/mp4" />
                   Your browser does not support the video tag.
               </video>
           </div>
           <div className="content">
             <div className="card">
                <img src="https://static.vecteezy.com/system/resources/previews/052/291/380/non_2x/the-logo-for-job-vector.jpg"
                 alt="logo" />
                <hr />
             <div className="card-body" style={{ marginTop:"-60px"}}>
                <h5 className="card-title">India's No #1 Career Platform</h5>
                <p className="card-text">
                    Search and manage your jobs with ease. Free and open source job portal application by varsha
                </p>
                <div className="d-flex justify-content-between mt-2">
                    <p>
                        Not a user? Register <Link to="/register">Here!</Link>
                    </p>
                    <p>
                        <Link to="/login" className="myBtn">
                            Login
                        </Link>
                    </p>
                </div>
                </div>
             </div>
           </div>
        </>
    );
};

export default HomePage;

