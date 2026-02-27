import { useState, useEffect } from 'react';
import { habitService } from '../../services/habitService';
import Modal from '../common/Modal';
import './HabitDetailModal.css';

const HabitDetailModal = ({ isOpen, onClose, habitId }) => {
    const [habit, setHabit] = useState(null);
    const [stats, setStats] = useState(null);
    const [recentChecks, setRecentChecks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && habitId) {
            loadHabitData();
        }
    }, [isOpen, habitId]);

    const loadHabitData = async () => {
        setLoading(true);
        try {
            const [habitData, statsData] = await Promise.all([
                habitService.getById(habitId),
                habitService.getStats(habitId)
            ]);

            setHabit(habitData);
            setStats(statsData);

            // Charger les 7 derniers jours
            const today = new Date();
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 6);

            const checks = await habitService.getChecks(
                habitId,
                weekAgo.toISOString().split('T')[0],
                today.toISOString().split('T')[0]
            );

            // Créer un tableau des 7 derniers jours
            const last7Days = [];
            for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                const check = checks.find(c => c.check_date === dateStr);

                last7Days.push({
                    date: dateStr,
                    dayName: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
                    dayNumber: date.getDate(),
                    isCompleted: check ? check.completed : false,
                    isToday: i === 0
                });
            }

            setRecentChecks(last7Days);
        } catch (error) {
            console.error('Error loading habit details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleDay = async (dateStr) => {
        const day = recentChecks.find(d => d.date === dateStr);
        if (!day) return;

        try {
            await habitService.toggleCheck({
                habit_id: habitId,
                check_date: dateStr,
                completed: !day.isCompleted
            });

            loadHabitData();
        } catch (error) {
            console.error('Error toggling day:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Détails de l'habitude"
            size="large"
        >
            {loading ? (
                <div className="loading-state">Chargement...</div>
            ) : habit ? (
                <div className="habit-detail-modal-content">
                    {/* Header avec icône et info */}
                    <div className="habit-modal-header">
                        <div className="habit-icon-wrapper">
                            <span
                                className="habit-icon-large"
                                style={{ backgroundColor: `${habit.color}20` }}
                            >
                                {habit.icon || '📌'}
                            </span>
                        </div>
                        <div className="habit-info-section">
                            <h2 className="habit-name">{habit.name}</h2>
                            {habit.description && (
                                <p className="habit-description">{habit.description}</p>
                            )}
                            <div className="habit-meta-info">
                                <span className="meta-badge" style={{ borderColor: habit.color }}>
                                    {habit.frequency === 'daily' ? '📅 Quotidienne' : `📆 ${habit.target_days}x/semaine`}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    {stats && (
                        <div className="stats-grid-modal">
                            <div className="stat-item-modal">
                                <div className="stat-icon-modal">🔥</div>
                                <div className="stat-details">
                                    <div className="stat-number">{stats.current_streak}</div>
                                    <div className="stat-label">Série actuelle</div>
                                </div>
                            </div>
                            <div className="stat-item-modal">
                                <div className="stat-icon-modal">🏆</div>
                                <div className="stat-details">
                                    <div className="stat-number">{stats.best_streak}</div>
                                    <div className="stat-label">Meilleure série</div>
                                </div>
                            </div>
                            <div className="stat-item-modal">
                                <div className="stat-icon-modal">📊</div>
                                <div className="stat-details">
                                    <div className="stat-number">{stats.completion_rate}%</div>
                                    <div className="stat-label">Taux de réussite</div>
                                </div>
                            </div>
                            <div className="stat-item-modal">
                                <div className="stat-icon-modal">✅</div>
                                <div className="stat-details">
                                    <div className="stat-number">{stats.completed_checks}</div>
                                    <div className="stat-label">Jours complétés</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 7 derniers jours */}
                    <div className="recent-activity-section">
                        <h3 className="section-title">7 derniers jours</h3>
                        <div className="recent-days-grid">
                            {recentChecks.map(day => (
                                <div
                                    key={day.date}
                                    className={`day-item ${day.isCompleted ? 'completed' : ''} ${day.isToday ? 'today' : ''}`}
                                    onClick={() => handleToggleDay(day.date)}
                                    style={{
                                        borderColor: day.isCompleted ? habit.color : undefined,
                                        backgroundColor: day.isCompleted ? `${habit.color}15` : undefined
                                    }}
                                >
                                    <div className="day-name">{day.dayName}</div>
                                    <div className="day-number">{day.dayNumber}</div>
                                    <div className="day-status">
                                        {day.isCompleted ? (
                                            <span className="check-icon" style={{ color: habit.color }}>✓</span>
                                        ) : (
                                            <span className="uncheck-icon">○</span>
                                        )}
                                    </div>
                                    {day.isToday && <div className="today-indicator">Aujourd'hui</div>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="modal-actions">
                        <button
                            className="btn-view-full"
                            onClick={() => {
                                onClose();
                                window.location.href = `/habits/${habitId}`;
                            }}
                        >
                            📊 Voir tous les détails
                        </button>
                    </div>
                </div>
            ) : (
                <div className="error-state">Habitude non trouvée</div>
            )}
        </Modal>
    );
};

export default HabitDetailModal;