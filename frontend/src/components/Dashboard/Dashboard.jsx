import { useState, useEffect } from 'react';
import { habitService } from '../../services/habitService';
import HabitCard from './HabitCard';
import './Dashboard.css';

const Dashboard = () => {
    const [habits, setHabits] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [habitsData, statsData] = await Promise.all([
                habitService.getAll(),
                habitService.getOverallStats()
            ]);

            setHabits(habitsData);
            setStats(statsData);
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleCheck = async (habitId, isChecked) => {
        try {
            await habitService.toggleCheck({
                habit_id: habitId,
                check_date: today,
                completed: !isChecked
            });

            loadData(); // Recharger les données
        } catch (error) {
            console.error('Error toggling check:', error);
        }
    };

    if (loading) return <div className="loading">Chargement...</div>;

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Mes habitudes</h1>
                <div className="stats-overview">
                    <div className="stat-card">
                        <span className="stat-number">{stats?.total_habits || 0}</span>
                        <span className="stat-label">Habitudes</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{stats?.total_checks || 0}</span>
                        <span className="stat-label">Jours complétés</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{stats?.total_badges || 0}</span>
                        <span className="stat-label">Badges</span>
                    </div>
                </div>
            </div>

            <div className="habits-grid">
                {habits.length === 0 ? (
                    <p className="no-habits">
                        Aucune habitude pour le moment. Créez votre première habitude !
                    </p>
                ) : (
                    habits.map(habit => (
                        <HabitCard
                            key={habit.id}
                            habit={habit}
                            onToggleCheck={handleToggleCheck}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default Dashboard;