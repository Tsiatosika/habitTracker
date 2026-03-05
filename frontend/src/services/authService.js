import api from './api';

export const authService = {
    // ────────────────────────────────────────────────────
    // AUTHENTIFICATION
    // ────────────────────────────────────────────────────

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
    },

    // ────────────────────────────────────────────────────
    // GESTION DU PROFIL
    // ────────────────────────────────────────────────────

    /**
     * Mettre à jour le profil utilisateur (username, email, bio)
     * ROUTE BACKEND: PUT /auth/profile
     */
    updateProfile: async (profileData) => {
        const response = await api.put('/auth/profile', profileData);
        return response.data;
    },

    /**
     * Changer le mot de passe
     * ROUTE BACKEND: PUT /auth/change-password ← CORRIGÉ
     */
    changePassword: async (currentPassword, newPassword) => {
        const response = await api.put('/auth/change-password', {
            currentPassword,
            newPassword
        });
        return response.data;
    },

    /**
     * Mettre à jour l'avatar
     * ROUTE BACKEND: PUT /auth/profile (utilise la même route)
     */
    updateAvatar: async (avatarUrl) => {
        const response = await api.put('/auth/profile', {
            avatar: avatarUrl
        });
        return response.data;
    },

    // ────────────────────────────────────────────────────
    // GESTION DES DONNÉES
    // ────────────────────────────────────────────────────

    /**
     * Réinitialiser toutes les données (habitudes, checks, badges)
     * ROUTE BACKEND: DELETE /auth/reset-data
     */
    resetData: async () => {
        const response = await api.delete('/auth/reset-data');
        return response.data;
    },

    /**
     * Supprimer définitivement le compte utilisateur
     * ROUTE BACKEND: DELETE /auth/delete-account ← CORRIGÉ
     */
    deleteAccount: async () => {
        const response = await api.delete('/auth/delete-account');
        return response.data;
    }
};