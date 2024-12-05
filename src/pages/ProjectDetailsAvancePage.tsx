import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { useParams, useNavigate } from 'react-router-dom';
import ProgressBar from '../components/Graphics/ProgressBar';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import {FaChartLine, FaRegSadTear, FaShieldAlt, FaUsers} from 'react-icons/fa';
import TareasComponent from '../components/TareasComponent';
import TareasPerformanceComponent from '../components/TareasPerformanceComponent';



ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface UsuarioDTO {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  rol: string;
}

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
    } | null; // Permitir que usuarioAsignado sea null si no hay asignado
    titulo: string;
    descripcion: string;
    estimacion: number;
    estado: {
      id: number;
      nombre: string;
    };
    activado: boolean;
  }

  interface Performance {
    usuario: {
      id: string;
      nombres: string;
      apellidos: string;
      email: string;
      fechaNacimiento: string;
      username: string;
    } | null; // Permitir usuario null si es necesario
    estimacionTerminadas: number;
    estimacionTrabajando: number;
  }
  
  
  

const ProjectDetailsAvancePage: React.FC = () => {
const { projectId } = useParams<{ projectId: string }>();
const [project, setProject] = useState<{ nombre: string; descripcion: string; fechaInicio: string; fechaFinal: string ; projectManagerId: string} | null>(null);
const [loading, setLoading] = useState(true);
const token = sessionStorage.getItem('token');
const [tareasContador, setTareasContador] = useState<{ [key: string]: number }>({
  Trabajando: 0,
  Terminado: 0,
  Pendiente: 0,
});
const [porcentajeCompletadas, setPorcentajeCompletadas] = useState<number | null>(null); // null por defecto
const [tareas, setTareas] = useState<Tarea[]>([]);
const userId = sessionStorage.getItem('id'); // ID del usuario actual
const navigate = useNavigate();



useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectResponse, tareasResponse, todasLasTareasResponse] = await Promise.all([
          axios.get(`http://localhost:8080/proyecto/find/${projectId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:8080/proyecto/${projectId}/tareas/estadisticas`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:8080/proyecto/${projectId}/tareas`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
  
        // Verificar si el usuario tiene autorización
      if (projectResponse.data.projectManagerId !== userId) {
        navigate('/notauthorized'); // Redirigir si no es el Project Manager
      }

        // Actualizar los estados
        setProject(projectResponse.data);
        setTareasContador(tareasResponse.data);
        setTareas(todasLasTareasResponse.data); // Guardar todas las tareas
      } catch (error) {
        console.error('Error fetching project details or tasks:', error);
      } finally {
        setLoading(false);
      }
    };
    
  
    fetchData();
  }, [projectId, token]);
  


  const progressChartData = {
    labels: ['Completadas', 'Pendientes', 'En Proceso'],
    datasets: [
      {
        data: [
          tareasContador.Terminado || 0,
          tareasContador.Pendiente || 0,
          tareasContador.Trabajando || 0,
        ],
        backgroundColor: ['#4CAF50', '#FF9800', '#2196F3'],
        hoverBackgroundColor: ['#388E3C', '#F57C00', '#1976D2'],
        borderWidth: 1,
      },
    ],
  };
  
  const progressChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as 'bottom', // Asegúrate de usar uno de los valores válidos
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            const dataset = tooltipItem.dataset;
            const value = dataset.data[tooltipItem.dataIndex];
            return `${value} tareas`; // Personaliza el texto del tooltip
          },
        },
      },
    },
  };



  // esta funcion nos permite calcular la preddcion de riesgo
  const [riesgoPrediccion, setRiesgoPrediccion] = useState<string>("");

  useEffect(() => {
    if (project && porcentajeCompletadas !== null) {
      const fechaInicio = new Date(project.fechaInicio);
      const fechaFinal = new Date(project.fechaFinal);
      const diasTotales = Math.ceil(
        (fechaFinal.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)
      );
      const diasTranscurridos = Math.ceil(
        (new Date().getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)
      );

      const avanceEsperado = (diasTranscurridos / diasTotales) * 100;
      const diferencia = porcentajeCompletadas - avanceEsperado;

      if (diferencia >= 10) {
        setRiesgoPrediccion("El proyecto va por buen camino.");
      } else if (diferencia >= -10) {
        setRiesgoPrediccion("El proyecto está ligeramente retrasado.");
      } else {
        setRiesgoPrediccion("El proyecto está en alto riesgo de no completarse a tiempo.");
      }
    }
  }, [project, porcentajeCompletadas]);



  const [riesgoPorcentaje, setRiesgoPorcentaje] = useState<number>(0);
  const [diasRestantes, setDiasRestantes] = useState<number>(0);

  useEffect(() => {
    if (project) {
      // Calcular los días restantes
      const hoy = new Date();
      const fechaFinal = new Date(project.fechaFinal);
      const diferenciaDias = Math.max(
        Math.ceil((fechaFinal.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)),
        0
      );
      setDiasRestantes(diferenciaDias);

      // Calcular el nivel de riesgo
      const progreso = porcentajeCompletadas || 0;
      const riesgo = diferenciaDias > 0 ? Math.max(100 - progreso, 0) : 100; // Si el proyecto ya terminó, el riesgo es 100
      setRiesgoPorcentaje(riesgo);
    }
  }, [project, porcentajeCompletadas]);

  
  useEffect(() => {
    if (tareasContador) {
      //console.log("Valores de tareasContador:", tareasContador);
  
      // Asegúrate de manejar los valores predeterminados para evitar errores
      const terminado = tareasContador.Terminado || 0;
      const pendiente = tareasContador.Pendiente || 0;
      const trabajando = tareasContador.Trabajando || 0;
  
      // Calcula el total de tareas
      const totalTareas = terminado + pendiente + trabajando;
      //console.log("Total de Tareas:", totalTareas);
  
      // Calcula el porcentaje de tareas completadas
      const progresoGeneral = totalTareas > 0 ? Math.round((terminado / totalTareas) * 100) : 0;
      //console.log("Progreso General:", progresoGeneral);
  
      // Actualiza el estado
      setPorcentajeCompletadas(progresoGeneral);
    }
  }, [tareasContador]);


  useEffect(() => {
    if (tareasContador) {
      const terminado = tareasContador.Terminado || 0;
      const pendiente = tareasContador.Pendiente || 0;
      const trabajando = tareasContador.Trabajando || 0;

      const totalTareas = terminado + pendiente + trabajando;
      const progresoGeneral = totalTareas > 0 ? Math.round((terminado / totalTareas) * 100) : 0;

      setPorcentajeCompletadas(progresoGeneral);
    }
  }, [tareasContador]);

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

  // Aca mostramos todas las tareas criticas que tienen un alto nivel de estimacion que siguen pendientes o en proceso
  const tareasCriticas = useMemo(() => {
    return tareas
      .filter(
        (tarea) =>
          tarea.estado.nombre !== "Terminado" && tarea.estimacion > 5 // Tareas críticas
      )
      .sort((a, b) => b.estimacion - a.estimacion); // Orden descendente
  }, [tareas]);
  

  const calcularPerformance = (tareas: Tarea[]): Performance[] => {
    const performancePorIntegrante: {
      [key: string]: {
        usuario: Tarea["usuarioAsignado"];
        estimacionTerminadas: number;
        estimacionTrabajando: number;
      };
    } = {};
  
    tareas.forEach((tarea) => {
      const { usuarioAsignado, estado, estimacion } = tarea;
  
      if (!usuarioAsignado) return; // Ignorar tareas sin usuario asignado
  
      const key = usuarioAsignado.id;
  
      if (!performancePorIntegrante[key]) {
        performancePorIntegrante[key] = {
          usuario: usuarioAsignado, // Asignar todo el objeto usuarioAsignado
          estimacionTerminadas: 0,
          estimacionTrabajando: 0,
        };
      }
  
      if (estado.nombre === "Terminado") {
        performancePorIntegrante[key].estimacionTerminadas += estimacion;
      } else if (estado.nombre === "Trabajando") {
        performancePorIntegrante[key].estimacionTrabajando += estimacion;
      }
    });
  
    return Object.values(performancePorIntegrante).sort(
      (a, b) => b.estimacionTerminadas - a.estimacionTerminadas
    );
  };
  
  
  const performance = useMemo(() => calcularPerformance(tareas), [tareas]);
  const tareasPorIntegrante = useMemo(
    () => calcularTareasPorIntegrante(tareas),
    [tareas]
  );


  if (loading) return <p>Loading...</p>;
  if (!project) return <p>Project not found</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-extrabold mb-6 text-blue-700">{project.nombre}</h1>
      <p className="text-gray-600 mb-8 text-lg">{project.descripcion}</p>

      {/* Gestión del Proyecto */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión del Proyecto</h1>
        {/* <FaShieldAlt className="text-red-600 text-7xl cursor-pointer" title="Gestión de Riesgos" /> */}
      </div>



       {/* Sección de Avance */}
       <section className="mb-8">
        <p className="text-3xl font-semibold mb-4 flex items-center text-green-700">
          <FaChartLine className="mr-2" /> Avance
        </p>
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md flex justify-center items-center" style={{ maxWidth: '600px', height: '400px', margin: '0 auto' }}>
        <Doughnut data={progressChartData} options={progressChartOptions} />
        </div>
        <div className="mb-4">
        <p className="text-xl font-bold text-gray-700 mt-4">
          Progreso General: {porcentajeCompletadas || 0}%
        </p>
          {porcentajeCompletadas !== null ? (
            <ProgressBar progress={porcentajeCompletadas} />
          ) : (
            <p>Calculando...</p>
          )}
        </div>
      </section>

      {/* KPIs del Proyecto */}
      <section className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold mb-4 flex items-center text-teal-600">
          <FaChartLine className="mr-2" /> KPIs del Proyecto
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Tareas completadas */}
          <li className="bg-teal-50 p-4 rounded-lg shadow-md flex items-center">
            <span className="text-4xl font-bold text-teal-600 mr-4">
              {Math.round(porcentajeCompletadas || 0)}%
            </span>
            <div>
              <p className="text-sm text-gray-500">Tareas completadas</p>
            </div>
          </li>

          {/* Días restantes */}
          <li className="bg-teal-50 p-4 rounded-lg shadow-md flex items-center">
            <span className="text-4xl font-bold text-teal-600 mr-4">
              {project.fechaFinal
                ? Math.max(
                    Math.ceil(
                      (new Date(project.fechaFinal).getTime() - new Date().getTime()) /
                        (1000 * 60 * 60 * 24)
                    ),
                    0
                  )
                : 'N/A'}
            </span>
            <div>
              <p className="text-sm text-gray-500">Días restantes</p>
            </div>
          </li>
          {/* Duración del Proyecto */}
        <li className="bg-teal-50 p-4 rounded-lg shadow-md flex items-center">
          <span className="text-4xl font-bold text-teal-600 mr-4">
            {project.fechaInicio && project.fechaFinal
              ? Math.ceil(
                  (new Date(project.fechaFinal).getTime() -
                    new Date(project.fechaInicio).getTime()) /
                    (1000 * 60 * 60 * 24)
                )
              : 'N/A'}
          </span>
          <div>
            <p className="text-sm text-gray-500">Duración total (días)</p>
          </div>
        </li>
          {/* Tareas por Estado */}
        <li className="bg-teal-50 p-4 rounded-lg shadow-md flex items-center">
          <span className="text-4xl font-bold text-teal-600 mr-4">
            {tareasContador.Pendiente || 0}
          </span>
          <div>
            <p className="text-sm text-gray-500">Tareas Pendientes</p>
          </div>
        </li>
        <li className="bg-teal-50 p-4 rounded-lg shadow-md flex items-center">
          <span className="text-4xl font-bold text-teal-600 mr-4">
            {tareasContador.Trabajando || 0}
          </span>
          <div>
            <p className="text-sm text-gray-500">Tareas en Proceso</p>
          </div>
        </li>
        <li className="bg-teal-50 p-4 rounded-lg shadow-md flex items-center">
          <span className="text-4xl font-bold text-teal-600 mr-4">
            {tareasContador.Terminado || 0}
          </span>
          <div>
            <p className="text-sm text-gray-500">Tareas terminadas</p>
          </div>

        </li>
        </ul>
      </section>


      {/* Sección de Gestión de Riesgos */}
      <section className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold mb-4 flex items-center text-red-600">
          <FaShieldAlt className="mr-2" /> Gestión de Riesgos
        </h2>

        {/* Barra de Riesgo */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Nivel de Riesgo</h3>
          <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
            <div
              className={`h-4 rounded-full ${
                riesgoPorcentaje <= 33
                  ? "bg-green-500"
                  : riesgoPorcentaje <= 66
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${riesgoPorcentaje}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Nivel de riesgo actual basado en el progreso:{" "}
            <span
              className={`font-semibold ${
                riesgoPorcentaje <= 33
                  ? "text-green-600"
                  : riesgoPorcentaje <= 66
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {riesgoPorcentaje <= 33
                ? "Bajo"
                : riesgoPorcentaje <= 66
                ? "Moderado"
                : "Alto"}
            </span>
          </p>
        </div>

        {/* Indicadores clave */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <h4 className="text-lg font-semibold text-gray-800">Días Restantes</h4>
            <p className="text-2xl font-bold text-blue-600">
              {diasRestantes > 0 ? diasRestantes : "¡Plazo vencido!"}
            </p>
            <p className="text-sm text-gray-500">
              Tiempo estimado restante hasta la fecha de finalización del proyecto.
            </p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <h4 className="text-lg font-semibold text-gray-800">Progreso Total</h4>
            <p className="text-2xl font-bold text-green-600">{porcentajeCompletadas || 0}%</p>
            <p className="text-sm text-gray-500">
              Porcentaje de tareas completadas en el proyecto.
            </p>
          </div>
          {/* tareas criticas */}
          <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <h4 className="text-lg font-semibold text-gray-800">Tareas Críticas por terminar...</h4>
            {tareasCriticas.length > 0 ? (
              <ul className="space-y-2">
                {tareasCriticas.map((tarea) => (
                  <li
                    key={tarea.id}
                    className="p-3 bg-red-100 rounded-lg shadow-md border border-red-200"
                  >
                    <p className="text-sm text-gray-800">
                      <strong>{tarea.titulo}</strong> - {tarea.estimacion} estimacion
                    </p>
                    <p className="text-xs text-gray-600">{tarea.descripcion}</p>
                    <p className="text-xs text-red-600">Estado: {tarea.estado.nombre}</p>
                    <p className="text-xs text-red-600">Asignado: {tarea.usuarioAsignado?.nombres} {tarea.usuarioAsignado?.apellidos}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No hay tareas críticas pendientes.</p>
            )}
          </div>

          <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <h4 className="text-lg font-semibold text-red-600">Predicción de Riesgo</h4>
            <p className="text-sm text-gray-700">{riesgoPrediccion}</p>
          </div>


        </div>
        
      </section>



    {/* Sección de Tareas */}
    <TareasComponent tareas={tareas} />

     {/* Tareas por Integrante */}
     <section className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold mb-6 flex items-center text-blue-600">
          <FaUsers className="mr-2" /> Tareas por Integrante
        </h2>
        {Object.keys(tareasPorIntegrante).length > 0 ? (
          <ul className="space-y-6">
            {Object.values(tareasPorIntegrante).map((integrante) => (
              <li
                key={integrante.usuario?.id}
                className="p-4 bg-gray-50 rounded-lg shadow-md border border-gray-200"
              >
                <h3 className="text-xl font-semibold text-gray-800">
                  {integrante.usuario?.nombres} {integrante.usuario?.apellidos}
                </h3>
                {/* <p className="text-sm text-gray-600">
                  Email: {integrante.usuario?.email}
                </p> */}
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="p-4 bg-yellow-100 rounded-lg shadow-md">
                    <h4 className="text-lg font-semibold text-yellow-600">
                      Pendientes
                    </h4>
                    <p className="text-2xl font-bold text-gray-800">
                      {integrante.pendiente}
                    </p>
                  </div>
                  <div className="p-4 bg-blue-100 rounded-lg shadow-md">
                    <h4 className="text-lg font-semibold text-blue-600">
                      Trabajando
                    </h4>
                    <p className="text-2xl font-bold text-gray-800">
                      {integrante.trabajando}
                    </p>
                  </div>
                  <div className="p-4 bg-green-100 rounded-lg shadow-md">
                    <h4 className="text-lg font-semibold text-green-600">
                      Terminadas
                    </h4>
                    <p className="text-2xl font-bold text-gray-800">
                      {integrante.terminado}
                    </p>
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

        {/* Sección de Desempeño */}
        <TareasPerformanceComponent performance={performance} />


    </div>
  );
};

export default ProjectDetailsAvancePage;
