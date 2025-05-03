import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist', // Vercel expects build output here
  },
  server: {
    port: 3000,
  },
  base: './', // Important if deploying from subdirectory
});
