const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const {
    toggleCheck,
    getChecks,
    getTodayChecks
} = require('../controllers/checkController');

router.use(authenticateToken);

router.post('/', toggleCheck);
router.get('/today', getTodayChecks);
router.get('/:habit_id', getChecks);

module.exports = router;