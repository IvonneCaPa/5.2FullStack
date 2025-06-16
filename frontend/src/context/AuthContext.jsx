import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    console.log('🚀 Función login ejecutada en AuthContext');
    
    try {
      // Llamar al servicio de autenticación
      const tokenData = await authService.login(email, password);
      console.log('📦 Token data recibido:', tokenData);
      
      // Verificar que tenemos el access_token
      if (!tokenData.access_token) {
        console.error('❌ No se recibió access_token en la respuesta');
        return { success: false, error: 'No se recibió token de acceso' };
      }
      
      // Guardar token en localStorage
      console.log('💾 Guardando token en localStorage...');
      localStorage.setItem('access_token', tokenData.access_token);
      
      // Verificar que se guardó correctamente
      const savedToken = localStorage.getItem('access_token');
      console.log('✅ Token guardado:', savedToken ? 'SÍ' : 'NO');
      
      // Obtener datos del usuario
      console.log('👤 Obteniendo datos del usuario...');
      const userData = await authService.getCurrentUser();
      
      console.log('👨‍💻 Estableciendo usuario en contexto:', userData);
      setUser(userData.user);
      
      return { success: true };
      
    } catch (error) {
      console.error('💥 Error completo en login:', error);
      
      let errorMessage = 'Error desconocido';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error_description) {
        errorMessage = error.response.data.error_description;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.error('📝 Mensaje de error final:', errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    console.log('🚪 Logout ejecutado en AuthContext');
    authService.logout();
    setUser(null);
  };

  useEffect(() => {
    console.log('🔄 AuthContext useEffect ejecutado');
    const token = localStorage.getItem('access_token');
    console.log('🎫 Token existente:', token ? 'Encontrado' : 'No encontrado');
    
    if (token) {
      console.log('🔍 Verificando token existente...');
      authService.getCurrentUser()
        .then((userData) => {
          console.log('✅ Token válido, usuario cargado:', userData);
          setUser(userData.user);
        })
        .catch((error) => {
          console.warn('⚠️ Token inválido, eliminando:', error.response?.status);
          localStorage.removeItem('access_token');
        })
        .finally(() => {
          console.log('🏁 Carga inicial completada');
          setLoading(false);
        });
    } else {
      console.log('🏁 No hay token, carga completada');
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};