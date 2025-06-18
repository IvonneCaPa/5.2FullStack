import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import galleryService from '../../services/galleryService';
import { useToast } from '../ToastProvider';
import FormReusable from '../FormReusable';
import { FaImage, FaCalendarAlt, FaMapMarkerAlt, FaHeading } from 'react-icons/fa';

const galleryFields = [
  {
    name: 'title',
    type: 'text',
    placeholder: 'Título',
    required: true,
    icon: <FaHeading />,
    maxLength: 20,
  },
  {
    name: 'date',
    type: 'date',
    placeholder: 'Fecha',
    required: true,
    icon: <FaCalendarAlt />,
  },
  {
    name: 'site',
    type: 'text',
    placeholder: 'Sitio',
    required: true,
    icon: <FaMapMarkerAlt />,
    maxLength: 45,
  },
  {
    name: 'images',
    type: 'file',
    placeholder: 'Imágenes',
    required: false,
    icon: <FaImage />,
    accept: 'image/jpeg,image/jpg,image/png,image/gif,image/webp',
    multiple: true,
    maxSize: 10 * 1024 * 1024,
  },
];

const GalleryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    site: '',
    images: [],
  });
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
        title: data.title,
        date: data.date ? data.date.slice(0, 10) : '',
        site: data.site,
        images: [],
      });
      setError(null);
    } catch (err) {
      setError('Error al cargar la galería');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const formattedData = {
        ...data,
        date: new Date(data.date).toISOString().split('T')[0],
      };
      let galleryId = id;
      if (id) {
        await galleryService.updateGallery(id, formattedData);
        galleryId = id;
      } else {
        const newGallery = await galleryService.createGallery(formattedData);
        galleryId = newGallery.id;
      }
      // Subir imágenes si hay
      if (data.images && data.images.length > 0) {
        try {
          await galleryService.uploadImages(galleryId, data.images);
        } catch (uploadError) {
          setError('Error al subir las imágenes: ' + uploadError.message);
          toast('Error al subir las imágenes: ' + uploadError.message, 'error');
          return;
        }
      }
      toast(id ? 'Galería actualizada correctamente' : 'Galería creada correctamente', 'success');
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
      <FormReusable
        fields={galleryFields}
        initialValues={formData}
        onSubmit={handleSubmit}
        submitText={id ? 'Guardar cambios' : 'Crear galería'}
        loading={loading}
        error={error}
        cancelText="Cancelar"
        onCancel={() => navigate('/galleries')}
      />
    </div>
  );
};

export default GalleryForm; 