import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* FIX: Added 'future' flags to opt-in to React Router v7 behavior. 
        This clears the "startTransition" and "relativeSplatPath" warnings.
    */}
    <BrowserRouter 
      future={{ 
        v7_startTransition: true, 
        v7_relativeSplatPath: true 
      }}
    >
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#1e293b', // Slate-800 for better readability
              borderRadius: '16px', // Slightly rounder for a modern look
              border: '2px solid #f1f5f9',
              padding: '16px',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: '600',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            },
            success: {
              iconTheme: { 
                primary: '#10b981', // Emerald-500
                secondary: '#fff' 
              },
            },
            error: {
              iconTheme: { 
                primary: '#f43f5e', // Rose-500
                secondary: '#fff' 
              },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)