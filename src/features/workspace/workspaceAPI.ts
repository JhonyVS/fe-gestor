import axios from 'axios';

const API_URL = 'http://localhost:8080'; // Ajusta según tu configuración

export const fetchWorkspaceByUsuarioIdAPI = async (usuarioId: string) => {
    const token = sessionStorage.getItem('token'); // Leer el token del sessionStorage
    const response = await axios.get(`http://localhost:8080/usuario/workspaces/${usuarioId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Agregar el encabezado de autorización
      },
    });
    return response.data;
  };

export const fetchTablerosByWorkspaceId = async (workspaceId: string) => {
  const response = await axios.get(`${API_URL}/workspace/${workspaceId}/tableros`);
  return response.data;
};
