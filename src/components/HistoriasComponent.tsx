import { FaBookOpen, FaRegListAlt, FaCheckCircle, FaHourglassHalf } from "react-icons/fa";
import React from "react";

interface HistoriaDTO {
  id: string;
  titulo: string;
  codigo: string;
  descripcion: string;
  activado: boolean;
}

interface HistoriasComponentProps {
  historias: HistoriaDTO[];
}

const HistoriasComponent: React.FC<HistoriasComponentProps> = ({ historias }) => {
  return (
    <section className="mt-8 bg-white p-8 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-purple-600 flex items-center">
          <FaBookOpen className="mr-2" /> Historias de Usuario
        </h2>
      </div>

      {historias.length === 0 ? (
        <p className="text-gray-500">No hay historias de usuario registradas aún.</p>
      ) : (
        <ul className="space-y-6">
          {historias.map((historia, index) => {
            const estaCompletada = index < 6; // ✅ las primeras 6 como completadas

            return (
              <li
                key={historia.id}
                className={`flex items-start p-4 rounded-md shadow-sm border-l-4 ${
                  estaCompletada ? "bg-green-50 border-green-500" : "bg-yellow-50 border-yellow-500"
                }`}
              >
                <FaRegListAlt
                  className={`mr-4 mt-1 text-xl ${
                    estaCompletada ? "text-green-600" : "text-yellow-600"
                  }`}
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {historia.codigo} - {historia.titulo}
                    </h3>

                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        estaCompletada
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {estaCompletada ? (
                        <>
                          <FaCheckCircle className="mr-1" /> Completada
                        </>
                      ) : (
                        <>
                          <FaHourglassHalf className="mr-1" /> Pendiente
                        </>
                      )}
                    </span>
                  </div>

                  <p className="text-gray-600 mt-2">{historia.descripcion}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default HistoriasComponent;
