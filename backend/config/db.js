
const mysql = require("mysql2/promise");

let pool;

const getPool = () => {
  if (!pool) {
    const required = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];

    for (const key of required) {
      if (process.env[key] === undefined || process.env[key] === "") {
        throw new Error(`Missing required environment variable: ${key}`);
      }
    }

    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: true },
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      multipleStatements: true,
    });
  }

  return pool;
};

const initDatabase = async () => {
  const connection = await getPool().getConnection();

  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('Admin', 'Student', 'Recruiter') NOT NULL DEFAULT 'Student',
        account_status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_users_email (email),
        INDEX idx_users_role (role),
        INDEX idx_users_status (account_status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    const [passwordColumns] = await connection.query(
      "SHOW COLUMNS FROM users LIKE 'password'"
    );

    if (passwordColumns.length > 0) {
      await connection.query(
        "ALTER TABLE users CHANGE COLUMN `password` `password_hash` VARCHAR(255) NOT NULL"
      );
    }

    const [statusColumns] = await connection.query(
      "SHOW COLUMNS FROM users LIKE 'account_status'"
    );

    if (statusColumns.length === 0) {
      await connection.query(`
        ALTER TABLE users
        ADD COLUMN account_status ENUM('active', 'inactive')
        NOT NULL DEFAULT 'active'
      `);
    }

    await connection.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        recruiter_id INT NULL,
        title VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        required_skills JSON NOT NULL,
        eligibility VARCHAR(255) DEFAULT 'Fresher',
        location VARCHAR(255) NOT NULL,
        job_status ENUM('Active', 'Closed', 'Draft') NOT NULL DEFAULT 'Active',
        application_deadline VARCHAR(100) NOT NULL,
        job_type ENUM('Full Time', 'Part Time', 'Internship', 'Remote') NOT NULL DEFAULT 'Full Time',
        salary VARCHAR(255) NOT NULL DEFAULT 'Competitive',
        experience VARCHAR(100) DEFAULT 'Fresher',
        category VARCHAR(255) DEFAULT 'Software Development',
        responsibilities JSON NULL,
        qualifications JSON NULL,
        logo VARCHAR(50) DEFAULT 'SP',
        color VARCHAR(50) DEFAULT 'blue',
        applicants_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_jobs_recruiter (recruiter_id),
        INDEX idx_jobs_status (job_status),
        INDEX idx_jobs_title (title),
        CONSTRAINT fk_jobs_recruiter
          FOREIGN KEY (recruiter_id) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        job_id INT NOT NULL,
        status ENUM('Under Review', 'Shortlisted', 'Interview', 'Rejected', 'Accepted')
          NOT NULL DEFAULT 'Under Review',
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        resume VARCHAR(255) DEFAULT '',
        notes TEXT NULL,
        UNIQUE KEY unique_student_job (student_id, job_id),
        INDEX idx_app_student (student_id),
        INDEX idx_app_job (job_id),
        INDEX idx_app_status (status),
        CONSTRAINT fk_app_student
          FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_app_job
          FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS student_profiles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL UNIQUE,
        name VARCHAR(255) DEFAULT '',
        email VARCHAR(255) DEFAULT '',
        phone VARCHAR(50) DEFAULT '',
        location VARCHAR(255) DEFAULT '',
        college VARCHAR(255) DEFAULT '',
        degree VARCHAR(255) DEFAULT '',
        graduation VARCHAR(50) DEFAULT '2028',
        cgpa VARCHAR(20) DEFAULT '',
        about TEXT,
        skills JSON,
        github VARCHAR(255) DEFAULT '',
        linkedin VARCHAR(255) DEFAULT '',
        certifications JSON,
        resume VARCHAR(255) DEFAULT '',
        resume_original_name VARCHAR(255) DEFAULT '',
        profile_score INT DEFAULT 70,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_student_user
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS company_profiles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL UNIQUE,
        company_name VARCHAR(255) NOT NULL,
        industry VARCHAR(255) DEFAULT 'Information Technology',
        location VARCHAR(255) DEFAULT '',
        website VARCHAR(255) DEFAULT '',
        email VARCHAR(255) DEFAULT '',
        phone VARCHAR(50) DEFAULT '',
        description TEXT,
        logo VARCHAR(50) DEFAULT 'SP',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_company_user
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log(
      `[MySQL] Successfully connected and verified schema on '${process.env.DB_NAME}'`
    );
  } catch (error) {
    console.error("[MySQL] Connection / Schema initialization error:", error.message);
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
  getPool,
  initDatabase,
};
