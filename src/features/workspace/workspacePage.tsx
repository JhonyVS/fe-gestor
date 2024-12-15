import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../redux/hooks/AppDispatch';
import { fetchWorkspaceByProjectManagerId } from '../../features/workspace/workspaceSlice';
import { RootState } from '../../app/store';
import { useNavigate } from 'react-router-dom';

const WorkspacePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { workspace, loading, error } = useSelector((state: RootState) => state.workspace);

  useEffect(() => {
    const projectManagerId = sessionStorage.getItem('id');
    if (!projectManagerId) {
      navigate('/notauthorized');
      return;
    }
    dispatch(fetchWorkspaceByProjectManagerId(projectManagerId));
  }, [dispatch, navigate]);

  if (loading) return <p>Cargando workspace...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Mi Workspace</h1>
      {workspace ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Tableros</h2>
          {workspace.tableros.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workspace.tableros.map((tablero: any) => (
                <li
                  key={tablero.id}
                  className="p-4 bg-blue-50 rounded-lg shadow-md hover:bg-blue-100 transition duration-200"
                >
                  <h3 className="text-xl font-bold text-blue-700">{tablero.titulo}</h3>
                  <p className="text-gray-600">{tablero.descripcion}</p>
                  <button
                    onClick={() => navigate(`/tableros/${tablero.id}`)}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
                  >
                    Ver Tablero
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No hay tableros en este workspace.</p>
          )}
        </div>
      ) : (
        <p>No se encontró el workspace.</p>
      )}
    </div>
  );
};

export default WorkspacePage;
