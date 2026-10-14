const express = require("express");
const router = express.Router();
const {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getRecruiterJobs,
  getJobApplications,
} = require("../controllers/jobController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// Public job browsing
router.get("/", getAllJobs);

// Recruiter specific jobs
router.get("/recruiter/my-jobs", protect, authorize("Recruiter", "Admin"), getRecruiterJobs);

// Job details
router.get("/:id", getJobById);

// Job applicants (matching Section 6: GET /api/jobs/:id/applications)
router.get("/:id/applications", protect, authorize("Recruiter", "Admin"), getJobApplications);

// Job CRUD operations (Recruiter & Admin)
router.post("/", protect, authorize("Recruiter", "Admin"), createJob);
router.put("/:id", protect, authorize("Recruiter", "Admin"), updateJob);
router.delete("/:id", protect, authorize("Recruiter", "Admin"), deleteJob);

module.exports = router;
