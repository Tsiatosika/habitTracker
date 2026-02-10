import { useState, useEffect } from 'react';
import { habitService } from '../../services/habitService';
import './Heatmap.css';

const Heatmap = ({ habit }) => {
    const [yearChecks, setYearChecks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadYearData();
    }, [habit.id]);

    const loadYearData = async () => {
        try {
            const today = new Date();
            const oneYearAgo = new Date(today);
            oneYearAgo.setFullYear(today.getFullYear() - 1);

            const checks = await habitService.getChecks(
                habit.id,
                oneYearAgo.toISOString().split('T')[0],
                today.toISOString().split('T')[0]
            );

            setYearChecks(checks);
        } catch (error) {
            console.error('Error loading year data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getLast365Days = () => {
        const days = [];
        const today = new Date();

        for (let i = 364; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            days.push(date);
        }

        return days;
    };

    const getCheckCount = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        const check = yearChecks.find(c => c.check_date === dateStr);
        return check && check.completed ? 1 : 0;
    };

    const getIntensityClass = (count) => {
        if (count === 0) return 'intensity-0';
        return 'intensity-4'; // Pour une habitude binaire (fait ou pas fait)
    };

    const groupByWeeks = (days) => {
        const weeks = [];
        let currentWeek = [];

        days.forEach((day, index) => {
            currentWeek.push(day);

            if (day.getDay() === 6 || index === days.length - 1) {
                weeks.push([...currentWeek]);
                currentWeek = [];
            }
        });

        return weeks;
    };

    if (loading) return <div className="loading">Chargement...</div>;

    const days = getLast365Days();
    const weeks = groupByWeeks(days);
    const monthLabels = [];

    // Générer les labels de mois
    for (let i = 0; i < 12; i++) {
        const date = new Date();
        date.setMonth(date.getMonth() - (11 - i));
        monthLabels.push(date.toLocaleDateString('fr-FR', { month: 'short' }));
    }

    const totalChecks = yearChecks.filter(c => c.completed).length;
    const currentStreak = calculateCurrentStreak(yearChecks);

    return (
        <div className="heatmap-container">
            <div className="heatmap-header">
                <h3>Activité de l'année</h3>
                <div className="heatmap-stats">
                    <span>{totalChecks} jours complétés</span>
                    <span>🔥 {currentStreak} jours de suite</span>
                </div>
            </div>

            <div className="heatmap-months">
                {monthLabels.map((month, i) => (
                    <span key={i} className="month-label">{month}</span>
                ))}
            </div>

            <div className="heatmap-grid">
                <div className="weekday-labels">
                    <span>Lun</span>
                    <span>Mer</span>
                    <span>Ven</span>
                </div>

                <div className="heatmap-weeks">
                    {weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="heatmap-week">
                            {week.map((day, dayIndex) => {
                                const count = getCheckCount(day);
                                return (
                                    <div
                                        key={dayIndex}
                                        className={`heatmap-day ${getIntensityClass(count)}`}
                                        title={`${day.toLocaleDateString('fr-FR')} - ${count > 0 ? 'Complété' : 'Non complété'}`}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            <div className="heatmap-legend">
                <span>Moins</span>
                <div className="legend-boxes">
                    <div className="legend-box intensity-0"></div>
                    <div className="legend-box intensity-1"></div>
                    <div className="legend-box intensity-2"></div>
                    <div className="legend-box intensity-3"></div>
                    <div className="legend-box intensity-4"></div>
                </div>
                <span>Plus</span>
            </div>
        </div>
    );
};

// Helper function pour calculer le streak actuel
const calculateCurrentStreak = (checks) => {
    if (checks.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sortedChecks = checks
        .filter(c => c.completed)
        .sort((a, b) => new Date(b.check_date) - new Date(a.check_date));

    if (sortedChecks.length === 0) return 0;

    const lastCheckDate = new Date(sortedChecks[0].check_date);
    lastCheckDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((today - lastCheckDate) / (1000 * 60 * 60 * 24));
    if (diffDays > 1) return 0;

    let streak = 0;
    let expectedDate = new Date(lastCheckDate);

    for (const check of sortedChecks) {
        const checkDate = new Date(check.check_date);
        checkDate.setHours(0, 0, 0, 0);

        if (checkDate.getTime() === expectedDate.getTime()) {
            streak++;
            expectedDate.setDate(expectedDate.getDate() - 1);
        } else {
            break;
        }
    }

    return streak;
};

export default Heatmap;