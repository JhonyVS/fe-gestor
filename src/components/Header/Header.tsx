import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-500 text-white p-4 flex justify-between items-center">
      <h1>Gestor de Proyectos</h1>
      <nav>
        <ul className="flex space-x-4">
          <li><Link to="/" className="text-white">Home</Link></li>
          <li><Link to="/board" className="text-white">Tablero</Link></li>
          <li><Link to="/about" className="text-white">About</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
