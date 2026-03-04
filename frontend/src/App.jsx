import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { GamificationProvider } from './context/GamificationContext';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

// Composants d'authentification
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';

// Composants principaux
import Dashboard from './components/Dashboard/Dashboard';
import HabitList from './components/Habits/HabitList';
import HabitDetail from './components/Habits/HabitDetail';
import Statistics from './components/Stats/Statistics';
import BadgeList from './components/Badges/BadgeList';
import ModernQuickCheck from './components/Dashboard/ModernQuickCheck';

// Composants communs
import Navbar from './components/common/Navbar';

import './App.css';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner">⚡</div>
                <p>Chargement...</p>
            </div>
        );
    }

    return user ? children : <Navigate to="/login" />;
};

// Composant pour gérer l'affichage conditionnel de la Navbar
const AppLayout = ({ children }) => {
    const location = useLocation();
    const { user } = useContext(AuthContext);

    // Ne pas afficher la Navbar sur les pages Login et Signup
    const hideNavbar = location.pathname === '/login' || location.pathname === '/signup';

    return (
        <div className="app">
            {!hideNavbar && user && <Navbar />}
            <main className="app-content">
                {children}
            </main>
        </div>
    );
};

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <NotificationProvider>
                    <GamificationProvider>
                        <Router>
                            <AppLayout>
                                <Routes>
                                    {/* Routes publiques */}
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/signup" element={<Signup />} />

                                    {/* Routes privées */}
                                    <Route
                                        path="/dashboard"
                                        element={
                                            <PrivateRoute>
                                                <Dashboard />
                                            </PrivateRoute>
                                        }
                                    />
                                    <Route
                                        path="/quick-check"
                                        element={
                                            <PrivateRoute>
                                                <ModernQuickCheck />
                                            </PrivateRoute>
                                        }
                                    />
                                    <Route
                                        path="/habits"
                                        element={
                                            <PrivateRoute>
                                                <HabitList />
                                            </PrivateRoute>
                                        }
                                    />
                                    <Route
                                        path="/habits/:id"
                                        element={
                                            <PrivateRoute>
                                                <HabitDetail />
                                            </PrivateRoute>
                                        }
                                    />
                                    <Route
                                        path="/statistics"
                                        element={
                                            <PrivateRoute>
                                                <Statistics />
                                            </PrivateRoute>
                                        }
                                    />
                                    <Route
                                        path="/stats"
                                        element={<Navigate to="/statistics" replace />}
                                    />
                                    <Route
                                        path="/badges"
                                        element={
                                            <PrivateRoute>
                                                <BadgeList />
                                            </PrivateRoute>
                                        }
                                    />

                                    {/* Route par défaut */}
                                    <Route path="/" element={<Navigate to="/dashboard" />} />

                                    {/* Route 404 */}
                                    <Route
                                        path="*"
                                        element={
                                            <div className="error-404">
                                                <div className="error-content">
                                                    <h1>404</h1>
                                                    <p>Page non trouvée</p>
                                                    <button onClick={() => window.location.href = '/dashboard'}>
                                                        Retour au Dashboard
                                                    </button>
                                                </div>
                                            </div>
                                        }
                                    />
                                </Routes>
                            </AppLayout>
                        </Router>
                    </GamificationProvider>
                </NotificationProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;