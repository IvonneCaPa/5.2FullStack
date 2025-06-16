import React, { useEffect, useState } from 'react';
import { userService } from '../services/user';
import { useAuth } from '../context/AuthContext';

const initialForm = {
  name: '',
  email: '',
  password: '',
  role: '',
};

const USERS_PER_PAGE = 10;

const Users = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState('');
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [search, setSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    handleFilter();
    setCurrentPage(1);
  }, [users]);

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
      password: '',
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
        await userService.updateUser(editingId, form);
        setEditingId(null);
      } else {
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

  const handleFilter = () => {
    if (!search.trim()) {
      setFilteredUsers(users);
    } else {
      const lower = search.toLowerCase();
      setFilteredUsers(
        users.filter(
          (u) =>
            u.name.toLowerCase().includes(lower) ||
            u.email.toLowerCase().includes(lower)
        )
      );
    }
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200 py-8 px-2">
      <div className="w-full max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-orange-600 text-center mb-8 drop-shadow">Gestión de Usuarios</h1>
        {successMsg && (
          <div className="mb-4 p-2 bg-green-100 text-green-800 border border-green-300 rounded text-center font-semibold">
            {successMsg}
          </div>
        )}
        {/* Buscador */}
        <div className="mb-6 flex gap-2 max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Buscar por nombre o email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-orange-300 px-3 py-2 rounded w-full focus:ring-2 focus:ring-orange-400 focus:outline-none"
          />
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded font-semibold transition"
            onClick={handleFilter}
            type="button"
          >
            Buscar
          </button>
        </div>
        {/* Mensaje de no permisos */}
        {!isAdmin && (
          <div className="mb-6 p-4 bg-red-100 text-red-800 border border-red-300 rounded text-center font-semibold shadow">
            No tienes permisos para acceder a esta sección.
          </div>
        )}
        {/* Formulario para crear/editar usuario solo para admin */}
        {isAdmin && (
          <div className="mb-8 flex justify-center">
            <form onSubmit={handleSubmit} className="w-full max-w-xl bg-white shadow-lg rounded-lg p-6 border border-orange-200">
              <h2 className="text-xl font-bold text-orange-500 mb-4 text-center">
                {editingId ? 'Editar usuario' : 'Agregar nuevo usuario'}
              </h2>
              <div className="mb-3">
                <input
                  type="text"
                  name="name"
                  placeholder="Nombre"
                  value={form.name}
                  onChange={handleChange}
                  className="border border-orange-300 px-3 py-2 rounded w-full focus:ring-2 focus:ring-orange-400 focus:outline-none"
                />
              </div>
              <div className="mb-3">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="border border-orange-300 px-3 py-2 rounded w-full focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  disabled={editingId}
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  name="password"
                  placeholder={editingId ? 'Nueva contraseña (opcional)' : 'Contraseña'}
                  value={form.password}
                  onChange={handleChange}
                  className="border border-orange-300 px-3 py-2 rounded w-full focus:ring-2 focus:ring-orange-400 focus:outline-none"
                />
              </div>
              <div className="mb-3">
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="border border-orange-300 px-3 py-2 rounded w-full focus:ring-2 focus:ring-orange-400 focus:outline-none"
                >
                  <option value="">Selecciona un rol</option>
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              {formError && <p className="text-red-500 mb-2 text-center">{formError}</p>}
              <div className="flex gap-2 justify-center">
                <button
                  type="submit"
                  className={
                    editingId
                      ? 'bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded font-semibold transition'
                      : 'bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded font-semibold transition'
                  }
                  disabled={creating}
                >
                  {creating ? (editingId ? 'Guardando...' : 'Creando...') : (editingId ? 'Guardar cambios' : 'Agregar usuario')}
                </button>
                {editingId && (
                  <button type="button" className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded font-semibold transition" onClick={handleCancelEdit} disabled={creating}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
        {loading && <p className="text-center text-orange-500 font-semibold">Cargando...</p>}
        {error && <p className="text-center text-red-500 font-semibold">{error}</p>}
        {!loading && !error && (
          <>
            <div className="bg-white shadow-lg rounded-lg border border-orange-200 overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-orange-100">
                    <th className="py-3 px-4 border-b text-orange-700">Nombre</th>
                    <th className="py-3 px-4 border-b text-orange-700">Email</th>
                    <th className="py-3 px-4 border-b text-orange-700">Rol</th>
                    <th className="py-3 px-4 border-b text-orange-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user) => (
                    <tr key={user.id} className="text-center hover:bg-orange-50 transition">
                      <td className="py-2 px-4 border-b">{user.name}</td>
                      <td className="py-2 px-4 border-b">{user.email}</td>
                      <td className="py-2 px-4 border-b capitalize">{user.role}</td>
                      <td className="py-2 px-4 border-b">
                        {isAdmin ? (
                          <>
                            <button className="bg-orange-400 hover:bg-orange-500 text-white px-3 py-1 rounded mr-2 font-semibold transition" onClick={() => handleEdit(user)} disabled={creating}>Editar</button>
                            <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded font-semibold transition" onClick={() => handleDelete(user.id)} disabled={creating}>Eliminar</button>
                          </>
                        ) : (
                          <span className="text-gray-400">Sin permisos</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Paginación */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                className="px-4 py-2 bg-orange-200 hover:bg-orange-300 text-orange-700 rounded font-semibold transition disabled:opacity-50"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
              <span className="text-orange-700 font-semibold">Página {currentPage} de {totalPages}</span>
              <button
                className="px-4 py-2 bg-orange-200 hover:bg-orange-300 text-orange-700 rounded font-semibold transition disabled:opacity-50"
                onClick={handleNextPage}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Siguiente
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Users;
