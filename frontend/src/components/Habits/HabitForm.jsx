import { useState } from 'react';
import './HabitForm.css';

const COLORS = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'
];

const ICONS = ['💪', '📚', '🏃', '🧘', '💧', '🎯', '✍️', '🎨'];

const HabitForm = ({ onSubmit, onCancel, initialData = null }) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
        color: initialData?.color || COLORS[0],
        icon: initialData?.icon || ICONS[0],
        frequency: initialData?.frequency || 'daily',
        target_days: initialData?.target_days || 7
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <form className="habit-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Nom de l'habitude *</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ex: Lire 30 minutes"
                    required
                />
            </div>

            <div className="form-group">
                <label>Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Pourquoi cette habitude est importante..."
                    rows="3"
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Icône</label>
                    <div className="icon-picker">
                        {ICONS.map(icon => (
                            <button
                                key={icon}
                                type="button"
                                className={`icon-option ${formData.icon === icon ? 'selected' : ''}`}
                                onClick={() => setFormData(prev => ({ ...prev, icon }))}
                            >
                                {icon}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Couleur</label>
                    <div className="color-picker">
                        {COLORS.map(color => (
                            <button
                                key={color}
                                type="button"
                                className={`color-option ${formData.color === color ? 'selected' : ''}`}
                                style={{ backgroundColor: color }}
                                onClick={() => setFormData(prev => ({ ...prev, color }))}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="form-group">
                <label>Fréquence</label>
                <select
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleChange}
                >
                    <option value="daily">Quotidienne</option>
                    <option value="weekly">Hebdomadaire</option>
                </select>
            </div>

            {formData.frequency === 'weekly' && (
                <div className="form-group">
                    <label>Objectif (jours par semaine)</label>
                    <input
                        type="number"
                        name="target_days"
                        value={formData.target_days}
                        onChange={handleChange}
                        min="1"
                        max="7"
                    />
                </div>
            )}

            <div className="form-actions">
                <button type="button" onClick={onCancel} className="btn-cancel">
                    Annuler
                </button>
                <button type="submit" className="btn-submit">
                    {initialData ? 'Modifier' : 'Créer'}
                </button>
            </div>
        </form>
    );
};

export default HabitForm;