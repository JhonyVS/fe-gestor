
import React, { useMemo } from "react";
import { FaRegSadTear, FaUsers } from "react-icons/fa";

interface Tarea {
  id: string;
  historiaId: string;
  tarjetaId: string;
  usuarioAsignado: {
    id: string;
    nombres: string;
    apellidos: string;
    email: string;
    fechaNacimiento: string;
    username: string;
  } | null;
  titulo: string;
  descripcion: string;
  estimacion: number;
  estado: {
    id: number;
    nombre: string;
  };
  activado: boolean;
}


interface UsuarioDTO {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  rol: string;
}



  // Calcular tareas por integrante
  const calcularTareasPorIntegrante = (tareas: Tarea[]): {
    [key: string]: {
      usuario: Tarea['usuarioAsignado'];
      pendiente: number;
      trabajando: number;
      terminado: number;
    };
  } => {
    const resultado: {
      [key: string]: {
        usuario: Tarea['usuarioAsignado'];
        pendiente: number;
        trabajando: number;
        terminado: number;
      };
    } = {};

    tareas.forEach((tarea) => {
      const { usuarioAsignado, estado } = tarea;
      if (!usuarioAsignado) return;

      const key = `${usuarioAsignado.id}`;
      if (!resultado[key]) {
        resultado[key] = {
          usuario: usuarioAsignado,
          pendiente: 0,
          trabajando: 0,
          terminado: 0,
        };
      }

      if (estado.nombre === 'Pendiente') resultado[key].pendiente++;
      if (estado.nombre === 'Trabajando') resultado[key].trabajando++;
      if (estado.nombre === 'Terminado') resultado[key].terminado++;
    });

    return resultado;
  };
interface TareasPorIntegranteProps {
  tareas: Tarea[];
}



const TareasPorIntegrante: React.FC<TareasPorIntegranteProps & { todosLosIntegrantes: UsuarioDTO[] }> = ({ tareas, todosLosIntegrantes }) => {

    // Obtener tareas por integrante
    const tareasPorIntegrante = useMemo(() => calcularTareasPorIntegrante(tareas), [tareas]);

    const tareasPorIntegranteCompleto = useMemo(() => {
            return todosLosIntegrantes.map((integrante) => {
            const tareasUsuario = tareasPorIntegrante[integrante.id] || {
                usuario: integrante,
                pendiente: 0,
                trabajando: 0,
                terminado: 0,
            };
            return tareasUsuario;
            });
        }, [todosLosIntegrantes, tareasPorIntegrante]);

  return (
    <section className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold mb-6 flex items-center text-blue-600">
          <FaUsers className="mr-2" /> Tareas por Integrante
        </h2>
        {tareasPorIntegranteCompleto.length > 0 ? (
          <ul className="space-y-6">
            {tareasPorIntegranteCompleto.map((integrante) => (
              <li
                key={integrante.usuario?.id}
                className="p-4 bg-gray-50 rounded-lg shadow-md border border-gray-200"
              >
                <h3 className="text-xl font-semibold text-gray-800">
                  {integrante.usuario?.nombres} {integrante.usuario?.apellidos}
                </h3>
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="p-4 bg-yellow-100 rounded-lg shadow-md">
                    <h4 className="text-lg font-semibold text-yellow-600">Pendientes</h4>
                    <p className="text-2xl font-bold text-gray-800">{integrante.pendiente}</p>
                  </div>
                  <div className="p-4 bg-blue-100 rounded-lg shadow-md">
                    <h4 className="text-lg font-semibold text-blue-600">Trabajando</h4>
                    <p className="text-2xl font-bold text-gray-800">{integrante.trabajando}</p>
                  </div>
                  <div className="p-4 bg-green-100 rounded-lg shadow-md">
                    <h4 className="text-lg font-semibold text-green-600">Terminadas</h4>
                    <p className="text-2xl font-bold text-gray-800">{integrante.terminado}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">
            <FaRegSadTear className="inline mr-2 text-yellow-400" />
            No hay tareas asignadas a los integrantes.
          </p>
        )}
      </section>
  );    
};
export default TareasPorIntegrante;