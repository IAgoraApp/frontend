import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Botao,
  Container,
  Titulo,
} from '../../shared/ui/index';
import Rodape from '../../shared/footer';
import { lerEstadoPlataforma } from '../../app/estado/estadoPlataforma';
import { atalhosInicio, obterResumoTarefas } from './content';
import { CartaoAgenda } from './components/index';

export default function Inicio() {
  const [tarefas, setTarefas] = useState(obterResumoTarefas);
  const [estadoPlataforma, setEstadoPlataforma] = useState(
    lerEstadoPlataforma
  );

  useEffect(() => {
    const atualizar = () => {
      setEstadoPlataforma(lerEstadoPlataforma());
      setTarefas(obterResumoTarefas());
    };
    window.addEventListener('iagora:estado', atualizar);
    return () => window.removeEventListener('iagora:estado', atualizar);
  }, []);

  const momentoAtual =
    estadoPlataforma.perfil?.momentoRotulo || 'Já moro sozinho';

  return (
    <div
      lang='pt-BR'
      className='min-w-0 flex-1 bg-white font-corpo text-(--azul-titulo) [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-(--laranja-principal)'
    >
      <Container como='main' classe='py-8 sm:py-12'>
        <div className='flex flex-col justify-between gap-6 lg:flex-row lg:items-center'>
          <Titulo
            como='h1'
            classe='text-3xl leading-tight font-extrabold sm:text-4xl'
          >
            Oi! O que vamos resolver hoje?
          </Titulo>
          <div className='flex min-w-0 items-center justify-between gap-6 rounded-[10px] bg-(--azul-fundo) px-5 py-4 lg:w-[445px]'>
            <div className='min-w-0'>
              <p className='text-xs font-bold tracking-[1.5px] text-(--laranja-principal)'>
                SEU MOMENTO
              </p>
              <p className='mt-1 truncate font-bold text-(--azul-titulo)'>
                {momentoAtual}
              </p>
            </div>
            <Link
              to='/onboarding'
              className='inline-flex min-h-11 shrink-0 items-center font-bold text-(--laranja-principal)'
            >
              Alterar ↗
            </Link>
          </div>
        </div>

        <section className='mt-10' aria-labelledby='inicio-ferramentas'>
          <p
            id='inicio-ferramentas'
            className='text-xs font-bold tracking-[0.12em] text-(--laranja-principal)'
          >
            FERRAMENTAS PARA A VIDA REAL
          </p>
          <nav
            aria-label='Ferramentas para a vida real'
            className='mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6'
          >
            {atalhosInicio.map(item => (
              <Link
                key={item.rotulo}
                to={item.rota}
                className='flex min-w-0 items-center gap-3.5 rounded-xl p-2 text-sm font-bold text-(--azul-titulo) transition-colors hover:bg-(--azul-fundo) sm:text-base'
              >
                <span className='flex size-14 shrink-0 items-center justify-center rounded-[20px] bg-(--azul-titulo) sm:size-[70px]'>
                  <img
                    src={item.icone}
                    alt=''
                    className='max-h-9 max-w-9 object-contain'
                  />
                </span>
                <span className='wrap-anywhere'>{item.rotulo}</span>
              </Link>
            ))}
          </nav>
        </section>

        <div className='mt-8 grid items-stretch gap-5 lg:grid-cols-2'>
          <section
            className='flex min-w-0 items-center rounded-md bg-(--azul-escuro) p-7 sm:p-10 lg:min-h-[30rem]'
            aria-labelledby='inicio-tarefas'
          >
            <div className='min-w-0 max-w-lg'>
              <p className='text-xs font-bold tracking-[1.5px] text-[#e13b00]'>
                MINHAS TAREFAS
              </p>
              <Titulo
                id='inicio-tarefas'
                classe='mt-4 text-3xl leading-tight font-extrabold text-white! sm:text-[34px]'
              >
                {tarefas.hoje.length
                  ? `${tarefas.hoje.length} pendentes`
                  : 'Seu dia, no seu ritmo'}
                {tarefas.proximas.length > 0
                  ? ` e ${tarefas.proximas.length} próximas.`
                  : '.'}
              </Titulo>
              <p className='mt-4 text-base leading-relaxed text-white/90 sm:text-lg'>
                {tarefas.hoje.length
                  ? `Hoje: ${tarefas.hoje.map(item => item.title).join(', ')}.`
                  : 'Você está em dia com as tarefas de hoje. Que tal organizar os próximos passos?'}
                {tarefas.proximas.length > 0 &&
                  ` Próximas: ${tarefas.proximas
                    .slice(0, 2)
                    .map(item => item.title)
                    .join(' e ')}.`}
              </p>
              <Botao
                como={Link}
                to='/rotina?visao=lista'
                cor='laranja'
                classe='mt-6 min-h-13 rounded-full px-8'
              >
                Ver tarefas
              </Botao>
            </div>
          </section>

          <section
            className='flex min-w-0 flex-col justify-between gap-6'
            aria-labelledby='inicio-agenda'
          >
            <CartaoAgenda />
            <div className='pt-2 text-center'>
              <p className='text-sm font-bold text-[#e13b00]'>
                PARA O SEU DIA A DIA
              </p>
              <Titulo
                id='inicio-agenda'
                classe='mt-1 text-[clamp(3.25rem,6vw,5.75rem)] leading-[1.05] font-extrabold tracking-[-0.5px]'
              >
                I Agenda
              </Titulo>
            </div>
          </section>
        </div>
      </Container>
      <Rodape />
    </div>
  );
}
