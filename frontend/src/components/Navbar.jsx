import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const isActive = (path) => {
    return location.pathname === path ? "nav-link active" : "nav-link";
  };

  const getDashboardPath = () => {
    if (user?.role === "Admin") return "/admin/dashboard";
    if (user?.role === "Recruiter") return "/recruiter/dashboard";
    return "/student/dashboard";
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="main-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">SP</div>
          <div className="logo-text">
            <strong>Smart</strong>
            <span>Placement</span>
          </div>
        </Link>

        <div className="navbar-links">
          <Link to="/" className={isActive("/")}>
            Home
          </Link>
          <Link to="/about" className={isActive("/about")}>
            About
          </Link>
          <Link to="/contact" className={isActive("/contact")}>
            Contact
          </Link>
        </div>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Link to={getDashboardPath()} className="login-btn">
                Dashboard ({user?.role})
              </Link>
              <button
                onClick={handleLogout}
                className="register-btn"
                style={{ cursor: "pointer", border: "none" }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="login-btn">
                Login
              </Link>
              <Link to="/register" className="register-btn">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
