import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './app/styles/main.css';
import AplicacaoRotas from './app/router/index';

const contaUserWay =
  import.meta.env.VITE_USERWAY_ACCOUNT_ID?.trim() || 'Op4n7z4K0L';

if (!document.getElementById('userway-widget-script')) {
  const script = document.createElement('script');
  script.id = 'userway-widget-script';
  script.src = 'https://cdn.userway.org/widget.js';
  script.async = true;
  script.dataset.account = contaUserWay;
  script.dataset.language = 'pt';
  script.dataset.mobile = 'true';
  script.dataset.color = '#102a43';
  script.dataset.position = '5';
  script.dataset.size = 'small';
  document.head.appendChild(script);
}

createRoot(document.getElementById('raiz')).render(
  <StrictMode>
    <AplicacaoRotas />
  </StrictMode>
);
