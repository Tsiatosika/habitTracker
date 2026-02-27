import { useState, useEffect } from 'react';
import { habitService } from '../../services/habitService';
import './MonthView.css';

const MonthView = ({ habit }) => {
    const [monthData, setMonthData] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMonthData();
    }, [habit.id, currentDate]);

    const loadMonthData = async () => {
        try {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();

            // Premier et dernier jour du mois
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);

            const checks = await habitService.getChecks(
                habit.id,
                firstDay.toISOString().split('T')[0],
                lastDay.toISOString().split('T')[0]
            );

            // Créer la grille du calendrier
            const daysInMonth = lastDay.getDate();
            const startDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Lundi = 0

            const days = [];

            // Ajouter les jours vides au début
            for (let i = 0; i < startDayOfWeek; i++) {
                days.push({ isEmpty: true });
            }

            // Ajouter tous les jours du mois
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, month, day);
                const dateStr = date.toISOString().split('T')[0];
                const check = checks.find(c => c.check_date === dateStr);
                const today = new Date().toISOString().split('T')[0];

                days.push({
                    date: dateStr,
                    dayNumber: day,
                    isCompleted: check ? check.completed : false,
                    isToday: dateStr === today,
                    isFuture: date > new Date()
                });
            }

            setMonthData(days);
        } catch (error) {
            console.error('Error loading month data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleDay = async (dateStr) => {
        const day = monthData.find(d => d.date === dateStr);
        if (!day || day.isFuture || day.isEmpty) return;

        try {
            await habitService.toggleCheck({
                habit_id: habit.id,
                check_date: dateStr,
                completed: !day.isCompleted
            });

            loadMonthData();
        } catch (error) {
            console.error('Error toggling day:', error);
        }
    };

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const goToCurrentMonth = () => {
        setCurrentDate(new Date());
    };

    if (loading) return <div className="loading">Chargement...</div>;

    const monthName = currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    const completedDays = monthData.filter(d => !d.isEmpty && d.isCompleted).length;
    const totalDays = monthData.filter(d => !d.isEmpty && !d.isFuture).length;
    const completionRate = totalDays > 0 ? ((completedDays / totalDays) * 100).toFixed(0) : 0;

    const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

    return (
        <div className="month-view">
            <div className="month-header">
                <button className="btn-nav" onClick={goToPreviousMonth}>
                    ← Mois précédent
                </button>
                <div className="month-title-section">
                    <h3 className="month-title">{monthName}</h3>
                    <button className="btn-today-small" onClick={goToCurrentMonth}>
                        Ce mois
                    </button>
                </div>
                <button className="btn-nav" onClick={goToNextMonth}>
                    Mois suivant →
                </button>
            </div>

            <div className="month-stats">
                <div className="month-completion">
                    <span className="completion-number">{completedDays}/{totalDays}</span>
                    <span className="completion-label">jours complétés</span>
                </div>
                <div className="month-progress-bar">
                    <div
                        className="month-progress-fill"
                        style={{
                            width: `${completionRate}%`,
                            backgroundColor: habit.color
                        }}
                    ></div>
                </div>
                <span className="completion-percentage">{completionRate}%</span>
            </div>

            <div className="calendar-grid">
                <div className="weekday-headers">
                    {weekDays.map(day => (
                        <div key={day} className="weekday-header">{day}</div>
                    ))}
                </div>

                <div className="days-grid">
                    {monthData.map((day, index) => (
                        <div
                            key={index}
                            className={`calendar-day ${day.isEmpty ? 'empty' : ''} ${day.isCompleted ? 'completed' : ''} ${day.isToday ? 'today' : ''} ${day.isFuture ? 'future' : ''}`}
                            onClick={() => !day.isEmpty && handleToggleDay(day.date)}
                            style={{
                                borderColor: day.isCompleted ? habit.color : undefined,
                                backgroundColor: day.isCompleted ? `${habit.color}15` : undefined
                            }}
                        >
                            {!day.isEmpty && (
                                <>
                                    <span className="day-number">{day.dayNumber}</span>
                                    {day.isCompleted && (
                                        <span className="check-mark" style={{ color: habit.color }}>✓</span>
                                    )}
                                    {day.isToday && <div className="today-dot"></div>}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MonthView;