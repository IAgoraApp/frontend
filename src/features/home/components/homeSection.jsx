import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Title } from '../../../shared/ui';
import Footer from '../../../shared/footer';
import { shortcuts, taskSummary } from '../content';
import checklist from '../assets/IlustracaoChecklistDaRotina.png';
import photo from '../assets/FotoListaDeTarefasNaMesa.png';

const icons = import.meta.glob('../assets/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
});

export default function HomeSection() {
  const [tasks] = useState(taskSummary);
  return (
    <div
      lang='pt-BR'
      className='min-w-0 flex-1 bg-white font-body text-(--azul-titulo) [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-(--laranja-principal)'
    >
      <Container as='main' className='py-8 sm:py-12'>
        <div className='flex flex-col justify-between gap-6 lg:flex-row lg:items-center'>
          <Title
            as='h1'
            className='text-3xl leading-tight font-extrabold sm:text-4xl'
          >
            Oi! O que vamos resolver hoje?
          </Title>
          <div className='flex min-w-0 items-center justify-between gap-6 rounded-xl bg-(--azul-fundo) px-5 py-4 lg:w-96'>
            <div>
              <p className='text-xs font-bold tracking-wider text-(--laranja-principal)'>
                SEU MOMENTO
              </p>
              <p className='mt-1 font-bold'>Já moro sozinho</p>
            </div>
            <Link
              to='/onboarding'
              className='inline-flex min-h-11 items-center font-bold text-(--laranja-principal)'
            >
              Alterar ↗
            </Link>
          </div>
        </div>
        <section className='mt-10' aria-labelledby='home-tools'>
          <p
            id='home-tools'
            className='text-xs font-bold tracking-[0.12em] text-(--laranja-principal)'
          >
            FERRAMENTAS PARA A VIDA REAL
          </p>
          <nav
            aria-label='Ferramentas para a vida real'
            className='mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6'
          >
            {shortcuts.map(item => (
              <Link
                key={item.label}
                to={item.to}
                className='flex min-w-0 items-center gap-3 rounded-xl py-2 text-sm font-bold hover:bg-(--azul-fundo) sm:text-base'
              >
                <span className='flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#fdebdd] sm:size-17'>
                  <img
                    src={icons['../assets/' + item.icon + '.svg']}
                    alt=''
                    className='max-h-9 max-w-9'
                  />
                </span>
                <span className='wrap-anywhere'>{item.label}</span>
              </Link>
            ))}
          </nav>
        </section>
        <div className='mt-8 grid overflow-hidden rounded-lg border border-[#fce8d9] lg:grid-cols-2'>
          <section
            className='flex min-w-0 items-center gap-3 bg-[#fdebdd] p-6 sm:p-8 lg:min-h-[30rem]'
            aria-labelledby='home-tasks'
          >
            <div className='min-w-0 flex-1'>
              <p className='text-xs font-bold tracking-wider text-(--laranja-principal)'>
                MINHAS TAREFAS
              </p>
              <Title
                id='home-tasks'
                className='mt-4 text-3xl leading-tight font-extrabold'
              >
                {tasks.today.length
                  ? tasks.today.length + ' para hoje'
                  : 'Seu dia, no seu ritmo'}
                {tasks.upcoming.length > 0
                  ? ' e ' + tasks.upcoming.length + ' próximas.'
                  : '.'}
              </Title>
              <p className='mt-4 leading-relaxed text-(--texto-apoio)'>
                {tasks.today.length
                  ? 'Hoje: ' +
                    tasks.today.map(item => item.title).join(', ') +
                    '.'
                  : 'Você está em dia com as tarefas de hoje. Que tal organizar os próximos passos?'}
                {tasks.upcoming.length > 0 &&
                  ' Próximas: ' +
                    tasks.upcoming
                      .slice(0, 2)
                      .map(item => item.title)
                      .join(' e ') +
                    '.'}
              </p>
              <Button
                as={Link}
                to='/rotina?visao=lista'
                color='laranja'
                className='mt-5 min-h-12 px-7'
              >
                Ver tarefas
              </Button>
            </div>
            <img
              src={checklist}
              alt=''
              className='hidden w-28 shrink-0 sm:block xl:w-36'
            />
          </section>
          <section className='min-w-0' aria-labelledby='home-daily'>
            <img
              src={photo}
              alt='Lista de tarefas sobre a mesa, ao lado de uma planta e uma xícara'
              className='aspect-[1.95] w-full object-cover'
            />
            <div className='p-6 sm:p-8'>
              <p className='text-xs font-bold text-(--laranja-principal)'>
                PARA O SEU DIA A DIA
              </p>
              <Title
                id='home-daily'
                className='mt-3 text-3xl leading-tight font-extrabold'
              >
                Lembretes, sugestões e avisos importantes.
              </Title>
              <p className='mt-4 leading-relaxed text-(--texto-apoio)'>
                Veja as tarefas do dia, acompanhe os cuidados da casa e organize
                as contas do mês.
              </p>
              <div className='mt-4 flex flex-wrap gap-x-6 gap-y-2'>
                <Link
                  to='/casa?visao=manutencoes'
                  className='inline-flex min-h-11 items-center text-sm font-bold text-(--laranja-principal)'
                >
                  Cuidados da casa →
                </Link>
                <Link
                  to='/financas?visao=contas'
                  className='inline-flex min-h-11 items-center text-sm font-bold text-(--laranja-principal)'
                >
                  Contas do mês →
                </Link>
              </div>
            </div>
          </section>
        </div>
      </Container>
      <Footer variant='landing' />
    </div>
  );
}
