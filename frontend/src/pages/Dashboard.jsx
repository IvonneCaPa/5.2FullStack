import React from 'react';
import { useAuth } from '../context/AuthContext';
import TestUsers from '../components/TestUsers.jsx';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <h1>Dashboard</h1>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        onClick={() => navigate('/users')}
        style={{marginBottom: '1rem'}}
      >
        Ir a gestión de usuarios
      </button>
      <TestUsers />
      <div style={{marginBottom: '1rem'}}>
        <p><strong>Bienvenido:</strong> {user?.name || 'Usuario'}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Rol:</strong> {user?.role}</p>
      </div>
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
};

export default Dashboard;