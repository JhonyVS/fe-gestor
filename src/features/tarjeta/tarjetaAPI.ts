import axios from 'axios';

const baseUrl = 'http://localhost:8080/tarjeta'; // Base URL para las tarjetas

// Obtener las tarjetas por ID del tablero
export const fetchTarjetasByTableroIdAPI = async (tableroId: string) => {
  const response = await axios.get(`${baseUrl}/${tableroId}/tareas`);
  return response.data;
};

// Crear una nueva tarjeta
export const createTarjetaAPI = async (data: {
  tableroId: string;
  titulo: string;
  descripcion?: string;
}) => {
  const response = await axios.post(`${baseUrl}`, data);
  return response.data;
};

// Actualizar una tarjeta existente
export const updateTarjetaAPI = async (tarjetaId: string, data: { titulo?: string; descripcion?: string }) => {
  const response = await axios.put(`${baseUrl}/${tarjetaId}`, data);
  return response.data;
};

// Eliminar una tarjeta
export const deleteTarjetaAPI = async (tarjetaId: string) => {
  const response = await axios.delete(`${baseUrl}/${tarjetaId}`);
  return response.data;
};
