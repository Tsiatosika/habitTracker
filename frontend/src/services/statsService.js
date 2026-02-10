import api from './api';

export const statsService = {
    // Statistiques globales de l'utilisateur
    getOverallStats: async () => {
        const response = await api.get('/stats/overall');
        return response.data;
    },

    // Statistiques d'une habitude spécifique
    getHabitStats: async (habitId) => {
        const response = await api.get(`/stats/habit/${habitId}`);
        return response.data;
    },

    // Obtenir les badges de l'utilisateur
    getUserBadges: async () => {
        const response = await api.get('/badges');
        return response.data;
    },

    // Données pour les graphiques (30 derniers jours)
    getLast30DaysData: async () => {
        const response = await api.get('/stats/last30days');
        return response.data;
    },

    // Données mensuelles
    getMonthlyData: async (year, month) => {
        const response = await api.get('/stats/monthly', {
            params: { year, month }
        });
        return response.data;
    }
};