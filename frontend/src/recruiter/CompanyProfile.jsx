import React, { useState, useEffect } from "react";
import { userAPI } from "../services/api";

function CompanyProfile() {
  const [company, setCompany] = useState({
    companyName: "",
    industry: "Information Technology",
    location: "",
    website: "",
    email: "",
    phone: "",
    description: "",
    logo: "SP",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCompanyData = async () => {
      setLoading(true);
      try {
        const res = await userAPI.getProfile();
        if (res.success && res.profile) {
          setCompany({
            companyName: res.profile.companyName || res.user?.name || "Company",
            industry: res.profile.industry || "Information Technology",
            location: res.profile.location || "",
            website: res.profile.website || "",
            email: res.profile.email || res.user?.email || "",
            phone: res.profile.phone || "",
            description: res.profile.description || "",
            logo: res.profile.logo || "SP",
          });
        }
      } catch (err) {
        console.error("Fetch company profile error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  const handleChange = (e) => {
    setCompany({
      ...company,
      [e.target.name]: e.target.value,
    });
    if (message) setMessage("");
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const res = await userAPI.updateProfile(company);
      if (res.success) {
        setMessage("🎉 Company profile updated successfully!");
      }
    } catch (err) {
      console.error("Update company profile error:", err);
      setError("Failed to update company profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="recruiter-page" style={{ textAlign: "center", padding: "80px 20px" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>⏳</div>
        <p style={{ color: "#6b7280" }}>Loading company profile...</p>
      </div>
    );
  }

  return (
    <div className="recruiter-page">
      <div className="recruiter-page-header">
        <div>
          <p className="page-label">RECRUITER PORTAL</p>
          <h1>Company Profile</h1>
          <p className="page-description">
            Manage your organization details, branding and recruitment contacts.
          </p>
        </div>

        <button
          className="recruiter-primary-btn"
          onClick={handleSubmit}
          disabled={saving}
          style={{ opacity: saving ? 0.7 : 1, cursor: saving ? "wait" : "pointer" }}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {message && (
        <div
          style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            color: "#16a34a",
            padding: "16px 20px",
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
            padding: "16px 20px",
            borderRadius: "14px",
            marginBottom: "20px",
            fontWeight: "600",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      <div className="profile-card" style={{ background: "white", padding: "35px", borderRadius: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "30px", paddingBottom: "20px", borderBottom: "1px solid #f3f4f6" }}>
            <div
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #4f46e5, #9333ea)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "800",
                fontSize: "24px",
              }}
            >
              {company.companyName ? company.companyName.substring(0, 3).toUpperCase() : "SP"}
            </div>

            <div>
              <h2 style={{ margin: 0, fontSize: "22px", color: "#111827" }}>
                {company.companyName || "Organization Name"}
              </h2>
              <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "14px" }}>
                {company.industry} • Verified Recruiter
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div className="form-group">
              <label style={{ display: "block", fontWeight: "600", marginBottom: "6px" }}>Company / Organization Name *</label>
              <input
                type="text"
                name="companyName"
                value={company.companyName}
                onChange={handleChange}
                style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid #d1d5db" }}
                required
              />
            </div>

            <div className="form-group">
              <label style={{ display: "block", fontWeight: "600", marginBottom: "6px" }}>Industry Sector</label>
              <input
                type="text"
                name="industry"
                value={company.industry}
                onChange={handleChange}
                style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid #d1d5db" }}
              />
            </div>

            <div className="form-group">
              <label style={{ display: "block", fontWeight: "600", marginBottom: "6px" }}>Office Location / Headquarters</label>
              <input
                type="text"
                name="location"
                value={company.location}
                onChange={handleChange}
                placeholder="e.g. Hyderabad, Telangana"
                style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid #d1d5db" }}
              />
            </div>

            <div className="form-group">
              <label style={{ display: "block", fontWeight: "600", marginBottom: "6px" }}>Company Website</label>
              <input
                type="url"
                name="website"
                value={company.website}
                onChange={handleChange}
                placeholder="https://www.example.com"
                style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid #d1d5db" }}
              />
            </div>

            <div className="form-group">
              <label style={{ display: "block", fontWeight: "600", marginBottom: "6px" }}>HR / Recruitment Email</label>
              <input
                type="email"
                name="email"
                value={company.email}
                onChange={handleChange}
                style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid #d1d5db" }}
              />
            </div>

            <div className="form-group">
              <label style={{ display: "block", fontWeight: "600", marginBottom: "6px" }}>HR Contact Phone</label>
              <input
                type="text"
                name="phone"
                value={company.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid #d1d5db" }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: "15px" }}>
            <label style={{ display: "block", fontWeight: "600", marginBottom: "6px" }}>Company Overview & Culture</label>
            <textarea
              name="description"
              value={company.description}
              onChange={handleChange}
              rows="4"
              placeholder="Describe your company, work culture and opportunities for graduate students..."
              style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid #d1d5db", fontFamily: "inherit" }}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default CompanyProfile;
