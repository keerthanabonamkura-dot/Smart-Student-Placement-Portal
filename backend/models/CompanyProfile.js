const { getPool } = require("../config/db");

class CompanyProfile {
  static formatProfile(row) {
    if (!row) return null;
    return {
      id: row.id,
      userId: row.user_id,
      companyName: row.company_name,
      name: row.company_name,
      industry: row.industry || "Information Technology",
      location: row.location || "",
      website: row.website || "",
      email: row.email || "",
      phone: row.phone || "",
      description: row.description || "",
      logo: row.logo || "SP",
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  static async findByUserId(userId) {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT * FROM company_profiles WHERE user_id = ? LIMIT 1",
      [userId]
    );
    return rows[0] ? this.formatProfile(rows[0]) : null;
  }

  static async upsert(userId, data) {
    const pool = getPool();
    const existing = await this.findByUserId(userId);

    if (existing) {
      await pool.query(
        `UPDATE company_profiles SET
          company_name = ?,
          industry = ?,
          location = ?,
          website = ?,
          email = ?,
          phone = ?,
          description = ?,
          logo = ?
        WHERE user_id = ?`,
        [
          data.companyName || data.name || existing.companyName,
          data.industry || existing.industry,
          data.location !== undefined ? data.location : existing.location,
          data.website !== undefined ? data.website : existing.website,
          data.email !== undefined ? data.email : existing.email,
          data.phone !== undefined ? data.phone : existing.phone,
          data.description !== undefined ? data.description : existing.description,
          data.logo || existing.logo,
          userId,
        ]
      );
    } else {
      await pool.query(
        `INSERT INTO company_profiles
        (user_id, company_name, industry, location, website, email, phone, description, logo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          data.companyName || data.name || "Company",
          data.industry || "Information Technology",
          data.location || "",
          data.website || "",
          data.email || "",
          data.phone || "",
          data.description || "",
          data.logo || "SP",
        ]
      );
    }

    return this.findByUserId(userId);
  }

  static async findAll() {
    const pool = getPool();
    const [rows] = await pool.query("SELECT * FROM company_profiles ORDER BY created_at DESC");
    return rows.map((r) => this.formatProfile(r));
  }

  static async countTotal() {
    const pool = getPool();
    const [rows] = await pool.query("SELECT COUNT(*) AS total FROM company_profiles");
    return rows[0]?.total || 0;
  }
}

module.exports = CompanyProfile;
