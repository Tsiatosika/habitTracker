import { useState, useEffect } from 'react';
import { habitService } from '../../services/habitService';
import './BadgeList.css';

const allBadgeTypes = [
    {
        type: 'first_habit',
        name: 'Premier pas',
        description: 'Créer ta première habitude',
        icon: '🎯',
        rarity: 'common'
    },
    {
        type: 'first_week',
        name: 'Une semaine',
        description: 'Compléter une habitude 7 jours de suite',
        icon: '📅',
        rarity: 'common'
    },
    {
        type: 'first_month',
        name: 'Un mois',
        description: 'Compléter une habitude 30 jours de suite',
        icon: '🗓️',
        rarity: 'rare'
    },
    {
        type: 'streak_7',
        name: 'Série de 7',
        description: '7 jours consécutifs sur une habitude',
        icon: '🔥',
        rarity: 'common'
    },
    {
        type: 'streak_30',
        name: 'Série de 30',
        description: '30 jours consécutifs sur une habitude',
        icon: '⚡',
        rarity: 'rare'
    },
    {
        type: 'streak_100',
        name: 'Centurion',
        description: '100 jours consécutifs — légendaire',
        icon: '💎',
        rarity: 'legendary'
    },
    {
        type: 'perfect_week',
        name: 'Semaine parfaite',
        description: 'Toutes les habitudes complétées 7 jours',
        icon: '⭐',
        rarity: 'rare'
    },
    {
        type: 'perfect_month',
        name: 'Mois parfait',
        description: 'Toutes les habitudes complétées 30 jours',
        icon: '🌟',
        rarity: 'legendary'
    },
    {
        type: 'habit_master',
        name: 'Maître des habitudes',
        description: 'Créer 10 habitudes différentes',
        icon: '👑',
        rarity: 'epic'
    },
    {
        type: 'early_bird',
        name: 'Lève-tôt',
        description: 'Compléter une habitude avant 8h matin',
        icon: '🌅',
        rarity: 'common'
    },
    {
        type: 'comeback',
        name: 'Retour en force',
        description: 'Reprendre après 7 jours d\'absence',
        icon: '🦅',
        rarity: 'rare'
    },
    {
        type: 'completionist',
        name: 'Complétionniste',
        description: '500 complétions au total',
        icon: '🏆',
        rarity: 'epic'
    },
];

const rarityConfig = {
    common:    { label: 'Commun',    color: '#94a3b8', glow: 'rgba(148,163,184,0.3)' },
    rare:      { label: 'Rare',      color: '#60a5fa', glow: 'rgba(96,165,250,0.35)' },
    epic:      { label: 'Épique',    color: '#a78bfa', glow: 'rgba(167,139,250,0.4)' },
    legendary: { label: 'Légendaire',color: '#fbbf24', glow: 'rgba(251,191,36,0.45)' },
};

const BadgeList = () => {
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, earned, locked
    const [hoveredBadge, setHoveredBadge] = useState(null);

    useEffect(() => {
        loadBadges();
    }, []);

    const loadBadges = async () => {
        try {
            // Appel réel au backend
            const data = await habitService.getBadges();
            setBadges(data);
        } catch (error) {
            console.error('Error loading badges:', error);
            // Fallback si le backend ne répond pas encore
            setBadges([]);
        } finally {
            setLoading(false);
        }
    };

    const hasBadge = (badgeType) => badges.some(b => b.badge_type === badgeType);
    const getBadge = (badgeType) => badges.find(b => b.badge_type === badgeType);

    const filteredBadges = allBadgeTypes.filter(b => {
        if (filter === 'earned') return hasBadge(b.type);
        if (filter === 'locked') return !hasBadge(b.type);
        return true;
    });

    const earnedCount = badges.length;
    const totalCount = allBadgeTypes.length;
    const progressPct = (earnedCount / totalCount) * 100;

    if (loading) {
        return (
            <div className="badges-loading">
                <div className="badges-loading-spinner">🏆</div>
                <p>Chargement des badges...</p>
            </div>
        );
    }

    return (
        <div className="badges-container">

            {/* ── Header ── */}
            <div className="badges-hero">
                <div className="badges-hero-text">
                    <h1 className="badges-title">Mes Badges</h1>
                    <p className="badges-subtitle">Chaque badge est une victoire — continue comme ça.</p>
                </div>
                <div className="badges-score-ring">
                    <svg viewBox="0 0 80 80" className="ring-svg">
                        <circle cx="40" cy="40" r="34" className="ring-track" />
                        <circle
                            cx="40" cy="40" r="34"
                            className="ring-fill"
                            strokeDasharray={`${progressPct * 2.136} 213.6`}
                            strokeDashoffset="0"
                        />
                    </svg>
                    <div className="ring-label">
                        <span className="ring-earned">{earnedCount}</span>
                        <span className="ring-total">/{totalCount}</span>
                    </div>
                </div>
            </div>

            {/* ── Progress bar ── */}
            <div className="badges-progress-section">
                <div className="badges-progress-bar">
                    <div className="badges-progress-fill" style={{ width: `${progressPct}%` }} />
                </div>
                <span className="badges-progress-label">{Math.round(progressPct)}% débloqués</span>
            </div>

            {/* ── Filters ── */}
            <div className="badges-filters">
                {['all', 'earned', 'locked'].map(f => (
                    <button
                        key={f}
                        className={`filter-btn ${filter === f ? 'active' : ''}`}
                        onClick={() => setFilter(f)}
                    >
                        {f === 'all' && `Tous (${totalCount})`}
                        {f === 'earned' && `✓ Obtenus (${earnedCount})`}
                        {f === 'locked' && `🔒 Verrouillés (${totalCount - earnedCount})`}
                    </button>
                ))}
            </div>

            {/* ── Rarity legend ── */}
            <div className="rarity-legend">
                {Object.entries(rarityConfig).map(([key, cfg]) => (
                    <div key={key} className="rarity-pill" style={{ '--rarity-color': cfg.color }}>
                        <span className="rarity-dot" />
                        {cfg.label}
                    </div>
                ))}
            </div>

            {/* ── Grid ── */}
            <div className="badges-grid">
                {filteredBadges.map(badge => {
                    const earned = hasBadge(badge.type);
                    const earnedBadge = getBadge(badge.type);
                    const rarity = rarityConfig[badge.rarity];

                    return (
                        <div
                            key={badge.type}
                            className={`badge-card ${earned ? 'earned' : 'locked'} rarity-${badge.rarity}`}
                            style={{ '--rarity-color': rarity.color, '--rarity-glow': rarity.glow }}
                            onMouseEnter={() => setHoveredBadge(badge.type)}
                            onMouseLeave={() => setHoveredBadge(null)}
                        >
                            {/* Rarity stripe */}
                            <div className="badge-rarity-stripe" />

                            {/* Icon */}
                            <div className={`badge-icon-wrap ${earned ? 'earned-icon' : ''}`}>
                                <span className="badge-icon">{badge.icon}</span>
                                {earned && <div className="badge-shine" />}
                            </div>

                            {/* Info */}
                            <div className="badge-info">
                                <div className="badge-rarity-tag" style={{ color: rarity.color }}>
                                    {rarity.label}
                                </div>
                                <h3 className="badge-name">{badge.name}</h3>
                                <p className="badge-description">{badge.description}</p>
                            </div>

                            {/* Footer */}
                            <div className="badge-footer">
                                {earned && earnedBadge ? (
                                    <span className="earned-date">
                                        🗓 {new Date(earnedBadge.earned_at).toLocaleDateString('fr-FR', {
                                            day: 'numeric', month: 'short', year: 'numeric'
                                        })}
                                    </span>
                                ) : (
                                    <span className="locked-label">Non débloqué</span>
                                )}
                            </div>

                            {/* Locked overlay */}
                            {!earned && (
                                <div className="locked-overlay">
                                    <span className="lock-icon">🔒</span>
                                </div>
                            )}

                            {/* Earned glow effect */}
                            {earned && <div className="earned-glow" />}
                        </div>
                    );
                })}
            </div>

            {/* ── Empty state ── */}
            {filteredBadges.length === 0 && (
                <div className="no-badges-message">
                    <div className="no-badges-icon">
                        {filter === 'earned' ? '🏆' : '🔓'}
                    </div>
                    <h2>{filter === 'earned' ? 'Aucun badge obtenu' : 'Tous les badges débloqués !'}</h2>
                    <p>
                        {filter === 'earned'
                            ? 'Continue à compléter tes habitudes pour gagner tes premiers badges !'
                            : 'Tu es un vrai champion des habitudes 🎉'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default BadgeList;