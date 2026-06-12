import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Target modern browsers for smaller bundles
    target: 'es2020',
    // Compress assets
    assetsInlineLimit: 4096,
    sourcemap: false,
    // Chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') ||
              id.includes('node_modules/react-dom') ||
              id.includes('node_modules/react-router-dom')) {
            return 'react-vendor'
          }
          if (id.includes('node_modules/lucide-react')) return 'icons'
          if (id.includes('node_modules/axios')) return 'http'
          if (id.includes('node_modules/react-hot-toast')) return 'toast'
        },
        chunkFileNames:  'assets/[name]-[hash].js',
        assetFileNames:  'assets/[name]-[hash][extname]',
        entryFileNames:  'assets/[name]-[hash].js',
      },
    },
  },

  server: {
    port: 3000,
    proxy: {
      '/uploads': 'http://localhost:5000',
    },
  },
})