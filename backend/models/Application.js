const { getPool } = require("../config/db");

class Application {
  static formatApplication(row) {
    if (!row) return null;
    return {
      id: row.id,
      _id: row.id,
      jobId: row.job_id,
      job_id: row.job_id,
      studentId: row.student_id,
      student_id: row.student_id,
      status: row.status,
      appliedAt: row.applied_at,
      appliedDate: row.applied_at,
      resume: row.resume || "",
      notes: row.notes || "",
      company: row.job_company || "Company",
      job: row.job_title || "Job Role",
      title: row.job_title || "Job Role",
      location: row.job_location || "India",
      logo: row.job_logo || "SP",
      color: row.job_color || "blue",
      createdAt: row.applied_at,
      updatedAt: row.updated_at,
    };
  }

  static async create({ jobId, studentId, resume = "", notes = "", status = "Under Review" }) {
    const pool = getPool();
    const [result] = await pool.query(
      `INSERT INTO applications (job_id, student_id, resume, notes, status)
       VALUES (?, ?, ?, ?, ?)`,
      [jobId, studentId, resume, notes, status]
    );

    return this.findById(result.insertId);
  }

  static async findById(id) {
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT a.*, j.title AS job_title, j.company AS job_company, j.location AS job_location, j.logo AS job_logo, j.color AS job_color, j.recruiter_id
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       WHERE a.id = ? LIMIT 1`,
      [id]
    );
    return rows[0] ? this.formatApplication(rows[0]) : null;
  }

  static async findByStudentAndJob(studentId, jobId) {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT * FROM applications WHERE student_id = ? AND job_id = ? LIMIT 1",
      [studentId, jobId]
    );
    return rows[0] || null;
  }

  static async findByStudent(studentId, statusFilter) {
    const pool = getPool();
    let sql = `
      SELECT a.*, j.title AS job_title, j.company AS job_company, j.location AS job_location, j.logo AS job_logo, j.color AS job_color
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE a.student_id = ?
    `;
    const params = [studentId];

    if (statusFilter && statusFilter !== "All Applications" && statusFilter !== "All") {
      sql += " AND a.status = ?";
      params.push(statusFilter);
    }

    sql += " ORDER BY a.applied_at DESC";

    const [rows] = await pool.query(sql, params);
    return rows.map((r) => this.formatApplication(r));
  }

  static async findByJob(jobId) {
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT a.*, u.name AS student_name, u.email AS student_email,
              sp.degree AS student_degree, sp.college AS student_college,
              sp.cgpa AS student_cgpa, sp.skills AS student_skills,
              sp.resume AS profile_resume
       FROM applications a
       JOIN users u ON a.student_id = u.id
       LEFT JOIN student_profiles sp ON u.id = sp.user_id
       WHERE a.job_id = ?
       ORDER BY a.applied_at DESC`,
      [jobId]
    );

    return rows.map((r) => {
      let skills = [];
      try {
        skills = typeof r.student_skills === "string" ? JSON.parse(r.student_skills) : (r.student_skills || []);
      } catch {
        skills = [];
      }

      return {
        id: r.id,
        _id: r.id,
        applicationId: r.id,
        jobId: r.job_id,
        studentId: r.student_id,
        name: r.student_name,
        email: r.student_email,
        course: r.student_degree || "B.Tech CSE",
        college: r.student_college || "University",
        cgpa: r.student_cgpa || "N/A",
        skills,
        appliedDate: r.applied_at,
        appliedAt: r.applied_at,
        status: r.status,
        resume: r.resume || r.profile_resume || "",
        notes: r.notes || "",
      };
    });
  }

  static async findByRecruiter(recruiterId) {
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT a.*, j.title AS job_title, j.company AS job_company,
              u.name AS student_name, u.email AS student_email,
              sp.degree AS student_degree, sp.college AS student_college,
              sp.cgpa AS student_cgpa, sp.skills AS student_skills,
              sp.resume AS profile_resume
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       JOIN users u ON a.student_id = u.id
       LEFT JOIN student_profiles sp ON u.id = sp.user_id
       WHERE j.recruiter_id = ?
       ORDER BY a.applied_at DESC`,
      [recruiterId]
    );

    return rows.map((r) => {
      let skills = [];
      try {
        skills = typeof r.student_skills === "string" ? JSON.parse(r.student_skills) : (r.student_skills || []);
      } catch {
        skills = [];
      }

      return {
        id: r.id,
        _id: r.id,
        applicationId: r.id,
        jobId: r.job_id,
        studentId: r.student_id,
        job: r.job_title,
        jobTitle: r.job_title,
        company: r.job_company,
        name: r.student_name,
        email: r.student_email,
        course: r.student_degree || "B.Tech CSE",
        college: r.student_college || "University",
        cgpa: r.student_cgpa || "N/A",
        skills,
        appliedDate: r.applied_at,
        appliedAt: r.applied_at,
        status: r.status,
        resume: r.resume || r.profile_resume || "",
        notes: r.notes || "",
      };
    });
  }

  static async findAll() {
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT a.*, j.title AS job_title, j.company AS job_company,
              u.name AS student_name, u.email AS student_email
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       JOIN users u ON a.student_id = u.id
       ORDER BY a.applied_at DESC`
    );

    return rows.map((r) => ({
      id: r.id,
      _id: r.id,
      jobId: r.job_id,
      studentId: r.student_id,
      jobTitle: r.job_title,
      company: r.job_company,
      studentName: r.student_name,
      studentEmail: r.student_email,
      status: r.status,
      appliedAt: r.applied_at,
      appliedDate: r.applied_at,
      resume: r.resume,
      notes: r.notes,
    }));
  }

  static async updateStatus(id, status, notes) {
    const pool = getPool();
    let sql = "UPDATE applications SET status = ?";
    const params = [status];

    if (notes !== undefined) {
      sql += ", notes = ?";
      params.push(notes);
    }

    sql += " WHERE id = ?";
    params.push(id);

    await pool.query(sql, params);
    return this.findById(id);
  }

  static async delete(id) {
    const pool = getPool();
    const [result] = await pool.query("DELETE FROM applications WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }

  static async countByJob(jobId) {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT COUNT(*) AS total FROM applications WHERE job_id = ?",
      [jobId]
    );
    return rows[0]?.total || 0;
  }

  static async countTotal() {
    const pool = getPool();
    const [rows] = await pool.query("SELECT COUNT(*) AS total FROM applications");
    return rows[0]?.total || 0;
  }

  static async getStatsByStudent(studentId) {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT status, COUNT(*) as count FROM applications WHERE student_id = ? GROUP BY status",
      [studentId]
    );

    const stats = {
      total: 0,
      underReview: 0,
      interviews: 0,
      shortlisted: 0,
      rejected: 0,
      accepted: 0,
    };

    rows.forEach((r) => {
      stats.total += Number(r.count);
      if (r.status === "Under Review") stats.underReview = Number(r.count);
      if (r.status === "Interview") stats.interviews = Number(r.count);
      if (r.status === "Shortlisted") stats.shortlisted = Number(r.count);
      if (r.status === "Rejected") stats.rejected = Number(r.count);
      if (r.status === "Accepted") stats.accepted = Number(r.count);
    });

    return stats;
  }
}

module.exports = Application;
