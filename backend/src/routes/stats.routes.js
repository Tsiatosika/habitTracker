const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const {
    getOverallStats,
    getHabitStats
} = require('../controllers/statsController');

router.use(authenticateToken);

router.get('/overall', getOverallStats);
router.get('/habit/:habit_id', getHabitStats);

module.exports = router;