import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jobsAPI } from "../services/api";

function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All Jobs");
  const [search, setSearch] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await jobsAPI.getRecruiterJobs();
      if (res.success) {
        setJobs(res.jobs || []);
      }
    } catch (err) {
      console.error("Fetch recruiter jobs error:", err);
      setError("Failed to load your job postings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDeleteJob = async (jobId, title) => {
    if (!window.confirm(`Are you sure you want to delete the job posting "${title}"?`)) {
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

  const filteredJobs = jobs.filter((job) => {
    const matchesFilter =
      filter === "All Jobs" ||
      (filter === "Active" && job.status === "Active") ||
      (filter === "Closed" && job.status === "Closed");

    const matchesSearch =
      !search ||
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const totalApplicants = jobs.reduce((sum, j) => sum + (j.applicants || j.applicantsCount || 0), 0);
  const activeJobsCount = jobs.filter((j) => j.status === "Active").length;

  return (
    <div className="recruiter-page">
      <div className="recruiter-page-header">
        <div>
          <p className="page-label">RECRUITER PORTAL</p>
          <h1>Manage Jobs</h1>
          <p className="page-description">
            Create, monitor, update and manage your company's campus recruitment opportunities.
          </p>
        </div>

        <Link to="/recruiter/post-job" className="recruiter-primary-btn" style={{ textDecoration: "none" }}>
          + Post New Job
        </Link>
      </div>

      <div className="recruiter-stat-grid">
        <div className="recruiter-stat-card">
          <div className="recruiter-stat-icon">💼</div>
          <div>
            <span>Total Jobs</span>
            <h2>{jobs.length}</h2>
          </div>
        </div>

        <div className="recruiter-stat-card">
          <div className="recruiter-stat-icon">✓</div>
          <div>
            <span>Active Jobs</span>
            <h2>{activeJobsCount}</h2>
          </div>
        </div>

        <div className="recruiter-stat-card">
          <div className="recruiter-stat-icon">👥</div>
          <div>
            <span>Total Applicants</span>
            <h2>{totalApplicants}</h2>
          </div>
        </div>
      </div>

      <div className="job-management-section">
        <div className="job-management-header">
          <div>
            <h2>Your Job Postings</h2>
            <p>View and manage all jobs posted under your company account.</p>
          </div>

          <div className="job-search">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="job-filter-row">
          {["All Jobs", "Active", "Closed"].map((item) => (
            <button
              key={item}
              className={filter === item ? "job-filter active" : "job-filter"}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {error && (
          <div style={{ padding: "16px", color: "#dc2626", background: "#fef2f2", borderRadius: "10px", margin: "10px 0" }}>
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "50px", color: "#6b7280" }}>
            <div style={{ fontSize: "2rem", marginBottom: "10px" }}>⏳</div>
            Loading posted jobs...
          </div>
        ) : filteredJobs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#6b7280" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>💼</div>
            <h3>No job postings found</h3>
            <p>You haven't posted any jobs in this category yet.</p>
            <Link to="/recruiter/post-job" className="recruiter-primary-btn" style={{ display: "inline-block", marginTop: "12px", textDecoration: "none" }}>
              + Create First Job Posting
            </Link>
          </div>
        ) : (
          <div className="job-table-wrapper">
            <table className="job-table">
              <thead>
                <tr>
                  <th>JOB TITLE</th>
                  <th>LOCATION</th>
                  <th>TYPE</th>
                  <th>APPLICANTS</th>
                  <th>DEADLINE</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {filteredJobs.map((job) => (
                  <tr key={job.id}>
                    <td>
                      <div className="job-title-info">
                        <div className="job-title-icon">💼</div>
                        <div>
                          <strong>{job.title}</strong>
                          <span>{job.company}</span>
                        </div>
                      </div>
                    </td>

                    <td>📍 {job.location}</td>

                    <td>
                      <span className="job-type-badge">{job.jobType || job.type}</span>
                    </td>

                    <td>
                      <div className="applicant-count">
                        <strong>{job.applicants || job.applicantsCount || 0}</strong>
                        <span>applicants</span>
                      </div>
                    </td>

                    <td>{job.deadline}</td>

                    <td>
                      <span className={job.status === "Active" ? "job-status active" : "job-status closed"}>
                        {job.status}
                      </span>
                    </td>

                    <td>
                      <div className="job-actions">
                        <Link
                          to={`/student/job/${job.id}`}
                          className="job-action-btn view"
                          title="View Details"
                          style={{ textDecoration: "none" }}
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDeleteJob(job.id, job.title)}
                          className="job-action-btn"
                          title="Delete Job"
                          style={{
                            background: "#fee2e2",
                            color: "#ef4444",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "600",
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

export default ManageJobs;
