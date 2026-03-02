import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { habitService } from '../../services/habitService';
import Modal from '../common/Modal';
import './Profile.css';

const Profile = () => {
    const { user, updateUser } = useContext(AuthContext);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [stats, setStats] = useState(null);
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        bio: user?.bio || ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUserStats();
    }, []);

    const loadUserStats = async () => {
        try {
            const statsData = await habitService.getOverallStats();
            setStats(statsData);
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // await userService.updateProfile(formData);
            // updateUser(formData);
            setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
            setIsEditModalOpen(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur lors de la mise à jour du profil' });
        }
    };

    const openEditModal = () => {
        setFormData({
            username: user?.username || '',
            email: user?.email || '',
            bio: user?.bio || ''
        });
        setIsEditModalOpen(true);
    };

    const getMemberSince = () => {
        if (!user?.created_at) return 'Récemment';
        const date = new Date(user.created_at);
        return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Chargement du profil...</p>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>Mon Profil</h1>
                <p className="profile-subtitle">Vos informations personnelles</p>
            </div>

            {message.text && (
                <div className={`profile-message ${message.type}`}>
                    <span className="message-icon">
                        {message.type === 'success' ? '✓' : '⚠'}
                    </span>
                    {message.text}
                </div>
            )}

            <div className="profile-content">
                {/* Avatar et Infos principales */}
                <div className="profile-main-card">
                    <div className="profile-avatar-section">
                        <div className="profile-avatar-large">
                            {user?.username?.charAt(0).toUpperCase() || '👤'}
                        </div>
                        <button className="btn-change-avatar">
                            📷 Changer l'avatar
                        </button>
                    </div>

                    <div className="profile-info-section">
                        <div className="profile-info-header">
                            <div>
                                <h2>{user?.username}</h2>
                                <p className="profile-email">{user?.email}</p>
                                {user?.bio && <p className="profile-bio">{user.bio}</p>}
                            </div>
                            <button className="btn-edit-profile" onClick={openEditModal}>
                                ✏️ Modifier
                            </button>
                        </div>

                        <div className="profile-meta">
                            <div className="meta-item">
                                <span className="meta-icon">📅</span>
                                <span className="meta-text">Membre depuis {getMemberSince()}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-icon">🎯</span>
                                <span className="meta-text">{stats?.total_habits || 0} habitudes actives</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-icon">🔥</span>
                                <span className="meta-text">Meilleure série : {stats?.best_streak || 0} jours</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistiques */}
                <div className="profile-stats-grid">
                    <div className="profile-stat-card highlight">
                        <span className="stat-icon">🔥</span>
                        <div className="stat-info">
                            <span className="stat-value">{stats?.current_streak || 0}</span>
                            <span className="stat-label">Série actuelle</span>
                        </div>
                    </div>
                    <div className="profile-stat-card">
                        <span className="stat-icon">✅</span>
                        <div className="stat-info">
                            <span className="stat-value">{stats?.total_completions || 0}</span>
                            <span className="stat-label">Complétions totales</span>
                        </div>
                    </div>
                    <div className="profile-stat-card">
                        <span className="stat-icon">📊</span>
                        <div className="stat-info">
                            <span className="stat-value">{stats?.completion_rate || 0}%</span>
                            <span className="stat-label">Taux de complétion</span>
                        </div>
                    </div>
                    <div className="profile-stat-card">
                        <span className="stat-icon">🏆</span>
                        <div className="stat-info">
                            <span className="stat-value">{stats?.badges_count || 0}</span>
                            <span className="stat-label">Badges obtenus</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal d'édition du profil */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Modifier mon profil"
                size="medium"
            >
                <form onSubmit={handleSubmit} className="profile-modal-form">
                    <div className="form-group">
                        <label htmlFor="username">Nom d'utilisateur</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
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
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="bio">Bio</label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Parlez-nous de vous..."
                            rows="4"
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn-cancel">
                            Annuler
                        </button>
                        <button type="submit" className="btn-save">
                            Enregistrer
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Profile;