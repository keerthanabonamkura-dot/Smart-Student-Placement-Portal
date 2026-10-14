// Centralized Error Handling Middleware

const notFound = (req, res, next) => {
  const error = new Error(`Resource not found at ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Internal Server Error";

  // Handle MySQL duplicate entry error code ER_DUP_ENTRY (1062)
  if (err.code === "ER_DUP_ENTRY") {
    statusCode = 400;
    if (message.includes("unique_student_job")) {
      message = "You have already applied for this job position.";
    } else if (message.includes("users.email") || message.includes("email")) {
      message = "An account with this email address already exists.";
    } else {
      message = "Duplicate entry error. This resource already exists.";
    }
  }

  // Handle MySQL foreign key errors
  if (err.code === "ER_NO_REFERENCED_ROW_2") {
    statusCode = 404;
    message = "Referenced parent record does not exist.";
  }

  // Handle JSON Web Token errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid authentication token";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Authentication token expired";
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = {
  notFound,
  errorHandler,
};
