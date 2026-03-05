import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Charger l'utilisateur au démarrage
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
            setUser(JSON.parse(userData));
        }
        setLoading(false);
    }, []);

    // ────────────────────────────────────────────────────
    // AUTHENTIFICATION
    // ────────────────────────────────────────────────────

    const login = async (email, password) => {
        try {
            const data = await authService.login(email, password);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            return data;
        } catch (error) {
            console.error('Erreur de connexion:', error);
            throw error;
        }
    };

    const signup = async (email, password, username) => {
        try {
            const data = await authService.signup(email, password, username);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            return data;
        } catch (error) {
            console.error('Erreur d\'inscription:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    // ────────────────────────────────────────────────────
    // GESTION DU PROFIL
    // ────────────────────────────────────────────────────

    /**
     * Mettre à jour le profil utilisateur (username, email, bio)
     * Et mettre à jour localStorage + state
     */
    const updateProfile = async (profileData) => {
        try {
            const updatedUser = await authService.updateProfile(profileData);

            // Mettre à jour l'état local
            const newUser = {
                ...user,
                ...updatedUser
            };

            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));

            return updatedUser;
        } catch (error) {
            console.error('Erreur lors de la mise à jour du profil:', error);
            throw error;
        }
    };

    /**
     * Changer le mot de passe
     */
    const changePassword = async (currentPassword, newPassword) => {
        try {
            const response = await authService.changePassword(currentPassword, newPassword);
            return response;
        } catch (error) {
            console.error('Erreur lors du changement de mot de passe:', error);
            throw error;
        }
    };

    /**
     * Changer l'avatar utilisateur
     * Et mettre à jour localStorage + state immédiatement
     */
    const updateAvatar = async (avatarUrl) => {
        try {
            const updatedUser = await authService.updateAvatar(avatarUrl);

            // Mettre à jour l'état local avec le nouvel avatar
            const newUser = {
                ...user,
                avatar: updatedUser.avatar || avatarUrl
            };

            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));

            return updatedUser;
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'avatar:', error);
            throw error;
        }
    };

    // ────────────────────────────────────────────────────
    // GESTION DES DONNÉES
    // ────────────────────────────────────────────────────

    /**
     * Réinitialiser toutes les données utilisateur (habitudes, checks, badges)
     */
    const resetData = async () => {
        try {
            const response = await authService.resetData();
            return response;
        } catch (error) {
            console.error('Erreur lors de la réinitialisation des données:', error);
            throw error;
        }
    };

    /**
     * Supprimer définitivement le compte utilisateur
     */
    const deleteAccount = async () => {
        try {
            await authService.deleteAccount();
            logout();
        } catch (error) {
            console.error('Erreur lors de la suppression du compte:', error);
            throw error;
        }
    };

    // ────────────────────────────────────────────────────
    // VALEUR DU CONTEXTE
    // ────────────────────────────────────────────────────

    const value = {
        user,
        loading,
        login,
        signup,
        logout,
        updateProfile,
        changePassword,
        updateAvatar,
        resetData,
        deleteAccount
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};