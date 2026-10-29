import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Aumentamos un poco el límite para que no tire warning por cosas chicas
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Esta es la parte clave para la optimización móvil
        manualChunks: {
          'vendor-lightbox': ['yet-another-react-lightbox'],
          'vendor-utils': ['framer-motion', 'lucide-react'],
        },
      },
    },
  },
})