import React, { useState, useEffect } from "react";
import { adminAPI } from "../services/api";

function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getUsers({ role: "Student" });
      if (res.success) {
        setStudents(res.users || []);
      }
    } catch (err) {
      console.error("Fetch students error:", err);
      setError("Failed to load students list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleToggleStatus = async (studentId, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "inactive" : "active";
    try {
      const res = await adminAPI.updateUserStatus(studentId, newStatus);
      if (res.success) {
        setStudents((prev) =>
          prev.map((s) =>
            s.id === studentId ? { ...s, status: newStatus === "active" ? "Active" : "Inactive" } : s
          )
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status.");
    }
  };

  const handleDeleteStudent = async (studentId, name) => {
    if (!window.confirm(`Are you sure you want to delete the student account for "${name}"?`)) {
      return;
    }

    try {
      const res = await adminAPI.deleteUser(studentId);
      if (res.success) {
        setStudents(students.filter((s) => s.id !== studentId));
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete student account.");
    }
  };

  const filteredStudents = students.filter((s) => {
    return (
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.course || "").toLowerCase().includes(search.toLowerCase())
    );
  });

  const activeStudents = students.filter((s) => s.status === "Active").length;
  const totalApps = students.reduce((acc, s) => acc + (s.applications || 0), 0);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="page-label">ADMINISTRATION</p>
          <h1>Manage Students</h1>
          <p className="page-description">
            Oversee registered students, verify profile records, monitor applications and control account access.
          </p>
        </div>
      </div>

      <div className="company-stat-grid">
        <div className="company-stat-card">
          <div className="stat-icon">🎓</div>
          <div>
            <span>Total Students</span>
            <h2>{students.length}</h2>
          </div>
        </div>

        <div className="company-stat-card">
          <div className="stat-icon">✓</div>
          <div>
            <span>Active Students</span>
            <h2>{activeStudents}</h2>
          </div>
        </div>

        <div className="company-stat-card">
          <div className="stat-icon">⏳</div>
          <div>
            <span>Inactive Students</span>
            <h2>{students.length - activeStudents}</h2>
          </div>
        </div>

        <div className="company-stat-card">
          <div className="stat-icon">📄</div>
          <div>
            <span>Total Applications</span>
            <h2>{totalApps}</h2>
          </div>
        </div>
      </div>

      <div className="company-section">
        <div className="company-section-header">
          <div>
            <h2>Registered Students</h2>
            <p>View and manage students currently enrolled in the placement portal.</p>
          </div>

          <div className="company-search">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search students by name, email, course..."
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
            Loading registered students...
          </div>
        ) : filteredStudents.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
            No students found matching your criteria.
          </div>
        ) : (
          <div className="company-table-wrapper">
            <table className="company-table">
              <thead>
                <tr>
                  <th>STUDENT</th>
                  <th>COURSE / DEGREE</th>
                  <th>GRADUATION</th>
                  <th>APPLICATIONS</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <div className="company-info">
                        <div className="company-avatar">
                          {student.name ? student.name.charAt(0) : "S"}
                        </div>
                        <div>
                          <strong>{student.name}</strong>
                          <span>{student.email}</span>
                        </div>
                      </div>
                    </td>

                    <td>{student.course || "B.Tech CSE"}</td>

                    <td>{student.year || student.graduation || "2028"}</td>

                    <td>
                      <span className="job-count">{student.applications || 0}</span>
                    </td>

                    <td>
                      <span
                        className={
                          student.status === "Active"
                            ? "company-status active"
                            : "company-status pending"
                        }
                      >
                        {student.status}
                      </span>
                    </td>

                    <td>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => handleToggleStatus(student.id, student.status)}
                          style={{
                            background: student.status === "Active" ? "#fef3c7" : "#d1fae5",
                            color: student.status === "Active" ? "#d97706" : "#059669",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "600",
                            fontSize: "12px",
                          }}
                        >
                          {student.status === "Active" ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(student.id, student.name)}
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

export default ManageStudents;
