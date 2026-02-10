import { useState, useEffect } from 'react';
import { habitService } from '../../services/habitService';
import './WeekView.css';

const WeekView = ({ habit }) => {
    const [weekChecks, setWeekChecks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadWeekData();
    }, [habit.id]);

    const loadWeekData = async () => {
        try {
            const today = new Date();
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - 6);

            const checks = await habitService.getChecks(
                habit.id,
                startOfWeek.toISOString().split('T')[0],
                today.toISOString().split('T')[0]
            );

            setWeekChecks(checks);
        } catch (error) {
            console.error('Error loading week data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getLast7Days = () => {
        const days = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            days.push(date);
        }
        
        return days;
    };

    const isChecked = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        return weekChecks.some(
            check => check.check_date === dateStr && check.completed
        );
    };

    if (loading) return <div>Chargement...</div>;

    const days = getLast7Days();
    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

    return (
        <div className="week-view">
            <h3>Cette semaine</h3>
            <div className="week-grid">
                {days.map((date, index) => (
                    <div
                        key={index}
                        className={`day-cell ${isChecked(date) ? 'checked' : ''}`}
                    >
                        <span className="day-name">{dayNames[date.getDay()]}</span>
                        <span className="day-number">{date.getDate()}</span>
                        {isChecked(date) && <span className="check-mark">✓</span>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeekView;