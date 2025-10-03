import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const BACKEND_PORT = 3001; 

export default defineConfig({
  plugins: [react()],
  server: {
     proxy: {
      // Any request starting with /api will be sent to the backend server
      '/api': {
        target: `http://localhost:${BACKEND_PORT}`,
        changeOrigin: true,
        secure: false, // Use true for HTTPS
        rewrite: (path) => path.replace(/^\/api/, '/api'), // Optional, but good practice
      },
    },
  }
});