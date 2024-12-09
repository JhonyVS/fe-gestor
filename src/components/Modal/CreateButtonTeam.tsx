import React, { useState } from 'react';

// Define las props que acepta el componente
interface CreateTeamButtonProps {
    onTeamCreated: () => void;
  }

const CreateTeamButton: React.FC<CreateTeamButtonProps> = ({ onTeamCreated }) => {
  const [showModal, setShowModal] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateTeam = async () => {
    const token = sessionStorage.getItem('token');
    const userId = sessionStorage.getItem('id');

    if (!token || !userId) {
      setError('Faltan datos de autenticación.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/equipo/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: teamName,
          usuarioCapitan: {
            id: userId, // ID del usuario capitán
          },
        }),
      });

      if (!response.ok) {
        throw new Error('No se pudo crear el equipo');
      }

      // Resetear el formulario y cerrar el modal
      setTeamName('');
      setShowModal(false);
      setLoading(false);

      // Opcional: Actualizar la lista de equipos aquí si tienes un manejador global.
      alert('Equipo creado con éxito');
      onTeamCreated(); // Llama a la función para refrescar los equipos
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error');
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
      >
        Crear Equipo
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Crear Nuevo Equipo</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateTeam();
              }}
            >
              <div className="mb-4">
                <label htmlFor="teamName" className="block text-sm font-medium text-gray-700">
                  Nombre del Equipo
                </label>
                <input
                  id="teamName"
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={loading}
                >
                  {loading ? 'Creando...' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateTeamButton;
