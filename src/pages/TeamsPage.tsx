import React, { useEffect, useState } from 'react';
import { FaUsers, FaUserTag, FaEnvelope } from 'react-icons/fa';

interface Member {
  id: string;
  name: string;
  role: string;
  email: string;
}

interface Team {
  id: string;
  name: string;
  members: Member[];
}

const TeamsPage: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const userId = sessionStorage.getItem('id');

        if (!token || !userId) {
          console.error('Token or userId is missing');
          return;
        }

        const response = await fetch(`http://localhost:8080/equipo/by-project-manager/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch teams');
        }

        const data = await response.json();

        const mappedTeams: Team[] = data.reduce((acc: Team[], team: any) => {
          const existingTeam = acc.find((t) => t.id === team.id);
          if (!existingTeam) {
            acc.push({
              id: team.id,
              name: team.nombre,
              members: team.integrantes.map((member: any) => ({
                id: member.id,
                name: `${member.nombres} ${member.apellidos}`,
                role: member.rol || 'N/A',
                email: member.email,
              })),
            });
          }
          return acc;
        }, []);

        setTeams(mappedTeams);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching teams:', error);
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (loading) {
    return <p className="text-center text-blue-600">Cargando equipos...</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-blue-700 flex items-center justify-center space-x-3">
        <FaUsers /> <span>Mis Equipos</span>
      </h1>

      <div className="space-y-6">
        {teams.map((team) => (
          <section
            key={team.id}
            className="mt-8 bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-2xl font-semibold mb-4 flex items-center text-blue-700">
              <FaUsers className="mr-2" /> {team.name}
            </h2>
            <ul className="space-y-4">
              {team.members.map((member) => (
                <li
                  key={member.id}
                  className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100"
                >
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-800 flex items-center">
                      {member.name}
                      <span className="ml-3 flex items-center bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm font-semibold">
                        <FaUserTag className="mr-1" /> {member.role}
                      </span>
                    </h4>
                    <p className="text-gray-600 flex items-center">
                      <FaEnvelope className="mr-2 text-blue-500" /> {member.email}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
};

export default TeamsPage;
