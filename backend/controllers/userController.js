const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const CompanyProfile = require("../models/CompanyProfile");

// @desc    Get user profile details
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let profile = null;
    if (user.role === "Student") {
      profile = await StudentProfile.findByUserId(user.id);
    } else if (user.role === "Recruiter") {
      profile = await CompanyProfile.findByUserId(user.id);
    }

    return res.status(200).json({
      success: true,
      user: User.formatUser(user),
      profile,
    });
  } catch (error) {
    console.error("Get User Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching user profile",
    });
  }
};

// @desc    Update basic user profile details
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const { name, email, companyName, industry, location, website, phone, description } = req.body;

    const updatedUser = await User.update(req.user.id, { name, email });

    let profile = null;
    if (req.user.role === "Student") {
      profile = await StudentProfile.findByUserId(req.user.id);
    } else if (req.user.role === "Recruiter") {
      profile = await CompanyProfile.upsert(req.user.id, {
        companyName: companyName || name,
        industry,
        location,
        website,
        email,
        phone,
        description,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      user: User.formatUser(updatedUser),
      profile,
    });
  } catch (error) {
    console.error("Update User Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error updating user profile",
    });
  }
};

// @desc    Get single user details by ID
// @route   GET /api/users/:id
// @access  Private (Self or Admin)
const getUserById = async (req, res) => {
  try {
    const targetId = Number(req.params.id);

    // Permission check: Self or Admin
    if (req.user.role !== "Admin" && Number(req.user.id) !== targetId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You are not authorized to view this user account",
      });
    }

    const user = await User.findById(targetId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let profile = null;
    if (user.role === "Student") {
      profile = await StudentProfile.findByUserId(user.id);
    } else if (user.role === "Recruiter") {
      profile = await CompanyProfile.findByUserId(user.id);
    }

    return res.status(200).json({
      success: true,
      user: User.formatUser(user),
      profile,
    });
  } catch (error) {
    console.error("Get User By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching user",
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserById,
};
