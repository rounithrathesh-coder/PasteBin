import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  const apiUrl = process.env.VITE_API_URL || 'http://localhost:5001';

  return {
    plugins: [react()],
    appType: 'spa',
    server: {
      port: 3000,
      host: true,
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: false
        }
      }
    }
  };
});

