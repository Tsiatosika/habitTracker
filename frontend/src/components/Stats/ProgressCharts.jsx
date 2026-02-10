import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { habitService } from '../../services/habitService';
import './ProgressCharts.css';

const ProgressCharts = ({ habits }) => {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadChartData();
    }, [habits]);

    const loadChartData = async () => {
        try {
            // Récupérer les données des 30 derniers jours
            const last30Days = getLast30Days();
            const data = [];

            for (const date of last30Days) {
                const dayData = {
                    date: formatDate(date),
                    total: 0
                };

                // Pour chaque habitude, vérifier si elle a été complétée ce jour
                for (const habit of habits) {
                    const checks = await habitService.getChecks(habit.id, date, date);
                    const completed = checks.some(c => c.completed);
                    if (completed) {
                        dayData.total += 1;
                    }
                }

                data.push(dayData);
            }

            setChartData(data);
        } catch (error) {
            console.error('Error loading chart data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getLast30Days = () => {
        const days = [];
        const today = new Date();

        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            days.push(date.toISOString().split('T')[0]);
        }

        return days;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate()}/${date.getMonth() + 1}`;
    };

    if (loading) return <div className="loading">Chargement des graphiques...</div>;

    return (
        <div className="progress-charts">
            <h2>Progression des 30 derniers jours</h2>

            <div className="chart-container">
                <h3>Habitudes complétées par jour</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                            style={{ fontSize: '12px' }}
                        />
                        <YAxis style={{ fontSize: '12px' }} />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="total"
                            stroke="#667eea"
                            strokeWidth={2}
                            name="Habitudes complétées"
                            dot={{ fill: '#667eea', r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="chart-container">
                <h3>Vue en barres</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                            style={{ fontSize: '12px' }}
                        />
                        <YAxis style={{ fontSize: '12px' }} />
                        <Tooltip />
                        <Legend />
                        <Bar
                            dataKey="total"
                            fill="#667eea"
                            name="Habitudes complétées"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ProgressCharts;