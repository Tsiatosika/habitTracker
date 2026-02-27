import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/habits', label: 'Mes Habitudes', icon: '📝' },
        { path: '/quick-check', label: 'Quick Check', icon: '⚡' },
        { path: '/statistics', label: 'Statistiques', icon: '📈' },
        { path: '/badges', label: 'Badges', icon: '🏆' }
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/dashboard" className="navbar-brand">
                    <span className="brand-icon">✨</span>
                    <span className="brand-text">HabitTracker</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="navbar-links">
                    {navItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </Link>
                    ))}
                </div>

                {/* User Menu */}
                <div className="navbar-user">
                    <button
                        className="user-button"
                        onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                        <div className="user-avatar">
                            {user?.username?.charAt(0).toUpperCase() || '👤'}
                        </div>
                        <span className="user-name">{user?.username || 'Utilisateur'}</span>
                        <span className="dropdown-arrow">▼</span>
                    </button>

                    {showUserMenu && (
                        <div className="user-dropdown">
                            <div className="dropdown-header">
                                <div className="user-info">
                                    <div className="user-avatar-large">
                                        {user?.username?.charAt(0).toUpperCase() || '👤'}
                                    </div>
                                    <div className="user-details">
                                        <div className="user-name-large">{user?.username}</div>
                                        <div className="user-email">{user?.email}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="dropdown-divider"></div>
                            <button className="dropdown-item" onClick={() => navigate('/profile')}>
                                <span className="item-icon">👤</span>
                                Mon Profil
                            </button>
                            <button className="dropdown-item" onClick={() => navigate('/settings')}>
                                <span className="item-icon">⚙️</span>
                                Paramètres
                            </button>
                            <div className="dropdown-divider"></div>
                            <button className="dropdown-item logout" onClick={handleLogout}>
                                <span className="item-icon">🚪</span>
                                Déconnexion
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="mobile-menu-button"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                </button>
            </div>

            {/* Mobile Navigation */}
            <div className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
                {navItems.map(item => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`mobile-nav-link ${isActive(item.path) ? 'active' : ''}`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-label">{item.label}</span>
                    </Link>
                ))}
                <div className="mobile-divider"></div>
                <button
                    className="mobile-nav-link logout"
                    onClick={handleLogout}
                >
                    <span className="nav-icon">🚪</span>
                    <span className="nav-label">Déconnexion</span>
                </button>
            </div>

            {/* Overlay pour fermer les menus */}
            {(isMenuOpen || showUserMenu) && (
                <div
                    className="navbar-overlay"
                    onClick={() => {
                        setIsMenuOpen(false);
                        setShowUserMenu(false);
                    }}
                />
            )}
        </nav>
    );
};

export default Navbar;