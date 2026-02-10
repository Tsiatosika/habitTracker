const pool = require('../config/database');

class HabitCheck {
    static async findByHabitAndDate(habitId, checkDate) {
        const result = await pool.query(
            'SELECT * FROM habit_checks WHERE habit_id = $1 AND check_date = $2',
            [habitId, checkDate]
        );
        return result.rows[0];
    }

    static async findByHabit(habitId, startDate = null, endDate = null) {
        let query = 'SELECT * FROM habit_checks WHERE habit_id = $1';
        const params = [habitId];

        if (startDate && endDate) {
            query += ' AND check_date BETWEEN $2 AND $3';
            params.push(startDate, endDate);
        }

        query += ' ORDER BY check_date DESC';

        const result = await pool.query(query, params);
        return result.rows;
    }

    static async create(habitId, checkDate, completed = true, notes = null) {
        const result = await pool.query(
            'INSERT INTO habit_checks (habit_id, check_date, completed, notes) VALUES ($1, $2, $3, $4) RETURNING *',
            [habitId, checkDate, completed, notes]
        );
        return result.rows[0];
    }

    static async update(habitId, checkDate, completed, notes = null) {
        const result = await pool.query(
            'UPDATE habit_checks SET completed = $1, notes = $2 WHERE habit_id = $3 AND check_date = $4 RETURNING *',
            [completed, notes, habitId, checkDate]
        );
        return result.rows[0];
    }

    static async upsert(habitId, checkDate, completed, notes = null) {
        const existing = await this.findByHabitAndDate(habitId, checkDate);

        if (existing) {
            return await this.update(habitId, checkDate, completed, notes);
        } else {
            return await this.create(habitId, checkDate, completed, notes);
        }
    }

    static async delete(habitId, checkDate) {
        await pool.query(
            'DELETE FROM habit_checks WHERE habit_id = $1 AND check_date = $2',
            [habitId, checkDate]
        );
        return true;
    }

    static async getTodayChecksByUser(userId) {
        const today = new Date().toISOString().split('T')[0];
        const result = await pool.query(
            `SELECT hc.*, h.name, h.color, h.icon 
             FROM habit_checks hc
             JOIN habits h ON hc.habit_id = h.id
             WHERE h.user_id = $1 AND hc.check_date = $2 AND h.is_archived = FALSE`,
            [userId, today]
        );
        return result.rows;
    }
}

module.exports = HabitCheck;