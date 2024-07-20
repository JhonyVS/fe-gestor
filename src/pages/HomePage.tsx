// src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Página de Inicio</h1>
      <p className="mt-2">Bienvenido a la herramienta de gestión de proyectos.</p>
      <Link to="/board" className="text-blue-500 underline mt-4 block">Ir al Tablero</Link>
    </div>
  );
};

export default HomePage;
