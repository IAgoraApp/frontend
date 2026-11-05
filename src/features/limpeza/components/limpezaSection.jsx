import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Container, Title } from '../../../shared/ui';
import Footer from '../../../shared/footer';
import {
  CasaButton as Action,
  CasaCard as Card,
  CasaDialog as Dialog,
} from '../../casa/components/casaUi';
import {
  cadence,
  guides,
  headings,
  materials,
  readState,
  storageKey,
  tabs,
  todayKey,
} from '../content';
import LimpezaHero from './limpezaHero';
import { ChecklistForm, RoutineForm } from './limpezaForms';
import essentials from '../assets/EditorialPhotoEssentials.png';
import services from '../assets/EditorialPhotoServices.png';
import kit from '../assets/PhotoKitDeLimpeza.png';

const photos = import.meta.glob('../assets/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
});
const scope =
  'min-w-0 flex-1 bg-white font-body leading-normal text-(--azul-titulo) wrap-anywhere [&_:is(button,a,input,select):focus-visible]:outline-2 [&_:is(button,a,input,select):focus-visible]:outline-offset-3 [&_:is(button,a,input,select):focus-visible]:outline-(--laranja-principal)';
export default function LimpezaSection() {
  const [loaded] = useState(readState);
  const [data, setData] = useState(loaded.data);
  const [error, setError] = useState(
    loaded.error
      ? 'Não foi possível ler o checklist salvo. Os dados anteriores foram preservados.'
      : ''
  );
  const [params, setParams] = useSearchParams();
  const requested = params.get('visao');
  const guide = guides.find(item => item.id === params.get('guia'));
  const view = guide
    ? 'guia'
    : tabs.some(([key]) => key === requested)
      ? requested
      : 'inicio';
  const [period, setPeriod] = useState('daily');
  const [room, setRoom] = useState('Todos');
  const [search, setSearch] = useState('');
  const [dialog, setDialog] = useState(null);
  const [message, setMessage] = useState('');
  const day = todayKey();
  const done = data.tasks.filter(
    item => data.checks[day + ':' + item.id]
  ).length;
  const visibleGuides = guides.filter(
    item =>
      (room === 'Todos' || room === item.room) &&
      (item.title + ' ' + item.description)
        .toLocaleLowerCase('pt-BR')
        .includes(search.toLocaleLowerCase('pt-BR'))
  );
  useEffect(() => {
    if (loaded.error) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch {
      const timer = setTimeout(
        () =>
          setError(
            'Não foi possível salvar. As alterações ficam nesta sessão.'
          ),
        0
      );
      return () => clearTimeout(timer);
    }
  }, [data, loaded.error]);
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(''), 5000);
    return () => clearTimeout(timer);
  }, [message]);
  function navigate(next, guideId) {
    setParams(
      previous => {
        const updated = new URLSearchParams(previous);
        if (next === 'inicio') updated.delete('visao');
        else updated.set('visao', next);
        if (guideId) updated.set('guia', guideId);
        else updated.delete('guia');
        return updated;
      },
      { preventScrollReset: true }
    );
  }
  function check(key, value) {
    setData(previous => ({
      ...previous,
      checks: { ...previous.checks, [key]: value },
    }));
  }
  function saveGuide() {
    if (data.tasks.some(item => item.guideId === guide.id)) {
      setMessage('Este guia já está no checklist.');
      return;
    }
    setData(previous => ({
      ...previous,
      tasks: [
        ...previous.tasks,
        {
          id: crypto.randomUUID(),
          title: guide.title,
          room: guide.room,
          frequency: 'Semanal',
          materials: '',
          guideId: guide.id,
        },
      ],
    }));
    setMessage('Guia salvo no checklist.');
  }
  const checklistRow = (title, key, description) => (
    <label
      key={key}
      className='flex min-h-18 items-start gap-4 rounded-lg p-4 hover:bg-(--azul-fundo)'
    >
      <input
        type='checkbox'
        checked={Boolean(data.checks[key])}
        onChange={event => check(key, event.target.checked)}
        className='mt-1 size-5 shrink-0 accent-(--laranja-principal)'
      />
      <span>
        <strong className='block'>{title}</strong>
        {description && (
          <span className='mt-1 block text-sm text-(--texto-apoio)'>
            {description}
          </span>
        )}
      </span>
    </label>
  );
  return (
    <div lang='pt-BR' className={scope}>
      <main>
        <Container className='pt-4'>
          {error && (
            <p role='alert' className='mt-4 rounded-lg bg-amber-50 p-4 text-sm'>
              {error}
            </p>
          )}
        </Container>
        <Container className='pb-10'>
          {view === 'inicio' ? (
            <>
              <LimpezaHero
                onRoutine={() =>
                  setDialog({ type: 'routine', guide: guides[1] })
                }
              />
              <section>
                <p className='text-xs font-bold text-(--laranja-principal)'>
                  UM POUCO A CADA DIA
                </p>
                <Title className='mt-3 text-3xl font-extrabold sm:text-4xl'>
                  O combinado da semana.
                </Title>
                <p className='mt-3 text-(--texto-apoio)'>
                  Comece pelo que faz mais diferença no seu dia a dia.
                </p>
                <div
                  className='my-6 flex flex-wrap gap-3'
                  role='group'
                  aria-label='Frequência dos cuidados'
                >
                  {[
                    ['daily', 'No dia a dia'],
                    ['weekly', 'Na semana'],
                    ['monthly', 'No mês'],
                  ].map(([key, label]) => (
                    <Action
                      key={key}
                      secondary={period !== key}
                      aria-pressed={period === key}
                      onClick={() => setPeriod(key)}
                    >
                      {label}
                    </Action>
                  ))}
                </div>
                <div className='rounded-lg bg-(--azul-fundo) p-3 sm:p-5'>
                  {cadence[period].map(([title, description], index) =>
                    checklistRow(
                      title,
                      day + ':cadence:' + period + index,
                      description
                    )
                  )}
                </div>
                <div className='mt-5 flex flex-wrap gap-3'>
                  <Action secondary onClick={() => navigate('biblioteca')}>
                    Explorar guias
                  </Action>
                  <Action secondary onClick={() => navigate('checklist')}>
                    Abrir meu checklist
                  </Action>
                </div>
              </section>
              <div className='mt-10 grid gap-6 md:grid-cols-2'>
                {[
                  {
                    photo: essentials,
                    title: 'Seu primeiro kit de limpeza.',
                    description:
                      'Poucos itens bem escolhidos resolvem boa parte do básico.',
                    action: 'Ver o que vale ter ↗',
                    view: 'materiais',
                  },
                  {
                    photo: services,
                    title: 'Precisou de uma limpeza maior?',
                    description:
                      'Conheça empresas e converse sobre a necessidade da sua casa.',
                    action: 'Encontrar uma prestadora ↗',
                    to: '/casa?visao=servicos&categoria=limpeza',
                  },
                ].map((item, index) => (
                  <section
                    key={item.title}
                    className={index === 0 ? 'bg-(--laranja-fundo)' : ''}
                  >
                    <img
                      src={item.photo}
                      alt={
                        index
                          ? 'Equipe de limpeza'
                          : 'Itens essenciais para a casa'
                      }
                      className='aspect-[1.5] w-full object-cover'
                    />
                    <div className='space-y-4 p-6'>
                      <Title className='text-3xl font-extrabold'>
                        {item.title}
                      </Title>
                      <p className='text-sm text-(--texto-apoio)'>
                        {item.description}
                      </p>
                      {item.to ? (
                        <Action as={Link} to={item.to} className='w-full'>
                          {item.action}
                        </Action>
                      ) : (
                        <Action
                          className='w-full'
                          onClick={() => navigate(item.view)}
                        >
                          {item.action}
                        </Action>
                      )}
                    </div>
                  </section>
                ))}
              </div>
            </>
          ) : (
            <>
              <header className='py-8'>
                <button
                  type='button'
                  onClick={() =>
                    navigate(view === 'guia' ? 'biblioteca' : 'inicio')
                  }
                  className='mb-4 min-h-11 text-sm font-bold text-(--texto-apoio)'
                >
                  ← Voltar
                </button>
                <p className='text-xs font-bold text-(--laranja-principal)'>
                  CUIDADOS COM A CASA
                </p>
                <Title
                  as='h1'
                  className='mt-3 text-3xl leading-tight font-extrabold sm:text-4xl'
                >
                  {guide?.title ?? headings[view][0]}
                </Title>
                <p className='mt-3 text-(--texto-apoio)'>
                  {guide?.description ?? headings[view][1]}
                </p>
              </header>
              {view === 'biblioteca' && (
                <>
                  <input
                    aria-label='Buscar guia de limpeza'
                    type='search'
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                    placeholder='Buscar um cuidado...'
                    className='mb-5 min-h-13 w-full rounded-lg border border-[#dbe5ed] px-4'
                  />
                  <div
                    className='mb-6 flex flex-wrap gap-3'
                    role='group'
                    aria-label='Filtrar por cômodo'
                  >
                    {['Todos', ...guides.map(item => item.room)].map(value => (
                      <Action
                        key={value}
                        secondary={room !== value}
                        aria-pressed={room === value}
                        onClick={() => setRoom(value)}
                      >
                        {value}
                      </Action>
                    ))}
                  </div>
                  <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                    {visibleGuides.map(item => (
                      <button
                        type='button'
                        key={item.id}
                        onClick={() => navigate('guia', item.id)}
                        className='overflow-hidden rounded-xl border border-[#dbe5ed] text-left hover:shadow-md'
                      >
                        <img
                          src={photos['../assets/' + item.image + '.png']}
                          alt={item.room}
                          className='aspect-[1.6] w-full object-cover'
                        />
                        <div className='space-y-3 p-5'>
                          <p className='text-xs font-bold text-(--laranja-principal)'>
                            {item.room.toUpperCase()}
                          </p>
                          <Title className='text-2xl font-extrabold'>
                            {item.title}
                          </Title>
                          <p className='text-sm text-(--texto-apoio)'>
                            {item.description}
                          </p>
                          <span className='inline-block text-sm font-bold text-(--laranja-principal)'>
                            Ver guia →
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                  {!visibleGuides.length && (
                    <p
                      role='status'
                      className='py-12 text-center text-(--texto-apoio)'
                    >
                      Nenhum guia encontrado. Tente outro cômodo ou termo.
                    </p>
                  )}
                </>
              )}
              {view === 'guia' && guide && (
                <div className='space-y-6'>
                  <div className='grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]'>
                    <img
                      src={photos['../assets/' + guide.image + '.png']}
                      alt={guide.room}
                      className='aspect-[1.6] w-full rounded-xl object-cover'
                    />
                    <Card title='Você vai precisar de:'>
                      <ul className='space-y-3 text-sm'>
                        <li>
                          ✓ Produto adequado para a superfície, conforme o
                          rótulo
                        </li>
                        <li>✓ Panos separados para cada área</li>
                        <li>
                          ✓ Utensílios e proteção indicados pelo fabricante
                        </li>
                      </ul>
                      <p className='mt-6 rounded-lg bg-(--laranja-fundo) p-4 text-sm'>
                        Nunca misture produtos de limpeza. Leia o rótulo e siga
                        as orientações do fabricante.
                      </p>
                    </Card>
                  </div>
                  <Card title='Passo a passo'>
                    {guide.steps.map((step, index) =>
                      checklistRow(
                        index + 1 + '. ' + step,
                        day + ':guide:' + guide.id + index,
                        'Marque cada etapa quando terminar.'
                      )
                    )}
                  </Card>
                  <div className='flex flex-wrap gap-3'>
                    <Action
                      onClick={() => setDialog({ type: 'routine', guide })}
                    >
                      Adicionar à minha rotina
                    </Action>
                    <Action secondary onClick={saveGuide}>
                      Salvar no checklist
                    </Action>
                  </div>
                </div>
              )}
              {view === 'checklist' && (
                <div className='space-y-6'>
                  <div className='grid gap-4 sm:grid-cols-3'>
                    {[
                      ['Tarefas concluídas', done + ' de ' + data.tasks.length],
                      [
                        'Progresso',
                        (data.tasks.length
                          ? Math.round((done / data.tasks.length) * 100)
                          : 0) + '%',
                      ],
                      [
                        'Seu próximo cuidado',
                        data.tasks.find(
                          item => !data.checks[day + ':' + item.id]
                        )?.room ?? 'Tudo em dia',
                      ],
                    ].map(([label, value]) => (
                      <Card key={label}>
                        <p className='text-sm text-(--texto-apoio)'>{label}</p>
                        <strong className='mt-3 block text-2xl'>{value}</strong>
                      </Card>
                    ))}
                  </div>
                  <Card>
                    {data.tasks.map(item => (
                      <div
                        key={item.id}
                        className='flex items-center justify-between gap-2 border-b border-[#e6edf2]'
                      >
                        {checklistRow(
                          item.title,
                          day + ':' + item.id,
                          item.room +
                            ' · ' +
                            item.frequency +
                            (item.materials ? ' · ' + item.materials : '')
                        )}
                        <button
                          type='button'
                          aria-label={'Remover ' + item.title}
                          onClick={() =>
                            setDialog({ type: 'remove', task: item })
                          }
                          className='min-h-11 shrink-0 px-3 text-xs font-bold text-red-700'
                        >
                          Remover
                        </button>
                      </div>
                    ))}
                  </Card>
                  <div className='flex flex-wrap gap-3'>
                    <Action
                      onClick={() =>
                        setMessage('Checklist salvo neste navegador.')
                      }
                    >
                      Salvar checklist
                    </Action>
                    <Action
                      secondary
                      onClick={() => setDialog({ type: 'custom' })}
                    >
                      + Personalizar
                    </Action>
                    <Action secondary as={Link} to='/rotina?visao=lista'>
                      Ver Minha rotina
                    </Action>
                  </div>
                  <p className='text-xs text-(--texto-apoio)'>
                    As marcações acompanham o dia atual. Os cuidados voltam a
                    ficar disponíveis no dia seguinte.
                  </p>
                </div>
              )}
              {view === 'materiais' && (
                <div className='space-y-6'>
                  <div className='grid items-start gap-6 lg:grid-cols-2'>
                    <img
                      src={kit}
                      alt='Kit de materiais de limpeza'
                      className='aspect-[1.4] w-full rounded-xl object-cover'
                    />
                    <Card>
                      {materials.map((material, index) =>
                        checklistRow(
                          material,
                          'material:' + index,
                          'Confira o que você já tem.'
                        )
                      )}
                    </Card>
                  </div>
                  <p className='rounded-xl bg-(--laranja-fundo) p-5 text-sm'>
                    Leia os rótulos, guarde os produtos na embalagem original e
                    longe de crianças e animais. Não misture produtos.
                  </p>
                  <Action onClick={() => navigate('checklist')}>
                    Ver meu checklist
                  </Action>
                </div>
              )}
            </>
          )}
        </Container>
      </main>
      <Footer variant='landing' />
      {message && (
        <div
          role='status'
          className='fixed right-4 bottom-4 left-4 z-40 flex items-center justify-between gap-4 rounded-xl bg-(--azul-titulo) p-4 text-sm text-white sm:left-auto sm:max-w-md'
        >
          {message}
          <button
            type='button'
            onClick={() => setMessage('')}
            aria-label='Fechar aviso'
            className='size-11 shrink-0 text-xl'
          >
            ×
          </button>
        </div>
      )}
      {dialog && (
        <Dialog
          title={
            dialog.type === 'routine'
              ? 'Levar este cuidado para a rotina?'
              : dialog.type === 'remove'
                ? 'Remover tarefa?'
                : 'Seu checklist, do seu jeito.'
          }
          onClose={() => setDialog(null)}
        >
          {dialog.type === 'routine' ? (
            <RoutineForm
              guide={dialog.guide}
              onCancel={() => setDialog(null)}
              onDone={text => {
                setDialog(null);
                setMessage(text);
              }}
            />
          ) : dialog.type === 'custom' ? (
            <ChecklistForm
              onCancel={() => setDialog(null)}
              onSave={task => {
                setData(previous => ({
                  ...previous,
                  tasks: [...previous.tasks, task],
                }));
                setDialog(null);
                setMessage('Tarefa adicionada ao checklist.');
              }}
            />
          ) : (
            <>
              <p className='mb-5'>
                Remover “{dialog.task.title}” do checklist?
              </p>
              <div className='flex flex-wrap gap-3'>
                <Action
                  onClick={() => {
                    setData(previous => ({
                      ...previous,
                      tasks: previous.tasks.filter(
                        item => item.id !== dialog.task.id
                      ),
                    }));
                    setDialog(null);
                  }}
                >
                  Remover
                </Action>
                <Action secondary onClick={() => setDialog(null)}>
                  Cancelar
                </Action>
              </div>
            </>
          )}
        </Dialog>
      )}
    </div>
  );
}
