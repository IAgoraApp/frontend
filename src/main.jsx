import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './aplicacao/estilos/principal.css';
import AplicacaoRotas from './aplicacao/rotas/indice';

createRoot(document.getElementById('raiz')).render(
  <StrictMode>
    <AplicacaoRotas />
  </StrictMode>
);
