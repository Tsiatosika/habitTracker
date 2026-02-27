import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { habitService } from '../../services/habitService';
import Modal from '../common/Modal';
import HabitForm from './HabitForm';
import HabitDetailModal from './HabitDetailModal';
import './HabitList.css';

const HabitList = () => {
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingHabit, setEditingHabit] = useState(null);
    const [selectedHabitId, setSelectedHabitId] = useState(null);

    useEffect(() => {
        loadHabits();
    }, []);

    const loadHabits = async () => {
        try {
            const data = await habitService.getAll();
            setHabits(data);
        } catch (error) {
            console.error('Error loading habits:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateHabit = async (habitData) => {
        try {
            await habitService.create(habitData);
            setIsModalOpen(false);
            loadHabits();
        } catch (error) {
            console.error('Error creating habit:', error);
        }
    };

    const handleUpdateHabit = async (habitData) => {
        try {
            await habitService.update(editingHabit.id, habitData);
            setIsModalOpen(false);
            setEditingHabit(null);
            loadHabits();
        } catch (error) {
            console.error('Error updating habit:', error);
        }
    };

    const handleDeleteHabit = async (habitId) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette habitude ?')) {
            return;
        }

        try {
            await habitService.delete(habitId);
            loadHabits();
        } catch (error) {
            console.error('Error deleting habit:', error);
        }
    };

    const openEditModal = (habit) => {
        setEditingHabit(habit);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingHabit(null);
    };

    const openDetailModal = (habitId) => {
        setSelectedHabitId(habitId);
    };

    const closeDetailModal = () => {
        setSelectedHabitId(null);
    };

    if (loading) return <div className="loading">Chargement...</div>;

    return (
        <div className="habit-list-container">
            <div className="habit-list-header">
                <h1>Mes Habitudes</h1>
                <button
                    className="btn-create-habit"
                    onClick={() => setIsModalOpen(true)}
                >
                    + Nouvelle habitude
                </button>
            </div>

            {habits.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📝</div>
                    <h2>Aucune habitude</h2>
                    <p>Commencez par créer votre première habitude !</p>
                    <button
                        className="btn-create-first"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Créer ma première habitude
                    </button>
                </div>
            ) : (
                <div className="habits-grid">
                    {habits.map(habit => (
                        <div
                            key={habit.id}
                            className="habit-list-card"
                            style={{ borderLeftColor: habit.color }}
                        >
                            <div className="habit-card-header">
                                <div className="habit-title">
                                    <span className="habit-icon-large">{habit.icon || '📌'}</span>
                                    <h3>{habit.name}</h3>
                                </div>
                                <div className="habit-actions">
                                    <button
                                        className="btn-icon"
                                        onClick={() => openEditModal(habit)}
                                        title="Modifier"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        className="btn-icon"
                                        onClick={() => handleDeleteHabit(habit.id)}
                                        title="Supprimer"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>

                            {habit.description && (
                                <p className="habit-description">{habit.description}</p>
                            )}

                            <div className="habit-meta">
                                <span className="habit-frequency">
                                    {habit.frequency === 'daily' ? '📅 Quotidienne' : `📆 ${habit.target_days}x/semaine`}
                                </span>

                                {/* Option 1 : Quick view avec modal */}
                                <button
                                    className="btn-view-details"
                                    onClick={() => openDetailModal(habit.id)}
                                >
                                    Voir les détails →
                                </button>

                                {/* Option 2 : Navigation vers page complète */}
                                {/* <Link
                                    to={`/habits/${habit.id}`}
                                    className="btn-view-details"
                                >
                                    Vue complète →
                                </Link> */}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal pour créer/modifier */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={editingHabit ? 'Modifier l\'habitude' : 'Nouvelle habitude'}
            >
                <HabitForm
                    onSubmit={editingHabit ? handleUpdateHabit : handleCreateHabit}
                    onCancel={closeModal}
                    initialData={editingHabit}
                />
            </Modal>

            {/* Modal pour les détails */}
            <HabitDetailModal
                isOpen={!!selectedHabitId}
                onClose={closeDetailModal}
                habitId={selectedHabitId}
            />
        </div>
    );
};

export default HabitList;