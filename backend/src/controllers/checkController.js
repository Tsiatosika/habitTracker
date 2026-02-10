const pool = require('../config/database');

// Créer ou toggle un check
const toggleCheck = async (req, res) => {
    try {
        const { habit_id, check_date, completed, notes } = req.body;
        const userId = req.user.userId;

        // Vérifier que l'habitude appartient à l'utilisateur
        const habitCheck = await pool.query(
            'SELECT * FROM habits WHERE id = $1 AND user_id = $2',
            [habit_id, userId]
        );

        if (habitCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Habit not found' });
        }

        // Vérifier si un check existe déjà pour cette date
        const existingCheck = await pool.query(
            'SELECT * FROM habit_checks WHERE habit_id = $1 AND check_date = $2',
            [habit_id, check_date]
        );

        let result;

        if (existingCheck.rows.length > 0) {
            // Update existing check
            result = await pool.query(
                `UPDATE habit_checks 
                 SET completed = $1, notes = $2 
                 WHERE habit_id = $3 AND check_date = $4 
                 RETURNING *`,
                [completed, notes, habit_id, check_date]
            );
        } else {
            // Create new check
            result = await pool.query(
                `INSERT INTO habit_checks (habit_id, check_date, completed, notes) 
                 VALUES ($1, $2, $3, $4) 
                 RETURNING *`,
                [habit_id, check_date, completed, notes]
            );
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Toggle check error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Récupérer les checks pour une habitude (période donnée)
const getChecks = async (req, res) => {
    try {
        const { habit_id } = req.params;
        const { start_date, end_date } = req.query;
        const userId = req.user.userId;

        // Vérifier que l'habitude appartient à l'utilisateur
        const habitCheck = await pool.query(
            'SELECT * FROM habits WHERE id = $1 AND user_id = $2',
            [habit_id, userId]
        );

        if (habitCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Habit not found' });
        }

        let query = 'SELECT * FROM habit_checks WHERE habit_id = $1';
        const params = [habit_id];

        if (start_date && end_date) {
            query += ' AND check_date BETWEEN $2 AND $3';
            params.push(start_date, end_date);
        }

        query += ' ORDER BY check_date DESC';

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Get checks error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Récupérer tous les checks du jour pour l'utilisateur
const getTodayChecks = async (req, res) => {
    try {
        const userId = req.user.userId;
        const today = new Date().toISOString().split('T')[0];

        const result = await pool.query(
            `SELECT hc.*, h.name, h.color, h.icon 
             FROM habit_checks hc
             JOIN habits h ON hc.habit_id = h.id
             WHERE h.user_id = $1 AND hc.check_date = $2 AND h.is_archived = FALSE`,
            [userId, today]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Get today checks error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    toggleCheck,
    getChecks,
    getTodayChecks
};