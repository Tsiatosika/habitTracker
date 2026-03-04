import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { NotificationContext } from '../../context/NotificationContext';
import Modal from '../common/Modal';
import './Settings.css';

const Settings = () => {
    const navigate = useNavigate();
    const { user, changePassword, deleteAccount, resetData } = useContext(AuthContext);
    const { mode, toggleMode, themeName, changeTheme } = useContext(ThemeContext);
    const { permission, requestPermission } = useContext(NotificationContext);

    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState('');
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordErrors, setPasswordErrors] = useState({});
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loadingAction, setLoadingAction] = useState('');

    /* ─── Helpers ─── */
    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
        if (passwordErrors[name]) {
            setPasswordErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    /* ─── Validation mot de passe ─── */
    const validatePassword = () => {
        const errors = {};
        if (!passwordData.currentPassword) errors.currentPassword = 'Mot de passe actuel requis';
        if (!passwordData.newPassword) {
            errors.newPassword = 'Nouveau mot de passe requis';
        } else if (passwordData.newPassword.length < 6) {
            errors.newPassword = 'Minimum 6 caractères';
        }
        if (!passwordData.confirmPassword) {
            errors.confirmPassword = 'Confirmation requise';
        } else if (passwordData.newPassword !== passwordData.confirmPassword) {
            errors.confirmPassword = 'Les mots de passe ne correspondent pas';
        }
        return errors;
    };

    /* ─── Changer le mot de passe ─── */
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        const errors = validatePassword();
        if (Object.keys(errors).length > 0) {
            setPasswordErrors(errors);
            return;
        }
        setLoadingAction('password');
        try {
            await changePassword(passwordData.currentPassword, passwordData.newPassword);
            showMessage('success', 'Mot de passe modifié avec succès !');
            setIsPasswordModalOpen(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setPasswordErrors({});
        } catch (error) {
            const msg = error?.response?.data?.message || 'Mot de passe actuel incorrect';
            setPasswordErrors({ currentPassword: msg });
        } finally {
            setLoadingAction('');
        }
    };

    /* ─── Notifications navigateur ─── */
    const handleToggleNotifications = async () => {
        if (permission === 'granted') {
            showMessage('info', 'Pour désactiver, modifiez les permissions dans votre navigateur.');
        } else {
            const granted = await requestPermission();
            if (granted) {
                showMessage('success', 'Notifications activées !');
            } else {
                showMessage('error', 'Permission refusée. Activez-les dans les paramètres de votre navigateur.');
            }
        }
    };

    /* ─── Réinitialiser les données ─── */
    const handleResetData = async () => {
        setLoadingAction('reset');
        try {
            await resetData();
            showMessage('success', 'Toutes vos données ont été réinitialisées.');
            setIsResetModalOpen(false);
        } catch (error) {
            showMessage('error', 'Erreur lors de la réinitialisation.');
        } finally {
            setLoadingAction('');
        }
    };

    /* ─── Supprimer le compte ─── */
    const handleDeleteAccount = async () => {
        if (deleteConfirm !== user?.username) {
            showMessage('error', "Le nom d'utilisateur ne correspond pas.");
            return;
        }
        setLoadingAction('delete');
        try {
            await deleteAccount();
            navigate('/login');
        } catch (error) {
            showMessage('error', 'Erreur lors de la suppression du compte.');
            setLoadingAction('');
        }
    };

    const THEME_OPTIONS = [
        { key: 'light', label: 'Défaut', emoji: '☀️', color: '#667eea' },
        { key: 'ocean', label: 'Océan', emoji: '🌊', color: '#06b6d4' },
        { key: 'forest', label: 'Forêt', emoji: '🌿', color: '#10b981' },
        { key: 'sunset', label: 'Coucher de soleil', emoji: '🌅', color: '#f97316' },
    ];

    return (
        <div className="settings-container">
            <div className="settings-header">
                <h1>Paramètres</h1>
                <p className="settings-subtitle">Gérez la sécurité, l'apparence et vos préférences</p>
            </div>

            {message.text && (
                <div className={`settings-message ${message.type}`}>
                    <span className="message-icon">
                        {message.type === 'success' ? '✓' : message.type === 'info' ? 'ℹ' : '⚠'}
                    </span>
                    {message.text}
                </div>
            )}

            <div className="settings-content">

                {/* ── SÉCURITÉ ── */}
                <section className="settings-card">
                    <div className="settings-card-header">
                        <h2>🔒 Sécurité</h2>
                        <p>Gérez votre mot de passe et la sécurité de votre compte</p>
                    </div>
                    <div className="settings-item">
                        <div className="settings-item-info">
                            <div className="settings-item-icon">🔑</div>
                            <div>
                                <div className="settings-item-title">Mot de passe</div>
                                <div className="settings-item-desc">Changez régulièrement votre mot de passe</div>
                            </div>
                        </div>
                        <button
                            className="btn-secondary"
                            onClick={() => {
                                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                setPasswordErrors({});
                                setIsPasswordModalOpen(true);
                            }}
                        >
                            Modifier
                        </button>
                    </div>
                </section>

                {/* ── APPARENCE ── */}
                <section className="settings-card">
                    <div className="settings-card-header">
                        <h2>🎨 Apparence</h2>
                        <p>Personnalisez l'interface selon vos goûts</p>
                    </div>

                    <div className="settings-item">
                        <div className="settings-item-info">
                            <div className="settings-item-icon">{mode === 'dark' ? '🌙' : '☀️'}</div>
                            <div>
                                <div className="settings-item-title">Mode sombre</div>
                                <div className="settings-item-desc">
                                    {mode === 'dark' ? 'Thème sombre activé' : 'Thème clair activé'}
                                </div>
                            </div>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={mode === 'dark'}
                                onChange={toggleMode}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    {mode !== 'dark' && (
                        <div className="settings-item settings-item-column">
                            <div className="settings-item-info">
                                <div className="settings-item-icon">🖌️</div>
                                <div>
                                    <div className="settings-item-title">Couleur du thème</div>
                                    <div className="settings-item-desc">Choisissez votre palette de couleurs</div>
                                </div>
                            </div>
                            <div className="theme-palette">
                                {THEME_OPTIONS.map(t => (
                                    <button
                                        key={t.key}
                                        className={`theme-swatch ${themeName === t.key ? 'active' : ''}`}
                                        style={{ '--swatch-color': t.color }}
                                        onClick={() => changeTheme(t.key)}
                                        title={t.label}
                                    >
                                        <span className="swatch-dot"></span>
                                        <span className="swatch-label">{t.emoji} {t.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </section>

                {/* ── NOTIFICATIONS ── */}
                <section className="settings-card">
                    <div className="settings-card-header">
                        <h2>🔔 Notifications</h2>
                        <p>Contrôlez les alertes et rappels</p>
                    </div>

                    <div className="settings-item">
                        <div className="settings-item-info">
                            <div className="settings-item-icon">📳</div>
                            <div>
                                <div className="settings-item-title">Notifications navigateur</div>
                                <div className="settings-item-desc">
                                    {permission === 'granted'
                                        ? '✅ Activées'
                                        : permission === 'denied'
                                            ? '❌ Bloquées dans le navigateur'
                                            : '⏳ Permission non accordée'}
                                </div>
                            </div>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={permission === 'granted'}
                                onChange={handleToggleNotifications}
                                disabled={permission === 'denied'}
                            />
                            <span className={`toggle-slider ${permission === 'denied' ? 'disabled' : ''}`}></span>
                        </label>
                    </div>

                    {permission === 'denied' && (
                        <div className="settings-hint">
                            ⚠️ Les notifications sont bloquées. Activez-les dans les paramètres de votre navigateur.
                        </div>
                    )}
                </section>

                {/* ── ZONE DE DANGER ── */}
                <section className="settings-card settings-danger-card">
                    <div className="settings-card-header">
                        <h2>⚠️ Zone de danger</h2>
                        <p>Ces actions sont irréversibles. Procédez avec prudence.</p>
                    </div>

                    <div className="settings-item">
                        <div className="settings-item-info">
                            <div className="settings-item-icon">🗑️</div>
                            <div>
                                <div className="settings-item-title">Réinitialiser les données</div>
                                <div className="settings-item-desc">Supprime toutes vos habitudes et statistiques</div>
                            </div>
                        </div>
                        <button className="btn-danger-outline" onClick={() => setIsResetModalOpen(true)}>
                            Réinitialiser
                        </button>
                    </div>

                    <div className="settings-item">
                        <div className="settings-item-info">
                            <div className="settings-item-icon">💀</div>
                            <div>
                                <div className="settings-item-title">Supprimer mon compte</div>
                                <div className="settings-item-desc">Supprime définitivement votre compte et toutes vos données</div>
                            </div>
                        </div>
                        <button className="btn-danger" onClick={() => { setDeleteConfirm(''); setIsDeleteModalOpen(true); }}>
                            Supprimer
                        </button>
                    </div>
                </section>
            </div>

            {/* ── MODAL MOT DE PASSE ── */}
            <Modal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                title="Changer le mot de passe"
                size="medium"
            >
                <form onSubmit={handlePasswordSubmit} className="modal-form">
                    <div className="form-group">
                        <label>Mot de passe actuel</label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            placeholder="••••••••"
                            className={passwordErrors.currentPassword ? 'input-error' : ''}
                        />
                        {passwordErrors.currentPassword && (
                            <span className="field-error">{passwordErrors.currentPassword}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Nouveau mot de passe</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            placeholder="••••••••"
                            className={passwordErrors.newPassword ? 'input-error' : ''}
                        />
                        {passwordErrors.newPassword && (
                            <span className="field-error">{passwordErrors.newPassword}</span>
                        )}
                        {passwordData.newPassword && (
                            <div className="password-strength">
                                <div className={`strength-bar strength-${getPasswordStrength(passwordData.newPassword)}`}></div>
                                <span className="strength-label">{getPasswordStrengthLabel(passwordData.newPassword)}</span>
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Confirmer le nouveau mot de passe</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            placeholder="••••••••"
                            className={passwordErrors.confirmPassword ? 'input-error' : ''}
                        />
                        {passwordErrors.confirmPassword && (
                            <span className="field-error">{passwordErrors.confirmPassword}</span>
                        )}
                        {passwordData.confirmPassword && passwordData.newPassword === passwordData.confirmPassword && (
                            <span className="field-success">✓ Les mots de passe correspondent</span>
                        )}
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={() => setIsPasswordModalOpen(false)}>
                            Annuler
                        </button>
                        <button type="submit" className="btn-save" disabled={loadingAction === 'password'}>
                            {loadingAction === 'password' ? '⏳ Modification...' : 'Changer le mot de passe'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* ── MODAL RÉINITIALISATION ── */}
            <Modal
                isOpen={isResetModalOpen}
                onClose={() => setIsResetModalOpen(false)}
                title="Réinitialiser les données"
                size="small"
            >
                <div className="confirm-modal">
                    <div className="confirm-icon">🗑️</div>
                    <p className="confirm-text">
                        Êtes-vous sûr de vouloir <strong>supprimer toutes vos habitudes et statistiques</strong> ?
                        Cette action est irréversible.
                    </p>
                    <div className="form-actions">
                        <button className="btn-cancel" onClick={() => setIsResetModalOpen(false)}>
                            Annuler
                        </button>
                        <button
                            className="btn-danger"
                            onClick={handleResetData}
                            disabled={loadingAction === 'reset'}
                        >
                            {loadingAction === 'reset' ? '⏳ Réinitialisation...' : 'Oui, tout supprimer'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* ── MODAL SUPPRESSION COMPTE ── */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Supprimer mon compte"
                size="medium"
            >
                <div className="confirm-modal">
                    <div className="confirm-icon danger-icon">💀</div>
                    <p className="confirm-text">
                        Cette action supprimera <strong>définitivement</strong> votre compte et toutes vos données.
                        Cette opération est impossible à annuler.
                    </p>
                    <div className="form-group">
                        <label>
                            Tapez <strong>{user?.username}</strong> pour confirmer
                        </label>
                        <input
                            type="text"
                            value={deleteConfirm}
                            onChange={(e) => setDeleteConfirm(e.target.value)}
                            placeholder={user?.username}
                            className={deleteConfirm && deleteConfirm !== user?.username ? 'input-error' : ''}
                        />
                    </div>
                    <div className="form-actions">
                        <button className="btn-cancel" onClick={() => setIsDeleteModalOpen(false)}>
                            Annuler
                        </button>
                        <button
                            className="btn-danger"
                            onClick={handleDeleteAccount}
                            disabled={deleteConfirm !== user?.username || loadingAction === 'delete'}
                        >
                            {loadingAction === 'delete' ? '⏳ Suppression...' : 'Supprimer définitivement'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

/* ─── Utilitaires force mot de passe ─── */
const getPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 1) return 'weak';
    if (score <= 3) return 'medium';
    return 'strong';
};

const getPasswordStrengthLabel = (password) => {
    const s = getPasswordStrength(password);
    return { weak: '🔴 Faible', medium: '🟡 Moyen', strong: '🟢 Fort' }[s];
};

export default Settings;