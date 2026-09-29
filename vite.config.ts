import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      // Two entry pages so link crawlers (WhatsApp/X/Slack) get
      // brand-specific previews: / → Memphis meta, /zetu/ → Zetu meta.
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        zetu: fileURLToPath(new URL('./zetu.html', import.meta.url)),
      },
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
