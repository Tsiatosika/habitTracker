import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { habitService } from '../../services/habitService';
import { GamificationContext } from '../../context/GamificationContext';
import { ThemeContext } from '../../context/ThemeContext';
import './Statistics.css';

const Statistics = () => {
    const [habits, setHabits] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('30days'); // 7days, 30days, 90days, year
    const [chartData, setChartData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);

    const { userLevel, totalPoints } = useContext(GamificationContext);
    const { mode } = useContext(ThemeContext);

    const dark = mode === 'dark';
    const gridColor   = dark ? '#334155' : '#e0e0e0';
    const axisColor   = dark ? '#94a3b8' : '#666';
    const tooltipStyle = dark
        ? { background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }
        : { background: 'white',   border: '1px solid #e0e0e0', borderRadius: '8px' };

    useEffect(() => {
        loadData();
    }, [timeRange]);

    const loadData = async () => {
        try {
            const [habitsData, statsData] = await Promise.all([
                habitService.getAll(),
                habitService.getOverallStats()
            ]);

            setHabits(habitsData);
            setStats(statsData);

            // Générer les données pour les graphiques
            await generateChartData(habitsData);
            generateCategoryData(habitsData);
        } catch (error) {
            console.error('Error loading statistics:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateChartData = async (habitsData) => {
        const days = getDaysArray(timeRange);
        const data = [];

        for (const date of days) {
            let completed = 0;
            for (const habit of habitsData) {
                const checks = await habitService.getChecks(habit.id, date, date);
                if (checks.length > 0 && checks[0].completed) {
                    completed++;
                }
            }

            data.push({
                date: formatDate(date),
                completed,
                total: habitsData.length,
                percentage: habitsData.length > 0 ? Math.round((completed / habitsData.length) * 100) : 0
            });
        }

        setChartData(data);
    };

    const generateCategoryData = (habitsData) => {
        // Simuler des catégories basées sur les icônes
        const categories = {};

        habitsData.forEach(habit => {
            const category = getCategoryFromIcon(habit.icon);
            categories[category] = (categories[category] || 0) + 1;
        });

        const data = Object.keys(categories).map(key => ({
            name: key,
            value: categories[key],
            color: getCategoryColor(key)
        }));

        setCategoryData(data);
    };

    const getCategoryFromIcon = (icon) => {
        const categoryMap = {
            '💪': 'Sport',
            '🏃': 'Sport',
            '🧘': 'Bien-être',
            '😴': 'Bien-être',
            '📚': 'Apprentissage',
            '✍️': 'Apprentissage',
            '🎨': 'Créativité',
            '🎵': 'Créativité',
            '🍎': 'Santé',
            '💧': 'Santé',
            '💼': 'Travail',
            '🎯': 'Objectifs'
        };
        return categoryMap[icon] || 'Autre';
    };

    const getCategoryColor = (category) => {
        const colorMap = {
            'Sport': '#ef4444',
            'Bien-être': '#10b981',
            'Apprentissage': '#3b82f6',
            'Créativité': '#a855f7',
            'Santé': '#f59e0b',
            'Travail': '#6366f1',
            'Objectifs': '#ec4899',
            'Autre': '#8b5cf6'
        };
        return colorMap[category] || '#94a3b8';
    };

    const getDaysArray = (range) => {
        const days = [];
        const today = new Date();
        let count;

        switch(range) {
            case '7days': count = 7; break;
            case '30days': count = 30; break;
            case '90days': count = 90; break;
            case 'year': count = 365; break;
            default: count = 30;
        }

        for (let i = count - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            days.push(date.toISOString().split('T')[0]);
        }

        return days;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (timeRange === 'year') {
            return date.toLocaleDateString('fr-FR', { month: 'short' });
        }
        return `${date.getDate()}/${date.getMonth() + 1}`;
    };

    const calculateStreakStats = () => {
        // Calculer la plus longue série, série actuelle, etc.
        let longestStreak = 0;
        let currentStreak = 0;

        habits.forEach(async (habit) => {
            const stats = await habitService.getStats(habit.id);
            if (stats.best_streak > longestStreak) longestStreak = stats.best_streak;
            if (stats.current_streak > currentStreak) currentStreak = stats.current_streak;
        });

        return { longestStreak, currentStreak };
    };

    if (loading) {
        return (
            <div className="loading-container-stats">
                <motion.div
                    className="loading-spinner-stats"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    📊
                </motion.div>
                <p>Chargement de vos statistiques...</p>
            </div>
        );
    }

    return (
        <div className="statistics-page">
            {/* Hero Section */}
            <motion.div
                className="stats-hero"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="stats-hero-content">
                    <h1>📊 Mes Statistiques</h1>
                    <p>Analysez vos progrès et suivez votre évolution</p>
                </div>

                <div className="stats-hero-badge">
                    <div className="level-display">
                        <span className="level-icon">{userLevel.icon}</span>
                        <div className="level-info">
                            <span className="level-name">{userLevel.name}</span>
                            <span className="level-points">{totalPoints} points</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Time Range Selector */}
            <motion.div
                className="time-range-selector"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <button
                    className={`range-btn ${timeRange === '7days' ? 'active' : ''}`}
                    onClick={() => setTimeRange('7days')}
                >
                    7 jours
                </button>
                <button
                    className={`range-btn ${timeRange === '30days' ? 'active' : ''}`}
                    onClick={() => setTimeRange('30days')}
                >
                    30 jours
                </button>
                <button
                    className={`range-btn ${timeRange === '90days' ? 'active' : ''}`}
                    onClick={() => setTimeRange('90days')}
                >
                    90 jours
                </button>
                <button
                    className={`range-btn ${timeRange === 'year' ? 'active' : ''}`}
                    onClick={() => setTimeRange('year')}
                >
                    1 an
                </button>
            </motion.div>

            {/* Quick Stats Grid */}
            <motion.div
                className="quick-stats-grid-stats"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <div className="stat-card-stats">
                    <div className="stat-icon-stats">📝</div>
                    <div className="stat-content-stats">
                        <div className="stat-value-stats">{stats?.total_habits || 0}</div>
                        <div className="stat-label-stats">Habitudes Actives</div>
                    </div>
                </div>

                <div className="stat-card-stats">
                    <div className="stat-icon-stats">✅</div>
                    <div className="stat-content-stats">
                        <div className="stat-value-stats">{stats?.total_checks || 0}</div>
                        <div className="stat-label-stats">Jours Complétés</div>
                    </div>
                </div>

                <div className="stat-card-stats">
                    <div className="stat-icon-stats">🔥</div>
                    <div className="stat-content-stats">
                        <div className="stat-value-stats">{calculateStreakStats().currentStreak}</div>
                        <div className="stat-label-stats">Série Actuelle</div>
                    </div>
                </div>

                <div className="stat-card-stats">
                    <div className="stat-icon-stats">🏆</div>
                    <div className="stat-content-stats">
                        <div className="stat-value-stats">{calculateStreakStats().longestStreak}</div>
                        <div className="stat-label-stats">Meilleure Série</div>
                    </div>
                </div>
            </motion.div>

            {/* Charts Section */}
            <div className="charts-section">
                {/* Line Chart */}
                <motion.div
                    className="chart-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h3>📈 Progression dans le temps</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis dataKey="date" style={{ fontSize: '12px' }} stroke={axisColor} tick={{ fill: axisColor }} />
                            <YAxis style={{ fontSize: '12px' }} stroke={axisColor} tick={{ fill: axisColor }} />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="completed"
                                stroke="#667eea"
                                strokeWidth={3}
                                name="Habitudes complétées"
                                dot={{ fill: '#667eea', r: 5 }}
                                activeDot={{ r: 7 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Bar Chart */}
                <motion.div
                    className="chart-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <h3>📊 Taux de complétion</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis dataKey="date" style={{ fontSize: '12px' }} stroke={axisColor} tick={{ fill: axisColor }} />
                            <YAxis style={{ fontSize: '12px' }} stroke={axisColor} tick={{ fill: axisColor }} />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Legend />
                            <Bar dataKey="percentage" fill="#10b981" name="Taux de complétion (%)" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Pie Chart */}
                {categoryData.length > 0 && (
                    <motion.div
                        className="chart-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <h3>🎯 Répartition par catégorie</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={tooltipStyle} />
                            </PieChart>
                        </ResponsiveContainer>
                    </motion.div>
                )}
            </div>

            {/* Habits Performance */}
            <motion.div
                className="habits-performance-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
            >
                <h2>🏅 Performance par Habitude</h2>
                <div className="habits-performance-grid">
                    {habits.map((habit, index) => (
                        <HabitPerformanceCard key={habit.id} habit={habit} index={index} />
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

// Composant pour afficher la performance d'une habitude
const HabitPerformanceCard = ({ habit, index }) => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        loadStats();
    }, [habit.id]);

    const loadStats = async () => {
        try {
            const data = await habitService.getStats(habit.id);
            setStats(data);
        } catch (error) {
            console.error('Error loading habit stats:', error);
        }
    };

    if (!stats) return null;

    return (
        <motion.div
            className="habit-performance-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            style={{ borderLeftColor: habit.color }}
        >
            <div className="habit-perf-header">
                <div className="habit-perf-icon-wrapper" style={{ background: habit.color }}>
                    <span className="habit-perf-icon">{habit.icon || '📌'}</span>
                </div>
                <div className="habit-perf-info">
                    <h4>{habit.name}</h4>
                    <span className="habit-perf-rate">{stats.completion_rate}% de réussite</span>
                </div>
            </div>

            <div className="habit-perf-stats">
                <div className="perf-stat-item">
                    <span className="perf-icon">🔥</span>
                    <div>
                        <div className="perf-value">{stats.current_streak}</div>
                        <div className="perf-label">Série actuelle</div>
                    </div>
                </div>
                <div className="perf-stat-item">
                    <span className="perf-icon">🏆</span>
                    <div>
                        <div className="perf-value">{stats.best_streak}</div>
                        <div className="perf-label">Record</div>
                    </div>
                </div>
                <div className="perf-stat-item">
                    <span className="perf-icon">✅</span>
                    <div>
                        <div className="perf-value">{stats.completed_checks}</div>
                        <div className="perf-label">Jours</div>
                    </div>
                </div>
            </div>

            <div className="habit-perf-progress">
                <div
                    className="habit-perf-progress-bar"
                    style={{
                        width: `${stats.completion_rate}%`,
                        background: habit.color
                    }}
                />
            </div>
        </motion.div>
    );
};

export default Statistics;