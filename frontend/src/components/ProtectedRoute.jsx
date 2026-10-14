import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRoles }) {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontFamily: "sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
          <p style={{ color: "#667085" }}>Loading portal...</p>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.map((r) => r.toLowerCase()).includes((user.role || "").toLowerCase())) {
    // Redirect to their respective authorized dashboard
    if (user.role === "Admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === "Recruiter") {
      return <Navigate to="/recruiter/dashboard" replace />;
    } else {
      return <Navigate to="/student/dashboard" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
