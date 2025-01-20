import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Escucha en todas las interfaces de red
    port: 3000,      // Puerto que deseas exponer
    strictPort: true // Evita que Vite cambie el puerto si el 3000 está en uso
  }
})
