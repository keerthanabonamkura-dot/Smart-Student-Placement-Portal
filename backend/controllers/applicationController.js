const Application = require("../models/Application");
const Job = require("../models/Job");
const StudentProfile = require("../models/StudentProfile");

// @desc    Apply for a job (Student only)
// @route   POST /api/applications OR POST /api/applications/apply/:jobId
// @access  Private (Student)
const applyForJob = async (req, res) => {
  try {
    const jobId = req.params.jobId || req.body.jobId || req.body.job_id;
    const { notes } = req.body;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Please specify a valid jobId to apply for",
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job opportunity not found",
      });
    }

    if (job.status !== "Active" && job.jobStatus !== "Active") {
      return res.status(400).json({
        success: false,
        message: "This job posting is no longer active",
      });
    }

    // Duplicate check: Prevent duplicate applications at controller level
    const existing = await Application.findByStudentAndJob(req.user.id, jobId);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job position",
      });
    }

    const studentProfile = await StudentProfile.findByUserId(req.user.id);

    const application = await Application.create({
      jobId,
      studentId: req.user.id,
      resume: studentProfile?.resume || "",
      notes: notes || "",
      status: "Under Review",
    });

    // Increment applicants counter on the job
    await Job.incrementApplicants(jobId);

    return res.status(201).json({
      success: true,
      message: `Application submitted successfully for ${job.title}!`,
      application,
    });
  } catch (error) {
    console.error("Apply For Job Error:", error);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job position",
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message || "Server error submitting application",
    });
  }
};

// @desc    Get all applications for the logged-in student
// @route   GET /api/applications/my OR GET /api/applications/my-applications
// @access  Private (Student)
const getMyApplications = async (req, res) => {
  try {
    const { status } = req.query;

    const applications = await Application.findByStudent(req.user.id, status);

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("My Applications Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching applications",
    });
  }
};

// @desc    Get student application statistics
// @route   GET /api/applications/stats
// @access  Private (Student)
const getApplicationStats = async (req, res) => {
  try {
    const stats = await Application.getStatsByStudent(req.user.id);

    return res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Application Stats Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching application stats",
    });
  }
};

// @desc    Get applicants for all jobs of the logged-in recruiter
// @route   GET /api/applications/recruiter
// @access  Private (Recruiter, Admin)
const getRecruiterApplicants = async (req, res) => {
  try {
    let applicants = [];
    if (req.user.role === "Admin") {
      applicants = await Application.findByRecruiter(req.query.recruiterId || null);
      if (!req.query.recruiterId) {
        applicants = await Application.findAll();
      }
    } else {
      applicants = await Application.findByRecruiter(req.user.id);
    }

    return res.status(200).json({
      success: true,
      count: applicants.length,
      applicants,
    });
  } catch (error) {
    console.error("Recruiter Applicants Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching recruiter applicants",
    });
  }
};

// @desc    Update application status (Recruiter / Admin)
// @route   PATCH /api/applications/:id/status OR PUT /api/applications/:id/status
// @access  Private (Recruiter, Admin)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const validStatuses = [
      "Under Review",
      "Shortlisted",
      "Interview",
      "Rejected",
      "Accepted",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Ownership verification: If recruiter, verify they own the job posting
    if (req.user.role !== "Admin") {
      const job = await Job.findById(application.jobId);
      if (!job || Number(job.recruiterId) !== Number(req.user.id)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You are not authorized to update applications for jobs you did not post",
        });
      }
    }

    const updated = await Application.updateStatus(
      req.params.id,
      status,
      notes
    );

    return res.status(200).json({
      success: true,
      message: `Application status successfully updated to '${status}'`,
      application: updated,
    });
  } catch (error) {
    console.error("Update Status Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error updating application status",
    });
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getApplicationStats,
  getRecruiterApplicants,
  updateApplicationStatus,
};
