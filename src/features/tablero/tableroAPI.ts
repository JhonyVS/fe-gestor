import axios from 'axios';

// Obtener las tarjetas de un tablero
export const getTarjetasByTableroId = async (tableroId: string) => {
  const response = await axios.get(`/tablero/${tableroId}/tarjetas`);
  return response.data;
};

// Crear una nueva tarjeta en el tablero
export const createTarjeta = async (tableroId: string, tarjetaData: any) => {
  const response = await axios.post(`/tablero/${tableroId}/tarjetas`, tarjetaData);
  return response.data;
};

// Actualizar una tarjeta
export const updateTarjeta = async (tarjetaId: string, tarjetaData: any) => {
  const response = await axios.put(`/tarjeta/${tarjetaId}`, tarjetaData);
  return response.data;
};

// Eliminar una tarjeta
export const deleteTarjeta = async (tarjetaId: string) => {
  const response = await axios.delete(`/tarjeta/${tarjetaId}`);
  return response.data;
};

// Obtener las tareas de una tarjeta
export const getTareasByTarjetaId = async (tarjetaId: string) => {
  const response = await axios.get(`/tarjeta/${tarjetaId}/tareas`);
  return response.data;
};

// Crear una nueva tarea en una tarjeta
export const createTarea = async (tarjetaId: string, tareaData: any) => {
  const response = await axios.post(`/tarjeta/${tarjetaId}/tareas`, tareaData);
  return response.data;
};

// Actualizar una tarea
export const updateTarea = async (tareaId: string, tareaData: any) => {
  const response = await axios.put(`/tarea/${tareaId}`, tareaData);
  return response.data;
};

// Eliminar una tarea
export const deleteTarea = async (tareaId: string) => {
  const response = await axios.delete(`/tarea/${tareaId}`);
  return response.data;
};
// Exporta la función para ser usada en el slice
export const actualizarTareasEnTablero = async (tableroId: string, data: any, token: string) => {
  const response = await axios.put(`http://localhost:8080/tablero/${tableroId}/actualizar-tareas`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
