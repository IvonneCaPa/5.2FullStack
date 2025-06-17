import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import galleryService from '../../services/galleryService';

const GALLERIES_PER_PAGE = 6;

const GalleryList = () => {
  const navigate = useNavigate();
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadGalleries();
  }, []);

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
    const confirmMessage = `¿Estás seguro de que deseas eliminar la galería "${gallery.title}"?\n\nEsta acción eliminará permanentemente la galería y todas sus fotos asociadas.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        setLoading(true);
        await galleryService.deleteGallery(gallery.id);
        setSuccessMessage(`La galería "${gallery.title}" ha sido eliminada correctamente`);
        await loadGalleries();
      } catch (err) {
        setError('Error al eliminar la galería');
        console.error(err);
      } finally {
        setLoading(false);
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      }
    }
  };

  // Paginación
  const totalPages = Math.ceil(galleries.length / GALLERIES_PER_PAGE);
  const paginatedGalleries = galleries.slice(
    (currentPage - 1) * GALLERIES_PER_PAGE,
    currentPage * GALLERIES_PER_PAGE
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) return <div className="loading">Cargando galerías...</div>;

  return (
    <div className="gallery-list">
      <div className="gallery-header">
        <h2>Galerías</h2>
        <button 
          className="create-gallery-btn"
          onClick={() => navigate('/galleries/new')}
        >
          Crear Nueva Galería
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      {galleries.length === 0 ? (
        <div className="no-galleries">
          No hay galerías disponibles. ¡Crea una nueva!
        </div>
      ) : (
        <>
        <div className="gallery-grid">
          {paginatedGalleries.map((gallery) => (
            <div key={gallery.id} className="gallery-card">
              <h3>{gallery.title}</h3>
              <p>{gallery.site}</p>
              <p>Fotos: {gallery.photos ? gallery.photos.length : 0}</p>
              <div className="gallery-actions">
                <button 
                  className="view-btn"
                  onClick={() => navigate(`/galleries/${gallery.id}`)}
                >
                  Ver
                </button>
                <button 
                  className="edit-btn"
                  onClick={() => navigate(`/galleries/edit/${gallery.id}`)}
                >
                  Editar
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(gallery)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Controles de paginación */}
        <div className="pagination">
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>&laquo;</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={currentPage === i + 1 ? 'active' : ''}
              onClick={() => goToPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>&raquo;</button>
        </div>
        </>
      )}
    </div>
  );
};

export default GalleryList; 