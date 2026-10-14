import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="main-footer">

      <div className="footer-container">

        <div className="footer-brand">
          <div className="footer-logo">
            <span>SP</span>
          </div>

          <div>
            <h2>Smart<span>Placement</span></h2>
            <p>
              Connecting talented students with the right career opportunities.
            </p>
          </div>
        </div>

        <div className="footer-links">

          <div className="footer-column">
            <h3>Platform</h3>
            <Link to="/">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>

          <div className="footer-column">
            <h3>For Students</h3>
            <Link to="/student/jobs">Find Jobs</Link>
            <Link to="/student/recommendations">AI Recommendations</Link>
            <Link to="/student/skill-gap">Skill Gap</Link>
            <Link to="/student/applications">Applications</Link>
          </div>

          <div className="footer-column">
            <h3>Support</h3>
            <Link to="/contact">Contact Us</Link>
            <a href="#help">Help Center</a>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms & Conditions</a>
          </div>

        </div>

      </div>

      <div className="footer-bottom">

        <p>
          © {new Date().getFullYear()} Smart Placement Portal. All rights reserved.
        </p>

        <div className="footer-socials">
          <a href="#linkedin" aria-label="LinkedIn">
            in
          </a>

          <a href="#github" aria-label="GitHub">
            Git
          </a>

          <a href="#instagram" aria-label="Instagram">
            ◎
          </a>
        </div>

      </div>

    </footer>
  );
}

export default Footer;

