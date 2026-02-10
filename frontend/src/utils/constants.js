// Couleurs disponibles pour les habitudes
export const HABIT_COLORS = [
    '#3B82F6', // Bleu
    '#EF4444', // Rouge
    '#10B981', // Vert
    '#F59E0B', // Orange
    '#8B5CF6', // Violet
    '#EC4899', // Rose
    '#14B8A6', // Teal
    '#F97316', // Orange foncé
    '#6366F1', // Indigo
    '#84CC16', // Lime
];

// Icônes disponibles pour les habitudes
export const HABIT_ICONS = [
    '💪', // Sport
    '📚', // Lecture
    '🏃', // Course
    '🧘', // Méditation
    '💧', // Eau
    '🎯', // Objectif
    '✍️', // Écriture
    '🎨', // Art
    '🎵', // Musique
    '🍎', // Nutrition
    '😴', // Sommeil
    '🧠', // Apprentissage
    '💼', // Travail
    '👨‍👩‍👧‍👦', // Famille
    '🌱', // Développement
];

// Types de fréquence
export const FREQUENCY_TYPES = {
    DAILY: 'daily',
    WEEKLY: 'weekly',
};

// Labels de fréquence
export const FREQUENCY_LABELS = {
    daily: 'Quotidienne',
    weekly: 'Hebdomadaire',
};

// Types de badges
export const BADGE_TYPES = {
    FIRST_HABIT: 'first_habit',
    FIRST_WEEK: 'first_week',
    FIRST_MONTH: 'first_month',
    STREAK_7: 'streak_7',
    STREAK_30: 'streak_30',
    STREAK_100: 'streak_100',
    PERFECT_WEEK: 'perfect_week',
    PERFECT_MONTH: 'perfect_month',
};

// Messages de motivation
export const MOTIVATION_MESSAGES = [
    "Continue comme ça ! 🎉",
    "Tu es sur la bonne voie ! 🚀",
    "Excellent travail ! ⭐",
    "Ne lâche rien ! 💪",
    "Bravo pour ta régularité ! 🔥",
    "Tu progresses chaque jour ! 📈",
    "Fantastique ! Continue ! 🌟",
];

// Statuts de l'API
export const API_STATUS = {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error',
};

// Tailles des modales
export const MODAL_SIZES = {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
};

// Messages d'erreur
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Erreur de connexion. Vérifiez votre connexion internet.',
    AUTH_ERROR: 'Erreur d\'authentification. Veuillez vous reconnecter.',
    NOT_FOUND: 'Ressource non trouvée.',
    SERVER_ERROR: 'Erreur serveur. Veuillez réessayer plus tard.',
    VALIDATION_ERROR: 'Données invalides. Vérifiez vos informations.',
};

// Limites
export const LIMITS = {
    MAX_HABIT_NAME_LENGTH: 200,
    MAX_DESCRIPTION_LENGTH: 500,
    MIN_PASSWORD_LENGTH: 6,
    MAX_USERNAME_LENGTH: 100,
};

// Routes
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    SIGNUP: '/signup',
    DASHBOARD: '/dashboard',
    HABITS: '/habits',
    HABIT_DETAIL: '/habits/:id',
    STATS: '/stats',
    BADGES: '/badges',
};