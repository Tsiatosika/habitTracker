import './LoadingSkeleton.css';

// Skeleton pour HabitCard
export const HabitCardSkeleton = () => {
    return (
        <div className="habit-card-skeleton skeleton-container">
            <div className="skeleton-header">
                <div className="skeleton-icon"></div>
                <div className="skeleton-title"></div>
                <div className="skeleton-button"></div>
            </div>
            <div className="skeleton-description"></div>
            <div className="skeleton-description short"></div>
            <div className="skeleton-stats">
                <div className="skeleton-stat"></div>
                <div className="skeleton-stat"></div>
            </div>
        </div>
    );
};

// Skeleton pour liste d'habitudes
export const HabitListSkeleton = ({ count = 6 }) => {
    return (
        <div className="habits-grid">
            {Array.from({ length: count }).map((_, index) => (
                <HabitCardSkeleton key={index} />
            ))}
        </div>
    );
};

// Skeleton pour StatCard
export const StatCardSkeleton = () => {
    return (
        <div className="stat-card-skeleton skeleton-container">
            <div className="skeleton-stat-number"></div>
            <div className="skeleton-stat-label"></div>
        </div>
    );
};

// Skeleton pour Dashboard
export const DashboardSkeleton = () => {
    return (
        <div className="dashboard-skeleton">
            <div className="skeleton-header">
                <div className="skeleton-title-large"></div>
            </div>
            <div className="stats-overview">
                {Array.from({ length: 3 }).map((_, index) => (
                    <StatCardSkeleton key={index} />
                ))}
            </div>
            <HabitListSkeleton count={6} />
        </div>
    );
};

// Skeleton pour Badge
export const BadgeSkeleton = () => {
    return (
        <div className="badge-skeleton skeleton-container">
            <div className="skeleton-badge-icon"></div>
            <div className="skeleton-badge-name"></div>
            <div className="skeleton-badge-desc"></div>
        </div>
    );
};

// Skeleton pour liste de badges
export const BadgeListSkeleton = ({ count = 8 }) => {
    return (
        <div className="badges-grid">
            {Array.from({ length: count }).map((_, index) => (
                <BadgeSkeleton key={index} />
            ))}
        </div>
    );
};

// Skeleton pour calendrier
export const CalendarSkeleton = () => {
    return (
        <div className="calendar-skeleton skeleton-container">
            <div className="skeleton-calendar-header">
                <div className="skeleton-button"></div>
                <div className="skeleton-month-title"></div>
                <div className="skeleton-button"></div>
            </div>
            <div className="skeleton-calendar-grid">
                {Array.from({ length: 35 }).map((_, index) => (
                    <div key={index} className="skeleton-calendar-day"></div>
                ))}
            </div>
        </div>
    );
};

// Skeleton générique pour texte
export const TextSkeleton = ({ width = '100%', height = '16px' }) => {
    return (
        <div
            className="skeleton-text"
            style={{ width, height }}
        ></div>
    );
};

// Skeleton générique pour cercle
export const CircleSkeleton = ({ size = '48px' }) => {
    return (
        <div
            className="skeleton-circle"
            style={{ width: size, height: size }}
        ></div>
    );
};

// Skeleton générique pour rectangle
export const RectangleSkeleton = ({ width = '100%', height = '100px' }) => {
    return (
        <div
            className="skeleton-rectangle"
            style={{ width, height }}
        ></div>
    );
};

export default HabitCardSkeleton;