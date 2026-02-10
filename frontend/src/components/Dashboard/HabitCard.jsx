import { useState, useEffect } from 'react';
import { habitService } from '../../services/habitService';
import './HabitCard.css';

const HabitCard = ({ habit, onToggleCheck }) => {
    const [isChecked, setIsChecked] = useState(false);
    const [stats, setStats] = useState(null);
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        loadCheckStatus();
        loadStats();
    }, [habit.id]);

    const loadCheckStatus = async () => {
        try {
            const checks = await habitService.getChecks(habit.id, today, today);
            setIsChecked(checks.length > 0 && checks[0].completed);
        } catch (error) {
            console.error('Error loading check status:', error);
        }
    };

    const loadStats = async () => {
        try {
            const habitStats = await habitService.getStats(habit.id);
            setStats(habitStats);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const handleCheck = () => {
        onToggleCheck(habit.id, isChecked);
        setIsChecked(!isChecked);
    };

    return (
        <div className="habit-card" style={{ borderLeft: `4px solid ${habit.color}` }}>
            <div className="habit-header">
                <div className="habit-info">
                    <span className="habit-icon">{habit.icon || '📌'}</span>
                    <h3>{habit.name}</h3>
                </div>
                <button
                    className={`check-button ${isChecked ? 'checked' : ''}`}
                    onClick={handleCheck}
                >
                    {isChecked ? '✓' : ''}
                </button>
            </div>

            {habit.description && (
                <p className="habit-description">{habit.description}</p>
            )}

            {stats && (
                <div className="habit-stats">
                    <div className="stat-item">
                        <span className="stat-icon">🔥</span>
                        <span>{stats.current_streak} jours</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-icon">📊</span>
                        <span>{stats.completion_rate}%</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HabitCard;