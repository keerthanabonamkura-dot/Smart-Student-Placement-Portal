const Job = require("../models/Job");
const Application = require("../models/Application");

// @desc    Get all active jobs (with search and filters)
// @route   GET /api/jobs
// @access  Public
const getAllJobs = async (req, res) => {
  try {
    const { keyword, location, jobType, status } = req.query;

    const jobs = await Job.findAll({
      keyword,
      location,
      jobType,
      status: status || "Active",
    });

    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Get All Jobs Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching jobs",
    });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job opportunity not found",
      });
    }

    const count = await Application.countByJob(job.id);
    job.applicants = count;
    job.applicantsCount = count;

    return res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.error("Get Job By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching job details",
    });
  }
};

// @desc    Post a new job
// @route   POST /api/jobs
// @access  Private (Recruiter, Admin)
const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      jobType,
      type,
      salary,
      experience,
      eligibility,
      skills,
      required_skills,
      description,
      deadline,
      application_deadline,
      responsibilities,
      qualifications,
      category,
      color,
    } = req.body;

    if (!title || !company || !location || !salary || !description) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: title, company, location, salary, and description",
      });
    }

    let parsedSkills = [];
    const rawSkills = skills || required_skills;
    if (Array.isArray(rawSkills)) {
      parsedSkills = rawSkills;
    } else if (typeof rawSkills === "string") {
      parsedSkills = rawSkills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    let parsedResp = [];
    if (Array.isArray(responsibilities)) {
      parsedResp = responsibilities;
    } else if (typeof responsibilities === "string") {
      parsedResp = responsibilities.split("\n").map((r) => r.trim()).filter(Boolean);
    }

    let parsedQual = [];
    if (Array.isArray(qualifications)) {
      parsedQual = qualifications;
    } else if (typeof qualifications === "string") {
      parsedQual = qualifications.split("\n").map((q) => q.trim()).filter(Boolean);
    }

    const logo = company ? company.substring(0, 3).toUpperCase() : "SP";

    const job = await Job.create({
      title: title.trim(),
      company: company.trim(),
      location: location.trim(),
      jobType: jobType || type || "Full Time",
      salary: salary.trim(),
      experience: experience || eligibility || "Fresher",
      eligibility: eligibility || experience || "Fresher",
      skills: parsedSkills.length > 0 ? parsedSkills : ["General"],
      description: description.trim(),
      responsibilities: parsedResp,
      qualifications: parsedQual,
      deadline: deadline || application_deadline || "2026-12-31",
      category: category || "Software Development",
      recruiterId: req.user.id,
      postedBy: req.user.id,
      logo,
      color: color || "blue",
      status: "Active",
    });

    return res.status(201).json({
      success: true,
      message: "Job opportunity posted successfully!",
      job,
    });
  } catch (error) {
    console.error("Create Job Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error creating job",
    });
  }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter, Admin)
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job opportunity not found",
      });
    }

    // Ownership verification: Recruiter can only edit their own jobs; Admin can edit any
    if (
      req.user.role !== "Admin" &&
      job.recruiterId &&
      Number(job.recruiterId) !== Number(req.user.id)
    ) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You are not authorized to edit job postings created by other recruiters",
      });
    }

    if (typeof req.body.skills === "string") {
      req.body.skills = req.body.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    const updatedJob = await Job.update(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.error("Update Job Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error updating job",
    });
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter, Admin)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job opportunity not found",
      });
    }

    // Ownership verification: Recruiter can only delete their own jobs; Admin can delete any
    if (
      req.user.role !== "Admin" &&
      job.recruiterId &&
      Number(job.recruiterId) !== Number(req.user.id)
    ) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You are not authorized to delete job postings created by other recruiters",
      });
    }

    await Job.delete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Delete Job Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error deleting job",
    });
  }
};

// @desc    Get jobs posted by current recruiter
// @route   GET /api/jobs/recruiter/my-jobs
// @access  Private (Recruiter, Admin)
const getRecruiterJobs = async (req, res) => {
  try {
    const jobs =
      req.user.role === "Admin"
        ? await Job.findAll({ status: null })
        : await Job.findByRecruiter(req.user.id);

    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const count = await Application.countByJob(job.id);
        return {
          ...job,
          applicants: count,
          applicantsCount: count,
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: jobsWithCounts.length,
      jobs: jobsWithCounts,
    });
  } catch (error) {
    console.error("Recruiter Jobs Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching recruiter jobs",
    });
  }
};

// @desc    Get applicants for a specific job (Recruiter ownership check)
// @route   GET /api/jobs/:id/applications
// @access  Private (Recruiter, Admin)
const getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job opportunity not found",
      });
    }

    // Ownership verification
    if (
      req.user.role !== "Admin" &&
      job.recruiterId &&
      Number(job.recruiterId) !== Number(req.user.id)
    ) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You can only view applicants for your own job postings",
      });
    }

    const applicants = await Application.findByJob(job.id);

    return res.status(200).json({
      success: true,
      count: applicants.length,
      applicants,
    });
  } catch (error) {
    console.error("Get Job Applications Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching applicants",
    });
  }
};

module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getRecruiterJobs,
  getJobApplications,
};
