import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { adminAPI } from "../services/api";

function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalRecruiters: 0,
    totalCompanies: 0,
    activeJobs: 0,
    totalJobs: 0,
    totalApplications: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await adminAPI.getStats();
        if (res.success && res.stats) {
          setStats(res.stats);
        }
      } catch (err) {
        console.error("Admin stats error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              Admin <span style={styles.gradientText}>Dashboard</span>
            </h1>
            <p style={styles.subtitle}>
              Monitor, regulate and manage your Smart Student Placement Portal
            </p>
          </div>

          <div style={styles.adminBadge}>
            <div style={styles.avatar}>A</div>
            <div>
              <strong style={styles.adminName}>{user?.name || "Administrator"}</strong>
              <span style={styles.adminRole}>Master Admin Access</span>
            </div>
          </div>
        </div>

        <div style={styles.statsGrid}>
          <div style={{ ...styles.statCard, ...styles.blue }}>
            <div style={styles.icon}>👨‍🎓</div>
            <p style={styles.statLabel}>Total Students</p>
            <h2 style={styles.statNumber}>{stats.totalStudents}</h2>
            <span style={styles.statInfo}>Registered students</span>
          </div>

          <div style={{ ...styles.statCard, ...styles.purple }}>
            <div style={styles.icon}>🏢</div>
            <p style={styles.statLabel}>Recruiters & Companies</p>
            <h2 style={styles.statNumber}>{stats.totalRecruiters}</h2>
            <span style={styles.statInfo}>Active hiring partners</span>
          </div>

          <div style={{ ...styles.statCard, ...styles.green }}>
            <div style={styles.icon}>💼</div>
            <p style={styles.statLabel}>Active Jobs</p>
            <h2 style={styles.statNumber}>{stats.activeJobs}</h2>
            <span style={styles.statInfo}>Available opportunities</span>
          </div>

          <div style={{ ...styles.statCard, ...styles.orange }}>
            <div style={styles.icon}>📄</div>
            <p style={styles.statLabel}>Total Applications</p>
            <h2 style={styles.statNumber}>{stats.totalApplications}</h2>
            <span style={styles.statInfo}>Student submissions</span>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Portal Administration Modules</h2>
          <p style={styles.sectionText}>
            Direct access to manage students, recruiters, company verifications, job approvals and reports.
          </p>

          <div style={styles.managementGrid}>
            <Link to="/admin/students" style={styles.link}>
              <div style={{ ...styles.managementCard, borderTop: "5px solid #4f46e5" }}>
                <div style={{ ...styles.managementIcon, background: "#eef2ff" }}>👥</div>
                <h3 style={styles.cardTitle}>Manage Students</h3>
                <p style={styles.cardText}>
                  View, inspect and toggle active/inactive status of registered student accounts.
                </p>
                <span style={styles.cardLink}>Manage Students →</span>
              </div>
            </Link>

            <Link to="/admin/recruiters" style={styles.link}>
              <div style={{ ...styles.managementCard, borderTop: "5px solid #9333ea" }}>
                <div style={{ ...styles.managementIcon, background: "#f3e8ff" }}>🏢</div>
                <h3 style={styles.cardTitle}>Manage Recruiters</h3>
                <p style={styles.cardText}>
                  Review registered recruiter accounts, posted jobs and account approval status.
                </p>
                <span style={{ ...styles.cardLink, color: "#9333ea" }}>
                  Manage Recruiters →
                </span>
              </div>
            </Link>

            <Link to="/admin/jobs" style={styles.link}>
              <div style={{ ...styles.managementCard, borderTop: "5px solid #059669" }}>
                <div style={{ ...styles.managementIcon, background: "#d1fae5" }}>💼</div>
                <h3 style={styles.cardTitle}>Manage Jobs</h3>
                <p style={styles.cardText}>
                  Monitor, review and delete all job postings across the placement portal.
                </p>
                <span style={{ ...styles.cardLink, color: "#059669" }}>
                  Manage Jobs →
                </span>
              </div>
            </Link>

            <Link to="/admin/reports" style={styles.link}>
              <div style={{ ...styles.managementCard, borderTop: "5px solid #ea580c" }}>
                <div style={{ ...styles.managementIcon, background: "#ffedd5" }}>📊</div>
                <h3 style={styles.cardTitle}>Placement Reports</h3>
                <p style={styles.cardText}>
                  Detailed analytical breakdown of placements, companies and conversion rates.
                </p>
                <span style={{ ...styles.cardLink, color: "#ea580c" }}>
                  View Reports →
                </span>
              </div>
            </Link>
          </div>
        </div>

        <div style={styles.footerMessage}>
          <span>🚀</span>
          <strong>Smart Student Placement Portal</strong>
          <span>•</span>
          <span>Admin Control Center (MySQL Backend Integrated)</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 45%, #fdf2f8 100%)",
    padding: "40px 20px",
    fontFamily: "Arial, sans-serif",
  },
  container: {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "30px 35px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 15px 40px rgba(79, 70, 229, 0.10)",
    marginBottom: "30px",
  },
  title: {
    fontSize: "36px",
    margin: 0,
    color: "#172033",
    fontWeight: "800",
  },
  gradientText: {
    background: "linear-gradient(135deg, #4f46e5, #9333ea, #ec4899)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    marginTop: "8px",
    color: "#667085",
    fontSize: "15px",
  },
  adminBadge: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "#f8f9ff",
    padding: "10px 18px",
    borderRadius: "50px",
  },
  avatar: {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #4f46e5, #9333ea)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: "bold",
  },
  adminName: {
    display: "block",
    color: "#172033",
  },
  adminRole: {
    display: "block",
    color: "#667085",
    fontSize: "12px",
    marginTop: "3px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    marginBottom: "35px",
  },
  statCard: {
    borderRadius: "22px",
    padding: "25px",
    color: "white",
    minHeight: "165px",
    boxShadow: "0 15px 30px rgba(0,0,0,0.10)",
  },
  blue: {
    background: "linear-gradient(135deg, #2563eb, #4f46e5)",
  },
  purple: {
    background: "linear-gradient(135deg, #7c3aed, #a855f7)",
  },
  green: {
    background: "linear-gradient(135deg, #059669, #10b981)",
  },
  orange: {
    background: "linear-gradient(135deg, #ea580c, #f59e0b)",
  },
  icon: {
    fontSize: "28px",
    marginBottom: "8px",
  },
  statLabel: {
    margin: 0,
    opacity: 0.9,
    fontSize: "14px",
  },
  statNumber: {
    margin: "6px 0",
    fontSize: "32px",
  },
  statInfo: {
    fontSize: "12px",
    opacity: 0.8,
  },
  section: {
    textAlign: "center",
    marginBottom: "35px",
  },
  sectionTitle: {
    fontSize: "26px",
    color: "#172033",
    marginBottom: "8px",
  },
  sectionText: {
    color: "#667085",
    marginBottom: "25px",
  },
  managementGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    textAlign: "left",
  },
  link: {
    color: "inherit",
    textDecoration: "none",
  },
  managementCard: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "25px",
    minHeight: "235px",
    boxShadow: "0 10px 30px rgba(31, 41, 55, 0.08)",
  },
  managementIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    marginBottom: "16px",
  },
  cardTitle: {
    color: "#172033",
    marginBottom: "8px",
    fontSize: "18px",
  },
  cardText: {
    color: "#667085",
    fontSize: "13px",
    lineHeight: "1.6",
    minHeight: "60px",
  },
  cardLink: {
    color: "#4f46e5",
    fontWeight: "700",
    fontSize: "13px",
  },
  footerMessage: {
    background: "linear-gradient(135deg, #4f46e5, #9333ea)",
    color: "white",
    borderRadius: "18px",
    padding: "16px",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    alignItems: "center",
  },
};

export default AdminDashboard;
