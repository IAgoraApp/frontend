import { useEffect, useRef, useState } from 'react';
import iconeGoogle from '../assets/icone-google.png';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();
let carregamento;

function carregarGoogle() {
  if (window.google?.accounts?.id)
    return Promise.resolve(window.google.accounts.id);
  if (!carregamento) {
    carregamento = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.onload = () =>
        window.google?.accounts?.id
          ? resolve(window.google.accounts.id)
          : reject(new Error('O botão do Google não pôde ser carregado.'));
      script.onerror = () => {
        script.remove();
        reject(new Error('O botão do Google não pôde ser carregado.'));
      };
      document.head.appendChild(script);
    }).catch(erro => {
      carregamento = null;
      throw erro;
    });
  }
  return carregamento;
}

export default function EntrarComGoogle({ aoReceber, bloqueado }) {
  const elemento = useRef(null);
  const [falha, setFalha] = useState(false);

  useEffect(() => {
    if (!clientId) return;
    let ativo = true;
    const destino = elemento.current;
    carregarGoogle()
      .then(google => {
        if (!ativo || !destino) return;
        google.initialize({
          client_id: clientId,
          callback: ({ credential }) => {
            if (ativo) aoReceber(credential);
          },
        });
        google.renderButton(destino, {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          locale: 'pt-BR',
          width: Math.min(400, Math.floor(destino.clientWidth)),
        });
      })
      .catch(() => {
        if (ativo) setFalha(true);
      });
    return () => {
      ativo = false;
      destino?.replaceChildren();
    };
  }, [aoReceber]);

  if (!clientId || falha) {
    return (
      <div className='acesso-google'>
        <button type='button' disabled className='acesso-google-desativado'>
          <img src={iconeGoogle} alt='' width='18' height='18' /> Entrar com
          Google
        </button>
        <p>O acesso com Google está indisponível no momento.</p>
      </div>
    );
  }

  return <div className='acesso-google' ref={elemento} inert={bloqueado} />;
}
