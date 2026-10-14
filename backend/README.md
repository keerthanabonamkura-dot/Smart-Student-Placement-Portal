# Smart Student Placement Portal - Backend (MySQL & Node.js / Express)

RESTful backend for the Smart Student Placement Portal, powered by **Node.js**, **Express**, and **MySQL (mysql2)**.

---

## 📁 Project Architecture

```text
backend/
├── config/
│   └── db.js                 # MySQL connection pool & automatic table creation
├── controllers/
│   ├── authController.js     # User registration, login & JWT auth
│   ├── studentController.js  # Profile, skills, resume upload & AI matching
│   ├── jobController.js      # Job listings, filters, posting & recruiter views
│   └── applicationController.js # Job applications, status tracking & recruiter lists
├── middleware/
│   ├── authMiddleware.js     # JWT token verification
│   ├── roleMiddleware.js     # Role verification (Student, Recruiter, Admin)
│   └── uploadMiddleware.js   # Multer resume file uploads
├── models/
│   ├── User.js               # User auth model (bcrypt password hashing)
│   ├── StudentProfile.js      # Student profile & completion score model
│   ├── Job.js                # Job postings model
│   └── Application.js        # Job application tracking model
├── routes/
│   ├── authRoutes.js         # /api/auth routes
│   ├── studentRoutes.js      # /api/students routes
│   ├── jobRoutes.js          # /api/jobs routes
│   └── applicationRoutes.js  # /api/applications routes
├── seed/
│   └── seed.js               # MySQL initial data seeder
├── uploads/                  # Storage directory for uploaded resumes
├── .env                      # Database credentials and port
├── .env.example              # Environment variables template
├── package.json              # Backend dependencies & npm scripts
└── server.js                 # Express server on port 5000
```

---

## 🗄️ MySQL Database Schema

The database `smart_placement_portal` contains the following relational tables:

1. **`users`**:
   - `id` (INT, Primary Key, Auto Increment)
   - `name` (VARCHAR)
   - `email` (VARCHAR, Unique)
   - `password` (VARCHAR, Hashed with bcrypt)
   - `role` (ENUM: 'Student', 'Recruiter', 'Admin')
   - `created_at`, `updated_at`

2. **`student_profiles`**:
   - `id` (INT, Primary Key, Auto Increment)
   - `user_id` (INT, Foreign Key -> `users.id`, Unique, Cascade on delete)
   - `name`, `email`, `phone`, `location`, `college`, `degree`, `graduation`, `cgpa`, `about`
   - `skills` (JSON array)
   - `github`, `linkedin`
   - `certifications` (JSON array of objects)
   - `resume`, `resume_original_name`, `profile_score`
   - `created_at`, `updated_at`

3. **`jobs`**:
   - `id` (INT, Primary Key, Auto Increment)
   - `title`, `company`, `location`
   - `job_type` (ENUM: 'Full Time', 'Part Time', 'Internship', 'Remote')
   - `salary`, `experience`, `category`, `description`, `deadline`
   - `skills` (JSON array)
   - `responsibilities` (JSON array)
   - `qualifications` (JSON array)
   - `posted_by` (INT, Foreign Key -> `users.id`)
   - `status` (ENUM: 'Active', 'Closed', 'Draft')
   - `logo`, `color`, `applicants_count`
   - `created_at`, `updated_at`

4. **`applications`**:
   - `id` (INT, Primary Key, Auto Increment)
   - `job_id` (INT, Foreign Key -> `jobs.id`, Cascade on delete)
   - `student_id` (INT, Foreign Key -> `users.id`, Cascade on delete)
   - `status` (ENUM: 'Under Review', 'Shortlisted', 'Interview', 'Rejected', 'Accepted')
   - `applied_date`, `resume`, `notes`
   - Unique key on `(job_id, student_id)` to prevent duplicate applications
   - `created_at`, `updated_at`

---

## ⚙️ Environment Configuration (`.env`)

```env
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=smart_placement_portal
JWT_SECRET=smart_placement_secret_key_2026_super_secure
JWT_EXPIRE=30d
NODE_ENV=development
```

---

## 🚀 Step-by-Step Setup Guide

### Step 1: Open Terminal in the Backend Folder
```powershell
cd c:\Users\keert\Desktop\Smart-Student-Placement-Portal\backend
```

### Step 2: Install Node.js Dependencies
```powershell
npm install
```

### Step 3: Populate Initial Mock Data (Seed)
Run the seed script to automatically create sample users, job opportunities, and applications:
```powershell
npm run seed
```

**Pre-seeded Demo Accounts:**
- **Student:** `aarav.kumar@gmail.com` / `password123`
- **Recruiter:** `recruiter@tcs.com` / `password123`
- **Admin:** `admin@smartplacement.com` / `password123`

### Step 4: Start the Backend Server
```powershell
npm run dev
```
*(or `npm start`)*

The server starts on:
`http://localhost:5000`

---

## 📡 API Endpoints

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` - Create account (Student, Recruiter, Admin)
- `POST /api/auth/login` - Log in and obtain JWT Bearer token
- `GET /api/auth/me` - Get current authenticated user profile

### 🎓 Student Profile (`/api/students`)
- `GET /api/students/profile` - Get logged-in student's profile & skills
- `PUT /api/students/profile` - Update academic & personal details
- `POST /api/students/resume` - Upload student resume (PDF/DOC/DOCX)
- `GET /api/students/recommendations` - AI job matching score based on skills
- `GET /api/students/dashboard` - Student dashboard stats and metrics
- `GET /api/students` - List all students (Admin / Recruiter)

### 💼 Jobs (`/api/jobs`)
- `GET /api/jobs` - Browse active jobs (search & filters)
- `GET /api/jobs/:id` - Job details view
- `POST /api/jobs` - Post a job (Recruiter / Admin)
- `PUT /api/jobs/:id` - Update job (Recruiter / Admin)
- `DELETE /api/jobs/:id` - Remove job (Recruiter / Admin)
- `GET /api/jobs/recruiter/my-jobs` - Recruiter's posted jobs

### 📄 Job Applications (`/api/applications`)
- `POST /api/applications/apply/:jobId` - Apply for a job
- `GET /api/applications/my-applications` - Student application history
- `GET /api/applications/stats` - Total, Shortlisted, Interview counters
- `GET /api/applications/job/:jobId` - Recruiter view of candidates
- `PUT /api/applications/:id/status` - Update candidate status
