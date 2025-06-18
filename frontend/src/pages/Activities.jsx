import { useState, useEffect } from 'react';
import activityService from '../services/activityService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastProvider';
import Modal from '../components/Modal';

const ACTIVITIES_PER_PAGE = 6;

const Activities = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';
    const toast = useToast();
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
    const [search, setSearch] = useState('');
    const [filteredActivities, setFilteredActivities] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [activityToDelete, setActivityToDelete] = useState(null);

    useEffect(() => {
        loadActivities();
    }, []);

    useEffect(() => {
        handleFilter();
        setCurrentPage(1);
    }, [activities]);

    const loadActivities = async () => {
        try {
            setLoading(true);
            const data = await activityService.getAll();
            // Ordenar de más reciente a más antigua
            const sorted = [...data].sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
            setActivities(sorted);
            setError(null);
        } catch (err) {
            setError('Error al cargar las actividades');
            toast('Error al cargar las actividades', 'error');
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
                toast('Actividad editada correctamente', 'success');
            } else {
                await activityService.create(formData);
                toast('Actividad creada correctamente', 'success');
            }
            await loadActivities();
            resetForm();
        } catch (err) {
            setError('Error al guardar la actividad');
            toast('Error al guardar la actividad', 'error');
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

    const handleDelete = async (activity) => {
        try {
            await activityService.delete(activity.id);
            await loadActivities();
            toast('Actividad eliminada correctamente', 'success');
        } catch (err) {
            setError('Error al eliminar la actividad');
            toast('Error al eliminar la actividad', 'error');
            console.error(err);
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

    const handleFilter = () => {
        if (!search.trim()) {
            setFilteredActivities(activities);
        } else {
            const lower = search.toLowerCase();
            setFilteredActivities(
                activities.filter(
                    (a) =>
                        a.title.toLowerCase().includes(lower) ||
                        a.description.toLowerCase().includes(lower)
                )
            );
        }
        setCurrentPage(1);
    };

    useEffect(() => {
        handleFilter();
    }, [search, activities]);

    const totalPages = Math.ceil(filteredActivities.length / ACTIVITIES_PER_PAGE);
    const paginatedActivities = filteredActivities.slice(
        (currentPage - 1) * ACTIVITIES_PER_PAGE,
        currentPage * ACTIVITIES_PER_PAGE
    );

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };
    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-100 to-orange-300 py-8 px-2">
            <div className="w-full max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-orange-600 drop-shadow mb-2 md:mb-0">Gestión de Actividades</h1>
                    {isAdmin && (
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded font-semibold shadow transition"
                        >
                            {showForm ? 'Cancelar' : 'Nueva Actividad'}
                        </button>
                    )}
                </div>

                {/* Mensaje de advertencia para usuarios sin permisos */}
                {!isAdmin && (
                    <div className="mb-6 p-4 bg-red-100 text-red-800 border border-red-300 rounded text-center font-semibold shadow">
                        No tienes permisos para crear, editar o eliminar actividades.
                    </div>
                )}

                {/* Barra de búsqueda */}
                <div className="mb-6 flex gap-2 max-w-xl mx-auto">
                    <input
                        type="text"
                        placeholder="Buscar por título o descripción"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border border-orange-300 px-3 py-2 rounded w-full focus:ring-2 focus:ring-orange-400 focus:outline-none"
                    />
                    <button
                        className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded font-semibold transition"
                        onClick={handleFilter}
                        type="button"
                    >
                        Buscar
                    </button>
                </div>

                {showForm && isAdmin && (
                    <form onSubmit={handleSubmit} className="mb-10 bg-white rounded-xl shadow-lg p-8 border border-orange-200 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block mb-2 font-semibold text-orange-700">Título:</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-orange-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-2 font-semibold text-orange-700">Fecha y hora:</label>
                                <input
                                    type="datetime-local"
                                    name="dateTime"
                                    value={formData.dateTime}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-orange-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block mb-2 font-semibold text-orange-700">Descripción:</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-orange-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                                    rows="3"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-2 font-semibold text-orange-700">Sitio:</label>
                                <input
                                    type="text"
                                    name="site"
                                    value={formData.site}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-orange-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-6 py-2 border border-orange-400 text-orange-600 rounded font-semibold hover:bg-orange-50 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded font-semibold shadow transition"
                            >
                                {editingId ? 'Actualizar' : 'Crear'}
                            </button>
                        </div>
                        {error && <div className="text-red-500 mt-4 font-semibold">{error}</div>}
                    </form>
                )}

                {loading ? (
                    <div className="text-center text-orange-600 font-semibold p-4">Cargando...</div>
                ) : filteredActivities.length === 0 ? (
                    <div className="text-center text-orange-500 font-semibold p-4">No hay actividades registradas.</div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                            {paginatedActivities.map(activity => (
                                <div key={activity.id} className="bg-white rounded-xl shadow-lg p-6 border border-orange-200 flex flex-col justify-between h-full">
                                    <div>
                                        <h3 className="text-xl font-bold text-orange-700 mb-2">{activity.title}</h3>
                                        <p className="text-gray-700 mb-2">{activity.description}</p>
                                        <div className="text-sm text-orange-600 mb-1">
                                            <span className="font-semibold">Fecha y hora:</span> {new Date(activity.dateTime).toLocaleString()}
                                        </div>
                                        <div className="text-sm text-orange-600 mb-4">
                                            <span className="font-semibold">Sitio:</span> {activity.site}
                                        </div>
                                    </div>
                                    {isAdmin && (
                                        <div className="flex justify-end gap-2 mt-4">
                                            <button
                                                onClick={() => handleEdit(activity)}
                                                className="px-4 py-1 bg-orange-400 hover:bg-orange-500 text-white rounded font-semibold shadow transition"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => { setActivityToDelete(activity); setModalOpen(true); }}
                                                className="px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded font-semibold shadow transition"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        {/* Paginación */}
                        <div className="flex justify-center items-center gap-4 mb-8">
                            <button
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 rounded font-semibold border border-orange-400 text-orange-600 bg-white shadow transition ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-50'}`}
                            >
                                Anterior
                            </button>
                            <span className="font-semibold text-orange-700">
                                Página {currentPage} de {totalPages}
                            </span>
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className={`px-4 py-2 rounded font-semibold border border-orange-400 text-orange-600 bg-white shadow transition ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-50'}`}
                            >
                                Siguiente
                            </button>
                        </div>
                    </>
                )}
            </div>
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Confirmar eliminación">
                <p>¿Estás seguro de que deseas eliminar la actividad <b>{activityToDelete?.title}</b>?</p>
                <div className="flex justify-end gap-4 mt-6">
                    <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded" onClick={() => setModalOpen(false)}>Cancelar</button>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded" onClick={async () => { await handleDelete(activityToDelete); setModalOpen(false); }}>Eliminar</button>
                </div>
            </Modal>
        </div>
    );
};

export default Activities;
