import React, { useState, useEffect } from "react";
import { adminAPI } from "../services/api";

function Reports() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalRecruiters: 0,
    totalCompanies: 0,
    activeJobs: 0,
    totalJobs: 0,
    totalApplications: 0,
  });

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      try {
        const [statsRes, compRes] = await Promise.all([
          adminAPI.getStats(),
          adminAPI.getCompanies(),
        ]);

        if (statsRes.success) {
          setStats(statsRes.stats);
        }
        if (compRes.success) {
          setCompanies(compRes.companies || []);
        }
      } catch (err) {
        console.error("Report data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  const totalStudents = stats.totalStudents || 1;
  const activeJobs = stats.activeJobs || 0;
  const totalApplications = stats.totalApplications || 0;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="page-label">ADMINISTRATION</p>
          <h1>Placement Reports & Analytics</h1>
          <p className="page-description">
            Analyze campus placement performance, recruiter engagements and recruitment statistics.
          </p>
        </div>
      </div>

      <div className="company-stat-grid">
        <div className="company-stat-card">
          <div className="stat-icon">🎓</div>
          <div>
            <span>Total Students</span>
            <h2>{stats.totalStudents}</h2>
          </div>
        </div>

        <div className="company-stat-card">
          <div className="stat-icon">💼</div>
          <div>
            <span>Active Opportunities</span>
            <h2>{activeJobs}</h2>
          </div>
        </div>

        <div className="company-stat-card">
          <div className="stat-icon">📄</div>
          <div>
            <span>Total Applications</span>
            <h2>{totalApplications}</h2>
          </div>
        </div>

        <div className="company-stat-card">
          <div className="stat-icon">🏢</div>
          <div>
            <span>Recruiting Companies</span>
            <h2>{companies.length || stats.totalRecruiters}</h2>
          </div>
        </div>
      </div>

      <div className="report-grid">
        <div className="report-card">
          <div className="report-card-header">
            <div>
              <h2>Portal Engagement Overview</h2>
              <p>Key recruitment ratios and activity breakdown</p>
            </div>
          </div>

          <div className="placement-progress">
            <div className="progress-item">
              <div className="progress-info">
                <span>Active Opportunities vs Target</span>
                <strong>{activeJobs} Openings</strong>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${Math.min(100, Math.max(20, activeJobs * 15))}%` }}
                ></div>
              </div>
            </div>

            <div className="progress-item">
              <div className="progress-info">
                <span>Application Conversion Ratio</span>
                <strong>{totalStudents > 0 ? (totalApplications / totalStudents).toFixed(1) : 0} apps / student</strong>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill secondary"
                  style={{ width: "75%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="report-card">
          <div className="report-card-header">
            <div>
              <h2>Placement Summary Metrics</h2>
              <p>Aggregated operational indicators</p>
            </div>
          </div>

          <div className="summary-list">
            <div className="summary-item">
              <span>Verified Employers</span>
              <strong>{companies.length}</strong>
            </div>

            <div className="summary-item">
              <span>Total Applications Processed</span>
              <strong>{totalApplications}</strong>
            </div>

            <div className="summary-item">
              <span>Average Jobs per Company</span>
              <strong>{companies.length > 0 ? (stats.totalJobs / companies.length).toFixed(1) : 0}</strong>
            </div>

            <div className="summary-item">
              <span>Database Engine</span>
              <strong>MySQL (InnoDB)</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="company-section">
        <div className="company-section-header">
          <div>
            <h2>Company Placement Activity</h2>
            <p>Breakdown of opportunities by registered recruitment organizations.</p>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
            Loading report statistics...
          </div>
        ) : companies.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
            No company data recorded yet.
          </div>
        ) : (
          <div className="company-table-wrapper">
            <table className="company-table">
              <thead>
                <tr>
                  <th>COMPANY</th>
                  <th>INDUSTRY</th>
                  <th>LOCATION</th>
                  <th>OPPORTUNITIES POSTED</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>
                {companies.map((c) => (
                  <tr key={c.id || c.name}>
                    <td>
                      <div className="company-info">
                        <div className="company-avatar">{c.shortName || "C"}</div>
                        <div>
                          <strong>{c.name}</strong>
                          <span>Verified Partner</span>
                        </div>
                      </div>
                    </td>

                    <td>{c.industry}</td>
                    <td>📍 {c.location || "India"}</td>

                    <td>
                      <span className="job-count">{c.jobs} Jobs</span>
                    </td>

                    <td>
                      <span className={c.status === "Active" ? "company-status active" : "company-status pending"}>
                        {c.status}
                      </span>
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

export default Reports;
