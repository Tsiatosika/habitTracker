const Badge = require('../models/Badge');
const pool = require('../config/database');
const { calculateStreak } = require('./calculateStreak');

// Types de badges disponibles
const BADGE_TYPES = {
    FIRST_HABIT: 'first_habit',
    FIRST_WEEK: 'first_week',
    FIRST_MONTH: 'first_month',
    STREAK_7: 'streak_7',
    STREAK_30: 'streak_30',
    STREAK_100: 'streak_100',
    PERFECT_WEEK: 'perfect_week',
    PERFECT_MONTH: 'perfect_month',
    EARLY_BIRD: 'early_bird', // 5 checks avant 8h du matin
    NIGHT_OWL: 'night_owl', // 5 checks après 22h
};

// Descriptions des badges
const BADGE_DESCRIPTIONS = {
    first_habit: { name: 'Premier pas', description: 'Créé ta première habitude', icon: '🎯' },
    first_week: { name: 'Une semaine', description: '7 jours consécutifs', icon: '📅' },
    first_month: { name: 'Un mois', description: '30 jours consécutifs', icon: '🗓️' },
    streak_7: { name: 'Série de 7', description: '7 jours de suite', icon: '🔥' },
    streak_30: { name: 'Série de 30', description: '30 jours de suite', icon: '🔥🔥' },
    streak_100: { name: 'Série de 100', description: '100 jours de suite', icon: '🔥🔥🔥' },
    perfect_week: { name: 'Semaine parfaite', description: 'Toutes les habitudes complétées pendant 7 jours', icon: '⭐' },
    perfect_month: { name: 'Mois parfait', description: 'Toutes les habitudes complétées pendant 30 jours', icon: '🌟' },
    early_bird: { name: 'Lève-tôt', description: '5 checks avant 8h', icon: '🌅' },
    night_owl: { name: 'Noctambule', description: '5 checks après 22h', icon: '🌙' },
};

/**
 * Vérifier et attribuer les badges après un check
 */
const checkAndAwardBadges = async (userId, habitId) => {
    try {
        const newBadges = [];

        // Récupérer tous les checks complétés de cette habitude via pool
        const result = await pool.query(
            'SELECT * FROM habit_checks WHERE habit_id = $1 AND completed = TRUE ORDER BY check_date DESC',
            [habitId]
        );
        const checks = result.rows;

        // Calculer le streak actuel
        const currentStreak = calculateStreak(checks);

        // Badge: Première semaine (7 jours consécutifs)
        if (currentStreak >= 7) {
            const badge = await Badge.awardBadge(userId, BADGE_TYPES.FIRST_WEEK, habitId);
            if (badge) newBadges.push(badge);
        }

        // Badge: Premier mois (30 jours consécutifs)
        if (currentStreak >= 30) {
            const badge = await Badge.awardBadge(userId, BADGE_TYPES.FIRST_MONTH, habitId);
            if (badge) newBadges.push(badge);
        }

        // Badge: Streak de 7 jours
        if (currentStreak >= 7) {
            const badge = await Badge.awardBadge(userId, BADGE_TYPES.STREAK_7, habitId);
            if (badge) newBadges.push(badge);
        }

        // Badge: Streak de 30 jours
        if (currentStreak >= 30) {
            const badge = await Badge.awardBadge(userId, BADGE_TYPES.STREAK_30, habitId);
            if (badge) newBadges.push(badge);
        }

        // Badge: Streak de 100 jours
        if (currentStreak >= 100) {
            const badge = await Badge.awardBadge(userId, BADGE_TYPES.STREAK_100, habitId);
            if (badge) newBadges.push(badge);
        }

        return newBadges;
    } catch (error) {
        console.error('Error checking badges:', error);
        return [];
    }
};

/**
 * Vérifier le badge de première habitude
 */
const checkFirstHabitBadge = async (userId) => {
    try {
        const badge = await Badge.awardBadge(userId, BADGE_TYPES.FIRST_HABIT);
        return badge ? [badge] : [];
    } catch (error) {
        console.error('Error checking first habit badge:', error);
        return [];
    }
};

/**
 * Obtenir les informations d'un badge
 */
const getBadgeInfo = (badgeType) => {
    return BADGE_DESCRIPTIONS[badgeType] || {
        name: badgeType,
        description: 'Badge spécial',
        icon: '🏆'
    };
};

module.exports = {
    checkAndAwardBadges,
    checkFirstHabitBadge,
    getBadgeInfo,
    BADGE_TYPES,
    BADGE_DESCRIPTIONS
};