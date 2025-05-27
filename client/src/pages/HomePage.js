import React from "react";
import {Link}  from "react-router-dom";
import "../styles/Homepage.css";

const HomePage = () => {
    return (
        <>
           <video autoPlay muted loop id="myVideo">
            <source src="/assets/videos/bg.mp4" type="video/mp4" />
           </video>
           <div className="content">
             <div className="card w-25">
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

