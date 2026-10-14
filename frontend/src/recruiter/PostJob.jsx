import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jobsAPI } from "../services/api";

function PostJob() {
  const navigate = useNavigate();

  const [job, setJob] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "Full Time",
    salary: "",
    experience: "Fresher",
    eligibility: "",
    skills: "",
    description: "",
    responsibilities: "",
    qualifications: "",
    deadline: "",
    category: "Software Development",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setJob({
      ...job,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await jobsAPI.create({
        ...job,
        skills: job.skills.split(",").map((s) => s.trim()).filter(Boolean),
        responsibilities: job.responsibilities.split("\n").map((r) => r.trim()).filter(Boolean),
        qualifications: job.qualifications.split("\n").map((q) => q.trim()).filter(Boolean),
      });

      if (res.success) {
        setSuccess("🎉 Job opportunity posted successfully!");
        setTimeout(() => {
          navigate("/recruiter/manage-jobs");
        }, 1200);
      }
    } catch (err) {
      console.error("Post job error:", err);
      setError(err.response?.data?.message || "Failed to post job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* HEADER */}
        <div style={styles.header}>
          <div style={styles.headerIcon}>💼</div>
          <h1 style={styles.title}>
            Post a <span style={styles.gradientText}>New Job</span>
          </h1>
          <p style={styles.subtitle}>
            Create a new job opportunity and connect with talented students
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#dc2626",
              padding: "16px",
              borderRadius: "15px",
              marginBottom: "20px",
              fontWeight: "600",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div
            style={{
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              color: "#16a34a",
              padding: "16px",
              borderRadius: "15px",
              marginBottom: "20px",
              fontWeight: "600",
            }}
          >
            {success}
          </div>
        )}

        {/* FORM CARD */}
        <div style={styles.card}>
          <form onSubmit={handleSubmit}>
            {/* JOB INFORMATION */}
            <div style={styles.sectionHeader}>
              <div style={styles.sectionIcon}>📋</div>
              <div>
                <h2 style={styles.sectionTitle}>Job Information</h2>
                <p style={styles.sectionText}>Enter the basic details of the job</p>
              </div>
            </div>

            <div style={styles.grid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Job Title *</label>
                <input
                  type="text"
                  name="title"
                  value={job.title}
                  onChange={handleChange}
                  placeholder="e.g. Software Developer"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Company Name *</label>
                <input
                  type="text"
                  name="company"
                  value={job.company}
                  onChange={handleChange}
                  placeholder="e.g. Tata Consultancy Services"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Location *</label>
                <input
                  type="text"
                  name="location"
                  value={job.location}
                  onChange={handleChange}
                  placeholder="e.g. Hyderabad / Remote"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Job Type</label>
                <select
                  name="jobType"
                  value={job.jobType}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option>Full Time</option>
                  <option>Part Time</option>
                  <option>Internship</option>
                  <option>Remote</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Salary / CTC *</label>
                <input
                  type="text"
                  name="salary"
                  value={job.salary}
                  onChange={handleChange}
                  placeholder="e.g. ₹6 - ₹8 LPA or ₹25,000/month"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Experience / Eligibility</label>
                <input
                  type="text"
                  name="experience"
                  value={job.experience}
                  onChange={handleChange}
                  placeholder="e.g. Fresher / 0-1 Years"
                  style={styles.input}
                />
              </div>
            </div>

            {/* SKILLS */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Required Skills (Comma separated) *</label>
              <input
                type="text"
                name="skills"
                value={job.skills}
                onChange={handleChange}
                placeholder="e.g. Java, React, SQL, Spring Boot"
                style={styles.input}
                required
              />
              <small style={styles.helpText}>Separate multiple skills using commas.</small>
            </div>

            {/* DESCRIPTION */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Job Description *</label>
              <textarea
                name="description"
                value={job.description}
                onChange={handleChange}
                placeholder="Describe the job role, opportunities and expectations..."
                style={styles.textarea}
                rows="5"
                required
              />
            </div>

            {/* RESPONSIBILITIES */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Key Responsibilities (One per line)</label>
              <textarea
                name="responsibilities"
                value={job.responsibilities}
                onChange={handleChange}
                placeholder="Develop web features using React\nBuild robust backend APIs"
                style={styles.textarea}
                rows="3"
              />
            </div>

            {/* QUALIFICATIONS */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Qualifications & Criteria (One per line)</label>
              <textarea
                name="qualifications"
                value={job.qualifications}
                onChange={handleChange}
                placeholder="B.Tech in CSE / IT or related stream\nMinimum 60% in graduation"
                style={styles.textarea}
                rows="3"
              />
            </div>

            {/* DEADLINE */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Application Deadline *</label>
              <input
                type="date"
                name="deadline"
                value={job.deadline}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            {/* BUTTONS */}
            <div style={styles.buttons}>
              <button
                type="button"
                onClick={() => navigate("/recruiter/manage-jobs")}
                style={styles.cancelButton}
              >
                ← Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                style={{ ...styles.submitButton, opacity: loading ? 0.7 : 1, cursor: loading ? "wait" : "pointer" }}
              >
                {loading ? "Publishing Job..." : "🚀 Publish Job"}
              </button>
            </div>
          </form>
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
    maxWidth: "900px",
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  headerIcon: {
    width: "60px",
    height: "60px",
    margin: "0 auto 12px",
    borderRadius: "18px",
    background: "linear-gradient(135deg, #4f46e5, #9333ea)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
  },
  title: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#172033",
    margin: 0,
  },
  gradientText: {
    background: "linear-gradient(135deg, #4f46e5, #9333ea, #ec4899)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    color: "#667085",
    fontSize: "15px",
    marginTop: "8px",
  },
  card: {
    background: "#ffffff",
    borderRadius: "22px",
    padding: "35px",
    boxShadow: "0 15px 40px rgba(31, 41, 55, 0.08)",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "24px",
    paddingBottom: "16px",
    borderBottom: "1px solid #edf0f7",
  },
  sectionIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "12px",
    background: "#eef2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },
  sectionTitle: {
    margin: 0,
    color: "#172033",
    fontSize: "20px",
  },
  sectionText: {
    margin: "3px 0 0",
    color: "#667085",
    fontSize: "13px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontWeight: "700",
    color: "#344054",
    marginBottom: "6px",
    fontSize: "13px",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #d9dce8",
    background: "#fafbff",
    outline: "none",
    fontSize: "14px",
    color: "#172033",
  },
  textarea: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #d9dce8",
    background: "#fafbff",
    outline: "none",
    fontSize: "14px",
    color: "#172033",
    fontFamily: "inherit",
  },
  helpText: {
    color: "#98a2b3",
    fontSize: "12px",
    display: "block",
    marginTop: "4px",
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "10px",
  },
  cancelButton: {
    padding: "12px 22px",
    borderRadius: "10px",
    background: "#f2f4f7",
    color: "#475467",
    fontWeight: "700",
    border: "none",
    cursor: "pointer",
  },
  submitButton: {
    padding: "12px 28px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #4f46e5, #9333ea)",
    color: "#ffffff",
    fontWeight: "700",
    border: "none",
    cursor: "pointer",
  },
};

export default PostJob;
