import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/dashboard" className="navbar-brand">
                    <span className="brand-icon">✨</span>
                    HabitTracker
                </Link>

                <div className="navbar-menu">
                    <Link to="/dashboard" className="nav-link">
                        📊 Dashboard
                    </Link>
                    <Link to="/habits" className="nav-link">
                        📝 Mes Habitudes
                    </Link>
                    <Link to="/stats" className="nav-link">
                        📈 Statistiques
                    </Link>
                    <Link to="/badges" className="nav-link">
                        🏆 Badges
                    </Link>
                </div>

                <div className="navbar-user">
                    <span className="user-name">👋 {user.username}</span>
                    <button onClick={handleLogout} className="btn-logout">
                        Déconnexion
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;