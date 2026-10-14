const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const StudentProfile = require("../models/StudentProfile");
const CompanyProfile = require("../models/CompanyProfile");

// @desc    Get portal overall statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getAdminStats = async (req, res) => {
  try {
    const totalStudents = await User.countByRole("Student");
    const totalRecruiters = await User.countByRole("Recruiter");
    const totalCompanies = await CompanyProfile.countTotal();
    const activeJobs = await Job.countActive();
    const totalJobs = await Job.countTotal();
    const totalApplications = await Application.countTotal();

    return res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalRecruiters,
        totalCompanies: totalCompanies || totalRecruiters,
        activeJobs,
        totalJobs,
        totalApplications,
      },
    });
  } catch (error) {
    console.error("Get Admin Stats Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching admin statistics",
    });
  }
};

// @desc    Get all users with optional filtering by role or status
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const { role, status } = req.query;

    const users = await User.findAll({ role, status });

    const enrichedUsers = await Promise.all(
      users.map(async (u) => {
        let profile = null;
        let jobCount = 0;
        let applicationCount = 0;

        if (u.role === "Student") {
          profile = await StudentProfile.findByUserId(u.id);
          const appStats = await Application.getStatsByStudent(u.id);
          applicationCount = appStats.total;
        } else if (u.role === "Recruiter") {
          profile = await CompanyProfile.findByUserId(u.id);
          const jobs = await Job.findByRecruiter(u.id);
          jobCount = jobs.length;
        }

        return {
          ...u,
          course: profile?.degree ? profile.degree.split(" - ")[1] || "CSE" : "CSE",
          year: profile?.graduation ? `${profile.graduation}` : "3rd Year",
          company: profile?.companyName || "Company",
          applications: applicationCount,
          jobs: jobCount,
          status: u.account_status === "active" ? "Active" : "Inactive",
          profile,
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: enrichedUsers.length,
      users: enrichedUsers,
    });
  } catch (error) {
    console.error("Get All Users Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching users",
    });
  }
};

// @desc    Update user account status (Activate / Deactivate)
// @route   PATCH /api/admin/users/:id/status
// @access  Private (Admin)
const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const userId = req.params.id;

    if (!status || !["active", "inactive"].includes(status.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'active' or 'inactive'",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent admin from deactivating self
    if (Number(userId) === Number(req.user.id) && status.toLowerCase() === "inactive") {
      return res.status(400).json({
        success: false,
        message: "You cannot deactivate your own administrator account",
      });
    }

    const updated = await User.updateStatus(userId, status);

    return res.status(200).json({
      success: true,
      message: `User account has been set to '${status}'`,
      user: User.formatUser(updated),
    });
  } catch (error) {
    console.error("Update User Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error updating user account status",
    });
  }
};

// @desc    Delete a user account
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (Number(userId) === Number(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own administrator account",
      });
    }

    const deleted = await User.delete(userId);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User account deleted successfully",
    });
  } catch (error) {
    console.error("Delete User Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error deleting user",
    });
  }
};

// @desc    Get all jobs for Admin management
// @route   GET /api/admin/jobs
// @access  Private (Admin)
const getAllJobsAdmin = async (req, res) => {
  try {
    const jobs = await Job.findAll({ status: null });

    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const count = await Application.countByJob(job.id);
        return {
          ...job,
          applicants: count,
          applicantsCount: count,
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: jobsWithCounts.length,
      jobs: jobsWithCounts,
    });
  } catch (error) {
    console.error("Admin Get Jobs Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching jobs",
    });
  }
};

// @desc    Get all applications across portal
// @route   GET /api/admin/applications
// @access  Private (Admin)
const getAllApplicationsAdmin = async (req, res) => {
  try {
    const applications = await Application.findAll();

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Admin Get Applications Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching applications",
    });
  }
};

// @desc    Get all registered companies
// @route   GET /api/admin/companies
// @access  Private (Admin)
const getAllCompanies = async (req, res) => {
  try {
    const recruiters = await User.findAllByRole("Recruiter");

    const companies = await Promise.all(
      recruiters.map(async (recruiter) => {
        const profile = await CompanyProfile.findByUserId(recruiter.id);
        const jobs = await Job.findByRecruiter(recruiter.id);

        const companyName = profile?.companyName || recruiter.name + "'s Company";
        const shortName = companyName
          .split(" ")
          .map((w) => w[0])
          .join("")
          .toUpperCase()
          .slice(0, 3) || "CMP";

        return {
          id: recruiter.id,
          name: companyName,
          shortName,
          industry: profile?.industry || "Information Technology",
          location: profile?.location || "India",
          jobs: jobs.length,
          status: recruiter.account_status === "active" ? "Active" : "Inactive",
          email: recruiter.email,
          phone: profile?.phone || "",
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: companies.length,
      companies,
    });
  } catch (error) {
    console.error("Admin Get Companies Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching companies",
    });
  }
};

// @desc    Secure Initial Admin Account Creation (Protected by ADMIN_SETUP_SECRET)
// @route   POST /api/admin/create-admin
// @access  Public with secret key
const createInitialAdmin = async (req, res) => {
  try {
    const { name, email, password, adminSecret } = req.body;

    const setupKey = process.env.ADMIN_SETUP_SECRET || "smart_placement_initial_admin_setup_2026";

    if (!adminSecret || adminSecret !== setupKey) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Invalid or missing administrator setup secret key",
      });
    }

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required to create administrator",
      });
    }

    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "An account with this email address already exists",
      });
    }

    const adminUser = await User.create({
      name,
      email,
      password,
      role: "Admin",
      account_status: "active",
    });

    return res.status(201).json({
      success: true,
      message: "Administrator account created successfully!",
      user: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
      },
    });
  } catch (error) {
    console.error("Create Admin Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error creating administrator",
    });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getAllJobsAdmin,
  getAllApplicationsAdmin,
  getAllCompanies,
  createInitialAdmin,
};
