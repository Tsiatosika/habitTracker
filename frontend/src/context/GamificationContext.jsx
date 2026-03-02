import { createContext, useState, useEffect, useContext } from 'react';
import { NotificationContext } from './NotificationContext';

export const GamificationContext = createContext();

const LEVELS = [
    { level: 1, name: 'Débutant', minPoints: 0, maxPoints: 100, icon: '🌱', color: '#86efac' },
    { level: 2, name: 'Novice', minPoints: 100, maxPoints: 250, icon: '🌿', color: '#4ade80' },
    { level: 3, name: 'Apprenti', minPoints: 250, maxPoints: 500, icon: '🍀', color: '#22c55e' },
    { level: 4, name: 'Confirmé', minPoints: 500, maxPoints: 1000, icon: '🌳', color: '#16a34a' },
    { level: 5, name: 'Expert', minPoints: 1000, maxPoints: 2000, icon: '🏆', color: '#15803d' },
    { level: 6, name: 'Maître', minPoints: 2000, maxPoints: 5000, icon: '👑', color: '#166534' },
    { level: 7, name: 'Légende', minPoints: 5000, maxPoints: 10000, icon: '⭐', color: '#14532d' },
    { level: 8, name: 'Immortel', minPoints: 10000, maxPoints: Infinity, icon: '🌟', color: '#052e16' },
];

const CHALLENGES = {
    daily: [
        { id: 'complete_3_habits', name: 'Triple Check', description: 'Compléter 3 habitudes', points: 30, icon: '✨' },
        { id: 'complete_5_habits', name: 'Cinq sur Cinq', description: 'Compléter 5 habitudes', points: 50, icon: '💫' },
        { id: 'complete_all_habits', name: 'Perfection', description: 'Compléter toutes les habitudes', points: 100, icon: '🎯' },
        { id: 'morning_warrior', name: 'Guerrier Matinal', description: 'Compléter 3 habitudes avant 9h', points: 40, icon: '🌅' },
    ],
    weekly: [
        { id: 'complete_streak_7', name: 'Semaine Parfaite', description: '7 jours de suite', points: 200, icon: '🔥' },
        { id: 'complete_20_habits', name: 'Marathon', description: 'Compléter 20 habitudes en une semaine', points: 150, icon: '🏃' },
        { id: 'all_habits_3_days', name: 'Consistance', description: 'Toutes les habitudes pendant 3 jours', points: 180, icon: '💪' },
    ],
    monthly: [
        { id: 'complete_streak_30', name: 'Mois Légendaire', description: '30 jours de suite', points: 500, icon: '👑' },
        { id: 'complete_100_habits', name: 'Centurion', description: 'Compléter 100 habitudes', points: 400, icon: '💯' },
        { id: 'no_miss_month', name: 'Zéro Défaut', description: 'Aucun jour manqué ce mois', points: 600, icon: '🌟' },
    ]
};

const POINT_VALUES = {
    habit_complete: 10,
    first_habit_of_day: 5,
    streak_bonus_7: 50,
    streak_bonus_30: 200,
    streak_bonus_100: 1000,
    all_habits_day: 50,
    challenge_complete: 'varies',
};

export const GamificationProvider = ({ children }) => {
    const [userLevel, setUserLevel] = useState(LEVELS[0]);
    const [totalPoints, setTotalPoints] = useState(0);
    const [todayPoints, setTodayPoints] = useState(0);
    const [activeChallenges, setActiveChallenges] = useState([]);
    const [completedChallenges, setCompletedChallenges] = useState([]);
    const [achievements, setAchievements] = useState([]);

    const { addNotification } = useContext(NotificationContext) || { addNotification: () => {} };

    useEffect(() => {
        loadGamificationData();
        resetDailyChallenges();
    }, []);

    const loadGamificationData = () => {
        const saved = localStorage.getItem('gamification');
        if (saved) {
            const data = JSON.parse(saved);
            setTotalPoints(data.totalPoints || 0);
            setTodayPoints(data.todayPoints || 0);
            setCompletedChallenges(data.completedChallenges || []);
            setAchievements(data.achievements || []);
            updateLevel(data.totalPoints || 0);
        }

        // Charger les défis actifs
        const savedChallenges = localStorage.getItem('activeChallenges');
        if (savedChallenges) {
            setActiveChallenges(JSON.parse(savedChallenges));
        } else {
            generateDailyChallenges();
        }
    };

    const saveGamificationData = (data) => {
        localStorage.setItem('gamification', JSON.stringify({
            totalPoints,
            todayPoints,
            completedChallenges,
            achievements,
            ...data
        }));
    };

    const updateLevel = (points) => {
        const newLevel = LEVELS.find(l => points >= l.minPoints && points < l.maxPoints);
        if (newLevel && newLevel.level !== userLevel.level) {
            setUserLevel(newLevel);

            // Notification de niveau
            addNotification({
                type: 'achievement',
                title: 'Nouveau Niveau !',
                message: `Vous êtes maintenant ${newLevel.name} ${newLevel.icon}`,
            });
        } else {
            setUserLevel(newLevel || LEVELS[LEVELS.length - 1]);
        }
    };

    const addPoints = (points, reason = '') => {
        const newTotal = totalPoints + points;
        const newToday = todayPoints + points;

        setTotalPoints(newTotal);
        setTodayPoints(newToday);
        updateLevel(newTotal);

        saveGamificationData({
            totalPoints: newTotal,
            todayPoints: newToday
        });

        // Animation de points
        showPointsAnimation(points);

        // Vérifier les défis
        checkChallengeProgress(reason, points);

        return newTotal;
    };

    const showPointsAnimation = (points) => {
        // Cette fonction peut être utilisée pour afficher une animation de points
        console.log(`+${points} points!`);
    };

    const onHabitComplete = (habitId) => {
        // Points de base
        let points = POINT_VALUES.habit_complete;

        // Bonus pour la première habitude du jour
        if (todayPoints === 0) {
            points += POINT_VALUES.first_habit_of_day;
            addNotification({
                type: 'success',
                title: 'Premier Check !',
                message: `+${POINT_VALUES.first_habit_of_day} points bonus`,
            });
        }

        addPoints(points, 'habit_complete');

        return points;
    };

    const onStreakAchieved = (streakDays) => {
        let bonusPoints = 0;

        if (streakDays === 7) {
            bonusPoints = POINT_VALUES.streak_bonus_7;
        } else if (streakDays === 30) {
            bonusPoints = POINT_VALUES.streak_bonus_30;
        } else if (streakDays === 100) {
            bonusPoints = POINT_VALUES.streak_bonus_100;
        }

        if (bonusPoints > 0) {
            addPoints(bonusPoints, `streak_${streakDays}`);
            addNotification({
                type: 'streak',
                title: `🔥 Série de ${streakDays} jours !`,
                message: `Bonus de ${bonusPoints} points`,
            });
        }
    };

    const onAllHabitsCompleted = () => {
        const points = POINT_VALUES.all_habits_day;
        addPoints(points, 'all_habits_complete');

        addNotification({
            type: 'achievement',
            title: '🎯 Journée Parfaite !',
            message: `Toutes les habitudes complétées ! +${points} points`,
        });
    };

    const generateDailyChallenges = () => {
        // Sélectionner 3 défis quotidiens aléatoires
        const dailyChallenges = [...CHALLENGES.daily]
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(c => ({ ...c, progress: 0, target: extractTarget(c.id) }));

        setActiveChallenges(dailyChallenges);
        localStorage.setItem('activeChallenges', JSON.stringify(dailyChallenges));
    };

    const extractTarget = (challengeId) => {
        const match = challengeId.match(/\d+/);
        return match ? parseInt(match[0]) : 1;
    };

    const checkChallengeProgress = (reason, points) => {
        const updated = activeChallenges.map(challenge => {
            let newProgress = challenge.progress;

            if (reason === 'habit_complete' && challenge.id.includes('complete')) {
                newProgress = Math.min(newProgress + 1, challenge.target);
            }

            // Vérifier si le défi est terminé
            if (newProgress >= challenge.target && !challenge.completed) {
                completeChallenge(challenge);
                return { ...challenge, progress: newProgress, completed: true };
            }

            return { ...challenge, progress: newProgress };
        });

        setActiveChallenges(updated);
        localStorage.setItem('activeChallenges', JSON.stringify(updated));
    };

    const completeChallenge = (challenge) => {
        addPoints(challenge.points, 'challenge_complete');

        const completed = {
            ...challenge,
            completedAt: new Date().toISOString()
        };

        setCompletedChallenges([...completedChallenges, completed]);

        addNotification({
            type: 'achievement',
            title: `${challenge.icon} Défi Terminé !`,
            message: `${challenge.name}: +${challenge.points} points`,
        });
    };

    const resetDailyChallenges = () => {
        const lastReset = localStorage.getItem('lastChallengeReset');
        const today = new Date().toDateString();

        if (lastReset !== today) {
            generateDailyChallenges();
            setTodayPoints(0);
            localStorage.setItem('lastChallengeReset', today);
        }
    };

    const getProgressToNextLevel = () => {
        const currentMin = userLevel.minPoints;
        const currentMax = userLevel.maxPoints;
        const progress = totalPoints - currentMin;
        const total = currentMax - currentMin;

        return {
            progress,
            total,
            percentage: (progress / total) * 100
        };
    };

    const getLeaderboardPosition = () => {
        // Cette fonction nécessiterait un backend pour comparer avec d'autres utilisateurs
        return null;
    };

    return (
        <GamificationContext.Provider value={{
            userLevel,
            totalPoints,
            todayPoints,
            activeChallenges,
            completedChallenges,
            achievements,
            levels: LEVELS,
            pointValues: POINT_VALUES,
            addPoints,
            onHabitComplete,
            onStreakAchieved,
            onAllHabitsCompleted,
            getProgressToNextLevel,
            generateDailyChallenges,
        }}>
            {children}
        </GamificationContext.Provider>
    );
};