import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './providers/ThemeProvider.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'

import './index.css'
import App from './App.jsx'
import './config/axiosConfig' // Configuration globale axios

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
     <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </LanguageProvider>
     </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
) 
