import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotAuthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home'); // Redirigir a /home después de 5 segundos
    }, 5000);

    return () => clearTimeout(timer); // Limpiar el temporizador al desmontar
  }, [navigate]);

  return (
    <div className="container mx-auto p-6 text-center">
      <h1 className="text-4xl font-bold text-red-600">Acceso No Autorizado</h1>
      <p className="text-gray-700 mt-4">No tienes permisos para acceder a esta página.</p>
      <p className="text-gray-500 mt-2">
        Serás redirigido a la página principal en 5 segundos.
      </p>
    </div>
  );
};

export default NotAuthorizedPage;
