const express = require("express");
const router = express.Router();
const {
  applyForJob,
  getMyApplications,
  getApplicationStats,
  getRecruiterApplicants,
  updateApplicationStatus,
} = require("../controllers/applicationController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// Student application submission (supports POST /api/applications and POST /api/applications/apply/:jobId)
router.post("/", protect, authorize("Student"), applyForJob);
router.post("/apply/:jobId", protect, authorize("Student"), applyForJob);

// Student application history (supports GET /api/applications/my and GET /api/applications/my-applications)
router.get("/my", protect, authorize("Student"), getMyApplications);
router.get("/my-applications", protect, authorize("Student"), getMyApplications);

// Student stats
router.get("/stats", protect, authorize("Student"), getApplicationStats);

// Recruiter applications list
router.get("/recruiter", protect, authorize("Recruiter", "Admin"), getRecruiterApplicants);

// Application status updates (supports both PATCH and PUT /api/applications/:id/status)
router.patch("/:id/status", protect, authorize("Recruiter", "Admin"), updateApplicationStatus);
router.put("/:id/status", protect, authorize("Recruiter", "Admin"), updateApplicationStatus);

module.exports = router;
