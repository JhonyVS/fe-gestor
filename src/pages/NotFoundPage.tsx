import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{
        minHeight: 'calc(100vh - 220px)', // Ajustar para Top (64px), Menu (64px), Footer (64px)
        backgroundColor: '#f8f9fa',
      }}
    >
      <div className="text-center">
        <FaExclamationTriangle className="text-red-600 text-6xl mb-4" />
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Página No Encontrada</h1>
        <p className="text-gray-600 mb-6">
          Lo sentimos, no pudimos encontrar la página que estabas buscando.
        </p>
        <button
          onClick={() => navigate('/home')}
          className="px-6 py-3 bg-blue-500 text-white rounded-md text-lg hover:bg-blue-600 transition"
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
