const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const signup = async (req, res) => {
    try {
        const { email, password, username } = req.body;

        // Validation
        if (!email || !password || !username) {
            return res.status(400).json({ error: 'All fields required' });
        }

        // Vérifier si email existe
        const userExists = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Créer utilisateur
        const result = await pool.query(
            'INSERT INTO users (email, password_hash, username) VALUES ($1, $2, $3) RETURNING id, email, username',
            [email, passwordHash, username]
        );

        const user = result.rows[0];

        // Générer token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: { id: user.id, email: user.email, username: user.username }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Trouver utilisateur
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];

        // Vérifier password
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Générer token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                avatar: user.avatar,
                bio: user.bio
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const changePassword = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Tous les champs sont requis' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
        }

        // Récupérer le hash actuel
        const result = await pool.query('SELECT password_hash FROM users WHERE id = $1', [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        // Vérifier le mot de passe actuel
        const valid = await bcrypt.compare(currentPassword, result.rows[0].password_hash);
        if (!valid) {
            return res.status(401).json({ message: 'Mot de passe actuel incorrect' });
        }

        // Hasher et sauvegarder le nouveau mot de passe
        const newHash = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newHash, userId]);

        res.json({ message: 'Mot de passe modifié avec succès' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { username, email, bio, avatar } = req.body;

        // Construction de la requête SQL dynamique
        const updates = [];
        const values = [];
        let paramIndex = 1;

        // Ajouter les champs fournis
        if (username !== undefined) {
            if (!username || username.trim().length < 2) {
                return res.status(400).json({ error: 'Le nom doit contenir au moins 2 caractères' });
            }
            updates.push(`username = $${paramIndex++}`);
            values.push(username);
        }

        if (email !== undefined) {
            if (!email || !email.includes('@')) {
                return res.status(400).json({ error: 'Email invalide' });
            }
            // Vérifier si l'email est déjà pris
            const emailCheck = await pool.query(
                'SELECT id FROM users WHERE email = $1 AND id != $2',
                [email, userId]
            );
            if (emailCheck.rows.length > 0) {
                return res.status(400).json({ error: 'Cet email est déjà utilisé' });
            }
            updates.push(`email = $${paramIndex++}`);
            values.push(email);
        }

        if (bio !== undefined) {
            updates.push(`bio = $${paramIndex++}`);
            values.push(bio || null);
        }

        if (avatar !== undefined) {
            updates.push(`avatar = $${paramIndex++}`);
            values.push(avatar);
        }

        // Si aucun champ à mettre à jour
        if (updates.length === 0) {
            return res.status(400).json({ error: 'Aucune donnée à mettre à jour' });
        }

        // Ajouter updated_at
        updates.push('updated_at = CURRENT_TIMESTAMP');

        // Ajouter l'userId pour le WHERE
        values.push(userId);

        // Construire et exécuter la requête
        const query = `
            UPDATE users
            SET ${updates.join(', ')}
            WHERE id = $${paramIndex}
            RETURNING id, email, username, bio, avatar, created_at, updated_at
        `;

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

const resetData = async (req, res) => {
    const client = await pool.connect();
    try {
        const userId = req.user.userId;
        await client.query('BEGIN');

        // Supprimer dans l'ordre pour respecter les FK
        await client.query('DELETE FROM user_badges WHERE user_id = $1', [userId]);
        await client.query(
            `DELETE FROM habit_checks WHERE habit_id IN (
                SELECT id FROM habits WHERE user_id = $1
            )`, [userId]
        );
        await client.query('DELETE FROM habits WHERE user_id = $1', [userId]);

        await client.query('COMMIT');
        res.json({ message: 'Données réinitialisées avec succès' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Reset data error:', error);
        res.status(500).json({ error: 'Erreur lors de la réinitialisation' });
    } finally {
        client.release();
    }
};

const deleteAccount = async (req, res) => {
    const client = await pool.connect();
    try {
        const userId = req.user.userId;
        await client.query('BEGIN');

        // Supprimer toutes les données liées puis l'utilisateur
        await client.query('DELETE FROM user_badges WHERE user_id = $1', [userId]);
        await client.query(
            `DELETE FROM habit_checks WHERE habit_id IN (
                SELECT id FROM habits WHERE user_id = $1
            )`, [userId]
        );
        await client.query('DELETE FROM habits WHERE user_id = $1', [userId]);
        await client.query('DELETE FROM users WHERE id = $1', [userId]);

        await client.query('COMMIT');
        res.json({ message: 'Compte supprimé avec succès' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Delete account error:', error);
        res.status(500).json({ error: 'Erreur lors de la suppression' });
    } finally {
        client.release();
    }
};

module.exports = {
    signup,
    login,
    changePassword,
    updateProfile,
    resetData,
    deleteAccount
};