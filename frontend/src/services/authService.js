import api from './api';

export const authService = {
    // Inscription
    signup: async (email, password, username) => {
        const response = await api.post('/auth/signup', {
            email,
            password,
            username
        });
        return response.data;
    },

    // Connexion
    login: async (email, password) => {
        const response = await api.post('/auth/login', {
            email,
            password
        });
        return response.data;
    },

    // Déconnexion (côté client)
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Obtenir le token actuel
    getToken: () => {
        return localStorage.getItem('token');
    },

    // Obtenir l'utilisateur actuel
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Vérifier si l'utilisateur est authentifié
    isAuthenticated: () => {
        return !!authService.getToken();
    }
};