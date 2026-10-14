const { getPool } = require("../config/db");

class StudentProfile {
  static parseJson(val, fallback = []) {
    if (!val) return fallback;
    if (typeof val === "object") return val;
    try {
      return JSON.parse(val);
    } catch {
      return fallback;
    }
  }

  static calculateProfileScore(profile) {
    let score = 20; // base score for registration

    if (profile.name && profile.email) score += 10;
    if (profile.phone && profile.location) score += 10;
    if (profile.college && profile.degree && profile.cgpa) score += 15;

    const skills = Array.isArray(profile.skills) ? profile.skills : [];
    if (skills.length > 0) {
      score += Math.min(20, skills.length * 3);
    }

    const certs = Array.isArray(profile.certifications)
      ? profile.certifications
      : [];
    if (certs.length > 0) score += 10;

    if (profile.github || profile.linkedin) score += 5;
    if (profile.resume) score += 10;

    return Math.min(100, score);
  }

  static formatProfile(row) {
    if (!row) return null;
    const skills = this.parseJson(row.skills, []);
    const certifications = this.parseJson(row.certifications, []);

    return {
      id: row.id,
      _id: row.id,
      user: row.user_id,
      userId: row.user_id,
      name: row.name || "",
      email: row.email || "",
      phone: row.phone || "",
      location: row.location || "",
      college: row.college || "",
      degree: row.degree || "",
      graduation: row.graduation || "2028",
      cgpa: row.cgpa || "",
      about: row.about || "",
      skills,
      github: row.github || "",
      linkedin: row.linkedin || "",
      certifications,
      resume: row.resume || "",
      resumeOriginalName: row.resume_original_name || "",
      profileScore: row.profile_score || 70,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  static async create(data) {
    const pool = getPool();
    const skills = JSON.stringify(data.skills || []);
    const certifications = JSON.stringify(data.certifications || []);
    const profileScore = this.calculateProfileScore(data);

    const [result] = await pool.query(
      `INSERT INTO student_profiles 
      (user_id, name, email, phone, location, college, degree, graduation, cgpa, about, skills, github, linkedin, certifications, resume, resume_original_name, profile_score)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.user || data.userId,
        data.name || "",
        data.email || "",
        data.phone || "",
        data.location || "",
        data.college || "",
        data.degree || "",
        data.graduation || "2028",
        data.cgpa || "",
        data.about || "",
        skills,
        data.github || "",
        data.linkedin || "",
        certifications,
        data.resume || "",
        data.resumeOriginalName || "",
        profileScore,
      ]
    );

    return this.findById(result.insertId);
  }

  static async findById(id) {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT * FROM student_profiles WHERE id = ? LIMIT 1",
      [id]
    );
    return this.formatProfile(rows[0]);
  }

  static async findByUserId(userId) {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT * FROM student_profiles WHERE user_id = ? LIMIT 1",
      [userId]
    );
    return this.formatProfile(rows[0]);
  }

  static async updateByUserId(userId, updateData) {
    const pool = getPool();
    const current = await this.findByUserId(userId);

    const merged = {
      ...(current || {}),
      ...updateData,
    };

    const newScore = this.calculateProfileScore(merged);

    const skillsJson = JSON.stringify(
      Array.isArray(merged.skills) ? merged.skills : []
    );
    const certsJson = JSON.stringify(
      Array.isArray(merged.certifications) ? merged.certifications : []
    );

    await pool.query(
      `UPDATE student_profiles SET
        name = ?,
        phone = ?,
        location = ?,
        college = ?,
        degree = ?,
        graduation = ?,
        cgpa = ?,
        about = ?,
        skills = ?,
        github = ?,
        linkedin = ?,
        certifications = ?,
        resume = ?,
        resume_original_name = ?,
        profile_score = ?
      WHERE user_id = ?`,
      [
        merged.name || "",
        merged.phone || "",
        merged.location || "",
        merged.college || "",
        merged.degree || "",
        merged.graduation || "2028",
        merged.cgpa || "",
        merged.about || "",
        skillsJson,
        merged.github || "",
        merged.linkedin || "",
        certsJson,
        merged.resume || "",
        merged.resumeOriginalName || "",
        newScore,
        userId,
      ]
    );

    return this.findByUserId(userId);
  }
}

module.exports = StudentProfile;
