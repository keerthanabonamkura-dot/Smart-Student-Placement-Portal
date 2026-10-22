const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const { initDatabase, getPool } = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Import route modules
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const studentRoutes = require("./routes/studentRoutes");

// Initialize express app
const app = express();

// Core Middleware
// Configure CORS to support Vercel frontend, local development, and credentials
const frontendUrl = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, "") : null;
const allowedOrigins = [
  frontendUrl,
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, health monitors)
      if (!origin) return callback(null, true);

      // Match exact frontend URL, Vercel preview domains, or localhost
      if (
        (frontendUrl && origin === frontendUrl) ||
        origin.endsWith(".vercel.app") ||
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }

      // Dynamic fallback: reflect requesting origin so custom subdomains work seamlessly
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files (e.g. resumes)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check & welcome route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Smart Student Placement Portal API is running with MySQL",
    version: "2.0.0",
    database: "MySQL (placement_portal)",
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      jobs: "/api/jobs",
      applications: "/api/applications",
      admin: "/api/admin",
      students: "/api/students",
    },
  });
});

app.get("/api/health", async (req, res) => {
  try {
    const pool = getPool();
    // Test live database connectivity with a lightweight ping
    await pool.query("SELECT 1 AS health");

    res.status(200).json({
      status: "healthy",
      database: "connected",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: "degraded",
      database: "disconnected",
      error: error.message,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  }
});

// Mount API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/students", studentRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start Server on PORT 5000 (default)
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Bind to PORT immediately to pass Render health checks and avoid port scan timeouts
  const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on http://localhost:${PORT}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`\n[PORT CONFLICT] Port ${PORT} is already in use by another program.`);
      console.error(`You can change PORT in backend/.env (e.g. 5001) and update frontend/src/services/api.js accordingly.\n`);
    } else {
      console.error("Server startup error:", err.message);
    }
  });

  try {
    await initDatabase();
  } catch (error) {
    console.error("Failed to initialize MySQL database on startup:", error.message);
    console.log("Server will keep running to allow health checks and automatic DB reconnects.");
  }
};

startServer();

module.exports = app;
