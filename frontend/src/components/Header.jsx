import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/dashboard');
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-orange-500 shadow-md">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3 relative">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={handleLogoClick}>
          <img src={logo} alt="Logo" className="w-30 object-contain" />
        </div>
        {/* Enlaces desktop */}
        <div className="hidden md:flex gap-4">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `px-4 py-2 rounded font-semibold transition-colors ${
                isActive
                  ? 'bg-white text-orange-600 shadow'
                  : 'text-white hover:bg-orange-600 hover:text-white'
              }`
            }
            onClick={closeMenu}
          >
            Inicio
          </NavLink>
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `px-4 py-2 rounded font-semibold transition-colors ${
                isActive
                  ? 'bg-white text-orange-600 shadow'
                  : 'text-white hover:bg-orange-600 hover:text-white'
              }`
            }
            onClick={closeMenu}
          >
            Usuarios
          </NavLink>
          <NavLink
            to="/activities"
            className={({ isActive }) =>
              `px-4 py-2 rounded font-semibold transition-colors ${
                isActive
                  ? 'bg-white text-orange-600 shadow'
                  : 'text-white hover:bg-orange-600 hover:text-white'
              }`
            }
            onClick={closeMenu}
          >
            Actividades
          </NavLink>
          <NavLink
            to="/galleries"
            className={({ isActive }) =>
              `px-4 py-2 rounded font-semibold transition-colors ${
                isActive
                  ? 'bg-white text-orange-600 shadow'
                  : 'text-white hover:bg-orange-600 hover:text-white'
              }`
            }
            onClick={closeMenu}
          >
            Galerías
          </NavLink>
        </div>
        {/* Botón hamburguesa */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          <span className={`block w-7 h-1 bg-white rounded transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-7 h-1 bg-white rounded my-1 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-7 h-1 bg-white rounded transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
        {/* Menú móvil deslizable */}
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-orange-500 shadow-lg z-50 transform transition-transform duration-300 ease-in-out
            ${menuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden flex flex-col`}
        >
          <button
            className="self-end m-4 text-white text-3xl focus:outline-none"
            onClick={closeMenu}
            aria-label="Cerrar menú"
          >
            &times;
          </button>
          <nav className="flex flex-col gap-6 items-center mt-10">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `w-full text-center px-4 py-2 rounded font-semibold text-lg transition-colors ${
                  isActive
                    ? 'bg-white text-orange-600 shadow'
                    : 'text-white hover:bg-orange-600 hover:text-white'
                }`
              }
              onClick={closeMenu}
            >
              Inicio
            </NavLink>
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `w-full text-center px-4 py-2 rounded font-semibold text-lg transition-colors ${
                  isActive
                    ? 'bg-white text-orange-600 shadow'
                    : 'text-white hover:bg-orange-600 hover:text-white'
                }`
              }
              onClick={closeMenu}
            >
              Usuarios
            </NavLink>
            <NavLink
              to="/activities"
              className={({ isActive }) =>
                `w-full text-center px-4 py-2 rounded font-semibold text-lg transition-colors ${
                  isActive
                    ? 'bg-white text-orange-600 shadow'
                    : 'text-white hover:bg-orange-600 hover:text-white'
                }`
              }
              onClick={closeMenu}
            >
              Actividades
            </NavLink>
            <NavLink
              to="/galleries"
              className={({ isActive }) =>
                `w-full text-center px-4 py-2 rounded font-semibold text-lg transition-colors ${
                  isActive
                    ? 'bg-white text-orange-600 shadow'
                    : 'text-white hover:bg-orange-600 hover:text-white'
                }`
              }
              onClick={closeMenu}
            >
              Galerías
            </NavLink>
          </nav>
        </div>
        {/* Fondo oscuro al abrir menú */}
        {menuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
            onClick={closeMenu}
          ></div>
        )}
      </nav>
    </header>
  );
};

export default Header; 