import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import galleryService from '../../services/galleryService';

const GalleryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      loadGallery();
    }
  }, [id]);

  const loadGallery = async () => {
    try {
      setLoading(true);
      const data = await galleryService.getGalleryById(id);
      setFormData({
        name: data.name,
        description: data.description,
      });
      setError(null);
    } catch (err) {
      setError('Error al cargar la galería');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (id) {
        await galleryService.updateGallery(id, formData);
        if (images.length > 0) {
          await galleryService.uploadImages(id, images);
        }
      } else {
        const newGallery = await galleryService.createGallery(formData);
        if (images.length > 0) {
          await galleryService.uploadImages(newGallery.id, images);
        }
      }
      navigate('/galleries');
    } catch (err) {
      setError('Error al guardar la galería');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="gallery-form">
      <h2>{id ? 'Editar Galería' : 'Nueva Galería'}</h2>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nombre:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="images">Imágenes:</label>
          <input
            type="file"
            id="images"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          <button type="button" onClick={() => navigate('/galleries')}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default GalleryForm; 