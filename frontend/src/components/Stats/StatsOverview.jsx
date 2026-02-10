import { useState, useEffect } from 'react';
import { habitService } from '../../services/habitService';
import ProgressCharts from './ProgressCharts';
import './StatsOverview.css';

const StatsOverview = () => {
    const [stats, setStats] = useState(null);
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [statsData, habitsData] = await Promise.all([
                habitService.getOverallStats(),
                habitService.getAll()
            ]);

            setStats(statsData);
            setHabits(habitsData);
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Chargement...</div>;

    return (
        <div className="stats-overview-container">
            <h1>Statistiques</h1>

            <div className="overview-cards">
                <div className="overview-card">
                    <div className="card-icon">📝</div>
                    <div className="card-content">
                        <h3>Habitudes actives</h3>
                        <p className="card-value">{stats?.total_habits || 0}</p>
                    </div>
                </div>

                <div className="overview-card">
                    <div className="card-icon">✅</div>
                    <div className="card-content">
                        <h3>Total de checks</h3>
                        <p className="card-value">{stats?.total_checks || 0}</p>
                    </div>
                </div>

                <div className="overview-card">
                    <div className="card-icon">🏆</div>
                    <div className="card-content">
                        <h3>Badges gagnés</h3>
                        <p className="card-value">{stats?.total_badges || 0}</p>
                    </div>
                </div>

                <div className="overview-card">
                    <div className="card-icon">📈</div>
                    <div className="card-content">
                        <h3>Moyenne quotidienne</h3>
                        <p className="card-value">
                            {stats?.total_checks && stats?.total_habits
                                ? Math.round(stats.total_checks / 30)
                                : 0}
                        </p>
                    </div>
                </div>
            </div>

            {habits.length > 0 && (
                <ProgressCharts habits={habits} />
            )}

            <div className="habits-performance">
                <h2>Performance par habitude</h2>
                {habits.length === 0 ? (
                    <p className="no-data">Aucune habitude à afficher</p>
                ) : (
                    <div className="performance-list">
                        {habits.map(habit => (
                            <HabitPerformanceCard key={habit.id} habit={habit} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const HabitPerformanceCard = ({ habit }) => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        loadHabitStats();
    }, [habit.id]);

    const loadHabitStats = async () => {
        try {
            const data = await habitService.getStats(habit.id);
            setStats(data);
        } catch (error) {
            console.error('Error loading habit stats:', error);
        }
    };

    if (!stats) return null;

    return (
        <div className="performance-card" style={{ borderLeftColor: habit.color }}>
            <div className="performance-header">
                <div className="habit-info">
                    <span className="habit-icon">{habit.icon || '📌'}</span>
                    <span className="habit-name">{habit.name}</span>
                </div>
                <span className="completion-badge">{stats.completion_rate}%</span>
            </div>

            <div className="performance-stats">
                <div className="perf-stat">
                    <span className="perf-label">Série actuelle</span>
                    <span className="perf-value">🔥 {stats.current_streak}</span>
                </div>
                <div className="perf-stat">
                    <span className="perf-label">Meilleure série</span>
                    <span className="perf-value">🏆 {stats.best_streak}</span>
                </div>
                <div className="perf-stat">
                    <span className="perf-label">Jours complétés</span>
                    <span className="perf-value">✅ {stats.completed_checks}</span>
                </div>
            </div>

            <div className="progress-bar-container">
                <div
                    className="progress-bar-fill"
                    style={{
                        width: `${stats.completion_rate}%`,
                        backgroundColor: habit.color
                    }}
                ></div>
            </div>
        </div>
    );
};

export default StatsOverview;