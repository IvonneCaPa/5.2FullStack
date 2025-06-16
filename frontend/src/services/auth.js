import api from './api';

export const authService = {
  login: async (email, password) => {
    console.log('🔄 Iniciando proceso de login...');
    console.log('📧 Email:', email);
    
    try {
      console.log('📡 Enviando petición de login...');
      
      const response = await api.post('/auths/login', {
        email: email,
        password: password
      });
      
      console.log('✅ Respuesta de login recibida:', response.data);
      
      return response.data;
      
    } catch (error) {
      console.error('❌ Error en petición de login:');
      console.error('📡 Status:', error.response?.status);
      console.error('📝 Data:', error.response?.data);
      console.error('🔥 Message:', error.message);
      
      throw error;
    }
  },

  getCurrentUser: async () => {
    console.log('👤 Obteniendo datos del usuario...');
    
    try {
      const response = await api.get('/auths/user');
      console.log('✅ Datos de usuario recibidos:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo usuario:', error.response?.data);
      throw error;
    }
  },

  logout: () => {
    console.log('🚪 Cerrando sesión...');
    localStorage.removeItem('access_token');
    console.log('🗑️ Token eliminado del localStorage');
  },
};