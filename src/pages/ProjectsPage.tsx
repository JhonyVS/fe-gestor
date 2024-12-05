// src/pages/ProjectsPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUserTie, FaUsers, FaRegFileAlt  } from 'react-icons/fa';
import { BiTask } from 'react-icons/bi';


interface EquipoDTO {
  id: string;
  nombre: string;
}

interface ProyectoDTO {
  id: string;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFinal: string;
  projectManagerId: string;
  activado: boolean;
  equipos?: EquipoDTO[];
}

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<ProyectoDTO[]>([]);
  const [memberProjects, setMemberProjects] = useState<ProyectoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMember, setLoadingMember] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];
  const twoWeeksLater = new Date();
  twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);
  const defaultEndDate = twoWeeksLater.toISOString().split('T')[0];

  const handleViewDetails = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  const [newProject, setNewProject] = useState({
    nombre: '',
    descripcion: '',
    fechaInicio: today,
    fechaFinal: defaultEndDate
  });
  

  useEffect(() => {
    const fetchProjects = async () => {
      const token = sessionStorage.getItem('token');
      const projectManagerId = sessionStorage.getItem('id');
      const userId = sessionStorage.getItem('id');

      try {
        // Proyectos como Project Manager
        const response = await axios.get<ProyectoDTO[]>(`http://localhost:8080/proyecto/mis-proyectos/${projectManagerId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProjects(response.data);

        // Proyectos como Miembro
        const memberResponse = await axios.get<ProyectoDTO[]>(`http://localhost:8080/proyecto/mis-proyectos-equipos/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setMemberProjects(memberResponse.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
        setLoadingMember(false);
      }
    };

    fetchProjects();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProject((prevProject) => ({
      ...prevProject,
      [name]: value
    }));
  };

  const handleCreateProject = async () => {
    const token = sessionStorage.getItem('token');
    const projectManagerId = sessionStorage.getItem('id');

    try {
      await axios.post(
        'http://localhost:8080/proyecto/create',
        {
          ...newProject,
          projectManagerId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      closeModal();
      window.location.reload();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <div className="bg-gray-100 p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold flex items-center space-x-2 text-blue-700">
            <BiTask  />
            <span>Mis Proyectos</span>
          </h1>
          <button
            onClick={openModal}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
          >
            Crear Nuevo Proyecto
          </button>
        </div>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <FaUserTie className="mr-2 text-blue-700" /> Proyectos como Project Manager
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-semibold mb-2 flex items-center text-blue-700">
                      <FaRegFileAlt className="mr-2" /> {project.nombre}
                    </h2>
                    <p className="text-gray-600 mb-2">{project.descripcion}</p>
                    {project.equipos && project.equipos.length > 0 && (
                      <p className="text-gray-500 italic mb-4">Equipo asignado: {project.equipos[0].nombre}</p>
                    )}
                  </div>
                  <div className="mt-auto">
                    <button
                      onClick={() => handleViewDetails(project.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 mt-4"
                      style={{ alignSelf: 'flex-start' }}
                    >
                      Ver detalles
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {loadingMember ? (
          <p className="text-center">Loading projects as member...</p>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mt-12 mb-4 flex items-center">
              <FaUsers className="mr-2 text-green-700" /> Proyectos como Miembro
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {memberProjects.map((project) => (
                <div key={project.id} className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between border-l-4 border-green-500">
                  <div>
                    <h2 className="text-xl font-semibold mb-2 flex items-center text-green-700">
                      <FaRegFileAlt className="mr-2" /> {project.nombre}
                    </h2>
                    <p className="text-gray-600 mb-2">{project.descripcion}</p>
                    {project.equipos && project.equipos.length > 0 && (
                      <p className="text-gray-500 italic mb-4">Equipo asignado: {project.equipos[0].nombre}</p>
                    )}
                  </div>
                  <div className="mt-auto">
                    <button
                      onClick={() => handleViewDetails(project.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 mt-4"
                      style={{ alignSelf: 'flex-start' }}
                    >
                      Ver detalles
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Create New Project</h2>
            <input
              type="text"
              name="nombre"
              value={newProject.nombre}
              onChange={handleInputChange}
              placeholder="Project Name"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <input
              type="text"
              name="descripcion"
              value={newProject.descripcion}
              onChange={handleInputChange}
              placeholder="Description"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <input
              type="date"
              name="fechaInicio"
              value={newProject.fechaInicio}
              readOnly
              className="w-full p-2 mb-4 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
            />
            <input
              type="date"
              name="fechaFinal"
              value={newProject.fechaFinal}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
