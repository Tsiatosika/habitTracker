import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Modal from '../common/Modal';
import './Profile.css'; // Réutilise les mêmes styles

const Settings = () => {
    const { user } = useContext(AuthContext);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            return;
        }

        try {
            // await userService.changePassword(passwordData);
            setMessage({ type: 'success', text: 'Mot de passe modifié avec succès !' });
            setIsPasswordModalOpen(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur lors du changement de mot de passe' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>Paramètres</h1>
                <p className="profile-subtitle">Gérez la sécurité et vos préférences</p>
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
                {/* Sécurité */}
                <div className="profile-security-card">
                    <div className="security-header">
                        <div>
                            <h3>🔒 Sécurité</h3>
                            <p>Gérez votre mot de passe et la sécurité de votre compte</p>
                        </div>
                        <button
                            className="btn-change-password"
                            onClick={() => {
                                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                setIsPasswordModalOpen(true);
                            }}
                        >
                            Changer le mot de passe
                        </button>
                    </div>
                </div>

                {/* Préférences */}
                <div className="profile-preferences-card">
                    <h3>⚙️ Préférences</h3>
                    <div className="preferences-list">
                        <div className="preference-item">
                            <div className="preference-info">
                                <span className="preference-icon">🔔</span>
                                <div>
                                    <div className="preference-title">Notifications</div>
                                    <div className="preference-desc">Recevoir des rappels quotidiens</div>
                                </div>
                            </div>
                            <label className="toggle-switch">
                                <input type="checkbox" defaultChecked />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>

                        <div className="preference-item">
                            <div className="preference-info">
                                <span className="preference-icon">🌙</span>
                                <div>
                                    <div className="preference-title">Mode sombre</div>
                                    <div className="preference-desc">Activer le thème sombre</div>
                                </div>
                            </div>
                            <label className="toggle-switch">
                                <input type="checkbox" />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>

                        <div className="preference-item">
                            <div className="preference-info">
                                <span className="preference-icon">📧</span>
                                <div>
                                    <div className="preference-title">Emails</div>
                                    <div className="preference-desc">Recevoir des résumés hebdomadaires</div>
                                </div>
                            </div>
                            <label className="toggle-switch">
                                <input type="checkbox" defaultChecked />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Zone de danger */}
                <div className="profile-danger-card">
                    <h3>⚠️ Zone de danger</h3>
                    <p className="danger-warning">
                        Les actions ci-dessous sont irréversibles. Procédez avec prudence.
                    </p>
                    <div className="danger-actions">
                        <button className="btn-danger-secondary">
                            Réinitialiser toutes les données
                        </button>
                        <button className="btn-danger">
                            Supprimer mon compte
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de changement de mot de passe */}
            <Modal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                title="Changer le mot de passe"
                size="medium"
            >
                <form onSubmit={handlePasswordSubmit} className="profile-modal-form">
                    <div className="form-group">
                        <label htmlFor="currentPassword">Mot de passe actuel</label>
                        <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="newPassword">Nouveau mot de passe</label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            required
                            minLength="6"
                        />
                        <span className="field-hint">Minimum 6 caractères</span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            required
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="btn-cancel">
                            Annuler
                        </button>
                        <button type="submit" className="btn-save">
                            Changer le mot de passe
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Settings;