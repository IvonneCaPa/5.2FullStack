import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import galleryService from '../../services/galleryService';
import { useToast } from '../ToastProvider';
import Modal from '../Modal';
import Loader from '../Loader';
import Table from '../Table';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const GALLERIES_PER_PAGE = 6;

const GalleryList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const toast = useToast();
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [galleryToDelete, setGalleryToDelete] = useState(null);

  useEffect(() => {
    loadGalleries();
  }, []);

  const loadGalleries = async () => {
    try {
      setLoading(true);
      const data = await galleryService.getAllGalleries();
      // Ordenar de más reciente a más antigua por fecha
      const sorted = [...data].sort((a, b) => {
        const dateA = new Date(a.date || a.updated_at || a.created_at);
        const dateB = new Date(b.date || b.updated_at || b.created_at);
        return dateB - dateA;
      });
      setGalleries(sorted);
      setError(null);
    } catch (err) {
      setError('Error al cargar las galerías');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (gallery) => {
    try {
      setLoading(true);
      await galleryService.deleteGallery(gallery.id);
      toast(`La galería "${gallery.title}" ha sido eliminada correctamente`, 'success');
      await loadGalleries();
    } catch (err) {
      toast('Error al eliminar la galería', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Columnas para la tabla
  const columns = [
    { label: 'Título', field: 'title' },
    { label: 'Sitio', field: 'site' },
    { label: 'Fotos', field: 'photos', render: (g) => g.photos ? g.photos.length : 0 },
    {
      label: 'Acciones',
      render: (gallery) => (
        <div className="flex gap-2">
          <button
            className="flex-1 bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded font-semibold transition flex items-center gap-2"
            onClick={() => navigate(`/galleries/${gallery.id}`)}
          >
            <FaEye /> Ver
          </button>
          {isAdmin && (
            <>
              <button
                className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded font-semibold transition flex items-center gap-2"
                onClick={() => navigate(`/galleries/edit/${gallery.id}`)}
              >
                <FaEdit /> Editar
              </button>
              <button
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold transition flex items-center gap-2"
                onClick={() => { setGalleryToDelete(gallery); setModalOpen(true); }}
              >
                <FaTrash /> Eliminar
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200 py-8 px-2">
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-orange-600 drop-shadow mb-2 md:mb-0">Gestión de Galerías</h1>
          {isAdmin && (
            <button
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded font-semibold shadow transition"
              onClick={() => navigate('/galleries/new')}
            >
              Crear Nueva Galería
            </button>
          )}
        </div>

        {/* Mensaje de advertencia para usuarios sin permisos */}
        {!isAdmin && (
          <div className="mb-6 p-4 bg-red-100 text-red-800 border border-red-300 rounded text-center font-semibold shadow">
            No tienes permisos para crear, editar o eliminar galerías.
          </div>
        )}

        {galleries.length === 0 ? (
          <div className="text-center text-gray-600 text-lg bg-orange-50 rounded-lg p-8 mt-8 shadow">
            No hay galerías disponibles.
          </div>
        ) : (
          <Table columns={columns} data={galleries} rowsPerPage={6} />
        )}

        {/* Modal de confirmación para eliminar */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Confirmar Eliminación"
        >
          <div className="p-6">
            <p className="text-gray-700 mb-6">
              ¿Estás seguro de que deseas eliminar la galería "{galleryToDelete?.title}"?
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
                  handleDelete(galleryToDelete);
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

export default GalleryList; 