import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    host: true, // expose on LAN so mobile can access via http://<your-ip>:3000
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
