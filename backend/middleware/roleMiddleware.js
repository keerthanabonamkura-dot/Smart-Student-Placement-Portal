const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated. Please log in first.",
      });
    }

    const normalizedAllowedRoles = roles.map((r) => r.toLowerCase());
    const userRole = (req.user.role || "").toLowerCase();

    if (!normalizedAllowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user.role}' is not authorized to access this resource`,
      });
    }

    next();
  };
};

module.exports = { authorize };
