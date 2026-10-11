import { defineConfig } from 'vite';

export default defineConfig({
  base: '/preposition-world/',
  server: {
    port: 3000,
    open: true
  },
  build: {
    chunkSizeWarningLimit: 1000
  }
});
