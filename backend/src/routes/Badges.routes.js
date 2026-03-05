const express = require('express');
const router = express.Router();
const Badge = require('../models/Badge');
const { getBadgeInfo } = require('../utils/badgeChecker');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const rows = await Badge.findByUserId(userId);

        const badges = rows.map(row => ({
            ...row,
            ...getBadgeInfo(row.badge_type)
        }));

        res.json(badges);
    } catch (error) {
        console.error('Error fetching badges:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des badges' });
    }
});

module.exports = router;