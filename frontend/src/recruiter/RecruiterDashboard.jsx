import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jobsAPI, applicationsAPI } from "../services/api";

function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [jobsRes, appsRes] = await Promise.all([
          jobsAPI.getRecruiterJobs(),
          applicationsAPI.getRecruiterApplicants(),
        ]);

        if (jobsRes.success) {
          setJobs(jobsRes.jobs || []);
        }
        if (appsRes.success) {
          setApplicants(appsRes.applicants || []);
        }
      } catch (err) {
        console.error("Recruiter dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const activeJobs = jobs.filter((j) => j.status === "Active").length;
  const totalApplicants = applicants.length;
  const interviewsCount = applicants.filter((a) => a.status === "Interview").length;
  const hiredCount = applicants.filter((a) => a.status === "Accepted").length;

  const stats = [
    {
      title: "Active Jobs",
      value: activeJobs,
      icon: "💼",
      color: "blue",
      link: "/recruiter/manage-jobs",
    },
    {
      title: "Total Applicants",
      value: totalApplicants,
      icon: "👥",
      color: "purple",
      link: "/recruiter/applicants",
    },
    {
      title: "Interviews",
      value: interviewsCount,
      icon: "📅",
      color: "orange",
      link: "/recruiter/applicants",
    },
    {
      title: "Hired Students",
      value: hiredCount,
      icon: "🎓",
      color: "green",
      link: "/recruiter/applicants",
    },
  ];

  return (
    <div className="recruiter-page">
      <div className="recruiter-page-header">
        <div>
          <p className="page-label">RECRUITER PORTAL</p>
          <h1>Recruiter Dashboard</h1>
          <p className="page-description">
            Welcome back! Manage your job postings and find the best student talent for your company.
          </p>
        </div>

        <Link to="/recruiter/post-job" className="recruiter-primary-btn" style={{ textDecoration: "none" }}>
          + Post New Job
        </Link>
      </div>

      <div className="dashboard-stats-grid">
        {stats.map((item) => (
          <Link
            to={item.link}
            key={item.title}
            className={`dashboard-stat-card ${item.color}`}
            style={{ textDecoration: "none" }}
          >
            <div className="stat-card-icon">{item.icon}</div>
            <div className="stat-card-content">
              <span>{item.title}</span>
              <h2>{item.value}</h2>
            </div>
          </Link>
        ))}
      </div>

      <div className="dashboard-two-column">
        {/* Recent Jobs */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <div>
              <h3>Recent Job Postings</h3>
              <p>Jobs published by your organization</p>
            </div>
            <Link to="/recruiter/manage-jobs" className="dashboard-view-link">
              Manage All →
            </Link>
          </div>

          <div className="student-job-list">
            {jobs.length === 0 ? (
              <p style={{ padding: "20px", color: "#6b7280", textAlign: "center" }}>
                No active jobs posted yet.
              </p>
            ) : (
              jobs.slice(0, 4).map((job) => (
                <div key={job.id} className="student-job-item">
                  <div className="student-job-logo blue">{job.logo || "SP"}</div>
                  <div className="student-job-info">
                    <h4>{job.title}</h4>
                    <span className="student-job-meta">
                      📍 {job.location} • 💼 {job.jobType || job.type} • 👥 {job.applicants || job.applicantsCount || 0} applicants
                    </span>
                  </div>
                  <span className={job.status === "Active" ? "job-status active" : "job-status closed"}>
                    {job.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Applicants */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <div>
              <h3>Recent Candidates</h3>
              <p>Students who recently applied for your positions</p>
            </div>
            <Link to="/recruiter/applicants" className="dashboard-view-link">
              View All →
            </Link>
          </div>

          <div className="student-job-list">
            {applicants.length === 0 ? (
              <p style={{ padding: "20px", color: "#6b7280", textAlign: "center" }}>
                No candidates have applied yet.
              </p>
            ) : (
              applicants.slice(0, 4).map((app) => (
                <div key={app.id} className="student-job-item">
                  <div className="applicant-avatar" style={{ width: "40px", height: "40px" }}>
                    {app.name ? app.name.charAt(0) : "S"}
                  </div>
                  <div className="student-job-info">
                    <h4>{app.name}</h4>
                    <span className="student-job-meta">
                      Applied for {app.job || app.jobTitle} • {app.course}
                    </span>
                  </div>
                  <span
                    className={`application-status ${
                      app.status === "Shortlisted"
                        ? "shortlisted"
                        : app.status === "Interview"
                        ? "interview"
                        : app.status === "Rejected"
                        ? "rejected"
                        : "review"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecruiterDashboard;
