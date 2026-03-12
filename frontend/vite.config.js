import { defineConfig } from 'vite' // On le remet ici !
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs' // Pour lire tes fichiers certs

// Configuration pour __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    https: {
      // Chemin : on remonte d'un dossier (..) pour sortir de 'frontend' et aller dans 'certs'
      key: fs.readFileSync(path.resolve(__dirname, '../certs/localhost-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, '../certs/localhost.pem')),
    },
    proxy: {
      '/api': {
        target: 'https://localhost:3000', 
        changeOrigin: true,
        secure: true, 
      }
    }
  }
})