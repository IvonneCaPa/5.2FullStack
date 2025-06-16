import api from './api';

export const userService = {
  getAllUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  },
  createUser: async (userData) => {
    try {
      const payload = {
        ...userData,
        password_confirmation: userData.password,
      };
      const response = await api.post('/auths/register', payload);
      return response.data;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  },
  updateUser: async (id, userData) => {
    try {
      // Si se va a cambiar la contraseña, enviar password_confirmation
      let payload = { ...userData };
      if (userData.password) {
        payload.password_confirmation = userData.password;
      } else {
        delete payload.password;
      }
      const response = await api.put(`/users/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error('Error al editar usuario:', error);
      throw error;
    }
  },
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  }
}; 