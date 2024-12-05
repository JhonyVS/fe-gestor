import React from "react";
import { FaUser } from "react-icons/fa";

interface Performance {
  usuario: {
    id: string;
    nombres: string;
    apellidos: string;
  } | null; // Permitir usuario null
  estimacionTerminadas: number;
  estimacionTrabajando: number;
}

interface TareasPerformanceComponentProps {
  performance: Performance[];
}

const TareasPerformanceComponent: React.FC<TareasPerformanceComponentProps> = ({ performance }) => {
  return (
    <section className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold mb-6 flex items-center text-purple-600">
        <FaUser className="mr-2" /> Desempeño por estimación
      </h2>
      {performance.length > 0 ? (
        <ul className="space-y-6">
          {performance.map((integrante, index) => (
            <li
              key={integrante.usuario?.id || `unknown-${index}`}
              className="p-4 bg-gray-50 rounded-lg shadow-md border border-gray-200"
            >
              <h3 className="text-xl font-semibold text-gray-800">
                {index + 1}. {integrante.usuario ? `${integrante.usuario.nombres} ${integrante.usuario.apellidos}` : "Usuario desconocido"}
              </h3>
              <div className="mt-4">
                {/* Barra de progreso para tareas terminadas */}
                <div className="mb-2">
                  <p className="text-sm text-gray-600">Tareas Terminadas: {integrante.estimacionTerminadas}</p>
                  <div className="relative h-4 bg-gray-200 rounded">
                    <div
                      className="absolute top-0 left-0 h-4 bg-green-500 rounded"
                      style={{
                        width: `${Math.min(integrante.estimacionTerminadas, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
                {/* Barra de progreso para tareas trabajando */}
                <div>
                  <p className="text-sm text-gray-600">Tareas Trabajando: {integrante.estimacionTrabajando}</p>
                  <div className="relative h-4 bg-gray-200 rounded">
                    <div
                      className="absolute top-0 left-0 h-4 bg-blue-500 rounded"
                      style={{
                        width: `${Math.min(integrante.estimacionTrabajando, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center">No hay datos de desempeño disponibles.</p>
      )}
    </section>
  );
};

export default TareasPerformanceComponent;
