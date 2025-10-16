import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: parseInt(process.env.PORT || '4000'),
    strictPort: true,
    host: '0.0.0.0',
    open: false
  },
  preview: {
    port: parseInt(process.env.PORT || '4000'),
    strictPort: true,
    host: '0.0.0.0'
  }
})
