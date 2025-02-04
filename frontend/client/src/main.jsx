import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = ''; //Eka hapa client ID , maybe import from .env
createRoot(document.getElementById('root')).render(

  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
    <App />
    </GoogleOAuthProvider>
  </StrictMode>
)
