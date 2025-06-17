import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import galleryService from '../../services/galleryService';

const GalleryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gallery, setGallery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadGallery();
  }, [id]);

  const loadGallery = async () => {
    try {
      setLoading(true);
      const data = await galleryService.getGalleryById(id);
      setGallery(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar la galería');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta imagen?')) {
      try {
        await galleryService.deleteImage(id, imageId);
        await loadGallery();
      } catch (err) {
        setError('Error al eliminar la imagen');
        console.error(err);
      }
    }
  };

  if (loading) return <div>Cargando galería...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!gallery) return <div>Galería no encontrada</div>;

  return (
    <div className="gallery-detail">
      <h2>{gallery.name}</h2>
      <p className="description">{gallery.description}</p>

      <div className="gallery-actions">
        <button onClick={() => navigate(`/galleries/edit/${id}`)}>
          Editar Galería
        </button>
        <button onClick={() => navigate('/galleries')}>
          Volver a la lista
        </button>
      </div>

      <div className="gallery-images">
        <h3>Imágenes</h3>
        {gallery.images && gallery.images.length > 0 ? (
          <div className="image-grid">
            {gallery.images.map((image) => (
              <div key={image.id} className="image-card">
                <img src={image.url} alt={image.name} />
                <button
                  className="delete-image"
                  onClick={() => handleDeleteImage(image.id)}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No hay imágenes en esta galería</p>
        )}
      </div>
    </div>
  );
};

export default GalleryDetail; 