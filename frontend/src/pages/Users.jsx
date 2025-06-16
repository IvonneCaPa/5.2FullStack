import React, { useEffect, useState } from 'react';
import { userService } from '../services/user';

const initialForm = {
  name: '',
  email: '',
  password: '',
  role: '',
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState('');
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getAllUsers();
      setUsers(data.users);
    } catch (err) {
      setError('Error al obtener usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (user) => {
    setForm({
      name: user.name,
      email: user.email,
      password: '', // No se muestra la contraseña actual
      role: user.role,
    });
    setEditingId(user.id);
    setFormError('');
  };

  const handleCancelEdit = () => {
    setForm(initialForm);
    setEditingId(null);
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setCreating(true);
    try {
      if (!form.name || !form.email || (!editingId && !form.password) || !form.role) {
        setFormError('Todos los campos son obligatorios');
        setCreating(false);
        return;
      }
      if (editingId) {
        // Editar usuario
        await userService.updateUser(editingId, form);
        setEditingId(null);
      } else {
        // Crear usuario
        await userService.createUser(form);
      }
      setForm(initialForm);
      await fetchUsers();
    } catch (err) {
      setFormError('Error al ' + (editingId ? 'editar' : 'crear') + ' usuario');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;
    try {
      await userService.deleteUser(id);
      await fetchUsers();
      setSuccessMsg('Usuario eliminado correctamente');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert('Error al eliminar usuario');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Usuarios</h1>
      {successMsg && (
        <div className="mb-4 p-2 bg-green-100 text-green-800 border border-green-300 rounded">
          {successMsg}
        </div>
      )}
      {/* Formulario para crear/editar usuario */}
      <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded bg-gray-50 max-w-xl mx-auto">
        <h2 className="text-lg font-semibold mb-2">
          {editingId ? 'Editar usuario' : 'Agregar nuevo usuario'}
        </h2>
        <div className="mb-2">
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={form.name}
            onChange={handleChange}
            className="border px-2 py-1 rounded w-full"
          />
        </div>
        <div className="mb-2">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border px-2 py-1 rounded w-full"
            disabled={editingId} // No permitir editar el email
          />
        </div>
        <div className="mb-2">
          <input
            type="password"
            name="password"
            placeholder={editingId ? 'Nueva contraseña (opcional)' : 'Contraseña'}
            value={form.password}
            onChange={handleChange}
            className="border px-2 py-1 rounded w-full"
          />
        </div>
        <div className="mb-2">
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="border px-2 py-1 rounded w-full"
          >
            <option value="">Selecciona un rol</option>
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        {formError && <p className="text-red-500 mb-2">{formError}</p>}
        <div className="flex gap-2">
          <button
            type="submit"
            className={editingId ? 'bg-yellow-500 text-white px-4 py-2 rounded' : 'bg-green-600 text-white px-4 py-2 rounded'}
            disabled={creating}
          >
            {creating ? (editingId ? 'Guardando...' : 'Creando...') : (editingId ? 'Guardar cambios' : 'Agregar usuario')}
          </button>
          {editingId && (
            <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded" onClick={handleCancelEdit} disabled={creating}>
              Cancelar
            </button>
          )}
        </div>
      </form>
      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Nombre</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Rol</th>
              <th className="py-2 px-4 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users && users.map((user) => (
              <tr key={user.id} className="text-center">
                <td className="py-2 px-4 border">{user.name}</td>
                <td className="py-2 px-4 border">{user.email}</td>
                <td className="py-2 px-4 border">{user.role}</td>
                <td className="py-2 px-4 border">
                  <button className="bg-yellow-400 text-white px-2 py-1 rounded mr-2" onClick={() => handleEdit(user)} disabled={creating}>Editar</button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(user.id)} disabled={creating}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Users;
