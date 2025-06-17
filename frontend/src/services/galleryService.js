import api from './api';

const galleryService = {
  // Obtener todas las galerías
  getAllGalleries: async () => {
    try {
      const response = await api.get('/galleries');
      return response.data.galleries;
    } catch (error) {
      throw error;
    }
  },

  // Obtener una galería específica por ID
  getGalleryById: async (id) => {
    try {
      const response = await api.get(`/galleries/${id}`);
      return response.data.gallery;
    } catch (error) {
      throw error;
    }
  },

  // Crear una nueva galería
  createGallery: async (galleryData) => {
    try {
      const response = await api.post('/galleries', galleryData);
      return response.data.gallery;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar una galería existente
  updateGallery: async (id, galleryData) => {
    try {
      const response = await api.put(`/galleries/${id}`, galleryData);
      return response.data.gallery;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar una galería
  deleteGallery: async (id) => {
    try {
      const response = await api.delete(`/galleries/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Subir imágenes a una galería
  uploadImages: async (galleryId, images) => {
    try {
      const uploadPromises = images.map((image, index) => {
        const formData = new FormData();
        formData.append('location', image);
        formData.append('gallery_id', galleryId);
        formData.append('title', `${image.name.split('.')[0]}`); // Usar el nombre del archivo como título
        
        return api.post('/photos', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      });
      
      const responses = await Promise.all(uploadPromises);
      return responses.map(response => response.data);
    } catch (error) {
      console.error('Error al subir imágenes:', error.response?.data || error);
      throw error;
    }
  },

  // Eliminar una imagen de una galería
  deleteImage: async (photoId) => {
    try {
      const response = await api.delete(`/photos/${photoId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default galleryService; 