const { getPool } = require("../config/db");

class Job {
  static parseJson(val, fallback = []) {
    if (!val) return fallback;
    if (typeof val === "object") return val;
    try {
      return JSON.parse(val);
    } catch {
      return fallback;
    }
  }

  static formatJob(row) {
    if (!row) return null;
    const skills = this.parseJson(row.required_skills, []);
    const responsibilities = this.parseJson(row.responsibilities, []);
    const qualifications = this.parseJson(row.qualifications, []);

    return {
      id: row.id,
      _id: row.id,
      recruiterId: row.recruiter_id,
      recruiter_id: row.recruiter_id,
      postedBy: row.recruiter_id,
      title: row.title,
      company: row.company,
      location: row.location,
      jobType: row.job_type,
      job_type: row.job_type,
      type: row.job_type,
      salary: row.salary || "Competitive",
      experience: row.experience || "Fresher",
      eligibility: row.eligibility || row.experience || "Fresher",
      skills,
      required_skills: skills,
      category: row.category || "Software Development",
      description: row.description,
      responsibilities,
      qualifications,
      deadline: row.application_deadline,
      applicationDeadline: row.application_deadline,
      application_deadline: row.application_deadline,
      status: row.job_status,
      jobStatus: row.job_status,
      job_status: row.job_status,
      logo: row.logo || (row.company ? row.company.substring(0, 3).toUpperCase() : "SP"),
      color: row.color || "blue",
      applicants: row.applicants_count || 0,
      applicantsCount: row.applicants_count || 0,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  static async create(data) {
    const pool = getPool();
    const skillsArr = Array.isArray(data.skills)
      ? data.skills
      : Array.isArray(data.required_skills)
      ? data.required_skills
      : typeof (data.skills || data.required_skills) === "string"
      ? (data.skills || data.required_skills).split(",").map((s) => s.trim()).filter(Boolean)
      : ["General"];

    const skillsJson = JSON.stringify(skillsArr);
    const respJson = JSON.stringify(data.responsibilities || []);
    const qualJson = JSON.stringify(data.qualifications || []);

    const logo =
      data.logo ||
      (data.company ? data.company.substring(0, 3).toUpperCase() : "SP");

    const [result] = await pool.query(
      `INSERT INTO jobs 
      (recruiter_id, title, company, description, required_skills, eligibility, location, job_status, application_deadline, job_type, salary, experience, category, responsibilities, qualifications, logo, color, applicants_count)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.recruiterId || data.recruiter_id || data.postedBy || null,
        data.title,
        data.company,
        data.description,
        skillsJson,
        data.eligibility || data.experience || "Fresher",
        data.location,
        data.jobStatus || data.job_status || data.status || "Active",
        data.applicationDeadline || data.application_deadline || data.deadline || "2026-12-31",
        data.jobType || data.type || "Full Time",
        data.salary || "Competitive",
        data.experience || "Fresher",
        data.category || "Software Development",
        respJson,
        qualJson,
        logo,
        data.color || "blue",
        data.applicantsCount || 0,
      ]
    );

    return this.findById(result.insertId);
  }

  static async findById(id) {
    const pool = getPool();
    const [rows] = await pool.query("SELECT * FROM jobs WHERE id = ? LIMIT 1", [id]);
    return this.formatJob(rows[0]);
  }

  static async findAll({ keyword, location, jobType, status = "Active" } = {}) {
    const pool = getPool();
    let sql = "SELECT * FROM jobs WHERE 1=1";
    const params = [];

    if (status && status !== "All") {
      sql += " AND job_status = ?";
      params.push(status);
    }

    if (location) {
      sql += " AND location LIKE ?";
      params.push(`%${location}%`);
    }

    if (jobType && jobType !== "All") {
      sql += " AND job_type = ?";
      params.push(jobType);
    }

    if (keyword) {
      sql +=
        " AND (title LIKE ? OR company LIKE ? OR category LIKE ? OR JSON_SEARCH(required_skills, 'one', ?) IS NOT NULL)";
      params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
    }

    sql += " ORDER BY created_at DESC";

    const [rows] = await pool.query(sql, params);
    return rows.map((r) => this.formatJob(r));
  }

  static async findByRecruiter(recruiterId) {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT * FROM jobs WHERE recruiter_id = ? ORDER BY created_at DESC",
      [recruiterId]
    );
    return rows.map((r) => this.formatJob(r));
  }

  static async countActive() {
    const pool = getPool();
    const [rows] = await pool.query("SELECT COUNT(*) AS total FROM jobs WHERE job_status = 'Active'");
    return rows[0]?.total || 0;
  }

  static async countTotal() {
    const pool = getPool();
    const [rows] = await pool.query("SELECT COUNT(*) AS total FROM jobs");
    return rows[0]?.total || 0;
  }

  static async update(id, updateData) {
    const pool = getPool();
    const current = await this.findById(id);
    if (!current) return null;

    const merged = { ...current, ...updateData };

    const skillsArr = Array.isArray(merged.skills)
      ? merged.skills
      : Array.isArray(merged.required_skills)
      ? merged.required_skills
      : typeof (merged.skills || merged.required_skills) === "string"
      ? (merged.skills || merged.required_skills).split(",").map((s) => s.trim()).filter(Boolean)
      : ["General"];

    const skillsJson = JSON.stringify(skillsArr);
    const respJson = JSON.stringify(
      Array.isArray(merged.responsibilities) ? merged.responsibilities : []
    );
    const qualJson = JSON.stringify(
      Array.isArray(merged.qualifications) ? merged.qualifications : []
    );

    await pool.query(
      `UPDATE jobs SET
        title = ?,
        company = ?,
        location = ?,
        job_type = ?,
        salary = ?,
        experience = ?,
        eligibility = ?,
        required_skills = ?,
        category = ?,
        description = ?,
        responsibilities = ?,
        qualifications = ?,
        application_deadline = ?,
        job_status = ?,
        logo = ?,
        color = ?
      WHERE id = ?`,
      [
        merged.title,
        merged.company,
        merged.location,
        merged.jobType || merged.type,
        merged.salary,
        merged.experience,
        merged.eligibility || merged.experience,
        skillsJson,
        merged.category,
        merged.description,
        respJson,
        qualJson,
        merged.applicationDeadline || merged.deadline,
        merged.jobStatus || merged.status,
        merged.logo,
        merged.color,
        id,
      ]
    );

    return this.findById(id);
  }

  static async delete(id) {
    const pool = getPool();
    const [result] = await pool.query("DELETE FROM jobs WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }

  static async incrementApplicants(id) {
    const pool = getPool();
    await pool.query(
      "UPDATE jobs SET applicants_count = applicants_count + 1 WHERE id = ?",
      [id]
    );
  }
}

module.exports = Job;
