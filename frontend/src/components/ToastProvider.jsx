import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

const TOAST_COLORS = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-yellow-500',
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {/* Toasts visuales */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 items-end">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`min-w-[200px] max-w-xs px-4 py-3 rounded shadow-lg text-white font-semibold flex items-center justify-between ${TOAST_COLORS[toast.type] || TOAST_COLORS.info} animate-fade-in`}
            style={{ animation: 'fade-in 0.3s' }}
          >
            <span>{toast.message}</span>
            <button
              className="ml-4 text-xl font-bold hover:opacity-70 focus:outline-none"
              onClick={() => removeToast(toast.id)}
              aria-label="Cerrar notificación"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      {/* Animación fade-in */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s; }
      `}</style>
    </ToastContext.Provider>
  );
}; 