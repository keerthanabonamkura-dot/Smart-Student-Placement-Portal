-- ==========================================================
-- SMART STUDENT PLACEMENT PORTAL - MYSQL DATABASE SCHEMA
-- Database Name: placement_portal
-- ==========================================================

-- 1. Create Database
CREATE DATABASE IF NOT EXISTS `placement_portal`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `placement_portal`;

-- Disable foreign key checks momentarily for clean reset/creation
SET FOREIGN_KEY_CHECKS = 0;

-- 2. Drop existing tables if re-importing
DROP TABLE IF EXISTS `applications`;
DROP TABLE IF EXISTS `student_profiles`;
DROP TABLE IF EXISTS `company_profiles`;
DROP TABLE IF EXISTS `jobs`;
DROP TABLE IF EXISTS `users`;

SET FOREIGN_KEY_CHECKS = 1;

-- ==========================================================
-- 3. Table: users
-- Roles: Admin, Student, Recruiter
-- Account Status: active, inactive
-- ==========================================================
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('Admin', 'Student', 'Recruiter') NOT NULL DEFAULT 'Student',
  `account_status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_role` (`role`),
  INDEX `idx_users_status` (`account_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- 4. Table: jobs
-- Posts by recruiters or admins
-- ==========================================================
CREATE TABLE `jobs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `recruiter_id` INT NULL,
  `title` VARCHAR(255) NOT NULL,
  `company` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `required_skills` JSON NOT NULL,
  `eligibility` VARCHAR(255) DEFAULT 'Fresher',
  `location` VARCHAR(255) NOT NULL,
  `job_status` ENUM('Active', 'Closed', 'Draft') NOT NULL DEFAULT 'Active',
  `application_deadline` VARCHAR(100) NOT NULL,
  `job_type` ENUM('Full Time', 'Part Time', 'Internship', 'Remote') NOT NULL DEFAULT 'Full Time',
  `salary` VARCHAR(255) NOT NULL DEFAULT 'Competitive',
  `experience` VARCHAR(100) DEFAULT 'Fresher',
  `category` VARCHAR(255) DEFAULT 'Software Development',
  `responsibilities` JSON NULL,
  `qualifications` JSON NULL,
  `logo` VARCHAR(50) DEFAULT 'SP',
  `color` VARCHAR(50) DEFAULT 'blue',
  `applicants_count` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_jobs_recruiter` (`recruiter_id`),
  INDEX `idx_jobs_status` (`job_status`),
  INDEX `idx_jobs_title` (`title`),
  INDEX `idx_jobs_company` (`company`),
  CONSTRAINT `fk_jobs_recruiter` FOREIGN KEY (`recruiter_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- 5. Table: applications
-- Links students with applied jobs
-- Enforces: unique application per student per job
-- ==========================================================
CREATE TABLE `applications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `job_id` INT NOT NULL,
  `status` ENUM('Under Review', 'Shortlisted', 'Interview', 'Rejected', 'Accepted') NOT NULL DEFAULT 'Under Review',
  `applied_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `resume` VARCHAR(255) DEFAULT '',
  `notes` TEXT NULL,
  UNIQUE KEY `unique_student_job` (`student_id`, `job_id`),
  INDEX `idx_applications_student` (`student_id`),
  INDEX `idx_applications_job` (`job_id`),
  INDEX `idx_applications_status` (`status`),
  CONSTRAINT `fk_applications_student` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_applications_job` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- 6. Table: student_profiles
-- Extended details for students
-- ==========================================================
CREATE TABLE `student_profiles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE,
  `name` VARCHAR(255) DEFAULT '',
  `email` VARCHAR(255) DEFAULT '',
  `phone` VARCHAR(50) DEFAULT '',
  `location` VARCHAR(255) DEFAULT '',
  `college` VARCHAR(255) DEFAULT '',
  `degree` VARCHAR(255) DEFAULT '',
  `graduation` VARCHAR(50) DEFAULT '2028',
  `cgpa` VARCHAR(20) DEFAULT '',
  `about` TEXT,
  `skills` JSON,
  `github` VARCHAR(255) DEFAULT '',
  `linkedin` VARCHAR(255) DEFAULT '',
  `certifications` JSON,
  `resume` VARCHAR(255) DEFAULT '',
  `resume_original_name` VARCHAR(255) DEFAULT '',
  `profile_score` INT DEFAULT 70,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_profile_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- 7. Table: company_profiles
-- Extended details for recruiters/companies
-- ==========================================================
CREATE TABLE `company_profiles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE,
  `company_name` VARCHAR(255) NOT NULL,
  `industry` VARCHAR(255) DEFAULT 'Information Technology',
  `location` VARCHAR(255) DEFAULT '',
  `website` VARCHAR(255) DEFAULT '',
  `email` VARCHAR(255) DEFAULT '',
  `phone` VARCHAR(50) DEFAULT '',
  `description` TEXT,
  `logo` VARCHAR(50) DEFAULT 'SP',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_company_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- 8. Seed Default System Users (Passwords are bcrypt hashed for 'password123')
-- Hash for 'password123': $2a$10$Qj2Zk6uL2f7JzDmg5r3.fe9JcM0bF7Z2m8XF0jJ9I8yW5fR3N7cCy
-- ==========================================================

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `account_status`) VALUES
(1, 'Placement Administrator', 'admin@smartplacement.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin', 'active'),
(2, 'TCS Campus Recruiter', 'recruiter@tcs.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Recruiter', 'active'),
(3, 'Aarav Kumar', 'aarav.kumar@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Student', 'active'),
(4, 'Infosys Recruiter', 'recruiter@infosys.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Recruiter', 'active'),
(5, 'Ananya Reddy', 'ananya.reddy@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Student', 'active');

-- Student Profile for Aarav Kumar
INSERT INTO `student_profiles` (`user_id`, `name`, `email`, `phone`, `location`, `college`, `degree`, `graduation`, `cgpa`, `about`, `skills`, `github`, `linkedin`, `certifications`, `resume`, `resume_original_name`, `profile_score`) VALUES
(3, 'Aarav Kumar', 'aarav.kumar@gmail.com', '+91 98765 43210', 'Hyderabad, Telangana', 'Anurag University', 'B.Tech - Computer Science Engineering', '2028', '8.2',
'Computer Science Engineering student passionate about software development, web technologies and building real-world applications.',
JSON_ARRAY('Java', 'React', 'JavaScript', 'Spring Boot', 'SQL', 'HTML', 'CSS', 'Git'),
'github.com/aaravkumar', 'linkedin.com/in/aaravkumar',
JSON_ARRAY(
  JSON_OBJECT('title', 'Python Essentials', 'provider', 'CISCO Networking Academy', 'year', '2026'),
  JSON_OBJECT('title', 'Data Structures', 'provider', 'Infosys Springboard', 'year', '2026')
),
'Aarav_Kumar_Resume.pdf', 'Aarav_Kumar_Resume.pdf', 85);

-- Company Profile for TCS Recruiter
INSERT INTO `company_profiles` (`user_id`, `company_name`, `industry`, `location`, `website`, `email`, `phone`, `description`, `logo`) VALUES
(2, 'Tata Consultancy Services', 'Information Technology', 'Hyderabad, Telangana', 'https://www.tcs.com', 'hr@tcs.com', '+91 98765 43210',
'Tata Consultancy Services is a leading global IT services and consulting company providing technology solutions and digital transformation services.', 'TCS');

-- Seed Sample Jobs
INSERT INTO `jobs` (`id`, `recruiter_id`, `title`, `company`, `description`, `required_skills`, `eligibility`, `location`, `job_status`, `application_deadline`, `job_type`, `salary`, `experience`, `category`, `responsibilities`, `qualifications`, `logo`, `color`, `applicants_count`) VALUES
(1, 2, 'Java Full Stack Developer', 'Tata Consultancy Services',
'Tata Consultancy Services is looking for talented and motivated students to join its development team. The selected candidates will work on real-world applications using modern technologies and collaborate with experienced developers.',
JSON_ARRAY('Java', 'Spring Boot', 'React', 'JavaScript', 'SQL', 'REST API', 'Git'),
'B.Tech / B.E in CSE or related stream', 'Hyderabad', 'Active', '2026-10-30', 'Full Time', '₹6 - ₹8 LPA', 'Fresher', 'Software Development',
JSON_ARRAY(
  'Develop and maintain web applications using Java and Spring Boot.',
  'Build responsive frontend interfaces using React.',
  'Work with REST APIs and databases.',
  'Write clean, reusable and maintainable code.',
  'Participate in testing, debugging and code reviews.'
),
JSON_ARRAY(
  'B.Tech / B.E in Computer Science or related field.',
  'Strong knowledge of Java programming.',
  'Basic knowledge of Spring Boot and REST APIs.',
  'Understanding of HTML, CSS and JavaScript.',
  'Knowledge of SQL and database concepts.'
),
'TCS', 'blue', 1),

(2, 4, 'React Developer', 'Infosys',
'Infosys is hiring enthusiastic React Developers to design and build state-of-the-art interactive frontends.',
JSON_ARRAY('React', 'JavaScript', 'CSS', 'HTML', 'Redux'),
'B.Tech / MCA in Computer Science / IT', 'Bangalore', 'Active', '2026-11-15', 'Full Time', '₹5 - ₹7 LPA', 'Fresher', 'Frontend Development',
JSON_ARRAY(
  'Develop modern UI components using React and JavaScript.',
  'Optimize web application performance for maximum speed.',
  'Collaborate with backend developers to integrate REST endpoints.'
),
JSON_ARRAY(
  'B.Tech / MCA in Computer Science / IT or related stream.',
  'Proficiency in React, HTML5, CSS3, and modern JavaScript.'
),
'I', 'purple', 1),

(3, 2, 'Software Engineer', 'Deloitte',
'Join Deloitte Consulting team to build scalable enterprise solutions and leverage innovative technologies.',
JSON_ARRAY('Java', 'SQL', 'Spring', 'Problem Solving'),
'B.Tech / M.Tech in CS/IT', 'Hyderabad', 'Active', '2026-11-20', 'Full Time', '₹7 - ₹10 LPA', 'Fresher', 'Software Development',
JSON_ARRAY(
  'Design, develop, and maintain backend enterprise services.',
  'Write effective unit and integration tests.'
),
JSON_ARRAY(
  'Strong computer science fundamentals and data structures.',
  'Knowledge of Java, Spring, and SQL relational databases.'
),
'D', 'orange', 1),

(4, 4, 'Software Development Engineer', 'Microsoft',
'Build resilient cloud infrastructure and developer platform tools at Microsoft.',
JSON_ARRAY('Java', 'DSA', 'Azure', 'C++'),
'B.Tech in CSE / ECE', 'Bangalore', 'Active', '2026-12-01', 'Full Time', '₹10 - ₹15 LPA', '0-1 Years', 'Cloud & Systems',
JSON_ARRAY(
  'Build scalable cloud services on Azure.',
  'Solve complex algorithmic problems with high availability.'
),
JSON_ARRAY(
  'Excellent algorithm design and analytical capabilities.',
  'Familiarity with Java, C++, or modern cloud architectures.'
),
'M', 'green', 1);

-- Seed Initial Applications for Aarav Kumar (User 3)
INSERT INTO `applications` (`id`, `student_id`, `job_id`, `status`, `applied_at`, `resume`, `notes`) VALUES
(1, 3, 1, 'Shortlisted', NOW(), 'Aarav_Kumar_Resume.pdf', 'Profile matches all required core skills.'),
(2, 3, 2, 'Interview', NOW(), 'Aarav_Kumar_Resume.pdf', 'Technical interview scheduled for 25th Oct.'),
(3, 3, 3, 'Under Review', NOW(), 'Aarav_Kumar_Resume.pdf', 'Application submitted and currently in initial screening.'),
(4, 3, 4, 'Rejected', NOW(), 'Aarav_Kumar_Resume.pdf', 'Did not meet minimum work experience requirement.');
