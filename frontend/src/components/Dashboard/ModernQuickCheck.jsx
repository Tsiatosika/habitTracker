import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { habitService } from '../../services/habitService';
import { GamificationContext } from '../../context/GamificationContext';
import { NotificationContext } from '../../context/NotificationContext';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import './ModernQuickCheck.css';

const ModernQuickCheck = () => {
    const [habits, setHabits] = useState([]);
    const [todayChecks, setTodayChecks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, completed
    const [showConfetti, setShowConfetti] = useState(false);
    const [motivationalMessage, setMotivationalMessage] = useState('');
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [showTimeline, setShowTimeline] = useState(false);

    const { width, height } = useWindowSize();
    const today = new Date().toISOString().split('T')[0];

    const { onHabitComplete, todayPoints } = useContext(GamificationContext);
    const { showToast } = useContext(NotificationContext);

    useEffect(() => {
        loadData();
        loadSoundPreference();
    }, []);

    useEffect(() => {
        // Vérifier si tout est complété
        if (habits.length > 0 && completedCount === habits.length) {
            triggerCelebration();
        }
    }, [todayChecks, habits]);

    const loadData = async () => {
        try {
            const habitsData = await habitService.getAll();
            setHabits(habitsData);

            // Charger les checks pour chaque habitude
            const checksPromises = habitsData.map(h =>
                habitService.getChecks(h.id, today, today)
            );
            const checksResults = await Promise.all(checksPromises);

            const checks = habitsData.map((habit, index) => ({
                habit_id: habit.id,
                completed: checksResults[index].length > 0 && checksResults[index][0].completed
            }));

            setTodayChecks(checks);
        } catch (error) {
            console.error('Error loading quick check data:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadSoundPreference = () => {
        const pref = localStorage.getItem('soundEnabled');
        setSoundEnabled(pref !== 'false');
    };

    const isHabitChecked = (habitId) => {
        return todayChecks.find(c => c.habit_id === habitId)?.completed || false;
    };

    const handleToggle = async (habitId, habitName) => {
        const isChecked = isHabitChecked(habitId);

        try {
            await habitService.toggleCheck({
                habit_id: habitId,
                check_date: today,
                completed: !isChecked
            });

            // Mettre à jour l'état local
            setTodayChecks(prev => prev.map(c =>
                c.habit_id === habitId ? { ...c, completed: !c.completed } : c
            ));

            if (!isChecked) {
                // Habitude complétée
                const points = onHabitComplete(habitId);

                // Jouer un son
                if (soundEnabled) {
                    playCheckSound();
                }

                // Toast de notification
                showToast({
                    type: 'success',
                    title: habitName,
                    message: `+${points} points ! 🎉`
                });

                // Message motivationnel
                setMotivationalMessage(getMotivationalMessage());
                setTimeout(() => setMotivationalMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error toggling check:', error);
        }
    };

    const playCheckSound = () => {
        const audio = new Audio('/sounds/check.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => {
            // Ignore errors (pas de son disponible)
        });
    };

    const triggerCelebration = () => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);

        if (soundEnabled) {
            const audio = new Audio('/sounds/celebration.mp3');
            audio.volume = 0.5;
            audio.play().catch(() => {});
        }

        showToast({
            type: 'achievement',
            title: '🎉 Journée Parfaite !',
            message: 'Toutes tes habitudes sont complétées !'
        });
    };

    const getMotivationalMessage = () => {
        const messages = [
            "Super ! Continue comme ça ! 💪",
            "Excellent travail ! 🌟",
            "Tu es sur une belle lancée ! 🚀",
            "Bravo ! Un pas de plus vers tes objectifs ! 🎯",
            "Fantastique ! Tu progresses chaque jour ! 📈",
            "Incroyable ! Tu gères comme un pro ! 🏆",
            "Bien joué ! La régularité c'est la clé ! 🔑",
            "Tu déchires ! Garde cette énergie ! ⚡"
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    };

    const toggleSound = () => {
        const newValue = !soundEnabled;
        setSoundEnabled(newValue);
        localStorage.setItem('soundEnabled', newValue.toString());
    };

    // Filtrer les habitudes
    const filteredHabits = habits.filter(habit => {
        if (filter === 'pending') {
            return !isHabitChecked(habit.id);
        } else if (filter === 'completed') {
            return isHabitChecked(habit.id);
        }
        return true;
    });

    const completedCount = todayChecks.filter(c => c.completed).length;
    const totalHabits = habits.length;
    const progress = totalHabits > 0 ? (completedCount / totalHabits) * 100 : 0;
    const pendingCount = totalHabits - completedCount;

    if (loading) {
        return (
            <div className="loading-container-quick">
                <motion.div
                    className="loading-spinner-quick"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    ⚡
                </motion.div>
                <p>Chargement de tes habitudes...</p>
            </div>
        );
    }

    return (
        <div className="modern-quick-check">
            {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />}

            {/* Hero Section */}
            <motion.div
                className="quick-check-hero"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="hero-content-quick">
                    <div className="hero-header">
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            Quick Check ⚡
                        </motion.h1>
                        <div className="hero-badges">
                            <motion.div
                                className="points-badge"
                                whileHover={{ scale: 1.05 }}
                            >
                                <span className="points-icon">💎</span>
                                <span className="points-value">{todayPoints} pts</span>
                            </motion.div>
                            <motion.button
                                className={`sound-toggle ${soundEnabled ? 'active' : ''}`}
                                onClick={toggleSound}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {soundEnabled ? '🔊' : '🔇'}
                            </motion.button>
                            <motion.button
                                className="timeline-toggle"
                                onClick={() => setShowTimeline(!showTimeline)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                📅
                            </motion.button>
                        </div>
                    </div>

                    <motion.p
                        className="hero-subtitle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {progress === 100
                            ? "🎉 Incroyable ! Tu as tout complété aujourd'hui !"
                            : `Il te reste ${pendingCount} habitude${pendingCount > 1 ? 's' : ''} à cocher !`
                        }
                    </motion.p>

                    {/* Circular Progress */}
                    <div className="circular-progress">
                        <svg width="180" height="180" viewBox="0 0 180 180">
                            <circle
                                cx="90"
                                cy="90"
                                r="80"
                                fill="none"
                                stroke="rgba(255,255,255,0.2)"
                                strokeWidth="12"
                            />
                            <motion.circle
                                cx="90"
                                cy="90"
                                r="80"
                                fill="none"
                                stroke="url(#gradient-progress)"
                                strokeWidth="12"
                                strokeLinecap="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: progress / 100 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                style={{
                                    transform: "rotate(-90deg)",
                                    transformOrigin: "center",
                                    strokeDasharray: "502",
                                }}
                            />
                            <defs>
                                <linearGradient id="gradient-progress" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#667eea" />
                                    <stop offset="100%" stopColor="#764ba2" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="progress-center">
                            <motion.div
                                className="progress-percentage"
                                key={progress}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                            >
                                {Math.round(progress)}%
                            </motion.div>
                            <div className="progress-label">
                                {completedCount}/{totalHabits}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Smart Suggestions */}
                {pendingCount > 0 && (
                    <motion.div
                        className="smart-suggestion"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <span className="suggestion-icon">💡</span>
                        <span className="suggestion-text">
                            {getSuggestion(progress, pendingCount)}
                        </span>
                    </motion.div>
                )}

                {/* Motivational Message */}
                <AnimatePresence>
                    {motivationalMessage && (
                        <motion.div
                            className="motivational-toast"
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        >
                            {motivationalMessage}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Filters */}
            <motion.div
                className="filter-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <button
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    Toutes ({totalHabits})
                </button>
                <button
                    className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
                    onClick={() => setFilter('pending')}
                >
                    À faire ({pendingCount})
                </button>
                <button
                    className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
                    onClick={() => setFilter('completed')}
                >
                    Complétées ({completedCount})
                </button>
            </motion.div>

            {/* Habits List */}
            <div className="habits-list-container">
                {filteredHabits.length === 0 ? (
                    <motion.div
                        className="empty-state-quick"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div className="empty-icon">
                            {filter === 'completed' ? '🎉' : '📝'}
                        </div>
                        <h3>
                            {filter === 'completed'
                                ? 'Aucune habitude complétée'
                                : filter === 'pending'
                                ? 'Tout est fait ! 🎉'
                                : 'Aucune habitude'
                            }
                        </h3>
                        <p>
                            {filter === 'pending' && completedCount > 0
                                ? 'Bravo ! Tu as tout complété !'
                                : 'Crée ta première habitude pour commencer !'
                            }
                        </p>
                    </motion.div>
                ) : (
                    <Reorder.Group
                        axis="y"
                        values={filteredHabits}
                        onReorder={setHabits}
                        className="habits-reorder-list"
                    >
                        <AnimatePresence>
                            {filteredHabits.map((habit, index) => {
                                const isChecked = isHabitChecked(habit.id);

                                return (
                                    <Reorder.Item
                                        key={habit.id}
                                        value={habit}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <motion.div
                                            className={`modern-habit-item ${isChecked ? 'checked' : ''}`}
                                            whileHover={{ x: 4 }}
                                            onClick={() => handleToggle(habit.id, habit.name)}
                                        >
                                            <div className="habit-drag-handle">⋮⋮</div>

                                            <div
                                                className="habit-color-bar"
                                                style={{ background: habit.color }}
                                            />

                                            <div className="habit-icon-wrapper-quick">
                                                <span className="habit-icon-quick">{habit.icon || '📌'}</span>
                                            </div>

                                            <div className="habit-info-quick">
                                                <h4 className="habit-name-quick">{habit.name}</h4>
                                                {habit.description && (
                                                    <p className="habit-desc-quick">{habit.description}</p>
                                                )}
                                            </div>

                                            <motion.div
                                                className={`check-box-modern ${isChecked ? 'checked' : ''}`}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <motion.div
                                                    className="check-icon-modern"
                                                    initial={false}
                                                    animate={isChecked ? { scale: [0, 1.2, 1] } : { scale: 1 }}
                                                >
                                                    {isChecked && '✓'}
                                                </motion.div>
                                            </motion.div>

                                            {/* Ripple Effect */}
                                            {isChecked && (
                                                <motion.div
                                                    className="check-ripple-effect"
                                                    initial={{ scale: 0, opacity: 0.6 }}
                                                    animate={{ scale: 2, opacity: 0 }}
                                                    transition={{ duration: 0.6 }}
                                                />
                                            )}
                                        </motion.div>
                                    </Reorder.Item>
                                );
                            })}
                        </AnimatePresence>
                    </Reorder.Group>
                )}
            </div>

            {/* Timeline Widget */}
            <AnimatePresence>
                {showTimeline && (
                    <motion.div
                        className="timeline-widget"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <WeekTimeline habits={habits} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Composant Timeline de la semaine
const WeekTimeline = ({ habits }) => {
    const [weekData, setWeekData] = useState([]);

    useEffect(() => {
        loadWeekData();
    }, [habits]);

    const loadWeekData = async () => {
        const days = getLast7Days();
        const data = [];

        for (const date of days) {
            let completed = 0;
            for (const habit of habits) {
                const checks = await habitService.getChecks(habit.id, date, date);
                if (checks.length > 0 && checks[0].completed) {
                    completed++;
                }
            }
            data.push({ date, completed, total: habits.length });
        }

        setWeekData(data);
    };

    const getLast7Days = () => {
        const days = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            days.push(date.toISOString().split('T')[0]);
        }
        return days;
    };

    const getDayName = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', { weekday: 'short' });
    };

    return (
        <div className="week-timeline">
            <h3>Cette Semaine</h3>
            <div className="timeline-days">
                {weekData.map((day, index) => {
                    const percentage = day.total > 0 ? (day.completed / day.total) * 100 : 0;
                    const isToday = day.date === new Date().toISOString().split('T')[0];

                    return (
                        <motion.div
                            key={day.date}
                            className={`timeline-day ${isToday ? 'today' : ''}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <span className="day-name">{getDayName(day.date)}</span>
                            <div className="day-progress">
                                <motion.div
                                    className="day-progress-fill"
                                    initial={{ height: 0 }}
                                    animate={{ height: `${percentage}%` }}
                                    transition={{ delay: index * 0.05 + 0.2 }}
                                />
                            </div>
                            <span className="day-count">{day.completed}/{day.total}</span>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

// Fonction pour obtenir une suggestion intelligente
const getSuggestion = (progress, remaining) => {
    if (progress === 0) {
        return "C'est le moment de commencer ! 🚀";
    } else if (progress < 25) {
        return `${remaining} habitudes à valider. Tu peux le faire ! 💪`;
    } else if (progress < 50) {
        return "Bon début ! Continue sur ta lancée ! 🌟";
    } else if (progress < 75) {
        return `Plus que ${remaining} ! Tu y es presque ! 🎯`;
    } else {
        return `Dernière ligne droite ! ${remaining} restante${remaining > 1 ? 's' : ''} ! 🏁`;
    }
};

export default ModernQuickCheck;