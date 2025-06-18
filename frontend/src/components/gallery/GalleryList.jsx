import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import galleryService from '../../services/galleryService';
import { useToast } from '../ToastProvider';
import Modal from '../Modal';

const GALLERIES_PER_PAGE = 6;

const GalleryList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const toast = useToast();
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filteredGalleries, setFilteredGalleries] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [galleryToDelete, setGalleryToDelete] = useState(null);

  useEffect(() => {
    loadGalleries();
  }, []);

  useEffect(() => {
    handleFilter();
    setCurrentPage(1);
  }, [galleries]);

  const loadGalleries = async () => {
    try {
      setLoading(true);
      const data = await galleryService.getAllGalleries();
      setGalleries(data);
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

  // Buscador de galerías
  const handleFilter = () => {
    if (!search.trim()) {
      setFilteredGalleries(galleries);
    } else {
      const lower = search.toLowerCase();
      setFilteredGalleries(
        galleries.filter(
          (g) =>
            g.title.toLowerCase().includes(lower) ||
            g.site.toLowerCase().includes(lower)
        )
      );
    }
    setCurrentPage(1);
  };

  // Paginación
  const totalPages = Math.ceil(filteredGalleries.length / GALLERIES_PER_PAGE);
  const paginatedGalleries = filteredGalleries.slice(
    (currentPage - 1) * GALLERIES_PER_PAGE,
    currentPage * GALLERIES_PER_PAGE
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
      <div className="text-xl text-orange-600 font-semibold">Cargando galerías...</div>
    </div>
  );

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
        {/* Buscador */}
        <div className="mb-6 flex gap-2 max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Buscar por título o sitio"
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

        {filteredGalleries.length === 0 ? (
          <div className="text-center text-gray-600 text-lg bg-orange-50 rounded-lg p-8 mt-8 shadow">
            No hay galerías disponibles.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedGalleries.map((gallery) => (
                <div key={gallery.id} className="bg-white rounded-xl shadow-lg p-6 border border-orange-200 hover:shadow-xl transition-shadow">
                  <h3 className="text-xl font-bold text-orange-700 mb-2">{gallery.title}</h3>
                  <p className="text-gray-700 mb-1"><span className="font-semibold text-orange-500">Sitio:</span> {gallery.site}</p>
                  <p className="text-gray-700 mb-2">Fotos: {gallery.photos ? gallery.photos.length : 0}</p>
                  <div className="flex gap-2 mt-4">
                    <button
                      className="flex-1 bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded font-semibold transition"
                      onClick={() => navigate(`/galleries/${gallery.id}`)}
                    >
                      Ver
                    </button>
                    {isAdmin && (
                      <>
                        <button
                          className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded font-semibold transition"
                          onClick={() => navigate(`/galleries/edit/${gallery.id}`)}
                        >
                          Editar
                        </button>
                        <button
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold transition"
                          onClick={() => { setGalleryToDelete(gallery); setModalOpen(true); }}
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {/* Controles de paginación */}
            <div className="flex justify-center gap-2 mt-8">
              <button 
                onClick={() => goToPage(currentPage - 1)} 
                disabled={currentPage === 1}
                className="px-4 py-2 bg-orange-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-orange-600 transition"
              >
                &laquo;
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`px-4 py-2 rounded transition ${
                    currentPage === i + 1
                      ? 'bg-orange-600 text-white'
                      : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                  }`}
                  onClick={() => goToPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                onClick={() => goToPage(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-orange-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-orange-600 transition"
              >
                &raquo;
              </button>
            </div>
          </>
        )}
      </div>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Confirmar eliminación">
        <p>¿Estás seguro de que deseas eliminar la galería <b>{galleryToDelete?.title}</b>?</p>
        <div className="flex justify-end gap-4 mt-6">
          <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded" onClick={() => setModalOpen(false)}>Cancelar</button>
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded" onClick={async () => { await handleDelete(galleryToDelete); setModalOpen(false); }}>Eliminar</button>
        </div>
      </Modal>
    </div>
  );
};

export default GalleryList; 