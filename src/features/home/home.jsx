import { Link } from 'react-router-dom';
import { Rodape } from '../../shared/index';
import { Botao, Container, Titulo } from '../../shared/ui/index';
import { atalhosInicio } from './content';
import { useInicio } from './hooks/useInicio';
import { ResumoPlataforma } from './components/ResumoPlataforma';
import './home.css';
import { CartaoAgenda } from './components/index';

export default function Inicio() {
  const { banco, tarefas, eventos } = useInicio();
  const momentoAtual = 'Já moro sozinho';

  return (
    <div
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

        <nav
          className='inicio-ferramentas'
          aria-label='Ferramentas para a vida real'
        >
          {atalhosInicio.map(item => (
            <Link key={item.rota} to={item.rota}>
              <span
                aria-hidden='true'
                className='inicio-ferramentas-icone'
                style={{ '--ferramenta-icone': `url("${item.icone}")` }}
              />
              {item.rotulo}
            </Link>
          ))}
        </nav>

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
        <ResumoPlataforma banco={banco} />
      </Container>
      <Rodape />
    </div>
  );
}
