import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const currentPath = location.pathname;

  const getRole = () => {
    if (user && user.role) return user.role;
    if (currentPath.startsWith("/admin")) return "Admin";
    if (currentPath.startsWith("/recruiter")) return "Recruiter";
    return "Student";
  };

  const role = getRole();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const studentMenu = [
    {
      name: "Dashboard",
      path: "/student/dashboard",
      icon: "▦",
    },
    {
      name: "My Profile",
      path: "/student/profile",
      icon: "👤",
    },
    {
      name: "Find Jobs",
      path: "/student/jobs",
      icon: "💼",
    },
    {
      name: "Applications",
      path: "/student/applications",
      icon: "📄",
    },
    {
      name: "AI Recommendations",
      path: "/student/recommendations",
      icon: "✨",
    },
    {
      name: "Skill Gap",
      path: "/student/skill-gap",
      icon: "📊",
    },
  ];

  const recruiterMenu = [
    {
      name: "Dashboard",
      path: "/recruiter/dashboard",
      icon: "▦",
    },
    {
      name: "Company Profile",
      path: "/recruiter/company-profile",
      icon: "🏢",
    },
    {
      name: "Post Job",
      path: "/recruiter/post-job",
      icon: "➕",
    },
    {
      name: "Manage Jobs",
      path: "/recruiter/manage-jobs",
      icon: "💼",
    },
    {
      name: "Applicants",
      path: "/recruiter/applicants",
      icon: "👥",
    },
  ];

  const adminMenu = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: "▦",
    },
    {
      name: "Manage Students",
      path: "/admin/students",
      icon: "🎓",
    },
    {
      name: "Manage Recruiters",
      path: "/admin/recruiters",
      icon: "👥",
    },
    {
      name: "Manage Companies",
      path: "/admin/companies",
      icon: "🏢",
    },
    {
      name: "Manage Jobs",
      path: "/admin/jobs",
      icon: "💼",
    },
    {
      name: "Reports",
      path: "/admin/reports",
      icon: "📊",
    },
  ];

  const menu =
    role === "Admin"
      ? adminMenu
      : role === "Recruiter"
      ? recruiterMenu
      : studentMenu;

  return (
    <aside className="main-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">SP</div>
        <div>
          <h2>Smart Placement</h2>
          <span>{user?.name ? `${user.name} (${role})` : `${role} Portal`}</span>
        </div>
      </div>

      <div className="sidebar-section-title">MAIN MENU</div>

      <nav className="sidebar-menu">
        {menu.map((item) => {
          const active = currentPath === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={active ? "sidebar-link active" : "sidebar-link"}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-text">{item.name}</span>
              {active && <span className="sidebar-active-dot">•</span>}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-help">
          <div className="help-icon">?</div>
          <div>
            <strong>Need Help?</strong>
            <span>placement@college.edu</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="sidebar-logout"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
            font: "inherit",
          }}
        >
          <span>🚪</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
