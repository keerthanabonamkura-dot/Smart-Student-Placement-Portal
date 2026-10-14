const express = require("express");
const router = express.Router();
const {
  getAdminStats,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getAllJobsAdmin,
  getAllApplicationsAdmin,
  getAllCompanies,
  createInitialAdmin,
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// Secure initial admin creation endpoint (Public, guarded by secret key)
router.post("/create-admin", createInitialAdmin);

// Protected Admin routes (Requires Admin role)
router.use(protect, authorize("Admin"));

router.get("/stats", getAdminStats);
router.get("/users", getAllUsers);
router.patch("/users/:id/status", updateUserStatus);
router.delete("/users/:id", deleteUser);
router.get("/jobs", getAllJobsAdmin);
router.get("/applications", getAllApplicationsAdmin);
router.get("/companies", getAllCompanies);

module.exports = router;
