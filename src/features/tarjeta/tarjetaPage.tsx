import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTarjetasByTableroId } from './tarjetaSlice';
import { RootState, AppDispatch } from '../../app/store';

interface TarjetaProps {
  tableroId: string;
}

const TarjetasPage: React.FC<TarjetaProps> = ({ tableroId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { tarjetas, loading, error } = useSelector((state: RootState) => state.tarjeta);

  useEffect(() => {
    if (tableroId) {
      dispatch(fetchTarjetasByTableroId(tableroId));
    }
  }, [dispatch, tableroId]);

  if (loading) return <p>Loading tarjetas...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Tarjetas</h1>
      {tarjetas.length > 0 ? (
        <ul>
          {tarjetas.map((tarjeta) => (
            <li key={tarjeta.id}>
              <h2>{tarjeta.titulo}</h2>
              <p>{tarjeta.descripcion}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay tarjetas para mostrar</p>
      )}
    </div>
  );
};

export default TarjetasPage;
