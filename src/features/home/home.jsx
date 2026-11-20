import CabecalhoInicio from './components/CabecalhoInicio';
import { Link } from 'react-router-dom';
import { Rodape } from '../../shared/index';
import { Botao, Container, Titulo } from '../../shared/ui/index';
import { atalhosInicio, atalhosPreparacao } from './content';
import { useInicio } from './hooks/useInicio';
import { ResumoPlataforma } from './components/ResumoPlataforma';
import './home.css';
import ResumoJornada from './components/ResumoJornada';
import { CartaoAgenda } from './components/index';

export default function Inicio({ preparacao = false }) {
  const { banco, tarefas, eventos } = useInicio(preparacao);
  const momentoAtual = preparacao ? 'Quero morar sozinho' : 'Já moro sozinho';
  const tarefasRota = preparacao ? '/minhajornada' : '/rotina?visao=lista';

  return (
    <div
      lang='pt-BR'
      className='inicio-tela min-w-0 bg-white font-corpo text-(--azul-titulo) [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-(--laranja-principal)'
    >
      <Container como='main' classe='inicio-conteudo'>
        <CabecalhoInicio
          titulo={preparacao ? 'Oi! Vamos planejar sua mudança?' : 'Oi! O que vamos resolver hoje?'}
          rotulo='SEU MOMENTO'
          contexto={momentoAtual}
          destino='/onboarding'
          estado={{ usuarioMvp: banco.perfil?.user_id }}
          acao='Alterar ↗'
          atalhos={preparacao ? atalhosPreparacao : atalhosInicio}
        />

        <div className='inicio-paineis grid items-stretch gap-5 lg:grid-cols-2'>
          <section
            className='inicio-tarefas flex min-w-0 items-center rounded-md bg-(--azul-escuro) p-7 sm:p-10'
            aria-labelledby='inicio-tarefas'
          >
            <div className='min-w-0 max-w-lg'>
              <p className='text-xs font-bold tracking-[1.5px] text-[#e13b00]'>
                {preparacao ? 'TAREFAS DA JORNADA' : 'MINHAS TAREFAS'}
              </p>
              <Titulo
                id='inicio-tarefas'
                classe='mt-4 text-3xl leading-tight font-extrabold text-white! sm:text-[34px]'
              >
                {tarefas.hoje.length
                  ? `${tarefas.hoje.length} pendentes`
                  : preparacao ? 'Prepare sua mudança' : 'Seu dia, no seu ritmo'}
                {tarefas.hoje.length > 0 && tarefas.proximas.length > 0
                  ? ` e ${tarefas.proximas.length} próximas.`
                  : '.'}
              </Titulo>
              <p className='mt-4 text-base leading-relaxed text-white/90 sm:text-lg'>
                {tarefas.hoje.length
                  ? `Hoje: ${tarefas.hoje.map(item => item.title).join(', ')}.`
                  : preparacao ? 'Nenhuma tarefa da jornada vence hoje.' : 'Você está em dia com as tarefas de hoje. Que tal organizar os próximos passos?'}
                {tarefas.proximas.length > 0 &&
                  ` Próximas: ${tarefas.proximas
                    .slice(0, 2)
                    .map(item => item.title)
                    .join(' e ')}.`}
              </p>
              <Botao
                como={Link}
                to={tarefasRota}
                cor='laranja'
                classe='mt-6 min-h-13 rounded-full px-8'
              >
                {preparacao ? 'Abrir minha jornada' : 'Ver tarefas'}
              </Botao>
            </div>
          </section>

          {preparacao ? (
            <ResumoJornada banco={banco} />
          ) : (
            <section className='inicio-agenda flex min-w-0 flex-col justify-between gap-6' aria-label='Calendário e compromissos'>
              <CartaoAgenda eventosDisponiveis={eventos} />
            </section>
          )}
        </div>
        <ResumoPlataforma banco={banco} preparacao={preparacao} />
      </Container>
      <Rodape />
    </div>
  );
}
