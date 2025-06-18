import React, { useState, useMemo } from 'react';

const Table = ({ columns, data, rowsPerPage = 10 }) => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filtrado por búsqueda
  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const lower = search.toLowerCase();
    return data.filter(row =>
      columns.some(col => {
        if (col.field && row[col.field]) {
          return String(row[col.field]).toLowerCase().includes(lower);
        }
        return false;
      })
    );
  }, [search, data, columns]);

  // Paginación
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Reset page al buscar
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, data]);

  return (
    <div className="w-full bg-white rounded-xl shadow-lg border border-orange-200 p-4">
      {/* Buscador */}
      <div className="mb-4 flex gap-2 max-w-md">
        <input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-orange-300 px-3 py-2 rounded w-full focus:ring-2 focus:ring-orange-400 focus:outline-none"
        />
      </div>
      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-orange-100">
              {columns.map((col, idx) => (
                <th key={idx} className="px-4 py-2 text-left font-bold text-orange-600 uppercase tracking-wider">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-8 text-gray-500">
                  No hay datos para mostrar
                </td>
              </tr>
            ) : (
              paginatedData.map((row, i) => (
                <tr key={i} className="border-b hover:bg-orange-50 transition">
                  {columns.map((col, j) => (
                    <td key={j} className="px-4 py-2">
                      {col.render ? col.render(row) : row[col.field]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-orange-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-orange-600 transition"
          >
            &laquo;
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`px-4 py-2 rounded transition ${
                currentPage === i + 1
                  ? 'bg-orange-600 text-white'
                  : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
              }`}
              onClick={() => goToPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-orange-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-orange-600 transition"
          >
            &raquo;
          </button>
        </div>
      )}
    </div>
  );
};

export default Table; 