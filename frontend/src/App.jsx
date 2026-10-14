import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";

import StudentDashboard from "./student/StudentDashboard";
import StudentProfile from "./student/StudentProfile";
import Jobs from "./student/Jobs";
import JobDetails from "./student/JobDetails";
import Applications from "./student/Applications";
import Recommendations from "./student/Recommendations";
import SkillGap from "./student/SkillGap";

import RecruiterDashboard from "./recruiter/RecruiterDashboard";
import CompanyProfile from "./recruiter/CompanyProfile";
import PostJob from "./recruiter/PostJob";
import RecruiterManageJobs from "./recruiter/ManageJobs";
import Applicants from "./recruiter/Applicants";

import AdminDashboard from "./admin/AdminDashboard";
import ManageStudents from "./admin/ManageStudents";
import ManageRecruiters from "./admin/ManageRecruiters";
import ManageCompanies from "./admin/ManageCompanies";
import AdminManageJobs from "./admin/ManageJobs";
import Reports from "./admin/Reports";

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

function PortalLayout({ children }) {
  return (
    <div className="portal-layout">
      <Sidebar />
      <main className="portal-content">{children}</main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* PUBLIC PAGES */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <Home />
              </PublicLayout>
            }
          />

          <Route
            path="/about"
            element={
              <PublicLayout>
                <About />
              </PublicLayout>
            }
          />

          <Route
            path="/contact"
            element={
              <PublicLayout>
                <Contact />
              </PublicLayout>
            }
          />

          <Route
            path="/login"
            element={
              <PublicLayout>
                <Login />
              </PublicLayout>
            }
          />

          <Route
            path="/register"
            element={
              <PublicLayout>
                <Register />
              </PublicLayout>
            }
          />

          {/* STUDENT PAGES (Protected: Student only) */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={["Student"]}>
                <PortalLayout>
                  <StudentDashboard />
                </PortalLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/profile"
            element={
              <ProtectedRoute allowedRoles={["Student"]}>
                <PortalLayout>
                  <StudentProfile />
                </PortalLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/jobs"
            element={
              <ProtectedRoute allowedRoles={["Student"]}>
                <PortalLayout>
                  <Jobs />
                </PortalLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/job/:id"
            element={
              <ProtectedRoute allowedRoles={["Student", "Recruiter", "Admin"]}>
                <PortalLayout>
                  <JobDetails />
                </PortalLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/applications"
            element={
              <ProtectedRoute allowedRoles={["Student"]}>
                <PortalLayout>
                  <Applications />
                </PortalLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/recommendations"
            element={
              <ProtectedRoute allowedRoles={["Student"]}>
                <PortalLayout>
                  <Recommendations />
                </PortalLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/skill-gap"
            element={
              <ProtectedRoute allowedRoles={["Student"]}>
                <PortalLayout>
                  <SkillGap />
                </PortalLayout>
              </ProtectedRoute>
            }
          />

          {/* RECRUITER PAGES (Protected: Recruiter & Admin) */}
          <Route
            path="/recruiter/dashboard"
            element={
              <ProtectedRoute allowedRoles={["Recruiter", "Admin"]}>
                <PortalLayout>
                  <RecruiterDashboard />
                </PortalLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/recruiter/company-profile"
            element={
              <ProtectedRoute allowedRoles={["Recruiter", "Admin"]}>
                <PortalLayout>
                  <CompanyProfile />
                </PortalLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/recruiter/post-job"
            element={
              <ProtectedRoute allowedRoles={["Recruiter", "Admin"]}>
                <PortalLayout>
                  <PostJob />
                </PortalLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/recruiter/manage-jobs"
            element={
              <ProtectedRoute allowedRoles={["Recruiter", "Admin"]}>
                <PortalLayout>
                  <RecruiterManageJobs />
                </PortalLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/recruiter/applicants"
            element={
              <ProtectedRoute allowedRoles={["Recruiter", "Admin"]}>
                <PortalLayout>
                  <Applicants />
                </PortalLayout>
              </ProtectedRoute>
            }
          />

          {/* ADMIN PAGES (Protected: Admin only) */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <PortalLayout>
                  <AdminDashboard />
                </PortalLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/students"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <PortalLayout>
                  <ManageStudents />
                </PortalLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/recruiters"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <PortalLayout>
                  <ManageRecruiters />
                </PortalLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/companies"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <PortalLayout>
                  <ManageCompanies />
                </PortalLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/jobs"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <PortalLayout>
                  <AdminManageJobs />
                </PortalLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <PortalLayout>
                  <Reports />
                </PortalLayout>
              </ProtectedRoute>
            }
          />

          {/* FALLBACK */}
          <Route
            path="*"
            element={
              <PublicLayout>
                <Home />
              </PublicLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
