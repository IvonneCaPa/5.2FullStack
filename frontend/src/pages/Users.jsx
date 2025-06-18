import React, { useEffect, useState } from 'react';
import { userService } from '../services/user';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastProvider';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import Table from '../components/Table';
import { FaEdit, FaTrash } from 'react-icons/fa';

const initialForm = {
  name: '',
  email: '',
  password: '',
  role: '',
};

const Users = () => {
  const { user: currentUser } = useAuth();
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState('');
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

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
        toast('Usuario editado correctamente', 'success');
        setEditingId(null);
      } else {
        await userService.createUser(form);
        toast('Usuario creado correctamente', 'success');
      }
      setForm(initialForm);
      await fetchUsers();
    } catch (err) {
      setFormError('Error al ' + (editingId ? 'editar' : 'crear') + ' usuario');
      toast('Error al ' + (editingId ? 'editar' : 'crear') + ' usuario', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (user) => {
    try {
      await userService.deleteUser(user.id);
      await fetchUsers();
      toast('Usuario eliminado correctamente', 'success');
    } catch (err) {
      toast('Error al eliminar usuario', 'error');
    }
  };

  const isAdmin = currentUser?.role === 'admin';

  // Columnas para la tabla
  const columns = [
    { label: 'Nombre', field: 'name' },
    { label: 'Email', field: 'email' },
    { label: 'Rol', field: 'role' },
    {
      label: 'Acciones',
      render: (user) => (
        <>
          <button
            className="bg-orange-400 hover:bg-orange-500 text-white px-3 py-1 rounded mr-2 font-semibold transition flex items-center gap-2"
            onClick={() => handleEdit(user)}
            disabled={creating}
          >
            <FaEdit /> Editar
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded font-semibold transition flex items-center gap-2"
            onClick={() => { setUserToDelete(user); setModalOpen(true); }}
            disabled={creating}
          >
            <FaTrash /> Eliminar
          </button>
        </>
      ),
    },
  ];

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200 py-8 px-2">
      <div className="w-full max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-orange-600 text-center mb-8 drop-shadow">Gestión de Usuarios</h1>
        
        {/* Mensaje de no permisos */}
        {!isAdmin && (
          <div className="mb-6 p-4 bg-red-100 text-red-800 border border-red-300 rounded text-center font-semibold shadow">
            No tienes permisos para acceder a esta sección.
          </div>
        )}

        {/* Formulario */}
        {isAdmin && (editingId || (
          <div className="mb-8">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-xl mx-auto">
              <h2 className="text-2xl font-semibold text-orange-600 mb-6 text-center">
                {editingId ? 'Editar Usuario' : 'Agregar Usuario'}
              </h2>
              <div className="mb-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Nombre"
                  value={form.name}
                  onChange={handleChange}
                  className="border border-orange-300 px-3 py-2 rounded w-full focus:ring-2 focus:ring-orange-400 focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="border border-orange-300 px-3 py-2 rounded w-full focus:ring-2 focus:ring-orange-400 focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  name="password"
                  placeholder={editingId ? 'Nueva contraseña (opcional)' : 'Contraseña'}
                  value={form.password}
                  onChange={handleChange}
                  className="border border-orange-300 px-3 py-2 rounded w-full focus:ring-2 focus:ring-orange-400 focus:outline-none"
                />
              </div>
              <div className="mb-4">
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
        ))}

        {/* Tabla de usuarios */}
        {users.length === 0 ? (
          <div className="text-center text-gray-600 text-lg bg-orange-50 rounded-lg p-8 mt-8 shadow">
            No hay usuarios registrados.
          </div>
        ) : (
          <Table data={users} columns={columns} rowsPerPage={10} />
        )}

        {/* Modal de confirmación para eliminar */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Confirmar Eliminación"
        >
          <div className="p-6">
            <p className="text-gray-700 mb-6">
              ¿Estás seguro de que deseas eliminar al usuario "{userToDelete?.name}"?
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                onClick={() => setModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                onClick={() => {
                  handleDelete(userToDelete);
                  setModalOpen(false);
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Users;
