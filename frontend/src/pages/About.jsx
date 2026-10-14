import React from "react";
import { Link } from "react-router-dom";

function About() {
  return (
    <div className="about-page">

      <section className="about-hero">

        <div className="about-hero-content">

          <span className="about-badge">
            ABOUT SMART PLACEMENT
          </span>

          <h1>
            Building a Smarter
            <span> Career Future</span>
          </h1>

          <p>
            Smart Placement Portal is an intelligent platform designed to
            connect students, recruiters and companies through a simple,
            efficient and AI-powered placement ecosystem.
          </p>

          <div className="about-buttons">
            <Link to="/register" className="about-primary-btn">
              Get Started →
            </Link>

            <Link to="/contact" className="about-secondary-btn">
              Contact Us
            </Link>
          </div>

        </div>

        <div className="about-visual">

          <div className="about-main-card">

            <div className="about-card-top">
              <div className="about-card-icon">
                SP
              </div>

              <div>
                <strong>Smart Placement</strong>
                <span>Career Management Platform</span>
              </div>
            </div>

            <div className="about-card-stats">

              <div>
                <strong>500+</strong>
                <span>Students</span>
              </div>

              <div>
                <strong>98+</strong>
                <span>Companies</span>
              </div>

              <div>
                <strong>320+</strong>
                <span>Placements</span>
              </div>

            </div>

            <div className="about-success-box">
              <span>Placement Success Rate</span>

              <strong>64%</strong>

              <div className="about-progress">
                <div></div>
              </div>
            </div>

          </div>

        </div>

      </section>

      <section className="about-story">

        <div className="about-section-heading">

          <span>OUR PURPOSE</span>

          <h2>
            Making placements
            <br />
            <span>simple and intelligent.</span>
          </h2>

          <p>
            Traditional placement processes can be difficult to manage for
            students, recruiters and administrators. Our platform brings
            everything together in one centralized system.
          </p>

        </div>

        <div className="about-purpose-grid">

          <div className="about-purpose-card">
            <div className="purpose-icon">🎓</div>

            <h3>For Students</h3>

            <p>
              Discover relevant job opportunities, manage applications,
              identify skill gaps and receive AI-based career recommendations.
            </p>
          </div>

          <div className="about-purpose-card">
            <div className="purpose-icon">🏢</div>

            <h3>For Recruiters</h3>

            <p>
              Post job opportunities, manage applicants and efficiently find
              talented students based on their skills and qualifications.
            </p>
          </div>

          <div className="about-purpose-card">
            <div className="purpose-icon">📊</div>

            <h3>For Administrators</h3>

            <p>
              Manage students, recruiters, companies and jobs while monitoring
              overall placement performance through centralized reports.
            </p>
          </div>

        </div>

      </section>

      <section className="about-features">

        <div className="about-section-heading center">

          <span>WHY SMART PLACEMENT?</span>

          <h2>
            Everything you need for
            <span> better placements.</span>
          </h2>

        </div>

        <div className="about-feature-grid">

          <div className="about-feature-card">
            <div className="feature-number">01</div>
            <div>
              <h3>AI-Powered Recommendations</h3>
              <p>
                Help students discover opportunities that match their skills,
                interests and career goals.
              </p>
            </div>
          </div>

          <div className="about-feature-card">
            <div className="feature-number">02</div>
            <div>
              <h3>Centralized Job Management</h3>
              <p>
                Manage job postings, applications and recruitment activities
                from one platform.
              </p>
            </div>
          </div>

          <div className="about-feature-card">
            <div className="feature-number">03</div>
            <div>
              <h3>Skill Gap Analysis</h3>
              <p>
                Identify missing skills and guide students toward better
                career preparation.
              </p>
            </div>
          </div>

          <div className="about-feature-card">
            <div className="feature-number">04</div>
            <div>
              <h3>Placement Analytics</h3>
              <p>
                Provide administrators with useful insights into placement
                performance and recruitment trends.
              </p>
            </div>
          </div>

        </div>

      </section>

      <section className="about-cta">

        <div>
          <span>START YOUR CAREER JOURNEY</span>

          <h2>
            Your next opportunity
            <br />
            could be one click away.
          </h2>

          <p>
            Join Smart Placement and take the next step toward your career.
          </p>
        </div>

        <Link to="/register" className="about-cta-btn">
          Create Your Account →
        </Link>

      </section>

    </div>
  );
}

export default About;

