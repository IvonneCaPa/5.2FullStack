import React, { useState, useEffect } from 'react';
import { userService } from '../services/user';

const TestUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testGetUsers = async () => {
    setLoading(true);
    try {
      const result = await userService.getAllUsers();
      setUsers(result);
      console.log('✅ Usuarios obtenidos:', result);
    } catch (err) {
      setError(err);
      console.error('❌ Error al obtener usuarios:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2>Test User Service</h2>
      <button onClick={testGetUsers} className="bg-blue-500 text-white px-4 py-2 rounded">
        Obtener Usuarios
      </button>
      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-500">Error: {JSON.stringify(error)}</p>}
      {users.length > 0 && (
        <div>
          <h3>Usuarios encontrados:</h3>
          <pre>{JSON.stringify(users, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default TestUsers;