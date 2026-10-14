import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "Student",
  });

  const [error, setError] = useState("");
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
    setLoading(true);

    try {
      const data = await login(formData.email, formData.password, formData.role);

      if (data.success && data.user) {
        const userRole = data.user.role;
        if (userRole === "Admin") {
          navigate("/admin/dashboard");
        } else if (userRole === "Recruiter") {
          navigate("/recruiter/dashboard");
        } else {
          navigate("/student/dashboard");
        }
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Login failed. Please check your credentials and try again.";
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
            <span className="auth-badge">SMART CAREER PLATFORM</span>

            <h1>
              Welcome back.
              <br />
              Your <span>career</span>
              <br />
              awaits.
            </h1>

            <p>
              Access your placement dashboard, discover opportunities and
              take the next step toward your career goals.
            </p>

            <div className="auth-features">
              <div>
                <span>✓</span>
                <p>AI-powered job recommendations</p>
              </div>

              <div>
                <span>✓</span>
                <p>Smart skill gap analysis</p>
              </div>

              <div>
                <span>✓</span>
                <p>Easy application management</p>
              </div>
            </div>
          </div>

          <div className="auth-left-footer">
            © {new Date().getFullYear()} Smart Placement Portal
          </div>
        </div>

        <div className="auth-right">
          <div className="login-card">
            <div className="login-header">
              <div className="mobile-auth-logo">SP</div>
              <span>WELCOME BACK</span>
              <h2>Sign in to your account</h2>
              <p>Enter your details to continue to your dashboard.</p>
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

            <form onSubmit={handleSubmit}>
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
                <div className="form-label-row">
                  <label>Password</label>
                  <a href="#forgot">Forgot password?</a>
                </div>

                <div className="input-wrapper">
                  <span>🔒</span>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
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

                  <label
                    className={
                      formData.role === "Admin"
                        ? "role-option selected"
                        : "role-option"
                    }
                  >
                    <input
                      type="radio"
                      name="role"
                      value="Admin"
                      checked={formData.role === "Admin"}
                      onChange={handleChange}
                    />
                    <span className="role-icon">⚙</span>
                    <span>Admin</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="login-submit-btn"
                disabled={loading}
                style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "wait" : "pointer" }}
              >
                {loading ? "Signing In..." : "Sign In →"}
              </button>
            </form>

            <div className="login-divider">
              <span>OR</span>
            </div>

            <p className="register-text">
              Don't have an account?
              <Link to="/register"> Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
