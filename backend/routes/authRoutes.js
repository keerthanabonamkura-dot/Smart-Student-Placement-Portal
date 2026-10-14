const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Rate limiter for login endpoint to prevent brute-force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 25, // limit each IP to 25 login requests per 15 minutes
  message: {
    success: false,
    message: "Too many login attempts from this IP, please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Authentication Routes
router.post("/register", registerUser);
router.post("/login", loginLimiter, loginUser);
router.post("/logout", logoutUser);
router.get("/me", protect, getMe);

module.exports = router;
