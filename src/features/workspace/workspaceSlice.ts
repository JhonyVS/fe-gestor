import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface WorkspaceState {
  workspace: any | null; // Cambiar 'any' por el tipo real del workspace si tienes una interfaz.
  loading: boolean;
  error: string | null;
}

const initialState: WorkspaceState = {
  workspace: null,
  loading: false,
  error: null,
};

// Thunk para obtener el workspace completo por el ID del Project Manager
export const fetchWorkspaceByProjectManagerId = createAsyncThunk(
  'workspace/fetchWorkspaceByProjectManagerId',
  async (projectManagerId: string, thunkAPI) => {
    try {
      const token = sessionStorage.getItem('token'); // Obtener el token
      const response = await axios.get(
        `http://localhost:8080/workspace/by-project-manager/${projectManagerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Error al obtener el workspace');
    }
  }
);

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkspaceByProjectManagerId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkspaceByProjectManagerId.fulfilled, (state, action) => {
        state.workspace = action.payload;
        state.loading = false;
      })
      .addCase(fetchWorkspaceByProjectManagerId.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export default workspaceSlice.reducer;
