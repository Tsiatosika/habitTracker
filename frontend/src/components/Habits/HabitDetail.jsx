import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { habitService } from '../../services/habitService';
import WeekView from '../Calendar/WeekView';
import MonthView from '../Calendar/MonthView';
import Heatmap from '../Calendar/Heatmap';
import './HabitDetail.css';

const HabitDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [habit, setHabit] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeView, setActiveView] = useState('week'); // week, month, year

    useEffect(() => {
        loadHabitData();
    }, [id]);

    const loadHabitData = async () => {
        try {
            const [habitData, statsData] = await Promise.all([
                habitService.getById(id),
                habitService.getStats(id)
            ]);

            setHabit(habitData);
            setStats(statsData);
        } catch (error) {
            console.error('Error loading habit details:', error);
            navigate('/habits');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Chargement...</div>;
    if (!habit) return <div>Habitude non trouvée</div>;

    return (
        <div className="habit-detail-container">
            <button className="btn-back" onClick={() => navigate('/habits')}>
                ← Retour aux habitudes
            </button>

            <div className="habit-detail-header">
                <div className="habit-header-info">
                    <span className="habit-icon-xl">{habit.icon || '📌'}</span>
                    <div>
                        <h1>{habit.name}</h1>
                        {habit.description && (
                            <p className="habit-desc">{habit.description}</p>
                        )}
                    </div>
                </div>
                <div
                    className="habit-color-badge"
                    style={{ backgroundColor: habit.color }}
                ></div>
            </div>

            {stats && (
                <div className="stats-cards">
                    <div className="stat-card">
                        <div className="stat-icon">🔥</div>
                        <div className="stat-content">
                            <span className="stat-value">{stats.current_streak}</span>
                            <span className="stat-label">Série actuelle</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🏆</div>
                        <div className="stat-content">
                            <span className="stat-value">{stats.best_streak}</span>
                            <span className="stat-label">Meilleure série</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">📊</div>
                        <div className="stat-content">
                            <span className="stat-value">{stats.completion_rate}%</span>
                            <span className="stat-label">Taux de réussite</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">✅</div>
                        <div className="stat-content">
                            <span className="stat-value">{stats.completed_checks}</span>
                            <span className="stat-label">Jours complétés</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="view-selector">
                <button
                    className={activeView === 'week' ? 'active' : ''}
                    onClick={() => setActiveView('week')}
                >
                    Semaine
                </button>
                <button
                    className={activeView === 'month' ? 'active' : ''}
                    onClick={() => setActiveView('month')}
                >
                    Mois
                </button>
                <button
                    className={activeView === 'year' ? 'active' : ''}
                    onClick={() => setActiveView('year')}
                >
                    Année
                </button>
            </div>

            <div className="calendar-container">
                {activeView === 'week' && <WeekView habit={habit} />}
                {activeView === 'month' && <MonthView habit={habit} />}
                {activeView === 'year' && <Heatmap habit={habit} />}
            </div>
        </div>
    );
};

export default HabitDetail;