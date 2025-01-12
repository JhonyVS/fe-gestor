// src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="p-8">
      <br/><br/><br/>
      <h1 className="text-3xl font-bold mb-8">¡Bienvenido a tu Gestor de Proyectos!</h1>
      <br/><br/><br/>
      {/* Tarjetas de acceso rápido */}
      <div className="grid grid-cols-2 gap-8">
        <Link to="/activities" className="p-6 bg-blue-500 text-white rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-bold">Mis Actividades</h2>
          <p>Accede a tus actividades de trabajo</p>
        </Link>
        
        <Link to="/projects" className="p-6 bg-green-500 text-white rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-bold">Mis Proyectos</h2>
          <p>Revisa tus proyectos activos</p>
        </Link>
        
        <Link to="/teams" className="p-6 bg-purple-500 text-white rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-bold">Equipos</h2>
          <p>Gestiona tus equipos de trabajo</p>
        </Link>
        
        <Link to="" className="p-6 bg-red-500 text-white rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-bold">Staff</h2>
          <p>Ver y gestionar el personal</p>
        </Link>
      </div>

      {/* Sección de notificaciones o actividad reciente */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Actividad Reciente</h2>
        <ul>
          <li>📋 Haz creado una nueva tarea en el proyecto ...</li>
          <li>🔔 El equipo "Desarrollo Web" ha completado una tarjeta</li>
          <li>📅 Tienes una reunión programada para mañana a las 10:00 AM</li>
        </ul>
      </div>
    </div>
  );
};

export default HomePage;
