// src/pages/ProjectDetailsPage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { useParams } from 'react-router-dom';
import ProgressBar from '../components/Graphics/ProgressBar';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { FaUsers, FaComments, FaHistory,FaEnvelope, FaPhone, FaUserTag, FaChartLine, FaTasks, FaShieldAlt } from 'react-icons/fa';

// Registrar los componentes para Chart.js
ChartJS.register(ArcElement,CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface UsuarioDTO {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  rol: string;
}

interface EquipoDTO {
  id: string;
  nombre: string;
  proyectoId: string;
  integrantes: UsuarioDTO[];
}

// Datos para el gráfico de avance
const chartData = {
  labels: ['Tareas Completadas', 'Tareas Pendientes', 'Tareas en Proceso'],
  datasets: [
    {
      label: 'Progreso del Proyecto',
      data: [40, 20, 10], // Aquí cambiamos con valores reales
      backgroundColor: ['#4CAF50', '#FF9800', '#2196F3'],
      borderColor: ['#388E3C', '#F57C00', '#1976D2'],
      borderWidth: 1,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false, // Permite personalizar la relación de aspecto
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Avance del Proyecto',
    },
  },
  scales: {
    x: {
      ticks: {
        maxRotation: 0, // Ajusta la rotación de etiquetas
        minRotation: 0,
      },
    },
    y: {
      beginAtZero: true,
    },
  },
};





// Datos para el gráfico de progreso
const progressChartData = {
  labels: ['Completadas', 'Pendientes', 'En Proceso'],
  datasets: [
    {
      data: [50, 30, 20], // Sustituir con datos dinámicos
      backgroundColor: ['#4CAF50', '#FF9800', '#2196F3'],
      hoverBackgroundColor: ['#388E3C', '#F57C00', '#1976D2'],
      borderWidth: 1,
    },
  ],
};

const progressChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
    tooltip: {
      callbacks: {
        label: function (tooltipItem: any) {
          const dataset = tooltipItem.dataset;
          const value = dataset.data[tooltipItem.dataIndex];
          return `${value}%`;
        },
      },
    },
  },
};







const ProjectDetailsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<{ nombre: string; descripcion: string } | null>(null);
  const [equipos, setEquipos] = useState<EquipoDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      const token = sessionStorage.getItem('token');

      try {
        const projectResponse = await axios.get(`http://localhost:8080/proyecto/find/${projectId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProject(projectResponse.data);

        const equiposResponse = await axios.get<EquipoDTO[]>(`http://localhost:8080/proyecto/${projectId}/equipos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEquipos(equiposResponse.data);
      } catch (error) {
        console.error('Error fetching project details or teams:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!project) {
    return <p>Project not found</p>;
  }

  function openEventModal(): void {
    throw new Error('Function not implemented.');
  }

  function openAddMemberModal(): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-extrabold mb-6 text-blue-700">{project.nombre}</h1>
      <p className="text-gray-600 mb-8 text-lg">{project.descripcion}</p>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión del Proyecto</h1>
        <div className="flex space-x-4">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
            onClick={() => openAddMemberModal()}
          >
            Agregar Integrantes
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
            onClick={() => openEventModal()}
          >
            Crear Evento
          </button>
        </div>
      </div>


      {/* Sección de Avance */}
      <section className="mb-8">
        <h2 className="text-3xl font-semibold mb-4 flex items-center text-green-700">
          <FaChartLine className="mr-2" /> Avance
        </h2>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Tareas</h3>
        {/* Gráfico Circular */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md flex justify-center items-center" style={{ maxWidth: '400px', margin: '0 auto' }}>
              <Doughnut data={progressChartData} options={progressChartOptions} />
            </div>

            {/* Barra de Progreso */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Progreso General</h3>
              <ProgressBar progress={50} /> {/* Sustituir el valor 50 por datos dinámicos */}
            </div>
      </section>



      <section className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold mb-4 flex items-center text-teal-600">
          <FaChartLine className="mr-2" /> KPIs del Proyecto
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <li className="bg-teal-50 p-4 rounded-lg shadow-md flex items-center">
            <span className="text-4xl font-bold text-teal-600 mr-4">75%</span>
            <div>
              <p className="text-sm text-gray-500">Tareas completadas</p>
            </div>
          </li>
          <li className="bg-teal-50 p-4 rounded-lg shadow-md flex items-center">
            <span className="text-4xl font-bold text-teal-600 mr-4">12</span>
            <div>
              <p className="text-sm text-gray-500">Días restantes</p>
            </div>
          </li>
        </ul>
      </section>

      {/* Sección de Progreso */}
      <section className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold mb-6 flex items-center text-yellow-600">
          <FaTasks className="mr-2" /> Progreso
        </h2>
        <div className="relative">
          {/* Línea Vertical */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-300"></div>
          {/* Eventos */}
          <div className="space-y-8">
            {/* Evento 1 */}
            <div className="relative flex items-center">
              <div className="flex-1 text-right pr-8">
                <p className="text-sm text-gray-500">2024-11-01</p>
                <h3 className="text-lg font-semibold text-gray-800">Inicio del Proyecto</h3>
                <p className="text-gray-600">El proyecto comenzó oficialmente con la planificación inicial.</p>
              </div>
              <div className="relative z-10 w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center text-white font-semibold">
                1
              </div>
            </div>
            {/* Evento 2 */}
            <div className="relative flex items-center">
              <div className="relative z-10 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                2
              </div>
              <div className="flex-1 pl-8">
                <p className="text-sm text-gray-500">2024-11-05</p>
                <h3 className="text-lg font-semibold text-gray-800">Primera Reunión</h3>
                <p className="text-gray-600">Se establecieron metas y objetivos para el sprint inicial.</p>
              </div>
            </div>
            {/* Evento 3 */}
            <div className="relative flex items-center">
              <div className="flex-1 text-right pr-8">
                <p className="text-sm text-gray-500">2024-11-10</p>
                <h3 className="text-lg font-semibold text-gray-800">Inicio del Sprint 1</h3>
                <p className="text-gray-600">Se asignaron las tareas para el primer sprint.</p>
              </div>
              <div className="relative z-10 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                3
              </div>
            </div>
            {/* Evento 4 */}
            <div className="relative flex items-center">
              <div className="relative z-10 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                4
              </div>
              <div className="flex-1 pl-8">
                <p className="text-sm text-gray-500">2024-11-20</p>
                <h3 className="text-lg font-semibold text-gray-800">Fin del Sprint 1</h3>
                <p className="text-gray-600">Se completaron las tareas y se presentó el resultado al cliente.</p>
              </div>
            </div>
          </div>
        </div>
      </section>




      {/* Sección de Equipo */}
      <section className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <Link to="/teams" className="text-3xl font-semibold mb-4 flex items-center text-blue-700 hover:underline">
        <FaUsers className="mr-2" /> Equipo
      </Link>
        {equipos.length > 0 ? (
          equipos.map((equipo) => (
            <div key={equipo.id} className="mb-6 p-4 bg-white rounded-lg shadow-md border border-gray-200">
              <h3 className="text-2xl font-semibold mb-3 text-blue-600">{equipo.nombre}</h3>
              <ul className="space-y-2">
                {equipo.integrantes.map((integrante) => (
                  <li key={integrante.id} className="flex items-center bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-800 flex items-center">
                        {integrante.nombres} {integrante.apellidos}
                        <span className="ml-3 flex items-center bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm font-semibold">
                          <FaUserTag className="mr-1" /> {integrante.rol}
                        </span>
                      </h4>
                      <p className="text-gray-600 flex items-center">
                        <FaEnvelope className="mr-2 text-blue-500" /> {integrante.email}
                      </p>
                      <p className="text-gray-600 flex items-center">
                        <FaPhone className="mr-2 text-blue-500" /> {integrante.telefono}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p>No teams found for this project.</p>
        )}
      </section>


      <section className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold mb-4 flex items-center text-blue-600">
          <FaHistory className="mr-2" /> Histórico de Cambios
        </h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>
            <strong>2024-11-01:</strong> Revisión de requisitos iniciales con el cliente.
          </li>
          <li>
            <strong>2024-11-05:</strong> Ajuste en el cronograma por retrasos en las pruebas.
          </li>
          <li>
            <strong>2024-11-10:</strong> Entrega de la primera versión funcional al cliente.
          </li>
        </ul>
      </section>


      {/* Sección de Gestión de Riesgos */}
      <section className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold mb-4 flex items-center text-red-600">
          <FaShieldAlt className="mr-2" /> Gestión de Riesgos
        </h2>
        <p className="text-gray-600">Información sobre los riesgos identificados y las medidas tomadas para mitigarlos.</p>
      </section>


      <section className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold mb-4 flex items-center text-purple-600">
          <FaComments className="mr-2" /> Comentarios del Proyecto
        </h2>
        <div className="space-y-4">
          <div className="border border-gray-300 p-4 rounded-md">
            <p className="text-sm text-gray-500">Juan Pérez - 2024-11-13</p>
            <p className="text-gray-700">El cliente aprobó el diseño inicial. Iniciaremos el desarrollo.</p>
          </div>
          <textarea
            placeholder="Agregar un comentario..."
            className="w-full border border-gray-300 rounded-md p-2"
          ></textarea>
          <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition duration-300">
            Agregar
          </button>
        </div>
      </section>

    </div>
  );
};

export default ProjectDetailsPage;
