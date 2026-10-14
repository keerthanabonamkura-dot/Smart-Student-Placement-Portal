const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  getUserById,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);
router.get("/:id", getUserById);

module.exports = router;
