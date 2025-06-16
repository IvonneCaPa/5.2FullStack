import api from './api';

const ACTIVITY_ENDPOINT = '/activities';

export const activityService = {
    // Obtener todas las actividades
    getAll: async () => {
        try {
            const response = await api.get(ACTIVITY_ENDPOINT);
            return response.data.activities || [];
        } catch (error) {
            console.error('Error al obtener actividades:', error);
            throw error;
        }
    },

    // Obtener una actividad por ID
    getById: async (id) => {
        try {
            const response = await api.get(`${ACTIVITY_ENDPOINT}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener actividad ${id}:`, error);
            throw error;
        }
    },

    // Crear una nueva actividad
    create: async (activityData) => {
        try {
            const response = await api.post(ACTIVITY_ENDPOINT, activityData);
            return response.data;
        } catch (error) {
            console.error('Error al crear actividad:', error);
            throw error;
        }
    },

    // Actualizar una actividad existente
    update: async (id, activityData) => {
        try {
            const response = await api.put(`${ACTIVITY_ENDPOINT}/${id}`, activityData);
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar actividad ${id}:`, error);
            throw error;
        }
    },

    // Eliminar una actividad
    delete: async (id) => {
        try {
            const response = await api.delete(`${ACTIVITY_ENDPOINT}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error al eliminar actividad ${id}:`, error);
            throw error;
        }
    }
};

export default activityService; 