import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // Vite 8 requires manualChunks as a function, not an object
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'vendor'
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'ui'
          }
          if (id.includes('node_modules/axios')) {
            return 'http'
          }
        },
        chunkFileNames:  'assets/[name]-[hash].js',
        assetFileNames:  'assets/[name]-[hash][extname]',
        entryFileNames:  'assets/[name]-[hash].js',
      },
    },
    assetsInlineLimit: 4096,
    sourcemap: false,
    target: 'es2020',
  },

  server: {
    port: 3000,
    proxy: {
      '/uploads': 'http://localhost:5000',
    },
  },
})