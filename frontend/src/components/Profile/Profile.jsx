import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { GamificationContext } from '../../context/GamificationContext';
import { NotificationContext } from '../../context/NotificationContext';
import Modal from '../common/Modal';
import './Profile.css';

const Profile = () => {
    const { user, updateProfile, updateAvatar } = useContext(AuthContext);
    const { userLevel, totalPoints } = useContext(GamificationContext);
    const { showToast } = useContext(NotificationContext);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [editData, setEditData] = useState({
        username: '',
        email: '',
        bio: ''
    });
    const [selectedAvatar, setSelectedAvatar] = useState('');
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loadingAction, setLoadingAction] = useState('');

    // Charger les données utilisateur dans le formulaire
    useEffect(() => {
        if (user) {
            setEditData({
                username: user.username || '',
                email: user.email || '',
                bio: user.bio || ''
            });
            setSelectedAvatar(user.avatar || '👤');
        }
    }, [user]);

    // ────────────────────────────────────────────────────
    // HELPERS
    // ────────────────────────────────────────────────────

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // ────────────────────────────────────────────────────
    // VALIDATION
    // ────────────────────────────────────────────────────

    const validateProfile = () => {
        const newErrors = {};

        if (!editData.username || editData.username.trim().length < 2) {
            newErrors.username = 'Le nom d\'utilisateur doit contenir au moins 2 caractères';
        }

        if (!editData.email || !editData.email.includes('@')) {
            newErrors.email = 'Email invalide';
        }

        if (editData.bio && editData.bio.length > 500) {
            newErrors.bio = 'La bio ne peut pas dépasser 500 caractères';
        }

        return newErrors;
    };

    // ────────────────────────────────────────────────────
    // MISE À JOUR DU PROFIL
    // ────────────────────────────────────────────────────

    const handleProfileSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateProfile();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoadingAction('profile');
        try {
            await updateProfile(editData);

            showMessage('success', 'Profil mis à jour avec succès !');
            showToast({
                type: 'success',
                title: 'Profil modifié',
                message: 'Vos informations ont été mises à jour'
            });

            setIsEditModalOpen(false);
            setErrors({});
        } catch (error) {
            const msg = error?.response?.data?.message || 'Erreur lors de la mise à jour';
            setErrors({ general: msg });
            showMessage('error', msg);
        } finally {
            setLoadingAction('');
        }
    };

    // ────────────────────────────────────────────────────
    // MISE À JOUR DE L'AVATAR
    // ────────────────────────────────────────────────────

    const handleAvatarSubmit = async () => {
        if (!selectedAvatar) {
            showMessage('error', 'Veuillez sélectionner un avatar');
            return;
        }

        setLoadingAction('avatar');
        try {
            await updateAvatar(selectedAvatar);

            showMessage('success', 'Avatar mis à jour !');
            showToast({
                type: 'success',
                title: 'Avatar modifié',
                message: 'Votre nouvel avatar a été enregistré'
            });

            setIsAvatarModalOpen(false);
        } catch (error) {
            const msg = error?.response?.data?.message || 'Erreur lors de la mise à jour';
            showMessage('error', msg);
        } finally {
            setLoadingAction('');
        }
    };

    // ────────────────────────────────────────────────────
    // AVATARS DISPONIBLES
    // ────────────────────────────────────────────────────

    const AVATAR_OPTIONS = [
        '👤', '😀', '😎', '🤩', '🥳', '😇', '🤓', '🧐',
        '🤠', '👨', '👩', '👨‍💻', '👩‍💻', '👨‍🎓', '👩‍🎓', '🧑‍🚀',
        '🦸', '🦹', '🧙', '🧚', '🧛', '🧜', '🧝', '🧞',
        '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
        '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔'
    ];

    // ────────────────────────────────────────────────────
    // STATISTIQUES UTILISATEUR
    // ────────────────────────────────────────────────────

    const getUserStats = () => {
        return {
            habits: 12, // À remplacer par les vraies données
            checks: 156,
            streak: 7,
            badges: 8
        };
    };

    const stats = getUserStats();

    // ────────────────────────────────────────────────────
    // RENDER
    // ────────────────────────────────────────────────────

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>Mon Profil</h1>
                <p className="profile-subtitle">Gérez vos informations personnelles</p>
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

                {/* ── CARTE PRINCIPALE ── */}
                <section className="profile-main-card">
                    <div className="profile-hero">
                        <div className="profile-avatar-section">
                            <div className="profile-avatar-large">
                                {user?.avatar || '👤'}
                            </div>
                            <button
                                className="btn-change-avatar"
                                onClick={() => {
                                    setSelectedAvatar(user?.avatar || '👤');
                                    setIsAvatarModalOpen(true);
                                }}
                            >
                                <span>📸</span> Changer l'avatar
                            </button>
                        </div>

                        <div className="profile-info">
                            <h2 className="profile-name">{user?.username || 'Utilisateur'}</h2>
                            <p className="profile-email">{user?.email || 'email@example.com'}</p>

                            {user?.bio ? (
                                <p className="profile-bio">{user.bio}</p>
                            ) : (
                                <p className="profile-bio empty">Aucune bio pour le moment</p>
                            )}

                            <button
                                className="btn-edit-profile"
                                onClick={() => setIsEditModalOpen(true)}
                            >
                                ✏️ Modifier le profil
                            </button>
                        </div>
                    </div>

                    <div className="profile-level">
                        <div className="level-badge">
                            <span className="level-icon">{userLevel?.icon || '🌱'}</span>
                            <div className="level-details">
                                <span className="level-name">{userLevel?.name || 'Débutant'}</span>
                                <span className="level-points">{totalPoints || 0} points</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── STATISTIQUES ── */}
                <section className="profile-stats-section">
                    <h3>📊 Mes Statistiques</h3>
                    <div className="profile-stats-grid">
                        <div className="profile-stat-card">
                            <div className="stat-icon">📝</div>
                            <div className="stat-value">{stats.habits}</div>
                            <div className="stat-label">Habitudes</div>
                        </div>
                        <div className="profile-stat-card">
                            <div className="stat-icon">✅</div>
                            <div className="stat-value">{stats.checks}</div>
                            <div className="stat-label">Jours complétés</div>
                        </div>
                        <div className="profile-stat-card highlight">
                            <div className="stat-icon">🔥</div>
                            <div className="stat-value">{stats.streak}</div>
                            <div className="stat-label">Série actuelle</div>
                        </div>
                        <div className="profile-stat-card">
                            <div className="stat-icon">🏆</div>
                            <div className="stat-value">{stats.badges}</div>
                            <div className="stat-label">Badges</div>
                        </div>
                    </div>
                </section>

                {/* ── INFORMATIONS DU COMPTE ── */}
                <section className="profile-security-card">
                    <h3>🔐 Informations du compte</h3>
                    <div className="account-info">
                        <div className="info-item">
                            <span className="info-label">Membre depuis</span>
                            <span className="info-value">
                                {user?.created_at
                                    ? new Date(user.created_at).toLocaleDateString('fr-FR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })
                                    : 'Date inconnue'
                                }
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Dernière connexion</span>
                            <span className="info-value">Aujourd'hui</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Identifiant</span>
                            <span className="info-value">#{user?.id || '000'}</span>
                        </div>
                    </div>
                </section>

            </div>

            {/* ── MODAL ÉDITION PROFIL ── */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Modifier le profil"
                size="medium"
            >
                <form onSubmit={handleProfileSubmit} className="modal-form">
                    {errors.general && (
                        <div className="form-error-message">{errors.general}</div>
                    )}

                    <div className="form-group">
                        <label htmlFor="username">Nom d'utilisateur</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={editData.username}
                            onChange={handleEditChange}
                            placeholder="Votre nom"
                            className={errors.username ? 'input-error' : ''}
                        />
                        {errors.username && (
                            <span className="field-error">{errors.username}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={editData.email}
                            onChange={handleEditChange}
                            placeholder="votre@email.com"
                            className={errors.email ? 'input-error' : ''}
                        />
                        {errors.email && (
                            <span className="field-error">{errors.email}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="bio">Bio (optionnel)</label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={editData.bio}
                            onChange={handleEditChange}
                            placeholder="Parlez-nous de vous..."
                            rows="4"
                            maxLength="500"
                            className={errors.bio ? 'input-error' : ''}
                        />
                        <div className="char-count">
                            {editData.bio.length}/500 caractères
                        </div>
                        {errors.bio && (
                            <span className="field-error">{errors.bio}</span>
                        )}
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={() => setIsEditModalOpen(false)}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="btn-save"
                            disabled={loadingAction === 'profile'}
                        >
                            {loadingAction === 'profile' ? '⏳ Enregistrement...' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* ── MODAL AVATAR ── */}
            <Modal
                isOpen={isAvatarModalOpen}
                onClose={() => setIsAvatarModalOpen(false)}
                title="Choisir un avatar"
                size="large"
            >
                <div className="avatar-selector">
                    <div className="avatar-grid">
                        {AVATAR_OPTIONS.map((avatar, index) => (
                            <button
                                key={index}
                                type="button"
                                className={`avatar-option ${selectedAvatar === avatar ? 'selected' : ''}`}
                                onClick={() => setSelectedAvatar(avatar)}
                            >
                                {avatar}
                            </button>
                        ))}
                    </div>

                    <div className="avatar-preview">
                        <div className="preview-label">Aperçu :</div>
                        <div className="preview-avatar">{selectedAvatar}</div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={() => setIsAvatarModalOpen(false)}
                        >
                            Annuler
                        </button>
                        <button
                            type="button"
                            className="btn-save"
                            onClick={handleAvatarSubmit}
                            disabled={loadingAction === 'avatar'}
                        >
                            {loadingAction === 'avatar' ? '⏳ Enregistrement...' : 'Choisir cet avatar'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Profile;