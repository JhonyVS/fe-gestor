import React from 'react';
import { useParams } from 'react-router-dom';
import { FaJs, FaReact, FaNodeJs, FaPython, FaJava } from 'react-icons/fa'; // Íconos de tecnologías
import { useFetchUser } from '../components/Hooks/useFetchUser';
import { SiTypescript } from 'react-icons/si'; // Ícono de TypeScript

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, loading, error } = useFetchUser(id as string);

  // Datos ficticios
  const additionalInfo = {
    completedProjects: 8,
    completedTasks: 120,
    teams: ["Team Alpha", "Team Beta"],
    skills: ["JavaScript", "React", "TypeScript", "Node.js"],
    other: "Always delivers high-quality code on time.",
  };

    // Mapeo de habilidades a íconos
    const skillIcons: Record<string, JSX.Element> = {
      JavaScript: <FaJs className="text-yellow-500 text-3xl" />,
      React: <FaReact className="text-blue-500 text-3xl" />,
      TypeScript: <SiTypescript className="text-blue-600 text-3xl" />,
      "Node.js": <FaNodeJs className="text-green-500 text-3xl" />,
      Java: <FaJava className="text-red-600 text-3xl" />,
      Python: <FaPython className="text-blue-400 text-3xl" />,
    };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center mt-5 text-red-500">{error}</div>;

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{
        minHeight: 'calc(100vh - 220px)', // Ajustar para Top (64px), Menu (64px), Footer (64px)
        backgroundColor: '#f8f9fa',
      }}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        {/* Header */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-blue-500 text-white rounded-full flex items-center justify-center text-3xl font-bold mb-4">
            {user?.nombres[0]}{user?.apellidos[0]}
          </div>
          <h1 className="text-xl font-bold">{user?.nombres} {user?.apellidos}</h1>
          <p className="text-gray-500">@{user?.username}</p>
        </div>

        {/* Divider */}
        <hr className="my-6" />

        {/* User Info */}
        <div className="space-y-4">
          <div className="flex items-center">
            <span className="w-6 h-6 text-blue-500 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.209 0 4-1.791 4-4s-1.791-4-4-4-4 1.791-4 4 1.791 4 4 4zm0 2c-2.672 0-8 1.343-8 4v2h16v-2c0-2.657-5.328-4-8-4z" />
              </svg>
            </span>
            <p className="text-gray-600"><strong>Email:</strong> {user?.email}</p>
          </div>
          <div className="flex items-center">
            <span className="w-6 h-6 text-blue-500 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 8v8h4v4l6-4h8v-8h-18zm18-6h-18v2h18v-2zm-10 6h2v2h-2v-2zm-4 0h2v2h-2v-2zm8 0h2v2h-2v-2z" />
              </svg>
            </span>
            <p className="text-gray-600"><strong>Phone:</strong> {user?.telefono}</p>
          </div>
          <div className="flex items-center">
            <span className="w-6 h-6 text-blue-500 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4c4.418 0 8 3.582 8 8s-3.582 8-8 8-8-3.582-8-8 3.582-8 8-8zm0-2c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10z" />
              </svg>
            </span>
            <p className="text-gray-600"><strong>Date of Birth:</strong> {user?.nacimiento ? new Date(user.nacimiento).toLocaleDateString() : 'Not provided'}</p>
          </div>
          <div className="flex items-center">
            <span className="w-6 h-6 text-blue-500 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.5 12l-6.5-6.5-1.5 1.5 5 5-5 5 1.5 1.5 6.5-6.5z" />
              </svg>
            </span>
            <p className="text-gray-600"><strong>Status:</strong> {user?.activado ? 'Active' : 'Inactive'}</p>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-6" />

        {/* Additional Info */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-700">Additional Information</h2>
          <p><strong>Completed Projects:</strong> {additionalInfo.completedProjects}</p>
          <p><strong>Completed Tasks:</strong> {additionalInfo.completedTasks}</p>
          <p><strong>Teams:</strong> {additionalInfo.teams.join(", ")}</p>
          {/* Skills Section */}
          <div>
            <strong>Skills:</strong>
            <div className="flex flex-wrap gap-4 mt-2">
              {additionalInfo.skills.map((skill) => (
                <div key={skill} className="flex items-center gap-2">
                  {skillIcons[skill] || <span className="text-gray-500 text-3xl">?</span>}
                  <span className="text-gray-700">{skill}</span>
                </div>
              ))}
            </div>
          </div>
          <p><strong>Other:</strong> {additionalInfo.other}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
