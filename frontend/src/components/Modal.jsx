import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full animate-modal-in relative">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-orange-500 rounded-t-lg">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <button
            className="text-white text-2xl font-bold hover:opacity-70 focus:outline-none"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            &times;
          </button>
        </div>
        {/* Contenido */}
        <div className="px-6 py-6">
          {children}
        </div>
      </div>
      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: translateY(-30px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-modal-in { animation: modal-in 0.25s; }
      `}</style>
    </div>
  );
};

export default Modal; 