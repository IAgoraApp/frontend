import { Navigate, useSearchParams } from 'react-router-dom';
import { SecoesApresentacao } from './components/index';
import { Rodape } from '../../shared/index';

export function PaginaInicial() {
  const [params] = useSearchParams();
  const token = params.get('token');
  if (token)
    return (
      <Navigate
        to={'/login?' + new URLSearchParams({ modo: 'nova-senha', token })}
        replace
      />
    );

  return (
    <div className='flex min-h-screen flex-col bg-white font-corpo antialiased selection:bg-[#E03B00] selection:text-white'>
      <main className='flex flex-1 flex-col'>
        <SecoesApresentacao.SecaoHero />
        <SecoesApresentacao.SecaoRecursos />
        <SecoesApresentacao.SecaoMomento />
        <SecoesApresentacao.SecaoPassos />
        <SecoesApresentacao.SecaoPerguntas />
        <SecoesApresentacao.SecaoEncerramento />
      </main>
      <Rodape variante='apresentacao' />
    </div>
  );
}
