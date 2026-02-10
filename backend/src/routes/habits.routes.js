const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const {
    createHabit,
    getHabits,
    getHabitById,
    updateHabit,
    deleteHabit
} = require('../controllers/habitController');

router.use(authenticateToken);

router.post('/', createHabit);
router.get('/', getHabits);
router.get('/:id', getHabitById);
router.put('/:id', updateHabit);
router.delete('/:id', deleteHabit);

module.exports = router;