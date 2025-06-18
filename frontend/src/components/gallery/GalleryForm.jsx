import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import galleryService from '../../services/galleryService';
import { useToast } from '../ToastProvider';

const GalleryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    site: ''
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

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
        title: data.title,
        date: data.date ? data.date.slice(0, 10) : '', // Solo YYYY-MM-DD
        site: data.site
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

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'El archivo debe ser una imagen (jpeg, jpg, png, gif, webp)';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'El archivo no puede ser mayor a 10MB';
    }
    return null;
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageError(null);

    // Validar cada archivo
    for (const file of files) {
      const error = validateFile(file);
      if (error) {
        setImageError(error);
        e.target.value = ''; // Limpiar el input
        return;
      }
    }

    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      // Asegurarnos de que la fecha está en el formato correcto (YYYY-MM-DD)
      const formattedData = {
        ...formData,
        date: new Date(formData.date).toISOString().split('T')[0]
      };

      if (id) {
        await galleryService.updateGallery(id, formattedData);
        if (images.length > 0) {
          try {
            await galleryService.uploadImages(id, images);
          } catch (uploadError) {
            setError('Error al subir las imágenes: ' + uploadError.message);
            toast('Error al subir las imágenes: ' + uploadError.message, 'error');
            console.error('Error al subir imágenes:', uploadError);
            return;
          }
        }
        toast('Galería actualizada correctamente', 'success');
      } else {
        const newGallery = await galleryService.createGallery(formattedData);
        if (images.length > 0) {
          try {
            await galleryService.uploadImages(newGallery.id, images);
          } catch (uploadError) {
            setError('Error al subir las imágenes: ' + uploadError.message);
            toast('Error al subir las imágenes: ' + uploadError.message, 'error');
            console.error('Error al subir imágenes:', uploadError);
            return;
          }
        }
        toast('Galería creada correctamente', 'success');
      }
      navigate('/galleries');
    } catch (err) {
      setError('Error al guardar la galería: ' + err.message);
      toast('Error al guardar la galería: ' + err.message, 'error');
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
      {imageError && <div className="error">{imageError}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Título:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            maxLength={20}
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Fecha:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="site">Sitio:</label>
          <input
            type="text"
            id="site"
            name="site"
            value={formData.site}
            onChange={handleChange}
            required
            maxLength={45}
          />
        </div>

        <div className="form-group">
          <label htmlFor="images">
            Imágenes: 
            <small> (Formatos permitidos: JPEG, JPG, PNG, GIF, WEBP. Tamaño máximo: 10MB)</small>
          </label>
          <input
            type="file"
            id="images"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleImageChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading || imageError}>
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