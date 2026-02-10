const pool = require('../config/database');
const { calculateStreak } = require('../utils/calculateStreak');

// Statistiques globales de l'utilisateur
const getOverallStats = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Nombre total d'habitudes
        const habitsCount = await pool.query(
            'SELECT COUNT(*) FROM habits WHERE user_id = $1 AND is_archived = FALSE',
            [userId]
        );

        // Total de checks complétés
        const checksCount = await pool.query(
            `SELECT COUNT(*) FROM habit_checks hc
             JOIN habits h ON hc.habit_id = h.id
             WHERE h.user_id = $1 AND hc.completed = TRUE`,
            [userId]
        );

        // Badges obtenus
        const badgesCount = await pool.query(
            'SELECT COUNT(*) FROM user_badges WHERE user_id = $1',
            [userId]
        );

        res.json({
            total_habits: parseInt(habitsCount.rows[0].count),
            total_checks: parseInt(checksCount.rows[0].count),
            total_badges: parseInt(badgesCount.rows[0].count)
        });
    } catch (error) {
        console.error('Get overall stats error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Statistiques pour une habitude spécifique
const getHabitStats = async (req, res) => {
    try {
        const { habit_id } = req.params;
        const userId = req.user.userId;

        // Vérifier ownership
        const habitCheck = await pool.query(
            'SELECT * FROM habits WHERE id = $1 AND user_id = $2',
            [habit_id, userId]
        );

        if (habitCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Habit not found' });
        }

        // Récupérer tous les checks
        const checks = await pool.query(
            'SELECT * FROM habit_checks WHERE habit_id = $1 ORDER BY check_date DESC',
            [habit_id]
        );

        // Calculer le streak actuel
        const currentStreak = calculateStreak(checks.rows);

        // Taux de complétion
        const completionRate = checks.rows.length > 0
            ? (checks.rows.filter(c => c.completed).length / checks.rows.length) * 100
            : 0;

        // Meilleur streak
        const bestStreak = calculateBestStreak(checks.rows);

        res.json({
            current_streak: currentStreak,
            best_streak: bestStreak,
            completion_rate: completionRate.toFixed(1),
            total_checks: checks.rows.length,
            completed_checks: checks.rows.filter(c => c.completed).length
        });
    } catch (error) {
        console.error('Get habit stats error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Helper pour calculer le meilleur streak
const calculateBestStreak = (checks) => {
    if (checks.length === 0) return 0;

    let bestStreak = 0;
    let currentStreak = 0;
    let previousDate = null;

    const sortedChecks = checks
        .filter(c => c.completed)
        .sort((a, b) => new Date(a.check_date) - new Date(b.check_date));

    for (const check of sortedChecks) {
        const currentDate = new Date(check.check_date);

        if (previousDate) {
            const diffDays = Math.floor((currentDate - previousDate) / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                currentStreak++;
            } else {
                bestStreak = Math.max(bestStreak, currentStreak);
                currentStreak = 1;
            }
        } else {
            currentStreak = 1;
        }

        previousDate = currentDate;
    }

    return Math.max(bestStreak, currentStreak);
};

module.exports = {
    getOverallStats,
    getHabitStats
};