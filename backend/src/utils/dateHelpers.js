/**
 * Obtenir la date d'aujourd'hui au format YYYY-MM-DD
 */
const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
};

/**
 * Obtenir la date d'hier au format YYYY-MM-DD
 */
const getYesterdayDate = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
};

/**
 * Obtenir le début de la semaine (lundi)
 */
const getStartOfWeek = (date = new Date()) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajuster si dimanche
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d.toISOString().split('T')[0];
};

/**
 * Obtenir la fin de la semaine (dimanche)
 */
const getEndOfWeek = (date = new Date()) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() + (7 - day);
    d.setDate(diff);
    d.setHours(23, 59, 59, 999);
    return d.toISOString().split('T')[0];
};

/**
 * Obtenir le début du mois
 */
const getStartOfMonth = (date = new Date()) => {
    const d = new Date(date);
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d.toISOString().split('T')[0];
};

/**
 * Obtenir la fin du mois
 */
const getEndOfMonth = (date = new Date()) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + 1);
    d.setDate(0);
    d.setHours(23, 59, 59, 999);
    return d.toISOString().split('T')[0];
};

/**
 * Calculer la différence en jours entre deux dates
 */
const daysDifference = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

/**
 * Formater une date au format lisible (ex: "15 janvier 2024")
 */
const formatDate = (dateString, locale = 'fr-FR') => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

/**
 * Vérifier si une date est aujourd'hui
 */
const isToday = (dateString) => {
    return dateString === getTodayDate();
};

/**
 * Vérifier si une date est hier
 */
const isYesterday = (dateString) => {
    return dateString === getYesterdayDate();
};

/**
 * Générer un tableau de dates entre deux dates
 */
const getDateRange = (startDate, endDate) => {
    const dates = [];
    const current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
        dates.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
    }

    return dates;
};

/**
 * Obtenir les 7 derniers jours
 */
const getLast7Days = () => {
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
const getLast30Days = () => {
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
 * Obtenir le nom du jour
 */
const getDayName = (dateString, locale = 'fr-FR') => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, { weekday: 'long' });
};

/**
 * Obtenir le nom du mois
 */
const getMonthName = (dateString, locale = 'fr-FR') => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, { month: 'long' });
};

module.exports = {
    getTodayDate,
    getYesterdayDate,
    getStartOfWeek,
    getEndOfWeek,
    getStartOfMonth,
    getEndOfMonth,
    daysDifference,
    formatDate,
    isToday,
    isYesterday,
    getDateRange,
    getLast7Days,
    getLast30Days,
    getDayName,
    getMonthName
};