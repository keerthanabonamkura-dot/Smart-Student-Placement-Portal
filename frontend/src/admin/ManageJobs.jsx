import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminAPI, jobsAPI } from "../services/api";

function AdminManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getJobs();
      if (res.success) {
        setJobs(res.jobs || []);
      }
    } catch (err) {
      console.error("Fetch admin jobs error:", err);
      setError("Failed to load jobs list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDeleteJob = async (jobId, title) => {
    if (!window.confirm(`Are you sure you want to delete the job opportunity "${title}" as Admin?`)) {
      return;
    }

    try {
      const res = await jobsAPI.delete(jobId);
      if (res.success) {
        setJobs(jobs.filter((j) => j.id !== jobId));
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete job.");
    }
  };

  const filteredJobs = jobs.filter((j) => {
    return (
      !search ||
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.location.toLowerCase().includes(search.toLowerCase())
    );
  });

  const activeJobsCount = jobs.filter((j) => j.status === "Active").length;
  const totalApplicants = jobs.reduce((sum, j) => sum + (j.applicants || j.applicantsCount || 0), 0);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="page-label">ADMINISTRATION</p>
          <h1>Manage All Jobs</h1>
          <p className="page-description">
            Monitor, review, moderate and manage all campus job opportunities posted across companies.
          </p>
        </div>
      </div>

      <div className="company-stat-grid">
        <div className="company-stat-card">
          <div className="stat-icon">💼</div>
          <div>
            <span>Total Jobs</span>
            <h2>{jobs.length}</h2>
          </div>
        </div>

        <div className="company-stat-card">
          <div className="stat-icon">✓</div>
          <div>
            <span>Active Jobs</span>
            <h2>{activeJobsCount}</h2>
          </div>
        </div>

        <div className="company-stat-card">
          <div className="stat-icon">⏳</div>
          <div>
            <span>Closed Jobs</span>
            <h2>{jobs.length - activeJobsCount}</h2>
          </div>
        </div>

        <div className="company-stat-card">
          <div className="stat-icon">👥</div>
          <div>
            <span>Total Applicants</span>
            <h2>{totalApplicants}</h2>
          </div>
        </div>
      </div>

      <div className="company-section">
        <div className="company-section-header">
          <div>
            <h2>Job Opportunities Master List</h2>
            <p>Review and moderate jobs posted by all registered companies.</p>
          </div>

          <div className="company-search">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search jobs by title, company or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div style={{ padding: "16px", color: "#dc2626", background: "#fef2f2", borderRadius: "10px", margin: "10px 0" }}>
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "50px", color: "#6b7280" }}>
            <div style={{ fontSize: "2rem", marginBottom: "10px" }}>⏳</div>
            Loading all jobs...
          </div>
        ) : filteredJobs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
            No jobs found matching your search.
          </div>
        ) : (
          <div className="company-table-wrapper">
            <table className="company-table">
              <thead>
                <tr>
                  <th>JOB TITLE</th>
                  <th>COMPANY</th>
                  <th>LOCATION</th>
                  <th>TYPE</th>
                  <th>APPLICANTS</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {filteredJobs.map((job) => (
                  <tr key={job.id}>
                    <td>
                      <div className="company-info">
                        <div className="company-avatar">💼</div>
                        <div>
                          <strong>{job.title}</strong>
                          <span>{job.company}</span>
                        </div>
                      </div>
                    </td>

                    <td>{job.company}</td>

                    <td>📍 {job.location}</td>

                    <td>
                      <span className="job-type">{job.jobType || job.type}</span>
                    </td>

                    <td>
                      <span className="job-count">{job.applicants || job.applicantsCount || 0}</span>
                    </td>

                    <td>
                      <span className={job.status === "Active" ? "company-status active" : "company-status pending"}>
                        {job.status}
                      </span>
                    </td>

                    <td>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <Link
                          to={`/student/job/${job.id}`}
                          className="view-company-btn"
                          style={{ textDecoration: "none" }}
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDeleteJob(job.id, job.title)}
                          style={{
                            background: "#fee2e2",
                            color: "#dc2626",
                            border: "none",
                            padding: "6px 10px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "600",
                            fontSize: "12px",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminManageJobs;
