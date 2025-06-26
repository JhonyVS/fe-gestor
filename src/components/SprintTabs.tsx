import { useEffect, useState } from "react";
import TareasComponent from "./TareasComponent";
import TareasPorIntegrante from "./TareasPorIntegrante";
import TareasPerformanceComponent from "./TareasPerformanceComponent";


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

interface EquipoDTO {
  id: string;
  nombre: string;
  proyectoId: string;
  integrantes: UsuarioDTO[];
}
interface UsuarioDTO {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  rol: string;
}

interface Performance {
  usuario: {
    id: string;
    nombres: string;
    apellidos: string;
    email: string;
    fechaNacimiento: string;
    username: string;
  } | null;
  estimacionTerminadas: number;
  estimacionTrabajando: number;
}

// Tipos esperados como props
interface SprintTabsProps {
  tareas: Tarea[];
  equipos: EquipoDTO[];
  performanceCompleto: Performance[];
}


// Función para mezclar arrays
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const SprintTabs: React.FC<SprintTabsProps> = ({ tareas, equipos, performanceCompleto }) => {
  const sprintTabs = ["Sprint 1", "Sprint 2", "Sprint 3"];
  const [activeSprint, setActiveSprint] = useState("Sprint 1");
  const [tareasMezcladas, setTareasMezcladas] = useState<Tarea[]>([]);

  const equipoActual = equipos[0]; // Ajusta si necesitas otro

  // Mezcla las tareas cuando se selecciona un nuevo sprint
  const handleSprintChange = (nuevoSprint: string) => {
    setActiveSprint(nuevoSprint);
    setTareasMezcladas(shuffleArray(tareas));
  };

  // Mezclar tareas al montar por primera vez
  useEffect(() => {
    setTareasMezcladas(shuffleArray(tareas));
  }, [tareas]);

  return (
    <section className="mt-8">
      {/* Pestañas */}
      <div className="flex border-b border-gray-200 mb-4">
        {sprintTabs.map((sprint) => (
            <button
            key={sprint}
            onClick={() => handleSprintChange(sprint)}
            className={`px-6 py-3 text-xl font-bold rounded-t-md transition-all duration-200 ${
                activeSprint === sprint
                ? "text-white bg-blue-600 shadow border-b-transparent"
                : "text-gray-600 bg-gray-100 hover:bg-blue-100"
            }`}
            >
            {sprint}
            </button>
        ))}
        </div>

      {/* Contenido */}
      <div className="space-y-10">
        <TareasComponent tareas={tareasMezcladas} />

        {equipoActual && (
          <TareasPorIntegrante
            tareas={tareasMezcladas}
            todosLosIntegrantes={equipoActual.integrantes}
          />
        )}

        <TareasPerformanceComponent performance={performanceCompleto} />
      </div>
    </section>
  );
};

export default SprintTabs;