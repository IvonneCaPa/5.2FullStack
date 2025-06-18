import React, { useState } from 'react';

const FormReusable = ({
  fields = [],
  initialValues = {},
  onSubmit,
  submitText = 'Guardar',
  loading = false,
  error = '',
  editingId = null,
  cancelText = 'Cancelar',
  onCancel,
}) => {
  const [formData, setFormData] = useState(initialValues);
  const [formError, setFormError] = useState('');
  const [fileErrors, setFileErrors] = useState({});

  // Validación básica
  const validate = () => {
    for (const field of fields) {
      if (field.required && !formData[field.name]) {
        setFormError(`El campo "${field.label || field.placeholder || field.name}" es obligatorio`);
        return false;
      }
      if (field.type === 'file' && field.required && (!formData[field.name] || formData[field.name].length === 0)) {
        setFormError(`Debes seleccionar al menos un archivo para "${field.label || field.placeholder || field.name}"`);
        return false;
      }
      if (field.maxLength && formData[field.name] && formData[field.name].length > field.maxLength) {
        setFormError(`El campo "${field.label || field.placeholder || field.name}" supera el máximo de ${field.maxLength} caracteres`);
        return false;
      }
    }
    setFormError('');
    return true;
  };

  const handleChange = (e, field) => {
    if (field.type === 'file') {
      const files = Array.from(e.target.files);
      // Validación de archivos (si hay reglas)
      if (field.accept || field.maxSize) {
        for (const file of files) {
          if (field.accept && !field.accept.split(',').includes(file.type)) {
            setFileErrors(prev => ({ ...prev, [field.name]: 'Tipo de archivo no permitido' }));
            return;
          }
          if (field.maxSize && file.size > field.maxSize) {
            setFileErrors(prev => ({ ...prev, [field.name]: 'Archivo demasiado grande' }));
            return;
          }
        }
      }
      setFileErrors(prev => ({ ...prev, [field.name]: '' }));
      setFormData(prev => ({ ...prev, [field.name]: files }));
    } else {
      setFormData(prev => ({ ...prev, [field.name]: e.target.value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setFormError('');
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-xl mx-auto">
      {fields.map((field) => (
        <div className="mb-4 flex items-center gap-2" key={field.name}>
          {field.icon && <span className="text-orange-400 text-lg">{field.icon}</span>}
          {field.type === 'select' ? (
            <select
              name={field.name}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(e, field)}
              className="border border-orange-300 px-3 py-2 rounded w-full focus:ring-2 focus:ring-orange-400 focus:outline-none"
              required={field.required}
            >
              <option value="">{field.placeholder || 'Selecciona una opción'}</option>
              {field.options && field.options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ) : field.type === 'file' ? (
            <input
              type="file"
              name={field.name}
              accept={field.accept}
              multiple={field.multiple}
              onChange={(e) => handleChange(e, field)}
              className="border border-orange-300 px-3 py-2 rounded w-full focus:ring-2 focus:ring-orange-400 focus:outline-none"
              required={field.required}
            />
          ) : (
            <input
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(e, field)}
              className="border border-orange-300 px-3 py-2 rounded w-full focus:ring-2 focus:ring-orange-400 focus:outline-none"
              required={field.required}
              maxLength={field.maxLength}
              min={field.min}
              max={field.max}
              step={field.step}
              autoComplete={field.autoComplete}
            />
          )}
          {fileErrors[field.name] && <span className="text-red-500 text-xs ml-2">{fileErrors[field.name]}</span>}
        </div>
      ))}
      {formError && <p className="text-red-500 mb-2 text-center">{formError}</p>}
      {error && <p className="text-red-500 mb-2 text-center">{error}</p>}
      <div className="flex gap-2 justify-center mt-4">
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded font-semibold transition flex items-center gap-2"
          disabled={loading}
        >
          {loading ? 'Guardando...' : submitText}
        </button>
        {onCancel && (
          <button
            type="button"
            className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded font-semibold transition"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </button>
        )}
      </div>
    </form>
  );
};

export default FormReusable; 