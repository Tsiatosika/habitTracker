import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Signup.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { signup } = useContext(AuthContext);
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

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            setLoading(false);
            return;
        }

        try {
            await signup(formData.email, formData.password, formData.username);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de l\'inscription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-wrapper">
                <div className="signup-content">
                    <div className="signup-info">
                        <h1 className="main-title">Commencez votre transformation</h1>
                        <p className="main-description">
                            Rejoignez des milliers d'utilisateurs qui ont déjà transformé leur vie grâce à Habit Tracker. Créez votre compte et commencez à bâtir de meilleures habitudes dès aujourd'hui.
                        </p>
                        <div className="features">
                            <div className="feature-item">
                                <span className="feature-icon">✨</span>
                                <span>Inscription gratuite et rapide</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">🔒</span>
                                <span>Vos données sont sécurisées</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">💪</span>
                                <span>Suivez autant d'habitudes que vous voulez</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">🌟</span>
                                <span>Atteignez vos objectifs plus facilement</span>
                            </div>
                        </div>
                    </div>

                    <div className="signup-box">
                        <h2>Inscription</h2>
                        <p className="subtitle">Créez votre compte pour commencer.</p>

                        {error && <div className="error-message">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="username">Nom d'utilisateur</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Votre nom"
                                    required
                                />
                            </div>

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

                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn-signup"
                                disabled={loading}
                            >
                                {loading ? 'Inscription...' : 'S\'inscrire'}
                            </button>
                        </form>

                        <p className="login-link">
                            Déjà un compte ? <Link to="/login">Se connecter</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;