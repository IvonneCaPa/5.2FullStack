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
      const formData = new FormData();
      images.forEach((image) => {
        formData.append('images[]', image);
      });
      
      const response = await api.post(`/galleries/${galleryId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar una imagen de una galería
  deleteImage: async (galleryId, imageId) => {
    try {
      const response = await api.delete(`/galleries/${galleryId}/images/${imageId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default galleryService; 