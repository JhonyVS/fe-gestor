import React, { useEffect, useState } from 'react';
import { FaBell, FaUserCircle, FaCog } from 'react-icons/fa';
import logo from '../../assets/logo.png';
import { useNavigate } from 'react-router-dom'; // Para la redirección

const Top: React.FC = () => {
  const [nombres, setNombres] = useState<string | null>(null);
  const [apellidos, setApellidos] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Control del menú desplegable
  const navigate = useNavigate();

  // Leer los datos de sessionStorage al cargar el componente
  useEffect(() => {
    const nombresFromStorage = sessionStorage.getItem('nombres');
    const apellidosFromStorage = sessionStorage.getItem('apellidos');

    if (nombresFromStorage) {
      setNombres(nombresFromStorage);
    }
    if (apellidosFromStorage) {
      setApellidos(apellidosFromStorage);
    }
  }, []);

  // Función para cerrar sesión
  const handleLogout = () => {
    // Limpiar sessionStorage
    sessionStorage.clear();
    // Redirigir al inicio
    navigate('/');
  };

  return (
    <div className="bg-gray-700 text-white p-5 flex items-center relative">
      <div className="flex items-center">
        <img src={logo} alt="Icon" className="w-10 h-10 mr-2" />
      </div>
      <div className="absolute p-11">
        <span className="text-xl font-bold">Gestor de Proyectos</span>
      </div>
      <div className="ml-auto flex items-center space-x-4">
        <FaBell className="w-6 h-6" />
        <div className="flex items-center space-x-2">
          <FaUserCircle className="w-8 h-8" />
          {/* Mostrar nombres y apellidos solo en pantallas medianas o más grandes */}
          <span className="hidden md:block">{nombres} {apellidos}</span>
        </div>
        {/* Botón de opciones con menú desplegable */}
        <div className="relative">
          <FaCog 
            className="w-6 h-6 cursor-pointer" 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle del menú
          />
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-10">
              <button 
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-200"
                onClick={handleLogout}
              >
                Salir
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Top;
