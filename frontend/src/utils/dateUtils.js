/**
 * Obtenir la date d'aujourd'hui au format YYYY-MM-DD
 */
export const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
};

/**
 * Obtenir la date d'hier
 */
export const getYesterdayDate = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
};

/**
 * Formater une date en format lisible
 */
export const formatDate = (dateString, locale = 'fr-FR') => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

/**
 * Formater une date en format court
 */
export const formatShortDate = (dateString, locale = 'fr-FR') => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
        month: 'short',
        day: 'numeric'
    });
};

/**
 * Obtenir les 7 derniers jours
 */
export const getLast7Days = () => {
    const dates = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
    }

    return dates;
};

/**
 * Obtenir les 30 derniers jours
 */
export const getLast30Days = () => {
    const dates = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
    }

    return dates;
};

/**
 * Vérifier si une date est aujourd'hui
 */
export const isToday = (dateString) => {
    return dateString === getTodayDate();
};

/**
 * Vérifier si une date est hier
 */
export const isYesterday = (dateString) => {
    return dateString === getYesterdayDate();
};

/**
 * Obtenir le nom du jour de la semaine
 */
export const getDayName = (dateString, locale = 'fr-FR') => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, { weekday: 'long' });
};

/**
 * Obtenir le nom du jour court
 */
export const getShortDayName = (dateString, locale = 'fr-FR') => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, { weekday: 'short' });
};

/**
 * Calculer la différence en jours entre deux dates
 */
export const daysBetween = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Obtenir le début de la semaine (lundi)
 */
export const getStartOfWeek = (date = new Date()) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    return d.toISOString().split('T')[0];
};

/**
 * Obtenir la fin de la semaine (dimanche)
 */
export const getEndOfWeek = (date = new Date()) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() + (7 - day);
    d.setDate(diff);
    return d.toISOString().split('T')[0];
};

/**
 * Obtenir le début du mois
 */
export const getStartOfMonth = (date = new Date()) => {
    const d = new Date(date);
    d.setDate(1);
    return d.toISOString().split('T')[0];
};

/**
 * Obtenir la fin du mois
 */
export const getEndOfMonth = (date = new Date()) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + 1);
    d.setDate(0);
    return d.toISOString().split('T')[0];
};