import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './app/styles/main.css';
import AplicacaoRotas from './app/router/index';

createRoot(document.getElementById('raiz')).render(
  <StrictMode>
    <AplicacaoRotas />
  </StrictMode>
);
