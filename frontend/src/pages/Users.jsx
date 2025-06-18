import React, { useEffect, useState } from 'react';
import { userService } from '../services/user';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastProvider';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import Table from '../components/Table';
import { FaEdit, FaTrash, FaUser, FaEnvelope, FaLock, FaUserTag, FaSave } from 'react-icons/fa';
import FormReusable from '../components/FormReusable';

const initialForm = {
  name: '',
  email: '',
  password: '',
  role: '',
};

const userFields = (editingId) => [
  {
    name: 'name',
    type: 'text',
    placeholder: 'Nombre',
    required: true,
    icon: <FaUser />,
    maxLength: 50,
  },
  {
    name: 'email',
    type: 'email',
    placeholder: 'Email',
    required: true,
    icon: <FaEnvelope />,
    maxLength: 100,
  },
  {
    name: 'password',
    type: 'password',
    placeholder: editingId ? 'Nueva contraseña (opcional)' : 'Contraseña',
    required: !editingId,
    icon: <FaLock />,
    maxLength: 100,
    autoComplete: 'new-password',
  },
  {
    name: 'role',
    type: 'select',
    placeholder: 'Selecciona un rol',
    required: true,
    icon: <FaUserTag />,
    options: [
      { value: 'user', label: 'Usuario' },
      { value: 'admin', label: 'Administrador' },
    ],
  },
];

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

  const handleSubmit = async (formData) => {
    setFormError('');
    setCreating(true);
    try {
      if (editingId) {
        await userService.updateUser(editingId, formData);
        toast('Usuario editado correctamente', 'success');
        setEditingId(null);
      } else {
        await userService.createUser(formData);
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
        {isAdmin && (
          <FormReusable
            fields={userFields(editingId)}
            initialValues={form}
            onSubmit={handleSubmit}
            submitText={editingId ? 'Guardar cambios' : 'Agregar usuario'}
            loading={creating}
            error={formError}
            editingId={editingId}
            cancelText={editingId ? 'Cancelar' : undefined}
            onCancel={editingId ? handleCancelEdit : undefined}
          />
        )}
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
