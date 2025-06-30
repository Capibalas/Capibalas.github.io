import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          firebase: ['firebase/app', 'firebase/firestore', 'firebase/auth', 'firebase/storage', 'firebase/analytics'],
          charts: ['chart.js', 'react-chartjs-2'],
          pdf: ['jspdf', 'jspdf-autotable']
        }
      }
    }
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['firebase/app', 'firebase/firestore', 'firebase/auth', 'firebase/storage', 'firebase/analytics']
  }
})
