import { useState, useEffect } from 'react';
import { habitService } from '../../services/habitService';
import './BadgeList.css';

const BadgeList = () => {
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBadges();
    }, []);

    const loadBadges = async () => {
        try {
            // Note: Vous devrez ajouter cette méthode dans habitService
            // const data = await habitService.getBadges();
            // Pour l'instant, simulons des badges
            const mockBadges = [
                {
                    id: 1,
                    badge_type: 'first_habit',
                    earned_at: new Date().toISOString(),
                    name: 'Premier pas',
                    description: 'Créé ta première habitude',
                    icon: '🎯'
                },
                {
                    id: 2,
                    badge_type: 'streak_7',
                    earned_at: new Date().toISOString(),
                    name: 'Série de 7',
                    description: '7 jours consécutifs',
                    icon: '🔥'
                }
            ];

            setBadges(mockBadges);
        } catch (error) {
            console.error('Error loading badges:', error);
        } finally {
            setLoading(false);
        }
    };

    const allBadgeTypes = [
        { type: 'first_habit', name: 'Premier pas', description: 'Créé ta première habitude', icon: '🎯' },
        { type: 'first_week', name: 'Une semaine', description: '7 jours consécutifs', icon: '📅' },
        { type: 'first_month', name: 'Un mois', description: '30 jours consécutifs', icon: '🗓️' },
        { type: 'streak_7', name: 'Série de 7', description: '7 jours de suite', icon: '🔥' },
        { type: 'streak_30', name: 'Série de 30', description: '30 jours de suite', icon: '🔥🔥' },
        { type: 'streak_100', name: 'Série de 100', description: '100 jours de suite', icon: '🔥🔥🔥' },
        { type: 'perfect_week', name: 'Semaine parfaite', description: 'Toutes les habitudes pendant 7 jours', icon: '⭐' },
        { type: 'perfect_month', name: 'Mois parfait', description: 'Toutes les habitudes pendant 30 jours', icon: '🌟' },
    ];

    const hasBadge = (badgeType) => {
        return badges.some(b => b.badge_type === badgeType);
    };

    if (loading) return <div className="loading">Chargement...</div>;

    return (
        <div className="badges-container">
            <div className="badges-header">
                <h1>Mes Badges</h1>
                <div className="badges-count">
                    <span className="earned">{badges.length}</span>
                    <span className="separator">/</span>
                    <span className="total">{allBadgeTypes.length}</span>
                    <span className="label">badges débloqués</span>
                </div>
            </div>

            <div className="progress-bar-section">
                <div className="overall-progress-bar">
                    <div
                        className="overall-progress-fill"
                        style={{ width: `${(badges.length / allBadgeTypes.length) * 100}%` }}
                    ></div>
                </div>
            </div>

            <div className="badges-grid">
                {allBadgeTypes.map(badge => {
                    const earned = hasBadge(badge.type);
                    const earnedBadge = badges.find(b => b.badge_type === badge.type);

                    return (
                        <div
                            key={badge.type}
                            className={`badge-card ${earned ? 'earned' : 'locked'}`}
                        >
                            <div className="badge-icon">{badge.icon}</div>
                            <h3 className="badge-name">{badge.name}</h3>
                            <p className="badge-description">{badge.description}</p>
                            {earned && earnedBadge && (
                                <span className="earned-date">
                                    Obtenu le {new Date(earnedBadge.earned_at).toLocaleDateString('fr-FR')}
                                </span>
                            )}
                            {!earned && (
                                <div className="locked-overlay">
                                    <span className="lock-icon">🔒</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {badges.length === 0 && (
                <div className="no-badges-message">
                    <div className="no-badges-icon">🏆</div>
                    <h2>Aucun badge pour le moment</h2>
                    <p>Continuez à compléter vos habitudes pour gagner des badges !</p>
                </div>
            )}
        </div>
    );
};

export default BadgeList;