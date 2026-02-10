import api from './api';

export const habitService = {
    // Récupérer toutes les habitudes
    getAll: async () => {
        const response = await api.get('/habits');
        return response.data;
    },

    // Récupérer une habitude
    getById: async (id) => {
        const response = await api.get(`/habits/${id}`);
        return response.data;
    },

    // Créer une habitude
    create: async (habitData) => {
        const response = await api.post('/habits', habitData);
        return response.data;
    },

    // Modifier une habitude
    update: async (id, habitData) => {
        const response = await api.put(`/habits/${id}`, habitData);
        return response.data;
    },

    // Supprimer une habitude
    delete: async (id) => {
        const response = await api.delete(`/habits/${id}`);
        return response.data;
    },

    // Toggle check
    toggleCheck: async (checkData) => {
        const response = await api.post('/checks', checkData);
        return response.data;
    },

    // Récupérer les checks
    getChecks: async (habitId, startDate, endDate) => {
        const response = await api.get(`/checks/${habitId}`, {
            params: { start_date: startDate, end_date: endDate }
        });
        return response.data;
    },

    // Récupérer les stats d'une habitude
    getStats: async (habitId) => {
        const response = await api.get(`/stats/habit/${habitId}`);
        return response.data;
    },

    // Récupérer les stats globales
    getOverallStats: async () => {
        const response = await api.get('/stats/overall');
        return response.data;
    },
};