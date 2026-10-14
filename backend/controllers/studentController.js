const StudentProfile = require("../models/StudentProfile");
const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const { getPool } = require("../config/db");

// @desc    Get current student's profile
// @route   GET /api/students/profile
// @access  Private (Student)
const getMyProfile = async (req, res) => {
  try {
    let profile = await StudentProfile.findByUserId(req.user.id);

    if (!profile) {
      profile = await StudentProfile.create({
        user: req.user.id,
        name: req.user.name,
        email: req.user.email,
        skills: ["Java", "React", "JavaScript", "SQL"],
        college: "Anurag University",
        degree: "B.Tech - Computer Science Engineering",
        graduation: "2028",
        cgpa: "8.2",
        location: "Hyderabad, Telangana",
        phone: "+91 98765 43210",
        about:
          "Computer Science Engineering student passionate about software development, web technologies and building real-world applications.",
        github: "github.com/aaravkumar",
        linkedin: "linkedin.com/in/aaravkumar",
        certifications: [
          {
            title: "Python Essentials",
            provider: "CISCO Networking Academy",
            year: "2026",
          },
          {
            title: "Data Structures",
            provider: "Infosys Springboard",
            year: "2026",
          },
        ],
        profileScore: 85,
      });
    }

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching student profile",
    });
  }
};

// @desc    Update current student's profile
// @route   PUT /api/students/profile
// @access  Private (Student)
const updateMyProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      location,
      college,
      degree,
      graduation,
      cgpa,
      about,
      skills,
      github,
      linkedin,
      certifications,
    } = req.body;

    if (name) {
      const pool = getPool();
      await pool.query("UPDATE users SET name = ? WHERE id = ?", [
        name,
        req.user.id,
      ]);
    }

    const updatedProfile = await StudentProfile.updateByUserId(req.user.id, {
      name,
      phone,
      location,
      college,
      degree,
      graduation,
      cgpa,
      about,
      skills: Array.isArray(skills) ? skills : [],
      github,
      linkedin,
      certifications: Array.isArray(certifications) ? certifications : [],
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error updating profile",
    });
  }
};

// @desc    Upload student resume
// @route   POST /api/students/resume
// @access  Private (Student)
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a resume file to upload (PDF, DOC, DOCX)",
      });
    }

    const updatedProfile = await StudentProfile.updateByUserId(req.user.id, {
      resume: `/uploads/${req.file.filename}`,
      resumeOriginalName: req.file.originalname,
    });

    return res.status(200).json({
      success: true,
      message: "Resume uploaded successfully!",
      resume: updatedProfile.resume,
      resumeOriginalName: updatedProfile.resumeOriginalName,
      profileScore: updatedProfile.profileScore,
    });
  } catch (error) {
    console.error("Upload Resume Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error uploading resume",
    });
  }
};

// @desc    Get AI job recommendations based on student skills
// @route   GET /api/students/recommendations
// @access  Private (Student)
const getRecommendations = async (req, res) => {
  try {
    const profile = await StudentProfile.findByUserId(req.user.id);
    const studentSkills = (profile?.skills || []).map((s) => s.toLowerCase());

    const jobs = await Job.findAll({ status: "Active" });

    const recommendations = jobs.map((job) => {
      const jobSkills = (job.skills || []).map((s) => s.toLowerCase());

      let matchCount = 0;
      jobSkills.forEach((skill) => {
        if (studentSkills.includes(skill)) {
          matchCount++;
        }
      });

      let match = 50;
      if (jobSkills.length > 0) {
        match = Math.round((matchCount / jobSkills.length) * 100);
      }
      if (match < 40 && studentSkills.length > 0) match = 55;

      return {
        id: job.id,
        _id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.jobType || job.type,
        jobType: job.jobType || job.type,
        salary: job.salary,
        match: Math.min(99, Math.max(45, match)),
        skills: job.skills,
        logo: job.logo,
        color: job.color,
      };
    });

    recommendations.sort((a, b) => b.match - a.match);

    return res.status(200).json({
      success: true,
      count: recommendations.length,
      recommendations,
    });
  } catch (error) {
    console.error("Recommendations Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching recommendations",
    });
  }
};

// @desc    Get student dashboard stats & recent activities
// @route   GET /api/students/dashboard
// @access  Private (Student)
const getStudentDashboard = async (req, res) => {
  try {
    const profile = await StudentProfile.findByUserId(req.user.id);
    const stats = await Application.getStatsByStudent(req.user.id);
    const applications = await Application.findByStudent(req.user.id);
    const activeJobsCount = await Job.countActive();

    const recentApplications = applications.slice(0, 5).map((app) => ({
      id: app.id,
      company: app.company,
      job: app.job,
      date: new Date(app.appliedDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: app.status,
      logo: app.logo,
    }));

    return res.status(200).json({
      success: true,
      stats: {
        totalApplications: stats.total,
        shortlisted: stats.shortlisted,
        interviews: stats.interviews,
        underReview: stats.underReview,
        jobMatches: activeJobsCount,
      },
      profileScore: profile?.profileScore || 85,
      studentName: req.user.name,
      recentApplications,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching dashboard data",
    });
  }
};

// @desc    Get all students (for Admin / Recruiter)
// @route   GET /api/students
// @access  Private (Admin, Recruiter)
const getAllStudents = async (req, res) => {
  try {
    const students = await User.findAllByRole("Student");

    const studentList = await Promise.all(
      students.map(async (student) => {
        const profile = await StudentProfile.findByUserId(student.id);
        const stats = await Application.getStatsByStudent(student.id);

        return {
          id: student.id,
          name: student.name,
          email: student.email,
          course: profile?.degree ? profile.degree.split(" - ")[1] || "CSE" : "CSE",
          year: profile?.graduation ? `${profile.graduation}` : "3rd Year",
          applications: stats.total,
          status: "Active",
          profile,
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: studentList.length,
      students: studentList,
    });
  } catch (error) {
    console.error("Get All Students Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching students list",
    });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  uploadResume,
  getRecommendations,
  getStudentDashboard,
  getAllStudents,
};
