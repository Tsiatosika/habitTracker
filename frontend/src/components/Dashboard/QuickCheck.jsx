import { useState, useEffect } from 'react';
import { habitService } from '../../services/habitService';
import './QuickCheck.css';

const QuickCheck = () => {
    const [habits, setHabits] = useState([]);
    const [todayChecks, setTodayChecks] = useState([]);
    const [loading, setLoading] = useState(true);

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [habitsData, checksData] = await Promise.all([
                habitService.getAll(),
                habitService.getTodayChecks()
            ]);

            setHabits(habitsData);
            setTodayChecks(checksData);
        } catch (error) {
            console.error('Error loading quick check data:', error);
        } finally {
            setLoading(false);
        }
    };

    const isHabitChecked = (habitId) => {
        return todayChecks.some(
            check => check.habit_id === habitId && check.completed
        );
    };

    const handleToggle = async (habitId) => {
        try {
            const isChecked = isHabitChecked(habitId);

            await habitService.toggleCheck({
                habit_id: habitId,
                check_date: today,
                completed: !isChecked
            });

            // Recharger les données
            loadData();
        } catch (error) {
            console.error('Error toggling check:', error);
        }
    };

    const completedToday = todayChecks.filter(c => c.completed).length;
    const totalHabits = habits.length;
    const progress = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;

    if (loading) return <div className="loading">Chargement...</div>;

    return (
        <div className="quick-check">
            <div className="quick-check-header">
                <h2>Quick Check - Aujourd'hui</h2>
                <div className="progress-info">
                    <span>{completedToday}/{totalHabits} habitudes complétées</span>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {habits.length === 0 ? (
                <p className="no-habits-message">
                    Aucune habitude. Créez votre première habitude pour commencer !
                </p>
            ) : (
                <div className="quick-check-list">
                    {habits.map(habit => {
                        const checked = isHabitChecked(habit.id);
                        return (
                            <div
                                key={habit.id}
                                className={`quick-check-item ${checked ? 'checked' : ''}`}
                                onClick={() => handleToggle(habit.id)}
                            >
                                <div className="habit-info">
                                    <span
                                        className="habit-color-indicator"
                                        style={{ backgroundColor: habit.color }}
                                    ></span>
                                    <span className="habit-icon">{habit.icon || '📌'}</span>
                                    <span className="habit-name">{habit.name}</span>
                                </div>
                                <div className={`check-box ${checked ? 'checked' : ''}`}>
                                    {checked && '✓'}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {progress === 100 && totalHabits > 0 && (
                <div className="celebration-message">
                    🎉 Bravo ! Toutes vos habitudes sont complétées aujourd'hui !
                </div>
            )}
        </div>
    );
};

export default QuickCheck;