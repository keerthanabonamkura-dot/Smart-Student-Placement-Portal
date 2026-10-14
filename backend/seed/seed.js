const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "../.env") });

const { initDatabase, getPool } = require("../config/db");
const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const CompanyProfile = require("../models/CompanyProfile");
const Job = require("../models/Job");
const Application = require("../models/Application");

const seedDatabase = async () => {
  try {
    console.log("Connecting to MySQL and ensuring database & tables exist...");
    await initDatabase();
    const pool = getPool();

    // Disable foreign key checks momentarily to clean tables cleanly
    await pool.query("SET FOREIGN_KEY_CHECKS = 0;");
    await pool.query("TRUNCATE TABLE applications;");
    await pool.query("TRUNCATE TABLE student_profiles;");
    await pool.query("TRUNCATE TABLE company_profiles;");
    await pool.query("TRUNCATE TABLE jobs;");
    await pool.query("TRUNCATE TABLE users;");
    await pool.query("SET FOREIGN_KEY_CHECKS = 1;");
    console.log("Cleared existing MySQL data.");

    // 1. Create Default Users (Admin, Recruiter, Student)
    const adminUser = await User.create({
      name: "Placement Administrator",
      email: "admin@smartplacement.com",
      password: "password123",
      role: "Admin",
      account_status: "active",
    });

    const recruiterUser = await User.create({
      name: "TCS Recruiter",
      email: "recruiter@tcs.com",
      password: "password123",
      role: "Recruiter",
      account_status: "active",
    });

    const recruiterUser2 = await User.create({
      name: "Infosys Recruiter",
      email: "recruiter@infosys.com",
      password: "password123",
      role: "Recruiter",
      account_status: "active",
    });

    const studentUser = await User.create({
      name: "Aarav Kumar",
      email: "aarav.kumar@gmail.com",
      password: "password123",
      role: "Student",
      account_status: "active",
    });

    const studentUser2 = await User.create({
      name: "Ananya Reddy",
      email: "ananya.reddy@gmail.com",
      password: "password123",
      role: "Student",
      account_status: "active",
    });

    console.log("Created users (Admin, Recruiters, Students).");

    // 2. Create Company Profiles
    await CompanyProfile.upsert(recruiterUser.id, {
      companyName: "Tata Consultancy Services",
      industry: "Information Technology",
      location: "Hyderabad, Telangana",
      website: "https://www.tcs.com",
      email: "recruiter@tcs.com",
      phone: "+91 98765 43210",
      description: "Tata Consultancy Services is a leading global IT services and consulting company providing technology solutions and digital transformation services.",
      logo: "TCS",
    });

    await CompanyProfile.upsert(recruiterUser2.id, {
      companyName: "Infosys",
      industry: "Information Technology",
      location: "Bangalore, Karnataka",
      website: "https://www.infosys.com",
      email: "recruiter@infosys.com",
      phone: "+91 98765 43211",
      description: "Infosys is a global leader in next-generation digital services and consulting.",
      logo: "I",
    });

    console.log("Created company profiles.");

    // 3. Create Student Profile for Aarav Kumar
    const studentProfile = await StudentProfile.create({
      user: studentUser.id,
      name: "Aarav Kumar",
      email: "aarav.kumar@gmail.com",
      phone: "+91 98765 43210",
      location: "Hyderabad, Telangana",
      college: "Anurag University",
      degree: "B.Tech - Computer Science Engineering",
      graduation: "2028",
      cgpa: "8.2",
      about:
        "Computer Science Engineering student passionate about software development, web technologies and building real-world applications.",
      skills: [
        "Java",
        "React",
        "JavaScript",
        "Spring Boot",
        "SQL",
        "HTML",
        "CSS",
        "Git",
      ],
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
      resume: "Aarav_Kumar_Resume.pdf",
      resumeOriginalName: "Aarav_Kumar_Resume.pdf",
      profileScore: 85,
    });

    await StudentProfile.create({
      user: studentUser2.id,
      name: "Ananya Reddy",
      email: "ananya.reddy@gmail.com",
      phone: "+91 98765 43212",
      location: "Bangalore, Karnataka",
      college: "Anurag University",
      degree: "B.Tech - Computer Science Engineering",
      graduation: "2028",
      cgpa: "8.9",
      about: "Frontend developer enthusiastic about React, UI/UX and web standards.",
      skills: ["React", "JavaScript", "HTML", "CSS", "TypeScript"],
      github: "github.com/ananyareddy",
      linkedin: "linkedin.com/in/ananyareddy",
      profileScore: 80,
    });

    console.log("Created student profiles.");

    // 4. Create Sample Jobs matching frontend
    const job1 = await Job.create({
      recruiterId: recruiterUser.id,
      title: "Java Full Stack Developer",
      company: "Tata Consultancy Services",
      location: "Hyderabad",
      jobType: "Full Time",
      experience: "Fresher",
      eligibility: "B.Tech / B.E in CSE or related stream",
      salary: "₹6 - ₹8 LPA",
      deadline: "2026-10-30",
      applicantsCount: 86,
      category: "Software Development",
      description:
        "Tata Consultancy Services is looking for talented and motivated students to join its development team. The selected candidates will work on real-world applications using modern technologies and collaborate with experienced developers.",
      responsibilities: [
        "Develop and maintain web applications using Java and Spring Boot.",
        "Build responsive frontend interfaces using React.",
        "Work with REST APIs and databases.",
        "Write clean, reusable and maintainable code.",
        "Participate in testing, debugging and code reviews.",
        "Collaborate with other developers and project teams.",
      ],
      qualifications: [
        "B.Tech / B.E in Computer Science or related field.",
        "Strong knowledge of Java programming.",
        "Basic knowledge of Spring Boot and REST APIs.",
        "Understanding of HTML, CSS and JavaScript.",
        "Knowledge of SQL and database concepts.",
        "Good communication and problem-solving skills.",
      ],
      skills: ["Java", "Spring Boot", "React", "JavaScript", "SQL", "REST API", "Git"],
      logo: "TCS",
      color: "blue",
      status: "Active",
    });

    const job2 = await Job.create({
      recruiterId: recruiterUser2.id,
      title: "React Developer",
      company: "Infosys",
      location: "Bangalore",
      jobType: "Full Time",
      experience: "Fresher",
      eligibility: "B.Tech / MCA in CS / IT",
      salary: "₹5 - ₹7 LPA",
      deadline: "2026-11-15",
      applicantsCount: 52,
      category: "Frontend Development",
      description:
        "Infosys is hiring enthusiastic React Developers to design and build state-of-the-art interactive frontends.",
      responsibilities: [
        "Develop modern UI components using React and JavaScript.",
        "Optimize web application performance for maximum speed.",
        "Collaborate with backend developers to integrate REST endpoints.",
      ],
      qualifications: [
        "B.Tech / MCA in Computer Science / IT or related stream.",
        "Proficiency in React, HTML5, CSS3, and modern JavaScript.",
      ],
      skills: ["React", "JavaScript", "CSS", "HTML", "Redux"],
      logo: "I",
      color: "purple",
      status: "Active",
    });

    const job3 = await Job.create({
      recruiterId: recruiterUser.id,
      title: "Software Engineer",
      company: "Deloitte",
      location: "Hyderabad",
      jobType: "Full Time",
      experience: "Fresher",
      eligibility: "B.Tech / M.Tech in CS/IT",
      salary: "₹7 - ₹10 LPA",
      deadline: "2026-11-20",
      applicantsCount: 64,
      category: "Software Development",
      description:
        "Join Deloitte Consulting team to build scalable enterprise solutions and leverage innovative technologies.",
      responsibilities: [
        "Design, develop, and maintain backend enterprise services.",
        "Write effective unit and integration tests.",
      ],
      qualifications: [
        "Strong computer science fundamentals and data structures.",
        "Knowledge of Java, Spring, and SQL relational databases.",
      ],
      skills: ["Java", "SQL", "Spring", "Problem Solving"],
      logo: "D",
      color: "orange",
      status: "Active",
    });

    const job4 = await Job.create({
      recruiterId: recruiterUser2.id,
      title: "Software Development Engineer",
      company: "Microsoft",
      location: "Bangalore",
      jobType: "Full Time",
      experience: "0-1 Years",
      eligibility: "B.Tech in CSE / ECE",
      salary: "₹10 - ₹15 LPA",
      deadline: "2026-12-01",
      applicantsCount: 110,
      category: "Cloud & Systems",
      description:
        "Build resilient cloud infrastructure and developer platform tools at Microsoft.",
      responsibilities: [
        "Build scalable cloud services on Azure.",
        "Solve complex algorithmic problems with high availability.",
      ],
      qualifications: [
        "Excellent algorithm design and analytical capabilities.",
        "Familiarity with Java, C++, or modern cloud architectures.",
      ],
      skills: ["Java", "DSA", "Azure", "C++"],
      logo: "M",
      color: "green",
      status: "Active",
    });

    const job5 = await Job.create({
      recruiterId: recruiterUser.id,
      title: "Data Analyst Intern",
      company: "TechNova Solutions",
      location: "Hyderabad",
      jobType: "Internship",
      experience: "Fresher",
      eligibility: "Any Engineering Degree with SQL/Python skills",
      salary: "₹25,000/month",
      deadline: "2026-11-25",
      applicantsCount: 38,
      category: "Data & Analytics",
      description:
        "Exciting internship opportunity for students passionate about data visualization and business analytics.",
      responsibilities: [
        "Extract and clean data sets using SQL and Python.",
        "Create insightful dashboards using PowerBI.",
      ],
      qualifications: [
        "Knowledge of SQL and basic Python for data analysis.",
      ],
      skills: ["Python", "SQL", "Excel", "PowerBI"],
      logo: "TN",
      color: "blue",
      status: "Active",
    });

    console.log("Created 5 sample jobs.");

    // 5. Create Initial Applications for Aarav Kumar
    await Application.create({
      jobId: job1.id,
      studentId: studentUser.id,
      status: "Shortlisted",
      resume: studentProfile.resume,
      notes: "Shortlisted for Round 1 technical interview.",
    });

    await Application.create({
      jobId: job2.id,
      studentId: studentUser.id,
      status: "Interview",
      resume: studentProfile.resume,
      notes: "Interview scheduled for 25th Oct at 10:00 AM.",
    });

    await Application.create({
      jobId: job3.id,
      studentId: studentUser.id,
      status: "Under Review",
      resume: studentProfile.resume,
      notes: "Application received and under review.",
    });

    await Application.create({
      jobId: job4.id,
      studentId: studentUser.id,
      status: "Rejected",
      resume: studentProfile.resume,
      notes: "Candidate profile does not match required Azure specialization.",
    });

    console.log("Created initial student applications.");

    console.log("\n==============================================");
    console.log(" MySQL Database 'placement_portal' seeded successfully!");
    console.log("==============================================");
    console.log("Test Login Credentials:");
    console.log("1. Student:   aarav.kumar@gmail.com    / password123");
    console.log("2. Recruiter: recruiter@tcs.com        / password123");
    console.log("3. Admin:     admin@smartplacement.com / password123");
    console.log("==============================================\n");

    process.exit(0);
  } catch (error) {
    console.error("MySQL Seeding Error:", error);
    process.exit(1);
  }
};

seedDatabase();
