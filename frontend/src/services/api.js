import axios from 'axios';

// URL base de tu API Laravel - CAMBIAR por tu URL
const API_BASE_URL = 'http://localhost:8000/api';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para añadir el token OAuth2 a todas las peticiones automáticamente
api.interceptors.request.use(
  (config) => {
    // Obtener token del localStorage
    const token = localStorage.getItem('access_token');
    
    // Si existe token, añadirlo al header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log para debugging (puedes quitarlo en producción)
    console.log('🚀 Petición enviada:', config.method?.toUpperCase(), config.url);
    
    return config;
  },
  (error) => {
    console.error('❌ Error en interceptor de petición:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores globalmente
api.interceptors.response.use(
  (response) => {
    // Log para debugging (puedes quitarlo en producción)
    console.log('✅ Respuesta recibida:', response.status, response.config.url);
    return response;
  },
  (error) => {
    // Manejar errores comunes
    if (error.response?.status === 401) {
      // Token expirado o inválido
      console.warn('🔑 Token inválido o expirado, limpiando localStorage');
      localStorage.removeItem('access_token');
      // Opcional: redirigir al login
      // window.location.href = '/login';
    }
    
    if (error.response?.status === 403) {
      console.warn('🚫 Sin permisos para esta acción');
    }
    
    if (error.response?.status >= 500) {
      console.error('🔥 Error del servidor:', error.response.status);
    }
    
    console.error('❌ Error en petición:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export default api;