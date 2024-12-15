import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../redux/hooks/AppDispatch';
import { fetchTarjetasByTableroId } from '../../features/tablero/tableroSlice';
import { RootState } from '../../app/store';
import { useParams } from 'react-router-dom';

const TableroPage: React.FC = () => {
  const { tableroId } = useParams<{ tableroId: string }>();
  const dispatch = useAppDispatch();

  const { tarjetas, loading, error } = useSelector((state: RootState) => state.tablero);

  useEffect(() => {
    if (tableroId) {
      dispatch(fetchTarjetasByTableroId(tableroId));
    }
  }, [dispatch, tableroId]);

  if (loading) return <p>Cargando tarjetas...</p>;
  if (error) return <p>Error: {error}</p>;

  // Verificar que tarjetas sea un array antes de mapearlo
  if (!Array.isArray(tarjetas)) {
    return <p>No se encontraron tarjetas.</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Tablero</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tarjetas.map((tarjeta) => (
          <li key={tarjeta.id} className="p-4 bg-green-50 rounded-lg shadow-md hover:bg-green-100 transition duration-200">
            <h3 className="text-xl font-bold text-green-700">{tarjeta.titulo}</h3>
            <p className="text-gray-600">{tarjeta.descripcion}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableroPage;
