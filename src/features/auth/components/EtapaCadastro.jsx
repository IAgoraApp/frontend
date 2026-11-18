import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import logo from '../../../shared/assets/logoLaranja.png';
import { Botao } from '../../../shared/ui';
import { contaApi, encerrarSessao } from '../../../app/dados/contaApi';
import './etapaCadastro.css';

export function EtapaCadastro({ sessao, empresa, ocupado, children }) {
  const navegar = useNavigate();
  const dialogo = useRef(null);
  const [excluindo, setExcluindo] = useState(false);
  const [erro, setErro] = useState('');

  async function sair() {
    if (excluindo) return;
    setExcluindo(true);
    setErro('');
    try {
      if (sessao?.cadastroPendente) {
        await contaApi(`/user/${sessao.id}`, {
          metodo: 'DELETE',
          token: sessao.token,
        });
        encerrarSessao();
      }
      dialogo.current.close();
      navegar('/login', { replace: true });
    } catch (falha) {
      setErro(falha.message);
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <main className='etapa-cadastro'>
      <header className='etapa-cadastro-topo'>
        <img src={logo} alt='IAgora' />
        <button
          type='button'
          disabled={ocupado}
          onClick={() => {
            setErro('');
            dialogo.current.showModal();
          }}
        >
          <X size={16} aria-hidden='true' /> Cancelar cadastro
        </button>
      </header>
      {children}
      <dialog
        ref={dialogo}
        className='etapa-cadastro-dialogo'
        aria-labelledby='titulo-cancelar-cadastro'
        onCancel={evento => {
          if (excluindo) evento.preventDefault();
        }}
      >
        <h2 id='titulo-cancelar-cadastro'>Cancelar cadastro?</h2>
        <p>
          Se você sair agora, a conta{' '}
          {empresa ? 'da empresa' : 'que acabou de criar'} será excluída e você
          precisará começar de novo.
        </p>
        {erro && <p role='alert'>{erro}</p>}
        <div>
          <Botao
            type='button'
            variante='contorno'
            autoFocus
            disabled={excluindo}
            onClick={() => dialogo.current.close()}
          >
            Continuar cadastro
          </Botao>
          <Botao
            type='button'
            classe='etapa-cadastro-excluir'
            disabled={excluindo}
            onClick={sair}
          >
            {excluindo ? 'Excluindo…' : 'Excluir conta e sair'}
          </Botao>
        </div>
      </dialog>
    </main>
  );
}
