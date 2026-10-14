import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jobsAPI } from "../services/api";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  const fetchJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await jobsAPI.getAll({
        keyword: search || undefined,
        jobType: selectedType !== "All" ? selectedType : undefined,
      });
      if (res.success) {
        setJobs(res.jobs || []);
      }
    } catch (err) {
      console.error("Fetch jobs error:", err);
      setError("Failed to load job listings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [selectedType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="student-page">
      <div className="student-page-header">
        <div>
          <p className="page-label">STUDENT PORTAL</p>
          <h1>Explore Opportunities</h1>
          <p className="page-description">
            Discover verified campus placement and internship opportunities matching your career profile.
          </p>
        </div>

        <Link to="/student/applications" className="student-primary-btn">
          My Applications →
        </Link>
      </div>

      <div className="job-management-section">
        <div className="job-management-header">
          <div>
            <h2>Available Job Postings ({jobs.length})</h2>
            <p>Filter by role title, company name, skill or employment type.</p>
          </div>

          <form onSubmit={handleSearchSubmit} className="job-search">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search by role, company or skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
        </div>

        <div className="job-filter-row">
          {["All", "Full Time", "Internship", "Remote"].map((type) => (
            <button
              key={type}
              className={selectedType === type ? "job-filter active" : "job-filter"}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </button>
          ))}
        </div>

        {error && (
          <div style={{ padding: "20px", color: "#dc2626", background: "#fef2f2", borderRadius: "12px", marginBottom: "20px" }}>
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "50px", color: "#6b7280" }}>
            <div style={{ fontSize: "2rem", marginBottom: "10px" }}>⏳</div>
            Loading active job opportunities...
          </div>
        ) : jobs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "10px" }}>💼</div>
            <h3 style={{ color: "#111827", marginBottom: "8px" }}>No Jobs Found</h3>
            <p style={{ color: "#6b7280" }}>Try adjusting your search criteria or filter options.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px", marginTop: "20px" }}>
            {jobs.map((job) => (
              <div
                key={job.id}
                style={{
                  background: "#ffffff",
                  borderRadius: "20px",
                  padding: "24px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  border: "1px solid #f1f3f9",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                    <div
                      className={`job-logo ${job.color || "blue"}`}
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "14px",
                        background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "800",
                        fontSize: "18px",
                      }}
                    >
                      {job.logo || "SP"}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "17px", color: "#111827", fontWeight: "700" }}>{job.title}</h3>
                      <p style={{ margin: "2px 0 0", color: "#6b7280", fontSize: "13px" }}>{job.company}</p>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
                    <span style={{ background: "#eef2ff", color: "#4f46e5", padding: "4px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: "600" }}>
                      📍 {job.location}
                    </span>
                    <span style={{ background: "#ecfdf5", color: "#059669", padding: "4px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: "600" }}>
                      💼 {job.jobType || job.type}
                    </span>
                    <span style={{ background: "#fef3c7", color: "#d97706", padding: "4px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: "600" }}>
                      💰 {job.salary}
                    </span>
                  </div>

                  <p style={{ color: "#4b5563", fontSize: "13px", lineHeight: "1.5", marginBottom: "16px", maxHeight: "60px", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {job.description}
                  </p>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "18px" }}>
                    {(job.skills || []).slice(0, 4).map((skill, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: "#f3f4f6",
                          color: "#374151",
                          padding: "3px 8px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: "500",
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                    {(job.skills || []).length > 4 && (
                      <span style={{ color: "#9ca3af", fontSize: "11px", alignSelf: "center" }}>
                        +{(job.skills || []).length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "14px", borderTop: "1px solid #f3f4f6" }}>
                  <span style={{ color: "#9ca3af", fontSize: "12px" }}>
                    Deadline: {job.deadline}
                  </span>
                  <Link
                    to={`/student/job/${job.id}`}
                    style={{
                      background: "linear-gradient(135deg, #4f46e5, #9333ea)",
                      color: "white",
                      padding: "8px 16px",
                      borderRadius: "10px",
                      fontSize: "13px",
                      fontWeight: "700",
                      textDecoration: "none",
                    }}
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Jobs;
