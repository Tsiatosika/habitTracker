import { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

const THEMES = {
    light: {
        primary: '#667eea', secondary: '#764ba2', background: '#f8f9fa',
        surface: '#ffffff', text: '#333333', textSecondary: '#666666',
        border: '#e0e0e0', success: '#10b981', error: '#ef4444',
        warning: '#f59e0b', info: '#3b82f6',
    },
    dark: {
        primary: '#818cf8', secondary: '#a78bfa', background: '#0f172a',
        surface: '#1e293b', text: '#f1f5f9', textSecondary: '#94a3b8',
        border: '#334155', success: '#34d399', error: '#f87171',
        warning: '#fbbf24', info: '#60a5fa',
    },
    ocean: {
        primary: '#06b6d4', secondary: '#0891b2', background: '#ecfeff',
        surface: '#ffffff', text: '#164e63', textSecondary: '#155e75',
        border: '#a5f3fc', success: '#14b8a6', error: '#f43f5e',
        warning: '#fb923c', info: '#06b6d4',
    },
    forest: {
        primary: '#10b981', secondary: '#059669', background: '#f0fdf4',
        surface: '#ffffff', text: '#064e3b', textSecondary: '#065f46',
        border: '#86efac', success: '#22c55e', error: '#dc2626',
        warning: '#f59e0b', info: '#10b981',
    },
    sunset: {
        primary: '#f97316', secondary: '#ea580c', background: '#fff7ed',
        surface: '#ffffff', text: '#7c2d12', textSecondary: '#9a3412',
        border: '#fed7aa', success: '#10b981', error: '#dc2626',
        warning: '#f59e0b', info: '#f97316',
    }
};

export const ThemeProvider = ({ children }) => {
    const [mode, setMode] = useState('light');
    const [themeName, setThemeName] = useState('light');
    const [customColors, setCustomColors] = useState(null);

    useEffect(() => {
        const savedMode = localStorage.getItem('themeMode') || 'light';
        const savedTheme = localStorage.getItem('themeName') || 'light';
        const savedCustom = localStorage.getItem('customColors');

        setMode(savedMode);
        setThemeName(savedTheme);
        if (savedCustom) setCustomColors(JSON.parse(savedCustom));

        applyTheme(savedMode === 'dark' ? THEMES.dark : THEMES[savedTheme]);
        applyClass(savedMode);
    }, []);

    const applyTheme = (colors) => {
        const root = document.documentElement;
        Object.entries(colors).forEach(([key, value]) => {
            root.style.setProperty(`--color-${key}`, value);
        });
    };

    // Ajoute/retire la classe "dark" sur <html>
    // C'est ce que App.css écoute pour appliquer le dark mode
    const applyClass = (currentMode) => {
        document.documentElement.classList.toggle('dark', currentMode === 'dark');
    };

    const toggleMode = () => {
        const newMode = mode === 'light' ? 'dark' : 'light';
        setMode(newMode);
        localStorage.setItem('themeMode', newMode);
        applyTheme(newMode === 'dark' ? THEMES.dark : THEMES[themeName]);
        applyClass(newMode);
    };

    const changeTheme = (name) => {
        setThemeName(name);
        localStorage.setItem('themeName', name);
        if (mode === 'light' && THEMES[name]) applyTheme(THEMES[name]);
    };

    const setCustomTheme = (colors) => {
        setCustomColors(colors);
        localStorage.setItem('customColors', JSON.stringify(colors));
        applyTheme(colors);
    };

    const currentTheme = customColors || (mode === 'dark' ? THEMES.dark : THEMES[themeName]);

    return (
        <ThemeContext.Provider value={{
            mode, themeName, theme: currentTheme, themes: THEMES,
            toggleMode, changeTheme, setCustomTheme
        }}>
            {children}
        </ThemeContext.Provider>
    );
};