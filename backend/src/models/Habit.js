const pool = require('../config/database');

class Habit {
    static async findByUserId(userId) {
        const result = await pool.query(
            'SELECT * FROM habits WHERE user_id = $1 AND is_archived = FALSE ORDER BY created_at DESC',
            [userId]
        );
        return result.rows;
    }

    static async findById(habitId, userId) {
        const result = await pool.query(
            'SELECT * FROM habits WHERE id = $1 AND user_id = $2',
            [habitId, userId]
        );
        return result.rows[0];
    }

    static async create(userId, habitData) {
        const { name, description, color, icon, frequency, target_days } = habitData;
        const result = await pool.query(
            `INSERT INTO habits (user_id, name, description, color, icon, frequency, target_days) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [userId, name, description, color, icon, frequency || 'daily', target_days || 7]
        );
        return result.rows[0];
    }

    static async update(habitId, userId, habitData) {
        const { name, description, color, icon, frequency, target_days } = habitData;
        const result = await pool.query(
            `UPDATE habits 
             SET name = $1, description = $2, color = $3, icon = $4, 
                 frequency = $5, target_days = $6, updated_at = CURRENT_TIMESTAMP
             WHERE id = $7 AND user_id = $8 RETURNING *`,
            [name, description, color, icon, frequency, target_days, habitId, userId]
        );
        return result.rows[0];
    }

    static async archive(habitId, userId) {
        const result = await pool.query(
            'UPDATE habits SET is_archived = TRUE WHERE id = $1 AND user_id = $2 RETURNING *',
            [habitId, userId]
        );
        return result.rows[0];
    }

    static async delete(habitId, userId) {
        await pool.query(
            'DELETE FROM habits WHERE id = $1 AND user_id = $2',
            [habitId, userId]
        );
        return true;
    }
}

module.exports = Habit;