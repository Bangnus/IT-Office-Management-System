import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: {
      port: 5173,
      clientPort: 5173,
      host: 'localhost'
    }
  },
  optimizeDeps: {
    include: ['@nivo/bar', '@nivo/pi', '@nivo/core'],
  },
})
