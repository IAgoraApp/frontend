import { SecoesApresentacao } from './components/index';
import { Rodape } from '../../shared/index';

export function PaginaInicial() {
  return (
    <div className='flex min-h-screen flex-col bg-white font-corpo antialiased selection:bg-[#E03B00] selection:text-white'>
      <main className='flex flex-1 flex-col'>
        <SecoesApresentacao.SecaoHero />
        <SecoesApresentacao.SecaoMomento />
        <SecoesApresentacao.SecaoRecursos />
        <SecoesApresentacao.SecaoPassos />
        <SecoesApresentacao.SecaoPerguntas />
        <SecoesApresentacao.SecaoEncerramento />
      </main>
      <Rodape variante='inicial' />
    </div>
  );
}
