import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import galleryService from '../../services/galleryService';
import Loader from '../Loader';

const backendUrl = 'http://localhost:8000';
const PHOTOS_PER_PAGE = 6;

const GalleryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gallery, setGallery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [erroredImages, setErroredImages] = useState({});
  const [modalPhoto, setModalPhoto] = useState(null);
  const [currentPhotoPage, setCurrentPhotoPage] = useState(1);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    loadGallery();
  }, [id]);

  const loadGallery = async () => {
    try {
      setLoading(true);
      const data = await galleryService.getGalleryById(id);
      setGallery(data);
      setError(null);
      setCurrentPhotoPage(1); // Reiniciar paginación al cargar galería
    } catch (err) {
      setError('Error al cargar la galería');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (photoId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta imagen?')) {
      try {
        await galleryService.deleteImage(photoId);
        setSuccessMessage('Imagen eliminada correctamente');
        await loadGallery();
      } catch (err) {
        setError('Error al eliminar la imagen');
        console.error(err);
      } finally {
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      return dateString; // Devolver la fecha original si no es válida
    }
    return date.toLocaleDateString('es-ES', options);
  };

  // Paginación de fotos
  const totalPhotos = gallery && gallery.photos ? gallery.photos.length : 0;
  const totalPhotoPages = Math.ceil(totalPhotos / PHOTOS_PER_PAGE);
  const paginatedPhotos = gallery && gallery.photos
    ? gallery.photos.slice((currentPhotoPage - 1) * PHOTOS_PER_PAGE, currentPhotoPage * PHOTOS_PER_PAGE)
    : [];

  const goToPhotoPage = (page) => {
    if (page >= 1 && page <= totalPhotoPages) {
      setCurrentPhotoPage(page);
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;
  if (!gallery) return <div className="not-found">Galería no encontrada</div>;

  return (
    <div className="gallery-detail">
      <div className="gallery-header">
        <h2>{gallery.title}</h2>
        <div className="gallery-actions">
          <button 
            className="edit-btn"
            onClick={() => navigate(`/galleries/edit/${id}`)}
          >
            Editar Galería
          </button>
          <button 
            className="back-btn"
            onClick={() => navigate('/galleries')}
          >
            Volver a la lista
          </button>
        </div>
      </div>

      <div className="gallery-info">
        <p><strong>Fecha:</strong> {formatDate(gallery.date)}</p>
        <p><strong>Sitio:</strong> {gallery.site}</p>
      </div>

      <div className="gallery-images">
        <h3>Imágenes de la Galería</h3>
        {successMessage && <div className="success-message">{successMessage}</div>}
        {totalPhotos > 0 ? (
          <>
          <div className="image-grid">
            {paginatedPhotos.map((photo) => (
              <div key={photo.id} className="image-card">
                {erroredImages[photo.id] ? (
                  <div className="image-error">Imagen no disponible</div>
                ) : (
                  <img
                    src={photo.location ? `${backendUrl}${photo.location}` : ''}
                    alt={photo.title}
                    onError={() => setErroredImages(prev => ({ ...prev, [photo.id]: true }))}
                    onClick={() => setModalPhoto(photo)}
                    style={{ cursor: 'pointer' }}
                  />
                )}
                <div className="image-title">{photo.title}</div>
                <div className="image-overlay">
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteImage(photo.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* Controles de paginación de fotos */}
          {totalPhotoPages > 1 && (
            <div className="pagination">
              <button onClick={() => goToPhotoPage(currentPhotoPage - 1)} disabled={currentPhotoPage === 1}>&laquo;</button>
              {Array.from({ length: totalPhotoPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={currentPhotoPage === i + 1 ? 'active' : ''}
                  onClick={() => goToPhotoPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button onClick={() => goToPhotoPage(currentPhotoPage + 1)} disabled={currentPhotoPage === totalPhotoPages}>&raquo;</button>
            </div>
          )}
          </>
        ) : (
          <p className="no-images">No hay imágenes en esta galería</p>
        )}
      </div>

      {/* Modal para ver imagen en grande */}
      {modalPhoto && (
        <div className="modal-overlay" onClick={() => setModalPhoto(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalPhoto(null)}>&times;</button>
            <img
              src={modalPhoto.location ? `${backendUrl}${modalPhoto.location}` : ''}
              alt={modalPhoto.title}
              className="modal-image"
            />
            <div className="modal-title">{modalPhoto.title}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryDetail; 