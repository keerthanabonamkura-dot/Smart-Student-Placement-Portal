import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Student",
    companyName: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please verify and try again.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role,
        companyName: formData.role === "Recruiter" ? formData.companyName : undefined,
      });

      if (res.success) {
        setSuccess("🎉 Account created successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Registration failed. Please check your information and try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <Link to="/" className="auth-brand">
            <div className="auth-logo">SP</div>
            <div>
              <strong>Smart</strong>
              <span>Placement</span>
            </div>
          </Link>

          <div className="auth-left-content">
            <span className="auth-badge">JOIN SMART PLACEMENT</span>

            <h1>
              Start your
              <br />
              <span>career journey</span>
              <br />
              today.
            </h1>

            <p>
              Create your account and connect with opportunities that match
              your skills, interests and career goals.
            </p>

            <div className="auth-features">
              <div>
                <span>✓</span>
                <p>Discover relevant job opportunities</p>
              </div>

              <div>
                <span>✓</span>
                <p>Get AI-powered career recommendations</p>
              </div>

              <div>
                <span>✓</span>
                <p>Track your placement journey</p>
              </div>
            </div>
          </div>

          <div className="auth-left-footer">
            © {new Date().getFullYear()} Smart Placement Portal
          </div>
        </div>

        <div className="auth-right">
          <div className="register-card">
            <div className="login-header">
              <div className="mobile-auth-logo">SP</div>
              <span>CREATE ACCOUNT</span>
              <h2>Join Smart Placement</h2>
              <p>Fill in your details to create your account.</p>
            </div>

            {error && (
              <div
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#dc2626",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  marginBottom: "18px",
                  fontSize: "14px",
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
                  padding: "12px 16px",
                  borderRadius: "10px",
                  marginBottom: "18px",
                  fontSize: "14px",
                }}
              >
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-wrapper">
                  <span>👤</span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <span>✉</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <span>🔒</span>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password (min 6 characters)"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <div className="input-wrapper">
                  <span>🔐</span>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Select Role</label>
                <div className="role-selection">
                  <label
                    className={
                      formData.role === "Student"
                        ? "role-option selected"
                        : "role-option"
                    }
                  >
                    <input
                      type="radio"
                      name="role"
                      value="Student"
                      checked={formData.role === "Student"}
                      onChange={handleChange}
                    />
                    <span className="role-icon">🎓</span>
                    <span>Student</span>
                  </label>

                  <label
                    className={
                      formData.role === "Recruiter"
                        ? "role-option selected"
                        : "role-option"
                    }
                  >
                    <input
                      type="radio"
                      name="role"
                      value="Recruiter"
                      checked={formData.role === "Recruiter"}
                      onChange={handleChange}
                    />
                    <span className="role-icon">🏢</span>
                    <span>Recruiter</span>
                  </label>
                </div>
                <small style={{ color: "#667085", fontSize: "12px", display: "block", marginTop: "6px" }}>
                  ℹ️ Admin accounts are created by system administration for security.
                </small>
              </div>

              {formData.role === "Recruiter" && (
                <div className="form-group">
                  <label>Company Name</label>
                  <div className="input-wrapper">
                    <span>🏢</span>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="e.g. Tata Consultancy Services"
                      required
                    />
                  </div>
                </div>
              )}

              <label className="terms-checkbox">
                <input type="checkbox" required />
                <span>
                  I agree to the
                  <a href="#terms"> Terms & Conditions</a> and
                  <a href="#privacy"> Privacy Policy</a>.
                </span>
              </label>

              <button
                type="submit"
                className="login-submit-btn"
                disabled={loading}
                style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "wait" : "pointer" }}
              >
                {loading ? "Creating Account..." : "Create Account →"}
              </button>
            </form>

            <div className="login-divider">
              <span>OR</span>
            </div>

            <p className="register-text">
              Already have an account?
              <Link to="/login"> Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
