import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { initDatabase } from './services/database/db'
import './index.css'

// Inicializar banco de dados
initDatabase();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
