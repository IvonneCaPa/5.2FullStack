import { useState, useEffect } from 'react';
import activityService from '../services/activityService';

const Activities = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dateTime: '',
        site: '',
    });
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // Cargar actividades al montar el componente
    useEffect(() => {
        loadActivities();
    }, []);

    const loadActivities = async () => {
        try {
            setLoading(true);
            const data = await activityService.getAll();
            setActivities(data);
            setError(null);
        } catch (err) {
            setError('Error al cargar las actividades');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await activityService.update(editingId, formData);
            } else {
                await activityService.create(formData);
            }
            await loadActivities();
            resetForm();
        } catch (err) {
            setError('Error al guardar la actividad');
            console.error(err);
        }
    };

    const handleEdit = (activity) => {
        setFormData({
            title: activity.title,
            description: activity.description,
            dateTime: activity.dateTime,
            site: activity.site || '',
        });
        setEditingId(activity.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta actividad?')) {
            try {
                await activityService.delete(id);
                await loadActivities();
            } catch (err) {
                setError('Error al eliminar la actividad');
                console.error(err);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            dateTime: '',
            site: '',
        });
        setEditingId(null);
        setShowForm(false);
    };

    if (loading) return <div className="text-center p-4">Cargando...</div>;
    if (error) return <div className="text-red-500 p-4">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Gestión de Actividades</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    {showForm ? 'Cancelar' : 'Nueva Actividad'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-8 p-4 bg-white rounded shadow">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2">Título:</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Fecha y hora:</label>
                            <input
                                type="datetime-local"
                                name="dateTime"
                                value={formData.dateTime}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block mb-2">Descripción:</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                rows="3"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Sitio:</label>
                            <input
                                type="text"
                                name="site"
                                value={formData.site}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={resetForm}
                            className="px-4 py-2 border rounded hover:bg-gray-100"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            {editingId ? 'Actualizar' : 'Crear'}
                        </button>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activities.map(activity => (
                    <div key={activity.id} className="bg-white p-4 rounded shadow">
                        <h3 className="text-xl font-semibold mb-2">{activity.title}</h3>
                        <p className="text-gray-600 mb-2">{activity.description}</p>
                        <div className="text-sm text-gray-500 mb-2">
                            Fecha y hora: {new Date(activity.dateTime).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500 mb-2">
                            Sitio: {activity.site}
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => handleEdit(activity)}
                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDelete(activity.id)}
                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Activities;
