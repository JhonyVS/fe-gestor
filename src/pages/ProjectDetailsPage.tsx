// src/pages/ProjectDetailsPage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaUsers, FaEnvelope, FaPhone, FaUserTag } from 'react-icons/fa';

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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-extrabold mb-6 text-blue-700">{project.nombre}</h1>
      <p className="text-gray-600 mb-8 text-lg">{project.descripcion}</p>

      <h2 className="text-3xl font-semibold mb-4 flex items-center">
        <FaUsers className="mr-2 text-blue-700" /> Equipos
      </h2>
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
    </div>
  );
};

export default ProjectDetailsPage;
