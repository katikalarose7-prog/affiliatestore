import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    port: 3000,
    proxy: {
      '/uploads': 'http://localhost:5000',
    },
  },

  build: {
    // Generate separate chunks for better caching
    rollupOptions: {
      output: {
       manualChunks(id) {
  if (id.includes('node_modules')) {

    if (
      id.includes('react') ||
      id.includes('react-dom') ||
      id.includes('react-router-dom')
    ) {
      return 'vendor'
    }

    if (id.includes('lucide-react')) {
      return 'ui'
    }

    if (id.includes('axios')) {
      return 'http'
    }

    return 'vendor'
  }
},
        // Deterministic filenames — good for SW cache busting
        chunkFileNames:  'assets/[name]-[hash].js',
        assetFileNames:  'assets/[name]-[hash][extname]',
        entryFileNames:  'assets/[name]-[hash].js',
      },
    },
    // Inline small assets as base64 (reduces requests)
    assetsInlineLimit: 4096,
    // Source maps for production debugging (optional — remove if you want)
    sourcemap: false,
    // Target modern browsers
    target: 'es2020',
  },

  // Make env vars available
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
  },
})