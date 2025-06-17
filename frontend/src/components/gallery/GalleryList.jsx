import React, { useState, useEffect } from 'react';
import galleryService from '../../services/galleryService';

const GalleryList = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta galería?')) {
      try {
        await galleryService.deleteGallery(id);
        await loadGalleries();
      } catch (err) {
        setError('Error al eliminar la galería');
        console.error(err);
      }
    }
  };

  if (loading) return <div>Cargando galerías...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="gallery-list">
      <h2>Galerías</h2>
      <div className="gallery-grid">
        {galleries.map((gallery) => (
          <div key={gallery.id} className="gallery-card">
            <h3>{gallery.title}</h3>
            <p>{gallery.date}</p>
            <p>{gallery.site}</p>
            <div className="gallery-actions">
              <button onClick={() => window.location.href = `/galleries/${gallery.id}`}>
                Ver
              </button>
              <button onClick={() => window.location.href = `/galleries/edit/${gallery.id}`}>
                Editar
              </button>
              <button onClick={() => handleDelete(gallery.id)} className="delete">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryList; 