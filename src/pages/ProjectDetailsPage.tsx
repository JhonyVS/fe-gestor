import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { useParams } from 'react-router-dom';
import ProgressBar from '../components/Graphics/ProgressBar';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { FaUsers, FaComments, FaEnvelope, FaPhone, FaUserTag, FaChartLine, FaTasks, FaShieldAlt, FaFlagCheckered, FaClock, FaCalendarAlt, FaFlag, FaPlus } from 'react-icons/fa';

import CreateEventModal from "../components/Modal/CreateEventModalProps";


ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface UsuarioDTO {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  rol: string;
}

interface UsuarioBasicDTO {
  nombres: string;
  apellidos: string;
}

interface ComentarioDTO {
  id: string;
  contenido: string;
  createdAt: string;
  usuario: UsuarioBasicDTO;
}

interface EquipoDTO {
  id: string;
  nombre: string;
  proyectoId: string;
  integrantes: UsuarioDTO[];
}

interface EventoDTO {
  id: string;
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
}

const chartData = {
  labels: ['Tareas Completadas', 'Tareas Pendientes', 'Tareas en Proceso'],
  datasets: [
    {
      label: 'Progreso del Proyecto',
      data: [40, 20, 10],
      backgroundColor: ['#4CAF50', '#FF9800', '#2196F3'],
      borderColor: ['#388E3C', '#F57C00', '#1976D2'],
      borderWidth: 1,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Avance del Proyecto',
    },
  },
};

const progressChartData = {
  labels: ['Completadas', 'Pendientes', 'En Proceso'],
  datasets: [
    {
      data: [50, 30, 20],
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
  const [project, setProject] = useState<{ nombre: string; descripcion: string; fechaInicio: string; fechaFinal: string } | null>(null);
  const [equipos, setEquipos] = useState<EquipoDTO[]>([]);
  const [comentarios, setComentarios] = useState<ComentarioDTO[]>([]);
  const [eventos, setEventos] = useState<EventoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem('token');

  const [nuevoComentario, setNuevoComentario] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectResponse, equiposResponse, comentariosResponse, eventosResponse] = await Promise.all([
          axios.get(`http://localhost:8080/proyecto/find/${projectId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get<EquipoDTO[]>(`http://localhost:8080/proyecto/${projectId}/equipos`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get<ComentarioDTO[]>(`http://localhost:8080/comentario/proyecto/${projectId}/detallado`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get<EventoDTO[]>(`http://localhost:8080/evento/proyecto/${projectId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // Ordenar eventos por fechaInicio antes de establecer el estado
        const eventosOrdenados = eventosResponse.data.sort(
          (a, b) => new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime()
        );
        setEventos(eventosOrdenados);

        setProject(projectResponse.data);
        setEquipos(equiposResponse.data);
        setComentarios(comentariosResponse.data);
        setEventos(eventosResponse.data);
      } catch (error) {
        console.error('Error fetching project details or teams:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId, token]);

  // modal para crear eventos
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);

  const handleCreateEvent = async (evento: { titulo: string; descripcion: string; fechaInicio: string }) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/evento/create`,
        { ...evento, idProyecto: projectId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Actualizar la lista de eventos
      setEventos((prevEventos) => [...prevEventos, response.data]);
      setShowCreateEventModal(false); // Cerrar el modal
    } catch (error) {
      console.error("Error al crear el evento:", error);
      alert("No se pudo crear el evento. Intenta nuevamente.");
    }
  };


  const agregarComentario = async () => {
    if (!nuevoComentario.trim()) {
      alert('El comentario no puede estar vacío.');
      return;
    }
  
    // Obtener el ID del usuario desde sessionStorage
    const usuarioId = sessionStorage.getItem('id');
    if (!usuarioId) {
      alert('No se pudo encontrar el ID del usuario en la sesión.');
      return;
    }
  
    // Crear el DTO según el nuevo formato
    const comentarioDTO = {
      usuario: {
        id: usuarioId, // Ahora el usuario es un objeto con su ID
      },
      idProyecto: projectId,
      contenido: nuevoComentario,
    };
  
    try {
      // Enviar la solicitud POST al backend
      const response = await axios.post(
        'http://localhost:8080/comentario/create',
        comentarioDTO,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Actualizar la lista de comentarios en el frontend
      setComentarios((prevComentarios) => [...prevComentarios, response.data]);
  
      // Limpiar el campo de entrada de texto
      setNuevoComentario('');
    } catch (error) {
      console.error('Error al agregar comentario:', error);
      alert('Ocurrió un error al agregar el comentario. Por favor, inténtelo de nuevo.');
    }
  };
  

  if (loading) return <p>Loading...</p>;
  if (!project) return <p>Project not found</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-extrabold mb-6 text-blue-700">{project.nombre}</h1>
      <p className="text-gray-600 mb-8 text-lg">{project.descripcion}</p>

      {/* Gestión del Proyecto */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión del Proyecto</h1>
      </div>

      {/* Sección de Avance */}
      <section className="mb-8">
        <h2 className="text-3xl font-semibold mb-4 flex items-center text-green-700">
          <FaChartLine className="mr-2" /> Avance
        </h2>
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md flex justify-center items-center" style={{ maxWidth: '400px', margin: '0 auto' }}>
          <Doughnut data={progressChartData} options={progressChartOptions} />
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Progreso General</h3>
          <ProgressBar progress={50} />
        </div>
      </section>



      {/* KPIs del Proyecto */}
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



      {/* Sección de Eventos */}
      <section className="mt-8 bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-yellow-600 flex items-center">
            <FaTasks className="mr-2" /> Eventos Importantes
          </h2>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
            onClick={() => setShowCreateEventModal(true)}
          >
            <FaPlus className="mr-2" /> Crear Evento
          </button>
        </div>

        <ul className="space-y-6">
          {/* Fecha de inicio del proyecto */}
          {project && (
            <li className="flex items-start bg-yellow-50 p-4 rounded-md shadow-sm border-l-4 border-yellow-500">
              <FaFlag className="text-yellow-600 mr-4 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-700">Inicio del Proyecto</h3>
                <p className="text-gray-600">{new Date(project.fechaInicio).toLocaleString()}</p>
              </div>
            </li>
          )}

          {/* Eventos ya ordenados */}
          {eventos.map((evento, index) => (
            <li
              key={index}
              className="flex items-start bg-blue-50 p-4 rounded-md shadow-sm border-l-4 border-blue-500"
            >
              <FaCalendarAlt className="text-blue-600 mr-4 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-blue-700">{evento.titulo}</h3>
                <p className="text-gray-600">{evento.descripcion}</p>
                <p className="text-sm text-gray-500">
                  <FaClock className="inline-block mr-1" />
                  {new Date(evento.fechaInicio).toLocaleString()}
                </p>
              </div>
            </li>
          ))}

          {/* Fecha de fin del proyecto */}
          {project && (
            <li className="flex items-start bg-green-50 p-4 rounded-md shadow-sm border-l-4 border-green-500">
              <FaFlagCheckered className="text-green-600 mr-4 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-green-700">Fin del Proyecto</h3>
                <p className="text-gray-600">{new Date(project.fechaFinal).toLocaleString()}</p>
              </div>
            </li>
          )}
        </ul>

        <CreateEventModal
          isOpen={showCreateEventModal}
          onClose={() => setShowCreateEventModal(false)}
          onCreate={handleCreateEvent}
        />
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




      {/* Sección de Gestión de Riesgos */}
      <section className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold mb-4 flex items-center text-red-600">
          <FaShieldAlt className="mr-2" /> Gestión de Riesgos
        </h2>
        <p className="text-gray-600">Información sobre los riesgos identificados y las medidas tomadas para mitigarlos.</p>
      </section>





      {/* Sección de Comentarios */}
      <section className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold mb-4 flex items-center text-purple-600">
          <FaComments className="mr-2" /> Comentarios
        </h2>
        <div className="space-y-4">
          {comentarios.map((comentario) => (
            <div key={comentario.id} className="border border-gray-300 p-4 rounded-md">
              <p className="text-sm text-gray-500">
                {new Date(comentario.createdAt).toLocaleDateString()} - {comentario.usuario.nombres} {comentario.usuario.apellidos}
              </p>
              <p className="text-gray-700">{comentario.contenido}</p>
            </div>
          ))}
          <textarea
            value={nuevoComentario}
            onChange={(e) => setNuevoComentario(e.target.value)}
            placeholder="Agregar un comentario..."
            className="w-full border border-gray-300 rounded-md p-2"
          ></textarea>
          <button
            onClick={agregarComentario}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition duration-300"
          >
            Agregar
          </button>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetailsPage;
