import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import dns from 'node:dns';
import { defineConfig, loadEnv } from 'vite';

// Fix Firefox "Upgrade required" (HTTP 426) when using localhost — keep resolution consistent
dns.setDefaultResultOrder('verbatim');

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), tailwindcss()],
    base: '/',
    server: {
      host: 'localhost',
      port: 5173,
      proxy: {
        '/images': {
          target: env.VITE_BACKEND_URL,
          changeOrigin: true,
        },
        '/hours': {
          target: env.VITE_BACKEND_URL,
          changeOrigin: true,
        },
        '/people': {
          target: env.VITE_BACKEND_URL,
          changeOrigin: true,
        },
      },
    },
  };
});
