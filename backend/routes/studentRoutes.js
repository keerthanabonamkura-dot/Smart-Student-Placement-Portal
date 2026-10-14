const express = require("express");
const router = express.Router();
const {
  getMyProfile,
  updateMyProfile,
  uploadResume,
  getRecommendations,
  getStudentDashboard,
  getAllStudents,
} = require("../controllers/studentController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Student profile management
router.get("/profile", protect, authorize("Student"), getMyProfile);
router.put("/profile", protect, authorize("Student"), updateMyProfile);
router.post(
  "/resume",
  protect,
  authorize("Student"),
  upload.single("resume"),
  uploadResume
);

// AI Recommendations & Dashboard
router.get("/recommendations", protect, authorize("Student"), getRecommendations);
router.get("/dashboard", protect, authorize("Student"), getStudentDashboard);

// Admin & Recruiter routes
router.get("/", protect, authorize("Admin", "Recruiter"), getAllStudents);

module.exports = router;
