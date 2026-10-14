const bcrypt = require("bcryptjs");
const { getPool } = require("../config/db");

class User {
  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  static async matchPassword(enteredPassword, hashedPassword) {
    if (!enteredPassword || !hashedPassword) return false;
    return await bcrypt.compare(enteredPassword, hashedPassword);
  }

  static formatUser(row) {
    if (!row) return null;
    const { password_hash, password, ...safeUser } = row;
    return {
      ...safeUser,
      _id: safeUser.id,
      id: safeUser.id,
      accountStatus: safeUser.account_status,
      createdAt: safeUser.created_at,
      updatedAt: safeUser.updated_at,
    };
  }

  static async create({ name, email, password, role = "Student", account_status = "active" }) {
    const pool = getPool();
    const hashedPassword = await this.hashPassword(password);
    const normalizedEmail = email.toLowerCase().trim();

    const [result] = await pool.query(
      "INSERT INTO users (name, email, password_hash, role, account_status) VALUES (?, ?, ?, ?, ?)",
      [name, normalizedEmail, hashedPassword, role, account_status]
    );

    return {
      id: result.insertId,
      _id: result.insertId,
      name,
      email: normalizedEmail,
      role,
      account_status,
      accountStatus: account_status,
    };
  }

  static async findByEmail(email) {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT id, name, email, password_hash, role, account_status, created_at, updated_at FROM users WHERE email = ? LIMIT 1",
      [email.toLowerCase().trim()]
    );
    return rows[0] || null;
  }

  static async findById(id) {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT id, name, email, password_hash, role, account_status, created_at, updated_at FROM users WHERE id = ? LIMIT 1",
      [id]
    );
    return rows[0] || null;
  }

  static async findAll({ role, status } = {}) {
    const pool = getPool();
    let sql = "SELECT id, name, email, role, account_status, created_at, updated_at FROM users WHERE 1=1";
    const params = [];

    if (role && role !== "All") {
      sql += " AND role = ?";
      params.push(role);
    }

    if (status && status !== "All") {
      sql += " AND account_status = ?";
      params.push(status.toLowerCase());
    }

    sql += " ORDER BY created_at DESC";

    const [rows] = await pool.query(sql, params);
    return rows.map((r) => this.formatUser(r));
  }

  static async findAllByRole(role) {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT id, name, email, role, account_status, created_at, updated_at FROM users WHERE role = ? ORDER BY created_at DESC",
      [role]
    );
    return rows.map((r) => this.formatUser(r));
  }

  static async updateStatus(id, status) {
    const pool = getPool();
    const normalizedStatus = status.toLowerCase() === "active" ? "active" : "inactive";
    await pool.query("UPDATE users SET account_status = ? WHERE id = ?", [normalizedStatus, id]);
    return this.findById(id);
  }

  static async update(id, { name, email }) {
    const pool = getPool();
    const updates = [];
    const params = [];

    if (name) {
      updates.push("name = ?");
      params.push(name);
    }
    if (email) {
      updates.push("email = ?");
      params.push(email.toLowerCase().trim());
    }

    if (updates.length > 0) {
      params.push(id);
      await pool.query(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`, params);
    }

    return this.findById(id);
  }

  static async delete(id) {
    const pool = getPool();
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }

  static async countByRole(role) {
    const pool = getPool();
    const [rows] = await pool.query("SELECT COUNT(*) AS total FROM users WHERE role = ?", [role]);
    return rows[0]?.total || 0;
  }

  static async countTotal() {
    const pool = getPool();
    const [rows] = await pool.query("SELECT COUNT(*) AS total FROM users");
    return rows[0]?.total || 0;
  }
}

module.exports = User;
