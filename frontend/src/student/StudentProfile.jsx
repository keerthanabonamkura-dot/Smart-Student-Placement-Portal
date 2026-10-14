import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { studentAPI } from "../services/api";

function StudentProfile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    college: "",
    degree: "",
    graduation: "2028",
    cgpa: "",
    about: "",
    github: "",
    linkedin: "",
    resume: "",
    resumeOriginalName: "",
    profileScore: 75,
  });

  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await studentAPI.getProfile();
        if (res.success && res.profile) {
          setProfile({
            ...profile,
            ...res.profile,
          });
          setSkills(res.profile.skills || []);
        }
      } catch (err) {
        console.error("Fetch profile error:", err);
        setError("Could not load profile. Please refresh.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
    if (message) setMessage("");
    if (error) setError("");
  };

  const addSkill = () => {
    const skill = newSkill.trim();
    if (skill && !skills.includes(skill)) {
      const updated = [...skills, skill];
      setSkills(updated);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    const updated = skills.filter((s) => s !== skillToRemove);
    setSkills(updated);
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setMessage("");
    setError("");

    try {
      const res = await studentAPI.uploadResume(file);
      if (res.success) {
        setProfile((prev) => ({
          ...prev,
          resume: res.resume,
          resumeOriginalName: res.resumeOriginalName || file.name,
          profileScore: res.profileScore || prev.profileScore,
        }));
        setMessage("📄 Resume uploaded successfully!");
      }
    } catch (err) {
      console.error("Resume upload error:", err);
      setError("Failed to upload resume file.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const res = await studentAPI.updateProfile({
        ...profile,
        skills,
      });

      if (res.success) {
        setProfile((prev) => ({
          ...prev,
          ...res.profile,
        }));
        setMessage("🎉 Profile updated successfully!");
      }
    } catch (err) {
      console.error("Update profile error:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="student-page" style={{ textAlign: "center", padding: "80px 20px" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>⏳</div>
        <p style={{ color: "#6b7280" }}>Loading your student profile...</p>
      </div>
    );
  }

  return (
    <div className="student-page student-profile-page">
      <div className="student-page-header">
        <div>
          <p className="page-label">STUDENT PORTAL</p>
          <h1>My Profile</h1>
          <p className="page-description">
            Keep your profile updated to receive better job recommendations and attract recruiters.
          </p>
        </div>

        <Link to="/student/recommendations" className="student-primary-btn">
          View Recommendations →
        </Link>
      </div>

      {message && (
        <div
          style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            color: "#16a34a",
            padding: "15px 20px",
            borderRadius: "14px",
            marginBottom: "20px",
            fontWeight: "600",
          }}
        >
          {message}
        </div>
      )}

      {error && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#dc2626",
            padding: "15px 20px",
            borderRadius: "14px",
            marginBottom: "20px",
            fontWeight: "600",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      <div className="profile-top-card">
        <div className="profile-main-info">
          <div className="profile-large-avatar">
            {profile.name ? profile.name.charAt(0).toUpperCase() : "S"}
          </div>

          <div>
            <span className="profile-role-badge">🎓 STUDENT</span>
            <h2>{profile.name}</h2>
            <p>{profile.degree || "B.Tech CSE"}</p>
            <div className="profile-location">📍 {profile.location || "India"}</div>
          </div>
        </div>

        <div className="profile-completion-box">
          <div className="profile-completion-header">
            <span>Profile Completion</span>
            <strong>{profile.profileScore || 75}%</strong>
          </div>
          <div className="progress-bar" style={{ background: "#e5e7eb", borderRadius: "10px", height: "8px" }}>
            <div
              className="progress-fill"
              style={{
                width: `${profile.profileScore || 75}%`,
                background: "linear-gradient(135deg, #4f46e5, #9333ea)",
                height: "100%",
                borderRadius: "10px",
              }}
            ></div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: "30px" }}>
        <div className="profile-card" style={{ background: "white", padding: "30px", borderRadius: "20px", marginBottom: "25px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "20px", color: "#111827" }}>Personal & Contact Details</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div className="form-group">
              <label style={{ display: "block", fontWeight: "600", marginBottom: "6px" }}>Full Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid #d1d5db" }}
                required
              />
            </div>

            <div className="form-group">
              <label style={{ display: "block", fontWeight: "600", marginBottom: "6px" }}>Email Address</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                disabled
                style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid #d1d5db", background: "#f3f4f6" }}
              />
            </div>

            <div className="form-group">
              <label style={{ display: "block", fontWeight: "600", marginBottom: "6px" }}>Phone Number</label>
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid #d1d5db" }}
              />
            </div>

            <div className="form-group">
              <label style={{ display: "block", fontWeight: "600", marginBottom: "6px" }}>Location</label>
              <input
                type="text"
                name="location"
                value={profile.location}
                onChange={handleChange}
                placeholder="e.g. Hyderabad, Telangana"
                style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid #d1d5db" }}
              />
            </div>
          </div>
        </div>

        <div className="profile-card" style={{ background: "white", padding: "30px", borderRadius: "20px", marginBottom: "25px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "20px", color: "#111827" }}>Academic Background</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div className="form-group">
              <label style={{ display: "block", fontWeight: "600", marginBottom: "6px" }}>College / University</label>
              <input
                type="text"
                name="college"
                value={profile.college}
                onChange={handleChange}
                placeholder="e.g. Anurag University"
                style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid #d1d5db" }}
              />
            </div>

            <div className="form-group">
              <label style={{ display: "block", fontWeight: "600", marginBottom: "6px" }}>Degree & Specialization</label>
              <input
                type="text"
                name="degree"
                value={profile.degree}
                onChange={handleChange}
                placeholder="e.g. B.Tech - Computer Science Engineering"
                style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid #d1d5db" }}
              />
            </div>

            <div className="form-group">
              <label style={{ display: "block", fontWeight: "600", marginBottom: "6px" }}>Graduation Year</label>
              <input
                type="text"
                name="graduation"
                value={profile.graduation}
                onChange={handleChange}
                placeholder="2028"
                style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid #d1d5db" }}
              />
            </div>

            <div className="form-group">
              <label style={{ display: "block", fontWeight: "600", marginBottom: "6px" }}>CGPA / Percentage</label>
              <input
                type="text"
                name="cgpa"
                value={profile.cgpa}
                onChange={handleChange}
                placeholder="e.g. 8.5"
                style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid #d1d5db" }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: "15px" }}>
            <label style={{ display: "block", fontWeight: "600", marginBottom: "6px" }}>Professional Summary / About</label>
            <textarea
              name="about"
              value={profile.about}
              onChange={handleChange}
              rows="4"
              placeholder="Tell recruiters about yourself, interests, and career objectives..."
              style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid #d1d5db", fontFamily: "sans-serif" }}
            />
          </div>
        </div>

        <div className="profile-card" style={{ background: "white", padding: "30px", borderRadius: "20px", marginBottom: "25px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "20px", color: "#111827" }}>Skills & Expertise</h2>

          <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
            <input
              type="text"
              placeholder="Add a new skill (e.g. Docker, Python, AWS)..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
              style={{ flex: 1, padding: "12px 14px", borderRadius: "10px", border: "1px solid #d1d5db" }}
            />
            <button
              type="button"
              onClick={addSkill}
              style={{
                background: "#4f46e5",
                color: "white",
                padding: "12px 20px",
                borderRadius: "10px",
                border: "none",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              + Add Skill
            </button>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {skills.map((skill) => (
              <span
                key={skill}
                style={{
                  background: "#eef2ff",
                  color: "#4338ca",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#6b7280",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="profile-card" style={{ background: "white", padding: "30px", borderRadius: "20px", marginBottom: "25px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "20px", color: "#111827" }}>Resume & Documents</h2>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: "600", color: "#374151" }}>
                {profile.resumeOriginalName ? `Current Resume: ${profile.resumeOriginalName}` : "No resume uploaded yet"}
              </p>
              <small style={{ color: "#6b7280" }}>Supported formats: PDF, DOC, DOCX (Max 5MB)</small>
            </div>

            <label
              style={{
                background: "#eef2ff",
                color: "#4f46e5",
                padding: "10px 18px",
                borderRadius: "10px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              {uploading ? "Uploading..." : "Upload New Resume"}
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                style={{ display: "none" }}
              />
            </label>
          </div>
        </div>

        <div style={{ textAlign: "right", marginTop: "20px" }}>
          <button
            type="submit"
            className="student-primary-btn"
            disabled={saving}
            style={{
              padding: "14px 35px",
              fontSize: "15px",
              cursor: saving ? "wait" : "pointer",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? "Saving Changes..." : "Save Profile Changes →"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default StudentProfile;
