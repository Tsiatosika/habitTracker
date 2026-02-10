const pool = require('../config/database');

class User {
    static async findByEmail(email) {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0];
    }

    static async findById(id) {
        const result = await pool.query(
            'SELECT id, email, username, created_at FROM users WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }

    static async create(email, passwordHash, username) {
        const result = await pool.query(
            'INSERT INTO users (email, password_hash, username) VALUES ($1, $2, $3) RETURNING id, email, username, created_at',
            [email, passwordHash, username]
        );
        return result.rows[0];
    }

    static async updateProfile(userId, updates) {
        const { username } = updates;
        const result = await pool.query(
            'UPDATE users SET username = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, email, username',
            [username, userId]
        );
        return result.rows[0];
    }

    static async delete(userId) {
        await pool.query('DELETE FROM users WHERE id = $1', [userId]);
        return true;
    }
}

module.exports = User;