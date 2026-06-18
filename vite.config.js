import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 👈 Ini nyawa Tailwind v4 di Vite

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 👈 Dipanggil di sini
  ],
})