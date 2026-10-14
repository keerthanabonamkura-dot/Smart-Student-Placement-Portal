import React, { useState, useEffect } from "react";
import { adminAPI } from "../services/api";

function ManageCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getCompanies();
      if (res.success) {
        setCompanies(res.companies || []);
      }
    } catch (err) {
      console.error("Fetch companies error:", err);
      setError("Failed to load companies list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter((c) => {
    return (
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase())
    );
  });

  const activeCompanies = companies.filter((c) => c.status === "Active").length;
  const totalJobs = companies.reduce((sum, c) => sum + (c.jobs || 0), 0);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="page-label">ADMINISTRATION</p>
          <h1>Manage Companies</h1>
          <p className="page-description">
            Review participating corporate employers, recruitment track records and active openings.
          </p>
        </div>
      </div>

      <div className="company-stat-grid">
        <div className="company-stat-card">
          <div className="stat-icon">🏢</div>
          <div>
            <span>Total Companies</span>
            <h2>{companies.length}</h2>
          </div>
        </div>

        <div className="company-stat-card">
          <div className="stat-icon">✓</div>
          <div>
            <span>Active Companies</span>
            <h2>{activeCompanies}</h2>
          </div>
        </div>

        <div className="company-stat-card">
          <div className="stat-icon">⏳</div>
          <div>
            <span>Inactive / Pending</span>
            <h2>{companies.length - activeCompanies}</h2>
          </div>
        </div>

        <div className="company-stat-card">
          <div className="stat-icon">💼</div>
          <div>
            <span>Job Opportunities</span>
            <h2>{totalJobs}</h2>
          </div>
        </div>
      </div>

      <div className="company-section">
        <div className="company-section-header">
          <div>
            <h2>Registered Companies</h2>
            <p>Companies currently registered on the placement portal.</p>
          </div>

          <div className="company-search">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search companies by name, sector or location..."
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
            Loading registered companies...
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
            No companies found matching your search.
          </div>
        ) : (
          <div className="company-table-wrapper">
            <table className="company-table">
              <thead>
                <tr>
                  <th>COMPANY</th>
                  <th>INDUSTRY</th>
                  <th>LOCATION</th>
                  <th>OPEN JOBS</th>
                  <th>STATUS</th>
                  <th>EMAIL CONTACT</th>
                </tr>
              </thead>

              <tbody>
                {filteredCompanies.map((company) => (
                  <tr key={company.id || company.name}>
                    <td>
                      <div className="company-info">
                        <div className="company-avatar">{company.shortName || "C"}</div>
                        <div>
                          <strong>{company.name}</strong>
                          <span>{company.shortName}</span>
                        </div>
                      </div>
                    </td>

                    <td>{company.industry}</td>

                    <td>📍 {company.location || "India"}</td>

                    <td>
                      <span className="job-count">{company.jobs}</span>
                    </td>

                    <td>
                      <span
                        className={
                          company.status === "Active"
                            ? "company-status active"
                            : "company-status pending"
                        }
                      >
                        {company.status}
                      </span>
                    </td>

                    <td>
                      <span style={{ fontSize: "13px", color: "#4f46e5" }}>{company.email}</span>
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

export default ManageCompanies;
