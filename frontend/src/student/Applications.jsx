import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { applicationsAPI } from "../services/api";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    underReview: 0,
    interviews: 0,
    shortlisted: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Applications");

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await applicationsAPI.getMyApplications({
        status: statusFilter !== "All Applications" ? statusFilter : undefined,
      });
      if (res.success) {
        setApplications(res.applications || []);
      }

      const statsRes = await applicationsAPI.getStats();
      if (statsRes.success && statsRes.stats) {
        setStats(statsRes.stats);
      }
    } catch (err) {
      console.error("Fetch applications error:", err);
      setError("Failed to load your applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const getStatusClass = (status) => {
    if (status === "Shortlisted") return "application-status shortlisted";
    if (status === "Interview") return "application-status interview";
    if (status === "Rejected") return "application-status rejected";
    if (status === "Accepted") return "application-status shortlisted";
    return "application-status review";
  };

  return (
    <div className="student-page">
      <div className="student-page-header">
        <div>
          <p className="page-label">STUDENT PORTAL</p>
          <h1>My Applications</h1>
          <p className="page-description">
            Track all your job applications and monitor their current status in real-time.
          </p>
        </div>

        <Link to="/student/jobs" className="student-primary-btn">
          Find More Jobs →
        </Link>
      </div>

      <div className="application-stats">
        <div className="application-stat-card">
          <div className="application-stat-icon blue">📄</div>
          <div>
            <span>Total Applications</span>
            <h2>{stats.total || applications.length}</h2>
          </div>
        </div>

        <div className="application-stat-card">
          <div className="application-stat-icon purple">👀</div>
          <div>
            <span>Under Review</span>
            <h2>{stats.underReview || 0}</h2>
          </div>
        </div>

        <div className="application-stat-card">
          <div className="application-stat-icon orange">📅</div>
          <div>
            <span>Interviews</span>
            <h2>{stats.interviews || 0}</h2>
          </div>
        </div>

        <div className="application-stat-card">
          <div className="application-stat-icon green">✓</div>
          <div>
            <span>Shortlisted</span>
            <h2>{stats.shortlisted || 0}</h2>
          </div>
        </div>
      </div>

      <div className="application-section">
        <div className="application-section-header">
          <div>
            <h2>Application History</h2>
            <p>View and track your recent job applications.</p>
          </div>

          <div className="application-filter">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Applications</option>
              <option>Shortlisted</option>
              <option>Interview</option>
              <option>Under Review</option>
              <option>Rejected</option>
              <option>Accepted</option>
            </select>
          </div>
        </div>

        {error && (
          <div style={{ padding: "16px", color: "#dc2626", background: "#fef2f2", borderRadius: "10px", margin: "10px 0" }}>
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>⏳</div>
            Loading your applications...
          </div>
        ) : applications.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px 20px", color: "#6b7280" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>📄</div>
            <h3 style={{ color: "#111827", marginBottom: "6px" }}>No applications found</h3>
            <p>You haven't submitted any applications under this category yet.</p>
            <Link to="/student/jobs" className="student-primary-btn" style={{ display: "inline-block", marginTop: "15px" }}>
              Browse Available Jobs →
            </Link>
          </div>
        ) : (
          <div className="application-list">
            {applications.map((app) => (
              <div className="application-card" key={app.id}>
                <div className={`application-company-logo ${app.color || "blue"}`}>
                  {app.logo || "SP"}
                </div>

                <div className="application-main-info">
                  <h3>{app.job || app.jobTitle}</h3>
                  <p className="application-company">{app.company}</p>

                  <div className="application-meta">
                    <span>📍 {app.location}</span>
                    <span>
                      📅 Applied:{" "}
                      {app.appliedDate
                        ? new Date(app.appliedDate).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "Recently"}
                    </span>
                  </div>

                  {app.notes && (
                    <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "6px" }}>
                      📝 <em>Notes: {app.notes}</em>
                    </p>
                  )}
                </div>

                <div className="application-status-wrapper">
                  <span className={getStatusClass(app.status)}>
                    {app.status}
                  </span>
                  {app.status === "Interview" && (
                    <small>Interview scheduled</small>
                  )}
                </div>

                <Link
                  to={`/student/job/${app.jobId}`}
                  className="application-view-btn"
                  style={{ textDecoration: "none" }}
                >
                  View Job
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="application-tip">
        <div className="application-tip-icon">💡</div>
        <div>
          <h3>Keep your profile updated</h3>
          <p>
            A complete profile with updated skills and resume can improve your
            chances of getting shortlisted by recruiters.
          </p>
        </div>
        <Link to="/student/profile" className="application-tip-btn">
          Update Profile →
        </Link>
      </div>
    </div>
  );
}

export default Applications;
