import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './app/styles/main.css';
import AppRoutes from './app/router';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRoutes />
  </StrictMode>
);
