import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './app/styles/main.css';
import AplicacaoRotas from './app/router/index';

const contaUserWay = import.meta.env.VITE_USERWAY_ACCOUNT_ID?.trim();

if (contaUserWay) {
  const script = document.createElement('script');
  script.src = 'https://cdn.userway.org/widget.js';
  script.async = true;
  script.dataset.account = contaUserWay;
  script.dataset.language = 'pt';
  script.dataset.mobile = 'true';
  document.head.appendChild(script);
}

createRoot(document.getElementById('raiz')).render(
  <StrictMode>
    <AplicacaoRotas />
  </StrictMode>
);
