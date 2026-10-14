import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { jobsAPI, applicationsAPI } from "../services/api";

function JobDetails() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchJobData = async () => {
      setLoading(true);
      setError("");
      try {
        const jobRes = await jobsAPI.getById(id);
        if (jobRes.success && jobRes.job) {
          setJob(jobRes.job);
        }

        // Check if student already applied
        try {
          const appRes = await applicationsAPI.getMyApplications();
          if (appRes.success && appRes.applications) {
            const hasApplied = appRes.applications.some(
              (a) => Number(a.jobId) === Number(id)
            );
            setApplied(hasApplied);
          }
        } catch (ignore) {}
      } catch (err) {
        console.error("Fetch job details error:", err);
        setError("Could not load job details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
  }, [id]);

  const handleApply = async () => {
    if (applied) return;
    setApplying(true);
    setSuccessMessage("");
    setError("");

    try {
      const res = await applicationsAPI.apply(id, "Applied via student portal");
      if (res.success) {
        setApplied(true);
        setSuccessMessage("🎉 Your application was submitted successfully!");
      }
    } catch (err) {
      console.error("Apply error:", err);
      const msg = err.response?.data?.message || "Failed to submit application.";
      if (msg.includes("already applied")) {
        setApplied(true);
      }
      setError(msg);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="student-page" style={{ textAlign: "center", padding: "100px 20px" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "15px" }}>⏳</div>
        <p style={{ color: "#6b7280" }}>Loading job specifications...</p>
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="student-page" style={{ textAlign: "center", padding: "100px 20px" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "15px" }}>⚠️</div>
        <h2 style={{ color: "#111827" }}>{error}</h2>
        <Link to="/student/jobs" className="student-primary-btn" style={{ marginTop: "20px", display: "inline-block" }}>
          ← Back to All Jobs
        </Link>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="student-page job-details-page">
      <div className="job-details-back">
        <Link to="/student/jobs">← Back to Jobs</Link>
      </div>

      {successMessage && (
        <div
          style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            color: "#16a34a",
            padding: "16px 20px",
            borderRadius: "15px",
            marginBottom: "20px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span>✓</span> {successMessage}
        </div>
      )}

      {error && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#dc2626",
            padding: "16px 20px",
            borderRadius: "15px",
            marginBottom: "20px",
            fontWeight: "600",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      <div className="job-details-hero">
        <div className="job-company-logo-large">{job.logo || "SP"}</div>

        <div className="job-details-title">
          <span className="job-details-category">{job.category || "Software Development"}</span>

          <h1>{job.title}</h1>

          <h3>{job.company}</h3>

          <div className="job-details-meta">
            <span>📍 {job.location}</span>
            <span>💼 {job.jobType || job.type}</span>
            <span>🎓 {job.experience || job.eligibility}</span>
            <span>💰 {job.salary}</span>
          </div>
        </div>

        <div className="job-details-action">
          {applied ? (
            <button
              className="job-apply-btn"
              disabled
              style={{
                background: "#10b981",
                cursor: "default",
                opacity: 0.9,
              }}
            >
              ✓ Applied
            </button>
          ) : (
            <button
              className="job-apply-btn"
              onClick={handleApply}
              disabled={applying}
              style={{ cursor: applying ? "wait" : "pointer", opacity: applying ? 0.7 : 1 }}
            >
              {applying ? "Submitting..." : "Apply Now →"}
            </button>
          )}

          <p>Application deadline: {job.deadline || job.applicationDeadline}</p>
        </div>
      </div>

      <div className="job-details-layout">
        <main className="job-details-main">
          <section className="job-details-card">
            <div className="job-details-card-header">
              <div className="job-section-icon">📋</div>
              <div>
                <h2>Job Description</h2>
                <p>About this opportunity</p>
              </div>
            </div>

            <p className="job-description-text">{job.description}</p>
          </section>

          {job.responsibilities && job.responsibilities.length > 0 && (
            <section className="job-details-card">
              <div className="job-details-card-header">
                <div className="job-section-icon">🎯</div>
                <div>
                  <h2>Responsibilities</h2>
                  <p>What you will be working on</p>
                </div>
              </div>

              <ul className="job-details-list">
                {job.responsibilities.map((item, index) => (
                  <li key={index}>
                    <span>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {job.qualifications && job.qualifications.length > 0 && (
            <section className="job-details-card">
              <div className="job-details-card-header">
                <div className="job-section-icon">🎓</div>
                <div>
                  <h2>Qualifications</h2>
                  <p>What we are looking for</p>
                </div>
              </div>

              <ul className="job-details-list">
                {job.qualifications.map((item, index) => (
                  <li key={index}>
                    <span>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="job-details-card">
            <div className="job-details-card-header">
              <div className="job-section-icon">⚡</div>
              <div>
                <h2>Required Skills</h2>
                <p>Skills required for this position</p>
              </div>
            </div>

            <div className="job-skill-list">
              {(job.skills || []).map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </section>
        </main>

        <aside className="job-details-sidebar">
          <div className="job-overview-card">
            <h2>Job Overview</h2>

            <div className="job-overview-item">
              <div className="overview-icon">💼</div>
              <div>
                <span>Job Type</span>
                <strong>{job.jobType || job.type}</strong>
              </div>
            </div>

            <div className="job-overview-item">
              <div className="overview-icon">📍</div>
              <div>
                <span>Location</span>
                <strong>{job.location}</strong>
              </div>
            </div>

            <div className="job-overview-item">
              <div className="overview-icon">🎓</div>
              <div>
                <span>Experience / Eligibility</span>
                <strong>{job.experience || job.eligibility}</strong>
              </div>
            </div>

            <div className="job-overview-item">
              <div className="overview-icon">💰</div>
              <div>
                <span>Salary</span>
                <strong>{job.salary}</strong>
              </div>
            </div>

            <div className="job-overview-item">
              <div className="overview-icon">👥</div>
              <div>
                <span>Applicants</span>
                <strong>{job.applicants || job.applicantsCount || 0}</strong>
              </div>
            </div>

            <div className="job-overview-item">
              <div className="overview-icon">📅</div>
              <div>
                <span>Deadline</span>
                <strong>{job.deadline || job.applicationDeadline}</strong>
              </div>
            </div>
          </div>

          <div className="company-mini-card">
            <div className="company-mini-logo">{job.logo || "SP"}</div>

            <h2>{job.company}</h2>

            <p>Verified recruiting partner on the Smart Student Placement Portal.</p>
          </div>

          <div className="job-apply-reminder">
            <div>🚀</div>
            <h3>Ready to apply?</h3>
            <p>Ensure your profile skills and contact information are up to date.</p>

            {applied ? (
              <button
                className="job-apply-sidebar-btn"
                disabled
                style={{ background: "#10b981", cursor: "default" }}
              >
                ✓ Already Applied
              </button>
            ) : (
              <button
                className="job-apply-sidebar-btn"
                onClick={handleApply}
                disabled={applying}
              >
                {applying ? "Applying..." : "Apply Now"}
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default JobDetails;
