import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/main.css';
import AppRoutes from './router';
import { AppFeedback } from './components/App/ui';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRoutes />
    <AppFeedback />
  </StrictMode>
);
