import React from 'react';
import { useAuth } from '../context/AuthContext';
import TestUsers from '../components/TestUsers.jsx';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200 py-8 px-2">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-orange-200 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-orange-600 mb-6 drop-shadow">Dashboard</h1>
        <button
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded font-semibold mb-6 transition shadow"
          onClick={() => navigate('/users')}
        >
          Ir a gestión de usuarios
        </button>
        <div className="w-full max-w-md bg-orange-50 rounded-lg p-6 mb-6 shadow border border-orange-100">
          <p className="text-lg font-semibold text-orange-700 mb-2">Bienvenido, <span className="text-orange-600">{user?.name || 'Usuario'}</span></p>
          <p className="text-gray-700 mb-1"><span className="font-semibold text-orange-500">Email:</span> {user?.email}</p>
          <p className="text-gray-700 mb-4"><span className="font-semibold text-orange-500">Rol:</span> {user?.role}</p>
          <button
            onClick={logout}
            className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-md transition duration-200 shadow"
          >
            Cerrar Sesión
          </button>
        </div>
        {/* Puedes quitar TestUsers si no lo necesitas */}
        {/* <TestUsers /> */}
      </div>
    </div>
  );
};

export default Dashboard;