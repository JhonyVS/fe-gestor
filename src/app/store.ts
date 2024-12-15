import { configureStore } from '@reduxjs/toolkit';
import workspaceReducer from '../features/workspace/workspaceSlice';
import tableroReducer from '../features/tablero/tableroSlice';
import tarjetaReducer from '../features/tarjeta/tarjetaSlice';

export const store = configureStore({
  reducer: {
    workspace: workspaceReducer,
    tablero: tableroReducer, // Combina ambos reducers
    tarjeta: tarjetaReducer, // Agregamos el reducer de tarjetas
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
