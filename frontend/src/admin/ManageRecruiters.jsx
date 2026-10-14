import React, { useState, useEffect } from "react";
import { adminAPI } from "../services/api";

function ManageRecruiters() {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const fetchRecruiters = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getUsers({ role: "Recruiter" });
      if (res.success) {
        setRecruiters(res.users || []);
      }
    } catch (err) {
      console.error("Fetch recruiters error:", err);
      setError("Failed to load recruiters list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const handleToggleStatus = async (recruiterId, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "inactive" : "active";
    try {
      const res = await adminAPI.updateUserStatus(recruiterId, newStatus);
      if (res.success) {
        setRecruiters((prev) =>
          prev.map((r) =>
            r.id === recruiterId ? { ...r, status: newStatus === "active" ? "Active" : "Inactive" } : r
          )
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update recruiter status.");
    }
  };

  const handleDeleteRecruiter = async (recruiterId, name) => {
    if (!window.confirm(`Are you sure you want to delete the recruiter account for "${name}"?`)) {
      return;
    }

    try {
      const res = await adminAPI.deleteUser(recruiterId);
      if (res.success) {
        setRecruiters(recruiters.filter((r) => r.id !== recruiterId));
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete recruiter account.");
    }
  };

  const filteredRecruiters = recruiters.filter((r) => {
    return (
      !search ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      (r.company || "").toLowerCase().includes(search.toLowerCase())
    );
  });

  const activeRecruiters = recruiters.filter((r) => r.status === "Active").length;
  const totalJobsPosted = recruiters.reduce((sum, r) => sum + (r.jobs || 0), 0);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="page-label">ADMINISTRATION</p>
          <h1>Manage Recruiters</h1>
          <p className="page-description">
            Oversee corporate recruiters, verify organizational credentials and control placement portal access.
          </p>
        </div>
      </div>

      <div className="company-stat-grid">
        <div className="company-stat-card">
          <div className="stat-icon">👥</div>
          <div>
            <span>Total Recruiters</span>
            <h2>{recruiters.length}</h2>
          </div>
        </div>

        <div className="company-stat-card">
          <div className="stat-icon">✓</div>
          <div>
            <span>Active Recruiters</span>
            <h2>{activeRecruiters}</h2>
          </div>
        </div>

        <div className="company-stat-card">
          <div className="stat-icon">⏳</div>
          <div>
            <span>Inactive Accounts</span>
            <h2>{recruiters.length - activeRecruiters}</h2>
          </div>
        </div>

        <div className="company-stat-card">
          <div className="stat-icon">💼</div>
          <div>
            <span>Jobs Posted</span>
            <h2>{totalJobsPosted}</h2>
          </div>
        </div>
      </div>

      <div className="company-section">
        <div className="company-section-header">
          <div>
            <h2>Registered Recruiters</h2>
            <p>View and manage all recruiter accounts verified on the portal.</p>
          </div>

          <div className="company-search">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search recruiters by name, company, email..."
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
            Loading registered recruiters...
          </div>
        ) : filteredRecruiters.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
            No recruiters found matching your search.
          </div>
        ) : (
          <div className="company-table-wrapper">
            <table className="company-table">
              <thead>
                <tr>
                  <th>RECRUITER</th>
                  <th>COMPANY / FIRM</th>
                  <th>EMAIL</th>
                  <th>JOBS POSTED</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {filteredRecruiters.map((recruiter) => (
                  <tr key={recruiter.id}>
                    <td>
                      <div className="company-info">
                        <div className="company-avatar">
                          {recruiter.name ? recruiter.name.charAt(0) : "R"}
                        </div>
                        <div>
                          <strong>{recruiter.name}</strong>
                          <span>Verified Recruiter</span>
                        </div>
                      </div>
                    </td>

                    <td>{recruiter.company || "Company"}</td>

                    <td>{recruiter.email}</td>

                    <td>
                      <span className="job-count">{recruiter.jobs || 0}</span>
                    </td>

                    <td>
                      <span
                        className={
                          recruiter.status === "Active"
                            ? "company-status active"
                            : "company-status pending"
                        }
                      >
                        {recruiter.status}
                      </span>
                    </td>

                    <td>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => handleToggleStatus(recruiter.id, recruiter.status)}
                          style={{
                            background: recruiter.status === "Active" ? "#fef3c7" : "#d1fae5",
                            color: recruiter.status === "Active" ? "#d97706" : "#059669",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "600",
                            fontSize: "12px",
                          }}
                        >
                          {recruiter.status === "Active" ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => handleDeleteRecruiter(recruiter.id, recruiter.name)}
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

export default ManageRecruiters;
