import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bienvenido, {user?.name || 'Usuario'}</p>
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
};

export default Dashboard;