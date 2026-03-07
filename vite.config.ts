import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    // 1. AÑADE ESTA LÍNEA PARA ARREGLAR LA PÁGINA EN BLANCO:
    base: '/Witcher-The-Old-World-App/',
    
    plugins: [react(), tailwindcss()],
    
    // 2. ELIMINA EL BLOQUE "define" PARA PROTEGER TU CLAVE
    
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify - file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
