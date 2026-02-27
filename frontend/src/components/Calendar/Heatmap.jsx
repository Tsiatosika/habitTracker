import { useState, useEffect } from 'react';
import { habitService } from '../../services/habitService';
import './Heatmap.css';

const Heatmap = ({ habit }) => {
    const [heatmapData, setHeatmapData] = useState([]);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(true);
    const [hoveredDay, setHoveredDay] = useState(null);

    useEffect(() => {
        loadYearData();
    }, [habit.id, currentYear]);

    const loadYearData = async () => {
        try {
            const startDate = new Date(currentYear, 0, 1);
            const endDate = new Date(currentYear, 11, 31);

            const checks = await habitService.getChecks(
                habit.id,
                startDate.toISOString().split('T')[0],
                endDate.toISOString().split('T')[0]
            );

            // Créer un tableau pour tous les jours de l'année
            const days = [];
            const today = new Date();

            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                const dateStr = d.toISOString().split('T')[0];
                const check = checks.find(c => c.check_date === dateStr);

                days.push({
                    date: dateStr,
                    dayOfWeek: d.getDay(),
                    month: d.getMonth(),
                    dayNumber: d.getDate(),
                    isCompleted: check ? check.completed : false,
                    isToday: dateStr === today.toISOString().split('T')[0],
                    isFuture: d > today
                });
            }

            // Organiser par semaines
            const weeks = [];
            let currentWeek = [];

            // Ajouter des jours vides au début si nécessaire
            const firstDayOfWeek = days[0].dayOfWeek;
            for (let i = 0; i < (firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1); i++) {
                currentWeek.push({ isEmpty: true });
            }

            days.forEach(day => {
                currentWeek.push(day);
                if (currentWeek.length === 7) {
                    weeks.push(currentWeek);
                    currentWeek = [];
                }
            });

            // Ajouter la dernière semaine si elle n'est pas complète
            if (currentWeek.length > 0) {
                while (currentWeek.length < 7) {
                    currentWeek.push({ isEmpty: true });
                }
                weeks.push(currentWeek);
            }

            setHeatmapData(weeks);
        } catch (error) {
            console.error('Error loading year data:', error);
        } finally {
            setLoading(false);
        }
    };

    const goToPreviousYear = () => {
        setCurrentYear(currentYear - 1);
    };

    const goToNextYear = () => {
        setCurrentYear(currentYear + 1);
    };

    const goToCurrentYear = () => {
        setCurrentYear(new Date().getFullYear());
    };

    if (loading) return <div className="loading">Chargement...</div>;

    const completedDays = heatmapData.flat().filter(d => !d.isEmpty && d.isCompleted).length;
    const totalDays = heatmapData.flat().filter(d => !d.isEmpty && !d.isFuture).length;
    const completionRate = totalDays > 0 ? ((completedDays / totalDays) * 100).toFixed(0) : 0;

    const currentStreak = calculateCurrentStreak(heatmapData.flat().filter(d => !d.isEmpty));
    const longestStreak = calculateLongestStreak(heatmapData.flat().filter(d => !d.isEmpty));

    const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

    return (
        <div className="heatmap-view">
            <div className="heatmap-header">
                <button className="btn-nav" onClick={goToPreviousYear}>
                    ← {currentYear - 1}
                </button>
                <div className="year-title-section">
                    <h3 className="year-title">{currentYear}</h3>
                    <button className="btn-today-small" onClick={goToCurrentYear}>
                        Cette année
                    </button>
                </div>
                <button className="btn-nav" onClick={goToNextYear}>
                    {currentYear + 1} →
                </button>
            </div>

            <div className="heatmap-stats-grid">
                <div className="heatmap-stat-card">
                    <span className="stat-value">{completedDays}</span>
                    <span className="stat-label">Jours complétés</span>
                </div>
                <div className="heatmap-stat-card">
                    <span className="stat-value">{completionRate}%</span>
                    <span className="stat-label">Taux de réussite</span>
                </div>
                <div className="heatmap-stat-card">
                    <span className="stat-value">{currentStreak}</span>
                    <span className="stat-label">Série actuelle</span>
                </div>
                <div className="heatmap-stat-card">
                    <span className="stat-value">{longestStreak}</span>
                    <span className="stat-label">Meilleure série</span>
                </div>
            </div>

            <div className="heatmap-container">
                <div className="heatmap-months">
                    {months.map((month, index) => (
                        <div key={index} className="month-label">{month}</div>
                    ))}
                </div>

                <div className="heatmap-grid-wrapper">
                    <div className="heatmap-weekdays">
                        {weekDays.map((day, index) => (
                            <div key={index} className="weekday-label">{day}</div>
                        ))}
                    </div>

                    <div className="heatmap-grid">
                        {heatmapData.map((week, weekIndex) => (
                            <div key={weekIndex} className="heatmap-week">
                                {week.map((day, dayIndex) => (
                                    <div
                                        key={dayIndex}
                                        className={`heatmap-day ${day.isEmpty ? 'empty' : ''} ${day.isCompleted ? 'completed' : ''} ${day.isToday ? 'today' : ''} ${day.isFuture ? 'future' : ''}`}
                                        style={{
                                            backgroundColor: day.isCompleted ? habit.color : undefined,
                                            opacity: day.isCompleted ? 1 : undefined
                                        }}
                                        onMouseEnter={() => !day.isEmpty && setHoveredDay(day)}
                                        onMouseLeave={() => setHoveredDay(null)}
                                        title={day.isEmpty ? '' : `${day.date} - ${day.isCompleted ? 'Complété' : 'Non complété'}`}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {hoveredDay && (
                    <div className="heatmap-tooltip">
                        <div className="tooltip-date">
                            {new Date(hoveredDay.date).toLocaleDateString('fr-FR', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>
                        <div className="tooltip-status">
                            {hoveredDay.isCompleted ? '✓ Complété' : '○ Non complété'}
                        </div>
                    </div>
                )}

                <div className="heatmap-legend">
                    <span className="legend-label">Moins</span>
                    <div className="legend-squares">
                        <div className="legend-square empty"></div>
                        <div className="legend-square" style={{ backgroundColor: habit.color, opacity: 0.3 }}></div>
                        <div className="legend-square" style={{ backgroundColor: habit.color, opacity: 0.6 }}></div>
                        <div className="legend-square" style={{ backgroundColor: habit.color, opacity: 1 }}></div>
                    </div>
                    <span className="legend-label">Plus</span>
                </div>
            </div>
        </div>
    );
};

// Fonction helper pour calculer la série actuelle
function calculateCurrentStreak(days) {
    const today = new Date().toISOString().split('T')[0];
    let streak = 0;

    for (let i = days.length - 1; i >= 0; i--) {
        if (days[i].date > today) continue;
        if (days[i].isCompleted) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
}

// Fonction helper pour calculer la plus longue série
function calculateLongestStreak(days) {
    let maxStreak = 0;
    let currentStreak = 0;

    days.forEach(day => {
        if (day.isCompleted) {
            currentStreak++;
            maxStreak = Math.max(maxStreak, currentStreak);
        } else {
            currentStreak = 0;
        }
    });

    return maxStreak;
}

export default Heatmap;