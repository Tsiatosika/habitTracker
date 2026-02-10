import { useState, useEffect } from 'react';
import { habitService } from '../../services/habitService';
import './MonthView.css';

const MonthView = ({ habit }) => {
    const [monthChecks, setMonthChecks] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMonthData();
    }, [habit.id, currentMonth]);

    const loadMonthData = async () => {
        try {
            const year = currentMonth.getFullYear();
            const month = currentMonth.getMonth();

            const startDate = new Date(year, month, 1).toISOString().split('T')[0];
            const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

            const checks = await habitService.getChecks(habit.id, startDate, endDate);
            setMonthChecks(checks);
        } catch (error) {
            console.error('Error loading month data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getDaysInMonth = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const days = [];
        const startDayOfWeek = firstDay.getDay();

        // Ajouter les jours vides au début
        for (let i = 0; i < startDayOfWeek; i++) {
            days.push(null);
        }

        // Ajouter tous les jours du mois
        for (let day = 1; day <= lastDay.getDate(); day++) {
            days.push(new Date(year, month, day));
        }

        return days;
    };

    const isChecked = (date) => {
        if (!date) return false;
        const dateStr = date.toISOString().split('T')[0];
        return monthChecks.some(
            check => check.check_date === dateStr && check.completed
        );
    };

    const isToday = (date) => {
        if (!date) return false;
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const previousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const goToToday = () => {
        setCurrentMonth(new Date());
    };

    if (loading) return <div className="loading">Chargement...</div>;

    const days = getDaysInMonth();
    const monthName = currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

    return (
        <div className="month-view">
            <div className="month-header">
                <button onClick={previousMonth} className="nav-btn">←</button>
                <div className="month-title">
                    <h3>{monthName}</h3>
                    <button onClick={goToToday} className="today-btn">Aujourd'hui</button>
                </div>
                <button onClick={nextMonth} className="nav-btn">→</button>
            </div>

            <div className="calendar-grid">
                {weekDays.map(day => (
                    <div key={day} className="calendar-weekday">
                        {day}
                    </div>
                ))}

                {days.map((date, index) => (
                    <div
                        key={index}
                        className={`calendar-day ${!date ? 'empty' : ''} ${isChecked(date) ? 'checked' : ''} ${isToday(date) ? 'today' : ''}`}
                    >
                        {date && (
                            <>
                                <span className="day-number">{date.getDate()}</span>
                                {isChecked(date) && <span className="check-icon">✓</span>}
                            </>
                        )}
                    </div>
                ))}
            </div>

            <div className="month-stats">
                <div className="stat">
                    <span className="stat-label">Jours complétés</span>
                    <span className="stat-value">
                        {monthChecks.filter(c => c.completed).length}
                    </span>
                </div>
                <div className="stat">
                    <span className="stat-label">Taux de réussite</span>
                    <span className="stat-value">
                        {monthChecks.length > 0
                            ? Math.round((monthChecks.filter(c => c.completed).length / days.filter(d => d).length) * 100)
                            : 0}%
                    </span>
                </div>
            </div>
        </div>
    );
};

export default MonthView;