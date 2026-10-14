
import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">

      <section className="hero-section">

        <div className="hero-content">

          <div className="hero-badge">
            ✨ AI-POWERED PLACEMENT PLATFORM
          </div>

          <h1>
            Your Skills.
            <br />
            Your <span>Career.</span>
            <br />
            Your Future.
          </h1>

          <p>
            Smart Student Placement Portal connects talented students with
            the right career opportunities using intelligent job matching,
            skill analysis and modern placement management.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="primary-btn">
              Get Started →
            </Link>

            <Link to="/about" className="secondary-btn">
              Explore Platform
            </Link>
          </div>

          <div className="hero-trust">
            <div className="trust-avatars">
              <span>AK</span>
              <span>SR</span>
              <span>RK</span>
              <span>+</span>
            </div>

            <div>
              <strong>500+ Students</strong>
              <p>Building their career with us</p>
            </div>
          </div>

        </div>

        <div className="hero-card">

          <div className="dashboard-preview">

            <div className="preview-header">

              <div>
                <span>STUDENT DASHBOARD</span>
                <h3>Welcome back! 👋</h3>
              </div>

              <div className="profile-circle">
                S
              </div>

            </div>

            <div className="preview-stats">

              <div>
                <span>Applications</span>
                <strong>12</strong>
              </div>

              <div>
                <span>Interviews</span>
                <strong>05</strong>
              </div>

              <div>
                <span>Offers</span>
                <strong>03</strong>
              </div>

            </div>

            <div className="recommendation-box">

              <div className="recommendation-header">
                <div className="recommendation-icon">
                  ✨
                </div>

                <div>
                  <span>AI RECOMMENDATION</span>
                  <strong>Perfect Match Found</strong>
                </div>
              </div>

              <div className="job-preview">

                <div className="job-logo">
                  T
                </div>

                <div className="job-info">
                  <strong>Java Full Stack Developer</strong>
                  <span>Tata Consultancy Services</span>
                </div>

                <div className="match-percentage">
                  96%
                </div>

              </div>

              <div className="match-bar">
                <div></div>
              </div>

            </div>

          </div>

        </div>

      </section>

      <section className="search-section">

        <div className="search-content">

          <div>
            <span>FIND YOUR NEXT OPPORTUNITY</span>

            <h2>
              Search thousands of
              <br />
              <span>career opportunities.</span>
            </h2>
          </div>

          <div className="search-box">

            <div className="search-input">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search jobs, skills or companies"
              />
            </div>

            <div className="search-location">
              📍
              <span>Location</span>
            </div>

            <button>
              Search Jobs →
            </button>

          </div>

        </div>

      </section>

      <section className="stats-section">

        <div className="stat-card">
          <strong>500+</strong>
          <span>Registered Students</span>
        </div>

        <div className="stat-card">
          <strong>98+</strong>
          <span>Partner Companies</span>
        </div>

        <div className="stat-card">
          <strong>356+</strong>
          <span>Job Opportunities</span>
        </div>

        <div className="stat-card">
          <strong>320+</strong>
          <span>Successful Placements</span>
        </div>

      </section>

      <section className="features-section">

        <div className="section-heading">

          <span>WHY SMART PLACEMENT?</span>

          <h2>
            Everything you need to
            <br />
            <span>build your career.</span>
          </h2>

          <p>
            One intelligent platform that makes the entire placement journey
            easier for students, recruiters and administrators.
          </p>

        </div>

        <div className="feature-grid">

          <div className="feature-card">

            <div className="feature-icon">
              ✨
            </div>

            <span>01</span>

            <h3>AI Job Recommendations</h3>

            <p>
              Discover jobs that match your skills, interests and career goals
              using intelligent recommendations.
            </p>

            <Link to="/student/recommendations">
              Explore Recommendations →
            </Link>

          </div>

          <div className="feature-card">

            <div className="feature-icon">
              📊
            </div>

            <span>02</span>

            <h3>Skill Gap Analysis</h3>

            <p>
              Identify missing skills and understand what you need to learn
              before applying for your dream job.
            </p>

            <Link to="/student/skill-gap">
              Analyze Your Skills →
            </Link>

          </div>

          <div className="feature-card">

            <div className="feature-icon">
              💼
            </div>

            <span>03</span>

            <h3>Smart Job Portal</h3>

            <p>
              Find relevant job opportunities and manage your applications
              from one simple platform.
            </p>

            <Link to="/student/jobs">
              Find Jobs →
            </Link>

          </div>

        </div>

      </section>

      <section className="cta-section">

        <div className="cta-content">

          <span>READY TO START?</span>

          <h2>
            Your dream career
            <br />
            starts here.
          </h2>

          <p>
            Create your account today and take the next step toward your
            professional future.
          </p>

          <Link to="/register" className="cta-button">
            Create Free Account →
          </Link>

        </div>

        <div className="cta-decoration">
          <div>SP</div>
        </div>

      </section>

    </div>
  );
}

export default Home;

