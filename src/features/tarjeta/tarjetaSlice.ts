import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchTarjetasByTableroIdAPI,
  createTarjetaAPI,
  updateTarjetaAPI,
  deleteTarjetaAPI,
} from './tarjetaAPI';

interface TarjetaState {
  tarjetas: any[];
  loading: boolean;
  error: string | null;
}

const initialState: TarjetaState = {
  tarjetas: [],
  loading: false,
  error: null,
};

// Thunk para obtener las tarjetas
export const fetchTarjetasByTableroId = createAsyncThunk(
  'tarjeta/fetchTarjetasByTableroId',
  async (tableroId: string, { rejectWithValue }) => {
    try {
      return await fetchTarjetasByTableroIdAPI(tableroId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error al obtener tarjetas');
    }
  }
);

// Thunk para crear una tarjeta
export const createTarjeta = createAsyncThunk(
  'tarjeta/createTarjeta',
  async (data: { tableroId: string; titulo: string; descripcion?: string }, { rejectWithValue }) => {
    try {
      return await createTarjetaAPI(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error al crear tarjeta');
    }
  }
);

// Thunk para actualizar una tarjeta
export const updateTarjeta = createAsyncThunk(
  'tarjeta/updateTarjeta',
  async (
    { tarjetaId, data }: { tarjetaId: string; data: { titulo?: string; descripcion?: string } },
    { rejectWithValue }
  ) => {
    try {
      return await updateTarjetaAPI(tarjetaId, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error al actualizar tarjeta');
    }
  }
);

// Thunk para eliminar una tarjeta
export const deleteTarjeta = createAsyncThunk(
  'tarjeta/deleteTarjeta',
  async (tarjetaId: string, { rejectWithValue }) => {
    try {
      return await deleteTarjetaAPI(tarjetaId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error al eliminar tarjeta');
    }
  }
);

const tarjetaSlice = createSlice({
  name: 'tarjeta',
  initialState,
  reducers: {},
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
      })
      .addCase(createTarjeta.fulfilled, (state, action) => {
        state.tarjetas.push(action.payload); // Agrega la nueva tarjeta
      })
      .addCase(updateTarjeta.fulfilled, (state, action) => {
        const index = state.tarjetas.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.tarjetas[index] = action.payload; // Actualiza la tarjeta
        }
      })
      .addCase(deleteTarjeta.fulfilled, (state, action) => {
        state.tarjetas = state.tarjetas.filter((t) => t.id !== action.meta.arg); // Elimina la tarjeta
      });
  },
});

export default tarjetaSlice.reducer;
