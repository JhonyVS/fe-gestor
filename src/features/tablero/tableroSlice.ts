import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { actualizarTareasEnTablero } from './tableroAPI';
import axios from 'axios';

// Estado inicial
const initialState = {
    tablero: null as string | null, // Puede ser null o un string
    tarjetas: [] as any[], // Define correctamente el tipo de las tarjetas
    loading: false,
    error: null as string | null, // Error también puede ser null o un string
  };
  
// Acción para obtener las tarjetas del tablero
export const fetchTarjetasByTableroId = createAsyncThunk(
    'tablero/fetchTarjetasByTableroId',
    async (tableroId: string, thunkAPI) => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get(`http://localhost:8080/tablero/${tableroId}/tarjetas`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return response.data; // Asegúrate de que este sea un array
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response?.data || 'Error al obtener las tarjetas');
      }
    }
  );

// Crear el asyncThunk para actualizar tareas
export const guardarCambiosTablero = createAsyncThunk(
  'tablero/actualizar-tareas',
  async ({ tableroId, data }: { tableroId: string; data: any }, thunkAPI) => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) throw new Error('No se encontró el token de autenticación');
      return await actualizarTareasEnTablero(tableroId, data, token);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Error al guardar cambios');
    }
  }
);
  
const tableroSlice = createSlice({
  name: 'tablero',
  initialState,
  reducers: {
    // Reducer para agregar, editar, o eliminar tareas (se implementarán después)
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTarjetasByTableroId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTarjetasByTableroId.fulfilled, (state, action) => {
        state.loading = false;
        state.tarjetas = action.payload;
      })
      .addCase(fetchTarjetasByTableroId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default tableroSlice.reducer;
