import { Link } from 'react-router-dom';
import { Botao, Container, Titulo } from '../../shared/ui/index';
import { atalhosInicio } from './content';
import { useInicio } from './hooks/useInicio';
import './home.css';
import { CartaoAgenda } from './components/index';

export default function Inicio() {
  const { referencia, tarefas, eventos } = useInicio();
  const momentoAtual = 'Já moro sozinho';

  return (
    <div
      ref={referencia}
      lang='pt-BR'
      className='inicio-tela min-w-0 bg-white font-corpo text-(--azul-titulo) [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-(--laranja-principal)'
    >
      <Container como='main' classe='inicio-conteudo'>
        <div className='inicio-boas-vindas flex flex-col justify-between gap-6 lg:flex-row lg:items-center'>
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

        <section
          className='inicio-ferramentas'
          aria-labelledby='inicio-ferramentas'
        >
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

        <div className='inicio-paineis grid items-stretch gap-5 lg:grid-cols-2'>
          <section
            className='inicio-tarefas flex min-w-0 items-center rounded-md bg-(--azul-escuro) p-7 sm:p-10'
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
                {tarefas.hoje.length > 0 && tarefas.proximas.length > 0
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
            className='inicio-agenda flex min-w-0 flex-col justify-between gap-6'
            aria-label='Calendário e compromissos'
          >
            <CartaoAgenda eventosDisponiveis={eventos} />
          </section>
        </div>
      </Container>
    </div>
  );
}
