import React, { useEffect, useState } from 'react';
import { FaUsers, FaUserTag, FaEnvelope, FaPhone } from 'react-icons/fa';
import CreateTeamButton from '../components/Modal/CreateButtonTeam';
import AgregarIntegranteModal from '../components/Modal/AgregarIntegranteModal';
import { Link } from 'react-router-dom';

interface Member {
  id: string;
  nombre: string;
  rol: string | null;
  email: string;
  telefono: string;
}

interface Team {
  id: string;
  nombre: string;
  integrantes: Member[] | null;
}

const TeamsPage: React.FC = () => {
  const [myTeams, setMyTeams] = useState<Team[]>([]);
  const [memberTeams, setMemberTeams] = useState<Team[]>([]);
  const [loadingMyTeams, setLoadingMyTeams] = useState(true);
  const [loadingMemberTeams, setLoadingMemberTeams] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState<string | null>(null);

  // Fetch equipos
  const fetchMyTeams = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const userId = sessionStorage.getItem('id');

      if (!token || !userId) {
        console.error('Token or userId is missing');
        return;
      }

      const response = await fetch(`http://localhost:8080/equipo/capitan/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch my teams');
      }

      const data = await response.json();

      const mappedTeams: Team[] = data.map((team: any) => ({
        id: team.id,
        nombre: team.nombre, // Cambiado a "nombre"
        integrantes: team.integrantes // Cambiado a "integrantes"
          ? team.integrantes.map((member: any) => ({
              id: member.id,
              nombre: `${member.nombres} ${member.apellidos}`, // Cambiado a "nombre"
              rol: member.rol || 'N/A',
              email: member.email,
              telefono: member.telefono,
            }))
          : [],
      }));
      

      setMyTeams(mappedTeams);
      setLoadingMyTeams(false);
    } catch (error) {
      console.error('Error fetching my teams:', error);
      setLoadingMyTeams(false);
    }
  };

  // Abrir modal
  const abrirModal = (equipoId: string) => {
    setEquipoSeleccionado(equipoId);
    setMostrarModal(true);
  };

  // Cerrar modal y refrescar equipos
  const cerrarModal = () => {
    setMostrarModal(false);
    setEquipoSeleccionado(null);
    fetchMyTeams(); // Refrescar la lista de equipos
  };

  // Cargar equipos al montar el componente
  useEffect(() => {
    fetchMyTeams();
  }, []);

  useEffect(() => {
    const fetchMemberTeams = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const userId = sessionStorage.getItem('id');

        if (!token || !userId) {
          console.error('Token or userId is missing');
          return;
        }

        const response = await fetch(`http://localhost:8080/equipo/member/${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch member teams');
        }

        const data = await response.json();

        const mappedTeams: Team[] = data.map((team: any) => ({
          id: team.id,
          nombre: team.nombre,
          integrantes: team.integrantes
            ? team.integrantes.map((member: any) => ({
                id: member.id,
                nombre: `${member.nombres} ${member.apellidos}`,
                rol: member.rol || 'N/A',
                email: member.email,
                telefono: member.telefono,
              }))
            : [],
        }));

        setMemberTeams(mappedTeams);
        setLoadingMemberTeams(false);
      } catch (error) {
        console.error('Error fetching member teams:', error);
        setLoadingMemberTeams(false);
      }
    };

    fetchMemberTeams();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-blue-700 flex items-center justify-center space-x-3">
        <FaUsers /> <span>Equipos</span>
      </h1>

      <section>
        <div className="mb-6 flex justify-end">
        {/* <CreateTeamButton
              onTeamCreated={fetchMyTeams} // Función para refrescar los equipos
              projectId={projectId} // Pasar el ID del proyecto
            /> */}
        </div>
      </section>

      <section>
      <h2 className="text-3xl font-bold mb-6 text-blue-700">Mis equipos</h2>
      {loadingMyTeams ? (
        <p className="text-center text-blue-600">Cargando mis equipos...</p>
      ) : (
        <div className="space-y-6">
          {myTeams.map((team) => (
            <div key={team.id} className="border border-gray-200 p-4 rounded-lg shadow-sm">
              {/* Contenedor con flex para alinear título y botón */}
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-blue-700 flex items-center">
                  <FaUsers className="mr-2" /> {team.nombre}
                </h3>
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center"
                  onClick={() => abrirModal(team.id)}
                >
                  <FaUserTag className="mr-2" /> Agregar Integrante
                </button>
              </div>

              {/* Mostrar integrantes del equipo */}
              {team.integrantes && team.integrantes.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {team.integrantes.map((member) => (
                    <li
                      key={member.id}
                      className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-100"
                    >
                      <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-800 flex items-center">
                        <Link to={`/profile/${member.id}`} className="hover:underline">
                          {member.nombre}
                        </Link>
                        <span className="ml-3 flex items-center bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm font-semibold">
                          <FaUserTag className="mr-1" /> {member.rol}
                        </span>
                      </h4>
                        <p className="text-gray-600 flex items-center">
                          <FaEnvelope className="mr-2 text-blue-500" /> {member.email}
                        </p>
                        <p className="text-gray-600 flex items-center">
                          <FaPhone className="mr-2 text-blue-500" /> {member.telefono}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 mt-4">No hay integrantes en este equipo.</p>
              )}
            </div>
          ))}

          {/* Mostrar el modal */}
          {mostrarModal && equipoSeleccionado && (
            <AgregarIntegranteModal
              equipoId={equipoSeleccionado}
              onClose={cerrarModal}
              onIntegranteAgregado={() => {
                console.log("Integrante agregado");
                fetchMyTeams(); // Actualiza los equipos inmediatamente
              }}
            />
          )}
        </div>
      )}
    </section>



      <section className="mt-10">
        <h2 className="text-3xl font-bold mb-6 text-green-700">Equipos miembro</h2>
        {loadingMemberTeams ? (
          <p className="text-center text-blue-600">Cargando equipos donde soy miembro...</p>
        ) : (
          <div className="space-y-6">
            {memberTeams.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const TeamCard: React.FC<{ team: Team }> = ({ team }) => (
  <section
    className="mt-8 bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300"
  >
    <h2 className="text-2xl font-semibold mb-4 flex items-center text-green-700">
      <FaUsers className="mr-2" /> {team.nombre}
    </h2>
    <ul className="space-y-4">
      {team.integrantes &&
        team.integrantes.map((member) => (
          <li
            key={member.id}
            className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100"
          >
            <div className="flex-1">
            <h4 className="text-lg font-medium text-gray-800 flex items-center">
              <Link to={`/profile/${member.id}`} className="hover:underline">
                {member.nombre}
              </Link>
              <span className="ml-3 flex items-center bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm font-semibold">
                <FaUserTag className="mr-1" /> {member.rol}
              </span>
            </h4>
              <p className="text-gray-600 flex items-center">
                <FaEnvelope className="mr-2 text-green-500" /> {member.email}
              </p>
              <p className="text-gray-600 flex items-center">
                <FaPhone className="mr-2 text-green-500" /> {member.telefono}
              </p>
            </div>
          </li>
        ))}
    </ul>
  </section>
);

export default TeamsPage;
