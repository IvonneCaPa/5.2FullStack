import React from 'react';
import { useAuth } from '../context/AuthContext';
import TestUsers from '../components/TestUsers.jsx';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
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