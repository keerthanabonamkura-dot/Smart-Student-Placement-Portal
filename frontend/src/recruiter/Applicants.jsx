import React, { useState, useEffect } from "react";
import { applicationsAPI } from "../services/api";

function Applicants() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All Applicants");
  const [search, setSearch] = useState("");

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const res = await applicationsAPI.getRecruiterApplicants();
      if (res.success) {
        setApplicants(res.applicants || []);
      }
    } catch (err) {
      console.error("Fetch applicants error:", err);
      setError("Failed to load applicants.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      const res = await applicationsAPI.updateStatus(appId, newStatus);
      if (res.success) {
        setApplicants((prev) =>
          prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status.");
    }
  };

  const filteredApplicants = applicants.filter((app) => {
    const matchesFilter =
      filter === "All Applicants" ||
      (filter === "Shortlisted" && app.status === "Shortlisted") ||
      (filter === "Interview" && app.status === "Interview") ||
      (filter === "Selected" && (app.status === "Accepted" || app.status === "Selected")) ||
      (filter === "Rejected" && app.status === "Rejected");

    const matchesSearch =
      !search ||
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.email.toLowerCase().includes(search.toLowerCase()) ||
      (app.job || "").toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const shortlistedCount = applicants.filter((a) => a.status === "Shortlisted").length;
  const interviewCount = applicants.filter((a) => a.status === "Interview").length;
  const selectedCount = applicants.filter((a) => a.status === "Accepted").length;

  return (
    <div className="recruiter-page">
      <div className="recruiter-page-header">
        <div>
          <p className="page-label">RECRUITER PORTAL</p>
          <h1>Candidate Applicants</h1>
          <p className="page-description">
            Review candidate qualifications, manage recruitment stages and update application statuses.
          </p>
        </div>
      </div>

      <div className="recruiter-stat-grid">
        <div className="recruiter-stat-card">
          <div className="recruiter-stat-icon">👥</div>
          <div>
            <span>Total Applicants</span>
            <h2>{applicants.length}</h2>
          </div>
        </div>

        <div className="recruiter-stat-card">
          <div className="recruiter-stat-icon">⭐</div>
          <div>
            <span>Shortlisted</span>
            <h2>{shortlistedCount}</h2>
          </div>
        </div>

        <div className="recruiter-stat-card">
          <div className="recruiter-stat-icon">📅</div>
          <div>
            <span>Interviews</span>
            <h2>{interviewCount}</h2>
          </div>
        </div>

        <div className="recruiter-stat-card">
          <div className="recruiter-stat-icon">✓</div>
          <div>
            <span>Selected</span>
            <h2>{selectedCount}</h2>
          </div>
        </div>
      </div>

      <div className="applicant-section">
        <div className="applicant-section-header">
          <div>
            <h2>Candidate Applications</h2>
            <p>Review students who applied for your job openings.</p>
          </div>

          <div className="applicant-search">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search by candidate name, email or job..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="applicant-filters">
          {["All Applicants", "Shortlisted", "Interview", "Selected", "Rejected"].map((cat) => (
            <button
              key={cat}
              className={filter === cat ? "applicant-filter active" : "applicant-filter"}
              onClick={() => setFilter(cat)}
            >
              {cat}
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
            Loading candidates...
          </div>
        ) : filteredApplicants.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px 20px", color: "#6b7280" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>👥</div>
            <h3>No applicants found in this category</h3>
          </div>
        ) : (
          <div className="applicant-table-wrapper">
            <table className="applicant-table">
              <thead>
                <tr>
                  <th>CANDIDATE</th>
                  <th>APPLIED JOB</th>
                  <th>ACADEMIC INFO</th>
                  <th>SKILLS</th>
                  <th>CURRENT STATUS</th>
                  <th>UPDATE STAGE</th>
                </tr>
              </thead>

              <tbody>
                {filteredApplicants.map((applicant) => (
                  <tr key={applicant.id}>
                    <td>
                      <div className="applicant-info">
                        <div className="applicant-avatar">
                          {applicant.name ? applicant.name.charAt(0) : "S"}
                        </div>
                        <div>
                          <strong>{applicant.name}</strong>
                          <span>{applicant.email}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <strong className="applicant-job">{applicant.job || applicant.jobTitle}</strong>
                    </td>

                    <td>
                      <span style={{ fontSize: "13px", color: "#374151" }}>{applicant.course || "B.Tech"}</span>
                      <br />
                      <small style={{ color: "#6b7280" }}>CGPA: {applicant.cgpa || "N/A"}</small>
                    </td>

                    <td>
                      <div className="skill-tags">
                        {(Array.isArray(applicant.skills)
                          ? applicant.skills
                          : typeof applicant.skills === "string"
                          ? applicant.skills.split(",")
                          : []
                        ).slice(0, 3).map((skill, idx) => (
                          <span key={idx}>{skill.trim()}</span>
                        ))}
                      </div>
                    </td>

                    <td>
                      <span
                        className={
                          applicant.status === "Shortlisted"
                            ? "applicant-status shortlisted"
                            : applicant.status === "Interview"
                            ? "applicant-status interview"
                            : applicant.status === "Rejected"
                            ? "applicant-status rejected"
                            : applicant.status === "Accepted"
                            ? "applicant-status shortlisted"
                            : "applicant-status review"
                        }
                      >
                        {applicant.status}
                      </span>
                    </td>

                    <td>
                      <select
                        value={applicant.status}
                        onChange={(e) => handleStatusChange(applicant.id, e.target.value)}
                        style={{
                          padding: "6px 10px",
                          borderRadius: "8px",
                          border: "1px solid #d1d5db",
                          background: "#ffffff",
                          fontSize: "12px",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                      >
                        <option value="Under Review">Under Review</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interview">Interview</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
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

export default Applicants;
