import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../styles/Layout.css";
import { userMenu, recruiterMenu } from "./Menus/UserMenus.js";
import { useSelector } from "react-redux";

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  
  // Choose menu based on user role
  const sidebarMenu = user?.role === 'recruiter' ? recruiterMenu : userMenu;

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logout Successfully");
    navigate("/login");
  };

  return (
    <>
      <div className="row">
        <div className="col-md-3 sidebar">
          <div className="logo">
            <h6>JOB PORTAL</h6>
          </div>
          <hr />
          <div className="user-info">
            <div className="user-welcome">
              <i className="fas fa-user-circle"></i>
              <h5>Welcome</h5>
              <h4>{user?.name}</h4>
            </div>
            <div className="user-role">
              <span className="role-badge">
                {user?.role === 'recruiter' ? (
                  <><i className="fas fa-building"></i> Recruiter</>
                ) : (
                  <><i className="fas fa-user-tie"></i> Job Seeker</>
                )}
              </span>
            </div>
          </div>
          <hr />
          <div className="menu">
            {sidebarMenu.map((menu) => {
              const isActive = location.pathname === menu.path;
              return (
                <div className={`menu-item ${isActive ? "active" : ""}`} key={menu.name}>
                  <i className={menu.icon}></i>
                  <Link to={menu.path}>{menu.name}</Link>
                </div>
              );
            })}

            {/* Logout */}
            <div className="menu-item" onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket"></i>
              <Link to="/login">Logout</Link>
            </div>
          </div>
        </div>

        <div className="col-md-9">{children}</div>
      </div>
    </>
  );
};

export default Layout;

