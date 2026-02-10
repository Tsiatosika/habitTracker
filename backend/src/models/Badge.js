const pool = require('../config/database');

class Badge {
    static async findByUserId(userId) {
        const result = await pool.query(
            'SELECT * FROM user_badges WHERE user_id = $1 ORDER BY earned_at DESC',
            [userId]
        );
        return result.rows;
    }

    static async create(userId, badgeType, habitId = null) {
        const result = await pool.query(
            'INSERT INTO user_badges (user_id, badge_type, habit_id) VALUES ($1, $2, $3) RETURNING *',
            [userId, badgeType, habitId]
        );
        return result.rows[0];
    }

    static async exists(userId, badgeType, habitId = null) {
        let query = 'SELECT * FROM user_badges WHERE user_id = $1 AND badge_type = $2';
        const params = [userId, badgeType];

        if (habitId) {
            query += ' AND habit_id = $3';
            params.push(habitId);
        }

        const result = await pool.query(query, params);
        return result.rows.length > 0;
    }

    static async awardBadge(userId, badgeType, habitId = null) {
        const exists = await this.exists(userId, badgeType, habitId);

        if (!exists) {
            return await this.create(userId, badgeType, habitId);
        }

        return null;
    }
}

module.exports = Badge;