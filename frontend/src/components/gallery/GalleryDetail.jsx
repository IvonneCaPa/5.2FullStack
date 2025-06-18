import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import galleryService from '../../services/galleryService';
import Loader from '../Loader';
import { FaCalendarAlt, FaMapMarkerAlt, FaEdit } from 'react-icons/fa';
import Modal from '../Modal';
import { useAuth } from '../../context/AuthContext';

const backendUrl = 'http://localhost:8000';
const PHOTOS_PER_PAGE = 6;

const GalleryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gallery, setGallery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [erroredImages, setErroredImages] = useState({});
  const [modalPhoto, setModalPhoto] = useState(null);
  const [currentPhotoPage, setCurrentPhotoPage] = useState(1);
  const [successMessage, setSuccessMessage] = useState(null);
  const [editPhoto, setEditPhoto] = useState(null);
  const [editPhotoTitle, setEditPhotoTitle] = useState('');
  const [editPhotoError, setEditPhotoError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    loadGallery();
  }, [id]);

  const loadGallery = async () => {
    try {
      setLoading(true);
      const data = await galleryService.getGalleryById(id);
      setGallery(data);
      setError(null);
      setCurrentPhotoPage(1); // Reiniciar paginación al cargar galería
    } catch (err) {
      setError('Error al cargar la galería');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (photoId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta imagen?')) {
      try {
        await galleryService.deleteImage(photoId);
        setSuccessMessage('Imagen eliminada correctamente');
        await loadGallery();
      } catch (err) {
        setError('Error al eliminar la imagen');
        console.error(err);
      } finally {
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      return dateString; // Devolver la fecha original si no es válida
    }
    return date.toLocaleDateString('es-ES', options);
  };

  // Paginación de fotos
  const totalPhotos = gallery && gallery.photos ? gallery.photos.length : 0;
  const totalPhotoPages = Math.ceil(totalPhotos / PHOTOS_PER_PAGE);
  const paginatedPhotos = gallery && gallery.photos
    ? gallery.photos.slice((currentPhotoPage - 1) * PHOTOS_PER_PAGE, currentPhotoPage * PHOTOS_PER_PAGE)
    : [];

  const goToPhotoPage = (page) => {
    if (page >= 1 && page <= totalPhotoPages) {
      setCurrentPhotoPage(page);
    }
  };

  const handleEditPhoto = (photo) => {
    setEditPhoto(photo);
    setEditPhotoTitle(photo.title);
    setEditPhotoError('');
  };

  const handleSavePhotoTitle = async () => {
    if (!editPhotoTitle.trim()) {
      setEditPhotoError('El título no puede estar vacío');
      return;
    }
    try {
      setLoadingEdit(true);
      await galleryService.updatePhoto(editPhoto.id, { title: editPhotoTitle, gallery_id: editPhoto.gallery_id });
      setEditPhoto(null);
      setEditPhotoTitle('');
      setEditPhotoError('');
      await loadGallery();
      setSuccessMessage('Título actualizado correctamente');
    } catch (err) {
      setEditPhotoError('Error al actualizar el título');
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleDeletePhotoFromEdit = async () => {
    if (!editPhoto) return;
    try {
      await galleryService.deleteImage(editPhoto.id);
      setSuccessMessage('Imagen eliminada correctamente');
      setEditPhoto(null);
      setEditPhotoTitle('');
      setEditPhotoError('');
      setShowDeleteModal(false);
      await loadGallery();
    } catch (err) {
      setEditPhotoError('Error al eliminar la imagen');
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;
  if (!gallery) return <div className="not-found">Galería no encontrada</div>;

  return (
    <div className="gallery-detail bg-gradient-to-br from-orange-100 to-orange-200 min-h-screen py-8 px-2">
      <div className="gallery-header flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg p-6 shadow">
        <h2 className="text-3xl font-bold text-white drop-shadow mb-2 md:mb-0">{gallery.title}</h2>
        <div className="gallery-actions flex gap-2">
          <button 
            className="bg-orange-100 hover:bg-orange-200 text-orange-600 font-semibold px-4 py-2 rounded shadow transition"
            onClick={() => navigate(`/galleries/edit/${id}`)}
          >
            Editar Galería
          </button>
          <button 
            className="bg-white hover:bg-orange-100 text-orange-500 font-semibold px-4 py-2 rounded shadow transition"
            onClick={() => navigate('/galleries')}
          >
            Volver a la lista
          </button>
        </div>
      </div>
      <div className="gallery-info flex flex-col md:flex-row gap-6 mb-8 items-center justify-center">
        <p className="flex items-center gap-2 text-orange-600 font-semibold text-lg">
          <FaCalendarAlt /> {formatDate(gallery.date)}
        </p>
        <p className="flex items-center gap-2 text-orange-500 font-semibold text-lg">
          <FaMapMarkerAlt /> {gallery.site}
        </p>
      </div>
      <div className="gallery-images">
        {successMessage && <div className="success-message bg-green-100 text-green-700 border border-green-300 rounded p-2 mb-4 text-center">{successMessage}</div>}
        {totalPhotos > 0 ? (
          <>
          <div className="image-grid grid grid-cols-1 sm:grid-cols-3 gap-6">
            {paginatedPhotos.map((photo) => (
              <div key={photo.id} className="image-card relative rounded-lg overflow-hidden shadow hover:shadow-lg border-2 border-transparent hover:border-orange-400 transition group bg-white">
                {erroredImages[photo.id] ? (
                  <div className="image-error">Imagen no disponible</div>
                ) : (
                  <img
                    src={photo.location ? `${backendUrl}${photo.location}` : ''}
                    alt={photo.title}
                    onError={() => setErroredImages(prev => ({ ...prev, [photo.id]: true }))}
                    onClick={() => setModalPhoto(photo)}
                    className="w-full h-48 object-cover cursor-pointer group-hover:opacity-80 transition"
                  />
                )}
                <div className="image-title absolute bottom-0 left-0 w-full bg-orange-500 bg-opacity-80 text-white text-center py-2 font-semibold text-sm">{photo.title}</div>
                {isAdmin && (
                  <button
                    className="absolute top-2 right-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full p-2 shadow opacity-80 hover:opacity-100 transition z-10"
                    style={{ width: 36, height: 36 }}
                    onClick={e => { e.stopPropagation(); handleEditPhoto(photo); }}
                    title="Editar foto"
                  >
                    <FaEdit size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
          {/* Controles de paginación de fotos */}
          {totalPhotoPages > 1 && (
            <div className="pagination flex justify-center gap-2 mt-6">
              <button onClick={() => goToPhotoPage(currentPhotoPage - 1)} disabled={currentPhotoPage === 1} className="px-4 py-2 bg-orange-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-orange-600 transition">&laquo;</button>
              {Array.from({ length: totalPhotoPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`px-4 py-2 rounded transition ${currentPhotoPage === i + 1 ? 'bg-orange-600 text-white' : 'bg-orange-100 text-orange-600 hover:bg-orange-200'}`}
                  onClick={() => goToPhotoPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button onClick={() => goToPhotoPage(currentPhotoPage + 1)} disabled={currentPhotoPage === totalPhotoPages} className="px-4 py-2 bg-orange-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-orange-600 transition">&raquo;</button>
            </div>
          )}
          </>
        ) : (
          <p className="no-images text-center text-orange-400 font-semibold py-8">No hay imágenes en esta galería</p>
        )}
      </div>
      {/* Modal para ver imagen en grande */}
      {modalPhoto && (
        <div className="modal-overlay fixed inset-0 bg-orange-900 bg-opacity-70 flex items-center justify-center z-50" onClick={() => setModalPhoto(null)}>
          <div className="modal-content bg-white rounded-lg shadow-lg p-6 relative max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <button className="modal-close absolute top-2 right-2 text-3xl text-orange-500 hover:text-orange-700 font-bold" onClick={() => setModalPhoto(null)}>&times;</button>
            <img
              src={modalPhoto.location ? `${backendUrl}${modalPhoto.location}` : ''}
              alt={modalPhoto.title}
              className="modal-image w-full h-96 object-contain mb-4 rounded"
            />
            <div className="modal-title text-center text-orange-600 font-bold text-lg">{modalPhoto.title}</div>
          </div>
        </div>
      )}
      {/* Modal para editar foto */}
      {editPhoto && (
        <Modal isOpen={!!editPhoto} onClose={() => setEditPhoto(null)} title="Editar imagen">
          <div className="p-4">
            <img
              src={editPhoto.location ? `${backendUrl}${editPhoto.location}` : ''}
              alt={editPhoto.title}
              className="w-full h-60 object-contain mb-4 rounded"
            />
            <label className="block text-orange-600 font-semibold mb-2">Título de la imagen</label>
            <input
              type="text"
              value={editPhotoTitle}
              onChange={e => setEditPhotoTitle(e.target.value)}
              className="w-full border border-orange-300 rounded px-3 py-2 mb-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
            {editPhotoError && <div className="text-red-500 text-sm mb-2">{editPhotoError}</div>}
            <div className="flex gap-2 justify-end mt-4">
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded font-semibold shadow"
                onClick={handleSavePhotoTitle}
              >
                Guardar cambios
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold shadow"
                onClick={() => setShowDeleteModal(true)}
              >
                Eliminar
              </button>
            </div>
          </div>
        </Modal>
      )}
      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Confirmar Eliminación">
          <div className="p-6">
            <p className="text-gray-700 mb-6">
              ¿Estás seguro de que deseas eliminar esta imagen?
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                onClick={handleDeletePhotoFromEdit}
              >
                Eliminar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default GalleryDetail; 