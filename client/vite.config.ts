import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true, // This forces Vite to use polling, which can help with file changes not being detected
    },
    hmr: {
      overlay: true, // Ensures errors appear in the browser, useful for debugging
    },
  },

})

