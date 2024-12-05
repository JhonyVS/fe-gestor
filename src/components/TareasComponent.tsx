import React from "react";
import { FaTasks, FaClock, FaTools, FaCheck, FaUser, FaCalendarAlt, FaRegSadTear } from "react-icons/fa";

interface Tarea {
  id: string;
  titulo: string;
  descripcion: string;
  estimacion: number;
  estado: {
    nombre: string;
  };
  usuarioAsignado: {
    nombres: string;
    apellidos: string;
  } | null; // Permitir null si no hay usuario asignado
}

interface TareasComponentProps {
  tareas: Tarea[];
}

const TareasComponent: React.FC<TareasComponentProps> = ({ tareas }) => {
  return (
    <section className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold mb-6 flex items-center text-indigo-600">
        <FaTasks className="mr-2" /> Tareas del Proyecto
      </h2>
      {tareas.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tareas.map((tarea) => (
            <li
              key={tarea.id}
              className={`p-4 rounded-lg shadow-md bg-white border ${
                tarea.estado.nombre === "Pendiente"
                  ? "border-yellow-500"
                  : tarea.estado.nombre === "Trabajando"
                  ? "border-blue-500"
                  : "border-green-500"
              }`}
            >
              {/* Encabezado */}
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-gray-800">{tarea.titulo}</h3>
                <div
                  className={`rounded-full p-2 ${
                    tarea.estado.nombre === "Pendiente"
                      ? "bg-yellow-500 text-white"
                      : tarea.estado.nombre === "Trabajando"
                      ? "bg-blue-500 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {tarea.estado.nombre === "Pendiente" && <FaClock />}
                  {tarea.estado.nombre === "Trabajando" && <FaTools />}
                  {tarea.estado.nombre === "Terminado" && <FaCheck />}
                </div>
              </div>

              {/* Descripción */}
              <p className="text-gray-600 mb-4">{tarea.descripcion}</p>

              {/* Detalles */}
              <div className="text-sm text-gray-500 space-y-1">
                <p>
                  <FaUser className="inline mr-2 text-indigo-500" />
                  Asignado a:{" "}
                  <span className="font-semibold text-gray-800">
                    {tarea.usuarioAsignado?.nombres || "Sin asignar"} {tarea.usuarioAsignado?.apellidos || ""}
                  </span>
                </p>
                <p>
                  <FaClock className="inline mr-2 text-indigo-500" />
                  Estimación:{" "}
                  <span className="font-semibold text-gray-800">{tarea.estimacion} horas</span>
                </p>
                <p>
                  <FaCalendarAlt className="inline mr-2 text-indigo-500" />
                  Estado:{" "}
                  <span
                    className={`font-semibold ${
                      tarea.estado.nombre === "Pendiente"
                        ? "text-yellow-600"
                        : tarea.estado.nombre === "Trabajando"
                        ? "text-blue-600"
                        : "text-green-600"
                    }`}
                  >
                    {tarea.estado.nombre}
                  </span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center">
          <FaRegSadTear className="inline mr-2 text-yellow-400" />
          No hay tareas para este proyecto.
        </p>
      )}
    </section>
  );
};

export default TareasComponent;
