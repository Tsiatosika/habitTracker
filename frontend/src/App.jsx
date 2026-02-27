import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

// Composants d'authentification
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';

// Composants principaux
import Dashboard from './components/Dashboard/Dashboard';
import HabitList from './components/Habits/HabitList';
import HabitDetail from './components/Habits/HabitDetail';
import StatsOverview from './components/Stats/StatsOverview';
import BadgeList from './components/Badges/BadgeList';

import Navbar from './components/common/Navbar';
import QuickCheck from './components/Dashboard/QuickCheck';
import ProgressCharts from './components/Stats/ProgressCharts';
import './App.css';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Chargement...</div>;

    return user ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="app">
                    <Navbar />
                    <main className="app-content">
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
                                path="/stats"
                                element={
                                    <PrivateRoute>
                                        <StatsOverview />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/badges"
                                element={
                                    <PrivateRoute>
                                        <BadgeList />
                                    </PrivateRoute>
                                }
                            />

                            {/* Routes optionnelles (si vous les avez) */}
                            <Route
                                path="/quick-check"
                                element={
                                    <PrivateRoute>
                                        <QuickCheck />
                                    </PrivateRoute>
                                }
                            />

                            {/* Route par défaut */}
                            <Route path="/" element={<Navigate to="/dashboard" />} />

                            {/* Route 404 */}
                            <Route path="*" element={
                                <div style={{ padding: '50px', textAlign: 'center' }}>
                                    <h1>404 - Page non trouvée</h1>
                                    <p>La page que vous recherchez n'existe pas.</p>
                                </div>
                            } />
                        </Routes>
                    </main>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;