import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './components/Dashboard/Dashboard';
import Navbar from './components/common/Navbar';

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
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route 
                            path="/dashboard" 
                            element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            } 
                        />
                        <Route path="/" element={<Navigate to="/dashboard" />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;