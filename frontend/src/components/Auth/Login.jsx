import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur de connexion');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-wrapper">
                <div className="login-content">
                    <div className="login-info">
                        <h1 className="main-title">Transformez vos habitudes</h1>
                        <p className="main-description">
                            Bienvenue sur Habit Tracker, votre compagnon pour construire des habitudes positives et atteindre vos objectifs quotidiens.
                        </p>
                        <div className="features">
                            <div className="feature-item">
                                <span className="feature-icon">📊</span>
                                <span>Suivez vos progrès en temps réel</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">🎯</span>
                                <span>Définissez et atteignez vos objectifs</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">📈</span>
                                <span>Visualisez vos statistiques détaillées</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">🔔</span>
                                <span>Recevez des rappels personnalisés</span>
                            </div>
                        </div>
                    </div>

                    <div className="login-box">
                        <h2>Connexion</h2>
                        <p className="subtitle">Connectez-vous pour continuer votre parcours.</p>

                        {error && <div className="error-message">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="votre@email.com"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Mot de passe</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn-login"
                                disabled={loading}
                            >
                                {loading ? 'Connexion...' : 'Se connecter'}
                            </button>
                        </form>

                        <p className="signup-link">
                            Pas encore de compte ? <Link to="/signup">S'inscrire</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;