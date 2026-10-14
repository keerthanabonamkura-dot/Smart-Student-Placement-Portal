const jwt = require("jsonwebtoken");
const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const CompanyProfile = require("../models/CompanyProfile");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "smart_placement_secret_key_2026_super_secure",
    {
      expiresIn: process.env.JWT_EXPIRE || "30d",
    }
  );
};

// @desc    Register a new user (Student or Recruiter only)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role, companyName } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: name, email, and password",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Enforce security rule: Public registration cannot create Admin accounts
    const requestedRole = role || "Student";
    if (requestedRole.toLowerCase() === "admin") {
      return res.status(403).json({
        success: false,
        message: "Public registration as Admin is forbidden. Administrators must be provisioned securely.",
      });
    }

    // Validate role is either Student or Recruiter
    const validRoles = ["Student", "Recruiter"];
    const assignedRole = validRoles.find(
      (r) => r.toLowerCase() === requestedRole.toLowerCase()
    ) || "Student";

    // Check if user already exists
    const userExists = await User.findByEmail(normalizedEmail);
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "An account with this email address already exists",
      });
    }

    // Create user in MySQL
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: assignedRole,
      account_status: "active",
    });

    // Initialize corresponding profile
    if (assignedRole === "Student") {
      await StudentProfile.create({
        user: user.id,
        name: user.name,
        email: user.email,
        skills: ["Java", "React", "JavaScript", "SQL"],
        college: "University Student",
        degree: "B.Tech CSE",
        graduation: "2028",
        profileScore: 50,
      });
    } else if (assignedRole === "Recruiter") {
      await CompanyProfile.upsert(user.id, {
        companyName: companyName || `${user.name}'s Company`,
        email: user.email,
        industry: "Information Technology",
      });
    }

    const token = generateToken(user.id);

    return res.status(201).json({
      success: true,
      message: `${assignedRole} account created successfully!`,
      token,
      user: {
        id: user.id,
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        accountStatus: "active",
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error during user registration",
    });
  }
};

// @desc    Authenticate user & get JWT token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email and password",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findByEmail(normalizedEmail);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await User.matchPassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check account status
    if (user.account_status === "inactive") {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Please contact the portal administrator.",
      });
    }

    // Role check if explicitly specified by frontend login tab/radio
    if (role && user.role.toLowerCase() !== role.toLowerCase()) {
      return res.status(403).json({
        success: false,
        message: `Your account is registered as '${user.role}', but you selected '${role}'. Please select the '${user.role}' role option.`,
      });
    }

    const token = generateToken(user.id);

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        id: user.id,
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        accountStatus: user.account_status,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error during login",
    });
  }
};

// @desc    Logout user / clear session
// @route   POST /api/auth/logout
// @access  Public / Private
const logoutUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

// @desc    Get current logged in user details & profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found",
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
    console.error("GetMe Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching user details",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
};
