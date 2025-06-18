import { useState, useEffect } from 'react';
import activityService from '../services/activityService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastProvider';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import Table from '../components/Table';
import { FaEdit, FaTrash, FaHeading, FaRegCalendarAlt, FaMapMarkerAlt, FaAlignLeft } from 'react-icons/fa';
import FormReusable from '../components/FormReusable';

const activityFields = (editingId) => [
  {
    name: 'title',
    type: 'text',
    placeholder: 'Título',
    required: true,
    icon: <FaHeading />,
    maxLength: 100,
  },
  {
    name: 'description',
    type: 'text',
    placeholder: 'Descripción',
    required: true,
    icon: <FaAlignLeft />,
    maxLength: 255,
  },
  {
    name: 'dateTime',
    type: 'date',
    placeholder: 'Fecha',
    required: true,
    icon: <FaRegCalendarAlt />,
  },
  {
    name: 'site',
    type: 'text',
    placeholder: 'Sitio',
    required: false,
    icon: <FaMapMarkerAlt />,
    maxLength: 100,
  },
];

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
    const [modalOpen, setModalOpen] = useState(false);
    const [activityToDelete, setActivityToDelete] = useState(null);
    const [creating, setCreating] = useState(false);
    const [formError, setFormError] = useState('');

    useEffect(() => {
        loadActivities();
    }, []);

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

    const handleEdit = (activity) => {
        // Formatear la fecha a YYYY-MM-DD para el input date
        const dateOnly = activity.dateTime ? new Date(activity.dateTime).toISOString().slice(0, 10) : '';
        setFormData({
            title: activity.title,
            description: activity.description,
            dateTime: dateOnly,
            site: activity.site || '',
        });
        setEditingId(activity.id);
        setShowForm(true);
        setFormError('');
    };

    const handleCancelEdit = () => {
        setFormData({
            title: '',
            description: '',
            dateTime: '',
            site: '',
        });
        setEditingId(null);
        setShowForm(false);
        setFormError('');
    };

    const handleSubmit = async (data) => {
        setFormError('');
        setCreating(true);
        try {
            if (editingId) {
                await activityService.update(editingId, data);
                toast('Actividad editada correctamente', 'success');
            } else {
                await activityService.create(data);
                toast('Actividad creada correctamente', 'success');
            }
            await loadActivities();
            handleCancelEdit();
        } catch (err) {
            setError('Error al guardar la actividad');
            setFormError('Error al guardar la actividad');
            toast('Error al guardar la actividad', 'error');
            console.error(err);
        } finally {
            setCreating(false);
        }
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

    // Columnas para la tabla
    const columns = [
        { label: 'Título', field: 'title' },
        { label: 'Descripción', field: 'description' },
        { label: 'Fecha', field: 'dateTime', render: (a) => new Date(a.dateTime).toLocaleDateString() },
        { label: 'Sitio', field: 'site' },
        {
            label: 'Acciones',
            render: (activity) => (
                isAdmin ? (
                    <>
                        <button
                            className="bg-orange-400 hover:bg-orange-500 text-white px-3 py-1 rounded mr-2 font-semibold transition flex items-center gap-2"
                            onClick={() => handleEdit(activity)}
                        >
                            <FaEdit /> Editar
                        </button>
                        <button
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded font-semibold transition flex items-center gap-2"
                            onClick={() => { setActivityToDelete(activity); setModalOpen(true); }}
                        >
                            <FaTrash /> Eliminar
                        </button>
                    </>
                ) : null
            ),
        },
    ];

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-100 to-orange-300 py-8 px-2">
            <div className="w-full max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-orange-600 drop-shadow mb-2 md:mb-0">Gestión de Actividades</h1>
                    {isAdmin && (
                        <button
                            onClick={() => {
                                if (showForm) {
                                    handleCancelEdit();
                                } else {
                                    setShowForm(true);
                                }
                            }}
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

                {/* Formulario de actividad */}
                {showForm && isAdmin && (
                    <FormReusable
                        fields={activityFields(editingId)}
                        initialValues={formData}
                        onSubmit={handleSubmit}
                        submitText={editingId ? 'Guardar cambios' : 'Crear actividad'}
                        loading={creating}
                        error={formError}
                        cancelText={editingId ? 'Cancelar' : 'Cerrar'}
                        onCancel={handleCancelEdit}
                    />
                )}

                {loading ? (
                    <div className="text-center text-orange-600 font-semibold p-4">Cargando...</div>
                ) : activities.length === 0 ? (
                    <div className="text-center text-orange-500 font-semibold p-4">No hay actividades registradas.</div>
                ) : (
                    <>
                        <Table columns={columns} data={activities} rowsPerPage={6} />
                        {/* Paginación */}
                        <div className="flex justify-center items-center gap-4 mb-8"></div>
                    </>
                )}

                {/* Modal de confirmación para eliminar */}
                <Modal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title="Confirmar Eliminación"
                >
                    <div className="p-6">
                        <p className="text-gray-700 mb-6">
                            ¿Estás seguro de que deseas eliminar la actividad "{activityToDelete?.title}"?
                            Esta acción no se puede deshacer.
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                                onClick={() => setModalOpen(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                onClick={() => {
                                    handleDelete(activityToDelete);
                                    setModalOpen(false);
                                }}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default Activities;
