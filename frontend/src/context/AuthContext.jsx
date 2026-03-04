import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
            setUser(JSON.parse(userData));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);

        return response.data;
    };

    const signup = async (email, password, username) => {
        const response = await api.post('/auth/signup', { email, password, username });
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);

        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const updateUser = async (data) => {
        const response = await api.put('/auth/profile', data);
        const updatedUser = { ...user, ...response.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        return updatedUser;
    };

    const changePassword = async (currentPassword, newPassword) => {
        const response = await api.put('/auth/password', { currentPassword, newPassword });
        return response.data;
    };

    const deleteAccount = async () => {
        await api.delete('/auth/account');
        logout();
    };

    const resetData = async () => {
        const response = await api.delete('/auth/data');
        return response.data;
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            signup,
            logout,
            loading,
            updateUser,
            changePassword,
            deleteAccount,
            resetData,
        }}>
            {children}
        </AuthContext.Provider>
    );
};