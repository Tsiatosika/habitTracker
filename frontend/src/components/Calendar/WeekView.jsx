import { useState, useEffect } from 'react';
import { habitService } from '../../services/habitService';
import './WeekView.css';

const WeekView = ({ habit }) => {
    const [weekData, setWeekData] = useState([]);
    const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStart(new Date()));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadWeekData();
    }, [habit.id, currentWeekStart]);

    function getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Lundi comme premier jour
        return new Date(d.setDate(diff));
    }

    const loadWeekData = async () => {
        try {
            const weekStart = new Date(currentWeekStart);
            const weekEnd = new Date(currentWeekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);

            const checks = await habitService.getChecks(
                habit.id,
                weekStart.toISOString().split('T')[0],
                weekEnd.toISOString().split('T')[0]
            );

            // Créer un tableau pour les 7 jours
            const days = [];
            for (let i = 0; i < 7; i++) {
                const date = new Date(weekStart);
                date.setDate(date.getDate() + i);
                const dateStr = date.toISOString().split('T')[0];

                const check = checks.find(c => c.check_date === dateStr);

                days.push({
                    date: dateStr,
                    dayName: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
                    dayNumber: date.getDate(),
                    month: date.toLocaleDateString('fr-FR', { month: 'short' }),
                    isCompleted: check ? check.completed : false,
                    isToday: dateStr === new Date().toISOString().split('T')[0],
                    isFuture: date > new Date()
                });
            }

            setWeekData(days);
        } catch (error) {
            console.error('Error loading week data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleDay = async (dateStr) => {
        const day = weekData.find(d => d.date === dateStr);
        if (!day || day.isFuture) return;

        try {
            await habitService.toggleCheck({
                habit_id: habit.id,
                check_date: dateStr,
                completed: !day.isCompleted
            });

            loadWeekData();
        } catch (error) {
            console.error('Error toggling day:', error);
        }
    };

    const goToPreviousWeek = () => {
        const newDate = new Date(currentWeekStart);
        newDate.setDate(newDate.getDate() - 7);
        setCurrentWeekStart(newDate);
    };

    const goToNextWeek = () => {
        const newDate = new Date(currentWeekStart);
        newDate.setDate(newDate.getDate() + 7);
        setCurrentWeekStart(newDate);
    };

    const goToCurrentWeek = () => {
        setCurrentWeekStart(getWeekStart(new Date()));
    };

    if (loading) return <div className="loading">Chargement...</div>;

    const completedDays = weekData.filter(d => d.isCompleted).length;
    const completionRate = ((completedDays / 7) * 100).toFixed(0);

    return (
        <div className="week-view">
            <div className="week-header">
                <button className="btn-nav" onClick={goToPreviousWeek}>
                    ← Semaine précédente
                </button>
                <button className="btn-today" onClick={goToCurrentWeek}>
                    Aujourd'hui
                </button>
                <button className="btn-nav" onClick={goToNextWeek}>
                    Semaine suivante →
                </button>
            </div>

            <div className="week-stats">
                <div className="week-completion">
                    <span className="completion-number">{completedDays}/7</span>
                    <span className="completion-label">jours complétés</span>
                </div>
                <div className="week-progress-bar">
                    <div
                        className="week-progress-fill"
                        style={{
                            width: `${completionRate}%`,
                            backgroundColor: habit.color
                        }}
                    ></div>
                </div>
                <span className="completion-percentage">{completionRate}%</span>
            </div>

            <div className="week-grid">
                {weekData.map(day => (
                    <div
                        key={day.date}
                        className={`day-card ${day.isCompleted ? 'completed' : ''} ${day.isToday ? 'today' : ''} ${day.isFuture ? 'future' : ''}`}
                        onClick={() => handleToggleDay(day.date)}
                        style={{
                            borderColor: day.isCompleted ? habit.color : undefined
                        }}
                    >
                        <div className="day-header">
                            <span className="day-name">{day.dayName}</span>
                            <span className="day-number">{day.dayNumber}</span>
                        </div>
                        <div className="day-icon">
                            {day.isFuture ? (
                                <span className="future-icon">🔒</span>
                            ) : day.isCompleted ? (
                                <span className="check-icon">✓</span>
                            ) : (
                                <span className="empty-icon">○</span>
                            )}
                        </div>
                        {day.isToday && <div className="today-badge">Aujourd'hui</div>}
                    </div>
                ))}
            </div>

            <div className="week-footer">
                <p className="week-date-range">
                    {weekData[0]?.dayNumber} {weekData[0]?.month} - {weekData[6]?.dayNumber} {weekData[6]?.month}
                </p>
            </div>
        </div>
    );
};

export default WeekView;