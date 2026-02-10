import { useState, useEffect } from 'react';
import { habitService } from '../services/habitService';

const useHabits = () => {
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadHabits();
    }, []);

    const loadHabits = async () => {
        try {
            setLoading(true);
            const data = await habitService.getAll();
            setHabits(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error loading habits:', err);
        } finally {
            setLoading(false);
        }
    };

    const createHabit = async (habitData) => {
        try {
            const newHabit = await habitService.create(habitData);
            setHabits(prev => [...prev, newHabit]);
            return newHabit;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const updateHabit = async (habitId, habitData) => {
        try {
            const updatedHabit = await habitService.update(habitId, habitData);
            setHabits(prev =>
                prev.map(h => h.id === habitId ? updatedHabit : h)
            );
            return updatedHabit;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const deleteHabit = async (habitId) => {
        try {
            await habitService.delete(habitId);
            setHabits(prev => prev.filter(h => h.id !== habitId));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    return {
        habits,
        loading,
        error,
        loadHabits,
        createHabit,
        updateHabit,
        deleteHabit
    };
};

export default useHabits;