const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized: No authentication token provided in Authorization header",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "smart_placement_secret_key_2026_super_secure"
    );

    const userRow = await User.findById(decoded.id);

    if (!userRow) {
      return res.status(401).json({
        success: false,
        message: "User associated with this token no longer exists",
      });
    }

    if (userRow.account_status === "inactive") {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Please contact the administrator.",
      });
    }

    req.user = User.formatUser(userRow);
    req.token = token;
    return next();
  } catch (error) {
    console.error("JWT Verification error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Not authorized: Invalid or expired authentication token",
    });
  }
};

module.exports = { protect };
