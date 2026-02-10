    const pool = require('../config/database');

// Créer une habitude
const createHabit = async (req, res) => {
    try {
        const { name, description, color, icon, frequency, target_days } = req.body;
        const userId = req.user.userId;

        const result = await pool.query(
            `INSERT INTO habits (user_id, name, description, color, icon, frequency, target_days) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) 
             RETURNING *`,
            [userId, name, description, color, icon, frequency || 'daily', target_days || 7]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Create habit error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Récupérer toutes les habitudes de l'utilisateur
const getHabits = async (req, res) => {
    try {
        const userId = req.user.userId;

        const result = await pool.query(
            'SELECT * FROM habits WHERE user_id = $1 AND is_archived = FALSE ORDER BY created_at DESC',
            [userId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Get habits error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Récupérer une habitude spécifique
const getHabitById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const result = await pool.query(
            'SELECT * FROM habits WHERE id = $1 AND user_id = $2',
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Habit not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Get habit error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Modifier une habitude
const updateHabit = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        const { name, description, color, icon, frequency, target_days } = req.body;

        const result = await pool.query(
            `UPDATE habits 
             SET name = $1, description = $2, color = $3, icon = $4, 
                 frequency = $5, target_days = $6, updated_at = CURRENT_TIMESTAMP
             WHERE id = $7 AND user_id = $8
             RETURNING *`,
            [name, description, color, icon, frequency, target_days, id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Habit not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Update habit error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Supprimer (archiver) une habitude
const deleteHabit = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const result = await pool.query(
            'UPDATE habits SET is_archived = TRUE WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Habit not found' });
        }

        res.json({ message: 'Habit archived successfully' });
    } catch (error) {
        console.error('Delete habit error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    createHabit,
    getHabits,
    getHabitById,
    updateHabit,
    deleteHabit
};