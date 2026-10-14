import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { studentAPI } from "../services/api";

function StudentDashboard() {
  const { user } = useAuth();

  const [dashboardData, setDashboardData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const [dashRes, recRes] = await Promise.all([
          studentAPI.getDashboard(),
          studentAPI.getRecommendations(),
        ]);

        if (dashRes.success) {
          setDashboardData(dashRes);
        }
        if (recRes.success) {
          setRecommendations(recRes.recommendations || []);
        }
      } catch (err) {
        console.error("Dashboard loading error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const stats = [
    {
      title: "Applications",
      value: dashboardData?.stats?.totalApplications ?? 0,
      icon: "📄",
      color: "blue",
      link: "/student/applications",
    },
    {
      title: "Shortlisted",
      value: dashboardData?.stats?.shortlisted ?? 0,
      icon: "⭐",
      color: "purple",
      link: "/student/applications",
    },
    {
      title: "Interviews",
      value: dashboardData?.stats?.interviews ?? 0,
      icon: "📅",
      color: "orange",
      link: "/student/applications",
    },
    {
      title: "Job Matches",
      value: dashboardData?.stats?.jobMatches ?? recommendations.length,
      icon: "🎯",
      color: "green",
      link: "/student/recommendations",
    },
  ];

  const recentApplications = dashboardData?.recentApplications || [];

  return (
    <div className="student-page student-dashboard">
      <div className="student-page-header">
        <div>
          <p className="page-label">STUDENT PORTAL</p>
          <h1>Welcome back, {user?.name || "Student"}! 👋</h1>
          <p className="page-description">
            Track your applications, discover new opportunities and build your
            career with Smart Placement.
          </p>
        </div>

        <Link to="/student/jobs" className="student-primary-btn">
          Find Jobs →
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
        {/* Left column: Recommended Jobs */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <div>
              <h3>AI Recommended Jobs</h3>
              <p>Top matching positions based on your skills profile</p>
            </div>
            <Link to="/student/recommendations" className="dashboard-view-link">
              View All →
            </Link>
          </div>

          <div className="student-job-list">
            {recommendations.length === 0 ? (
              <p style={{ padding: "20px", color: "#6b7280", textAlign: "center" }}>
                No job recommendations currently available.
              </p>
            ) : (
              recommendations.slice(0, 4).map((job) => (
                <div key={job.id} className="student-job-item">
                  <div className={`student-job-logo ${job.color || "blue"}`}>
                    {job.logo || "SP"}
                  </div>
                  <div className="student-job-info">
                    <h4>{job.title}</h4>
                    <span className="student-job-meta">
                      {job.company} • 📍 {job.location} • 💰 {job.salary}
                    </span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span className="student-job-match">{job.match}% match</span>
                    <br />
                    <Link
                      to={`/student/job/${job.id}`}
                      className="student-job-view-btn"
                      style={{ textDecoration: "none", display: "inline-block", marginTop: "4px" }}
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right column: Recent Applications & Profile Summary */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <div>
              <h3>Recent Applications</h3>
              <p>Status of your recently submitted applications</p>
            </div>
            <Link to="/student/applications" className="dashboard-view-link">
              View All →
            </Link>
          </div>

          <div className="student-job-list">
            {recentApplications.length === 0 ? (
              <div style={{ padding: "30px 20px", textAlign: "center", color: "#6b7280" }}>
                <p>You haven't submitted any job applications yet.</p>
                <Link
                  to="/student/jobs"
                  className="student-primary-btn"
                  style={{ display: "inline-block", marginTop: "10px", fontSize: "13px" }}
                >
                  Explore Jobs →
                </Link>
              </div>
            ) : (
              recentApplications.map((app) => (
                <div key={app.id} className="student-job-item">
                  <div className="student-job-logo blue">{app.logo || "SP"}</div>
                  <div className="student-job-info">
                    <h4>{app.job}</h4>
                    <span className="student-job-meta">
                      {app.company} • 📅 {app.date}
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

          <div
            style={{
              marginTop: "20px",
              padding: "16px",
              background: "linear-gradient(135deg, #eef2ff, #f3e8ff)",
              borderRadius: "15px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <strong style={{ color: "#3730a3", fontSize: "14px" }}>Profile Strength</strong>
              <p style={{ margin: "3px 0 0", color: "#6b7280", fontSize: "12px" }}>
                Add more skills to increase match percentage
              </p>
            </div>
            <Link
              to="/student/profile"
              style={{
                color: "#4f46e5",
                fontWeight: "700",
                fontSize: "13px",
                textDecoration: "none",
              }}
            >
              Update Profile →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
