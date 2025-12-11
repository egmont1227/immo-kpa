import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000, 
  },
  // Fix für "import.meta is not available"
  build: {
    target: 'es2020' 
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
    },
  },
})
