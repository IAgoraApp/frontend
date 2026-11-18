import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { Check, X } from 'lucide-react';
import { AvisosPerfilA } from './avisosPerfilA';
import './avisosPerfilA.css';

function inscreverDialogos(atualizar) {
  const observador = new MutationObserver(atualizar);
  observador.observe(document.body, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['open'],
  });
  return () => observador.disconnect();
}

function destinoAviso() {
  return (
    Array.from(document.querySelectorAll('dialog[open]')).at(-1) ||
    document.body
  );
}

function Aviso({ dados, fechar }) {
  const destino = useSyncExternalStore(inscreverDialogos, destinoAviso);
  useEffect(() => {
    const id = window.setTimeout(fechar, dados.acao ? 9000 : 4000);
    return () => window.clearTimeout(id);
  }, [dados, fechar]);

  return createPortal(
    <div className='aviso-perfil-a'>
      <p role='status' aria-atomic='true'>
        <Check size={18} aria-hidden='true' /> {dados.mensagem}
      </p>
      {dados.acao && (
        <button
          type='button'
          className='aviso-perfil-a-acao'
          onClick={() => {
            fechar();
            dados.acao();
          }}
        >
          {dados.rotulo || 'Desfazer'}
        </button>
      )}
      <button
        type='button'
        className='aviso-perfil-a-fechar'
        aria-label='Fechar aviso'
        onClick={fechar}
      >
        <X size={17} aria-hidden='true' />
      </button>
    </div>,
    destino
  );
}

export default function ProvedorAvisosPerfilA({ children }) {
  const [aviso, setAviso] = useState(null);
  const fechar = useCallback(() => setAviso(null), []);
  const notificar = useCallback((mensagem, acao, rotulo) => {
    if (mensagem) setAviso({ mensagem, acao, rotulo });
  }, []);

  return (
    <AvisosPerfilA.Provider value={notificar}>
      {children}
      {aviso && <Aviso dados={aviso} fechar={fechar} />}
    </AvisosPerfilA.Provider>
  );
}
