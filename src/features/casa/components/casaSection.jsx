import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Container, Title } from '../../../shared/ui';
import Footer from '../../../shared/footer';
import { completeMaintenance, readCasa, storageKey, views } from '../content';
import {
  readState as readFinance,
  money,
  monthKey,
  billStatus,
  billDue,
  shortDate,
} from '../../financas/content';
import { CasaButton, CasaCard, CasaDialog } from './casaUi';
import CasaHub from './casaHub';
import ResidenceForm from './residenceForm';
import MaintenanceForm from './maintenanceForm';
import residencePhoto from '../assets/PhotoMinhaResidencia.png';

export default function CasaSection() {
  const [loaded] = useState(readCasa);
  const [data, setData] = useState(loaded.data);
  const [storageError, setStorageError] = useState(
    loaded.error
      ? 'Não foi possível carregar sua casa. Os dados anteriores foram preservados; esta é uma prévia de exemplo.'
      : ''
  );
  const [params, setParams] = useSearchParams();
  const requested = params.get('visao');
  const view = Object.hasOwn(views, requested) ? requested : 'hub';
  const [dialog, setDialog] = useState(null);
  const [toast, setToast] = useState('');
  const [filter, setFilter] = useState('pending');
  const [search, setSearch] = useState('');
  const [service, setService] = useState(() =>
    params.get('categoria') === 'limpeza' ? 'Limpeza' : 'Manutenção'
  );
  const [month, setMonth] = useState(monthKey);
  const formView = view === 'cadastrar' || view === 'editar';
  const finance = readFinance();
  const homeCategories = finance.data.categories
    .filter(category => /moradia|habita|contas/i.test(category.name))
    .map(category => category.id);
  const expenses = finance.data.transactions.filter(
    item =>
      item.type === 'expense' &&
      homeCategories.includes(item.categoryId) &&
      item.date.startsWith(month)
  );
  const expenseTotal = expenses.reduce((total, item) => total + item.amount, 0);
  const bills = finance.data.bills.filter(
    bill =>
      (bill.repeat
        ? bill.date.slice(0, 7) <= month
        : bill.date.startsWith(month)) &&
      billStatus(bill, month, finance.data.payments) !== 'paid'
  );
  const pending = data.maintenance.filter(item => !item.completedAt);
  const history = view === 'historico' || filter === 'completed';
  const entries = data.maintenance
    .filter(
      item =>
        (history ? Boolean(item.completedAt) : !item.completedAt) &&
        item.title
          .toLocaleLowerCase('pt-BR')
          .includes(search.toLocaleLowerCase('pt-BR'))
    )
    .sort((a, b) =>
      history
        ? b.completedAt.localeCompare(a.completedAt)
        : a.date.localeCompare(b.date)
    );

  useEffect(() => {
    if (loaded.error) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch {
      const timer = setTimeout(
        () =>
          setStorageError(
            'Não foi possível salvar no navegador. As alterações ficam disponíveis nesta sessão.'
          ),
        0
      );
      return () => clearTimeout(timer);
    }
  }, [data, loaded.error]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 5000);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    if (formView) window.scrollTo({ top: 0, behavior: 'instant' });
  }, [formView]);

  function navigate(next) {
    setParams(
      previous => {
        const updated = new URLSearchParams(previous);
        if (next === 'hub') updated.delete('visao');
        else updated.set('visao', next);
        return updated;
      },
      { preventScrollReset: true }
    );
    setDialog(null);
  }
  function saveMaintenance(item) {
    setData(previous => ({
      ...previous,
      example: false,
      maintenance: previous.maintenance.some(entry => entry.id === item.id)
        ? previous.maintenance.map(entry =>
            entry.id === item.id ? item : entry
          )
        : [...previous.maintenance, item],
    }));
    setDialog(null);
    setToast('Manutenção salva.');
  }
  function check(key, value) {
    setData(previous => ({
      ...previous,
      checks: { ...previous.checks, [key]: value },
    }));
  }
  const openMaintenance = item => setDialog({ type: 'detail', item });
  const navigateMaintenance = () => {
    setFilter('pending');
    setSearch('');
    navigate('manutencoes');
  };

  return (
    <div
      lang='pt-BR'
      className='min-w-0 flex-1 bg-white font-body leading-normal text-(--azul-titulo) wrap-anywhere [overflow-anchor:none] [&_:is(button,summary)]:cursor-pointer [&_:is(a,button,input,select,textarea):focus-visible]:outline-2 [&_:is(a,button,input,select,textarea):focus-visible]:outline-offset-3 [&_:is(a,button,input,select,textarea):focus-visible]:outline-(--laranja-principal)'
    >
      <main>
        <Container className='pt-4'>
          {storageError && (
            <p
              role='alert'
              className='mb-4 rounded-lg bg-amber-50 p-4 text-sm text-amber-900'
            >
              {storageError}
            </p>
          )}
        </Container>
        {view === 'hub' ? (
          <CasaHub onNavigate={navigate} checks={data.checks} onCheck={check} />
        ) : (
          <Container className='py-7 sm:py-9'>
            <button
              type='button'
              onClick={() => navigate(formView ? 'residencia' : 'hub')}
              className='mb-4 min-h-11 text-sm font-bold text-(--texto-apoio)'
            >
              ← Voltar
            </button>
            <div className='mb-7'>
              <span className='inline-block rotate-[1.4deg] bg-(--laranja-principal) px-3 py-1.5 text-xs font-bold text-white'>
                MINHA CASA
              </span>
              <Title
                as='h1'
                className='mt-4 text-3xl leading-tight font-extrabold sm:text-4xl lg:text-5xl'
              >
                {views[view][0]}
              </Title>
              <p className='mt-3 max-w-3xl text-(--texto-apoio)'>
                {views[view][1]}
              </p>
              {data.example && !formView && (
                <p className='mt-3 text-xs text-(--texto-apoio)'>
                  Dados de exemplo da residência e das manutenções. Edite para
                  personalizar.
                </p>
              )}
            </div>
            {formView && (
              <ResidenceForm
                key={view}
                residence={view === 'editar' ? data.residence : null}
                onCancel={() => navigate('residencia')}
                onSave={residence => {
                  setData(previous => ({
                    ...previous,
                    example: false,
                    residence,
                  }));
                  navigate('residencia');
                  setToast('Sua casa foi salva.');
                }}
              />
            )}
            {view === 'residencia' &&
              (data.residence ? (
                <div className='space-y-6'>
                  <CasaCard>
                    <div className='grid items-center gap-6 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]'>
                      <img
                        src={residencePhoto}
                        alt='Ambiente ilustrativo de uma residência'
                        className='aspect-[1.65] w-full rounded-lg object-cover'
                      />
                      <div>
                        <p className='text-xs text-(--texto-apoio)'>
                          Imagem ilustrativa
                        </p>
                        <Title className='mt-2 text-3xl font-extrabold'>
                          {data.residence.name}
                        </Title>
                        <p className='mt-3 text-(--texto-apoio)'>
                          {data.residence.type} · {data.residence.location}
                        </p>
                        <p className='mt-2 text-sm'>
                          {data.residence.rooms.join(' · ')}
                        </p>
                        <div className='mt-5 flex flex-wrap gap-3'>
                          <CasaButton
                            secondary
                            onClick={() => navigate('editar')}
                          >
                            Editar minha casa
                          </CasaButton>
                          <button
                            type='button'
                            onClick={() => setDialog({ type: 'remove' })}
                            className='min-h-12 px-4 text-sm font-bold text-red-700'
                          >
                            Remover residência
                          </button>
                        </div>
                      </div>
                    </div>
                  </CasaCard>
                  <div className='grid gap-4 sm:grid-cols-3'>
                    {[
                      ['Cômodos', data.residence.rooms.length],
                      ['Manutenções pendentes', pending.length],
                      ['Despesas da casa / mês', money(expenseTotal)],
                    ].map(([label, value]) => (
                      <CasaCard key={label}>
                        <p className='text-sm text-(--texto-apoio)'>{label}</p>
                        <p className='mt-3 text-3xl font-extrabold'>{value}</p>
                      </CasaCard>
                    ))}
                  </div>
                  <div className='flex flex-wrap gap-3'>
                    <CasaButton onClick={navigateMaintenance}>
                      Manutenções
                    </CasaButton>
                    <CasaButton secondary onClick={() => navigate('despesas')}>
                      Despesas do imóvel
                    </CasaButton>
                    <CasaButton secondary as={Link} to='/limpeza'>
                      Cuidar da limpeza
                    </CasaButton>
                    <CasaButton secondary as={Link} to='/rotina'>
                      Ver minha rotina
                    </CasaButton>
                  </div>
                </div>
              ) : (
                <CasaCard title='Seu canto começa aqui.'>
                  <p className='mb-5 text-(--texto-apoio)'>
                    Cadastre sua residência para organizar seus cômodos e
                    cuidados.
                  </p>
                  <CasaButton onClick={() => navigate('cadastrar')}>
                    Cadastrar residência
                  </CasaButton>
                </CasaCard>
              ))}
            {(view === 'manutencoes' || view === 'historico') && (
              <div className='space-y-5'>
                <div className='flex flex-wrap items-center justify-between gap-4'>
                  <div
                    className='flex flex-wrap gap-2'
                    role='group'
                    aria-label='Status da manutenção'
                  >
                    {[
                      ['pending', 'Pendentes'],
                      ['completed', 'Concluídas'],
                    ].map(([key, label]) => (
                      <CasaButton
                        key={key}
                        secondary={(history ? 'completed' : 'pending') !== key}
                        aria-pressed={
                          (history ? 'completed' : 'pending') === key
                        }
                        onClick={() => {
                          setFilter(key);
                          if (view === 'historico') navigate('manutencoes');
                        }}
                      >
                        {label}
                      </CasaButton>
                    ))}
                  </div>
                  <CasaButton onClick={() => setDialog({ type: 'form' })}>
                    + Nova manutenção
                  </CasaButton>
                </div>
                <CasaCard>
                  <input
                    type='search'
                    aria-label='Buscar manutenção'
                    placeholder='Buscar manutenção...'
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                    className='mb-5 min-h-12 w-full rounded-lg border border-[#dbe5ed] px-4'
                  />
                  {entries.length ? (
                    <ul className='divide-y divide-[#e6edf2]'>
                      {entries.map(item => (
                        <li key={item.id}>
                          <button
                            type='button'
                            onClick={() => openMaintenance(item)}
                            className='flex min-h-24 w-full items-center justify-between gap-4 rounded-lg py-4 text-left hover:bg-(--azul-fundo)'
                          >
                            <span className='min-w-0'>
                              <strong className='block'>{item.title}</strong>
                              <span className='mt-2 block text-sm text-(--texto-apoio)'>
                                {item.room} · {shortDate(item.date)}
                                {item.frequency === 'monthly'
                                  ? ' · Mensal'
                                  : ''}
                              </span>
                              {item.completedAt && (
                                <span className='mt-1 block text-xs text-green-800'>
                                  Concluída em{' '}
                                  {new Date(
                                    item.completedAt
                                  ).toLocaleDateString('pt-BR')}
                                </span>
                              )}
                            </span>
                            <span
                              className={
                                'shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ' +
                                (item.completedAt
                                  ? 'bg-green-50 text-green-800'
                                  : item.priority === 'Alta'
                                    ? 'bg-red-50 text-red-800'
                                    : 'bg-(--azul-fundo) text-(--texto-apoio)')
                              }
                            >
                              {item.completedAt ? 'Concluída' : item.priority}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p
                      role='status'
                      className='py-10 text-center text-(--texto-apoio)'
                    >
                      {history
                        ? 'Nenhuma manutenção concluída encontrada.'
                        : 'Nenhuma manutenção pendente encontrada.'}
                    </p>
                  )}
                </CasaCard>
                <div className='flex flex-wrap gap-3'>
                  <CasaButton secondary onClick={() => navigate('historico')}>
                    Ver histórico
                  </CasaButton>
                  <CasaButton secondary onClick={() => navigate('servicos')}>
                    Encontrar uma empresa
                  </CasaButton>
                </div>
              </div>
            )}
            {view === 'despesas' && (
              <div className='space-y-5'>
                {finance.error && (
                  <p
                    role='alert'
                    className='rounded-lg bg-amber-50 p-4 text-sm'
                  >
                    Não foi possível ler suas finanças. Abra Finanças para
                    revisar os dados; os valores abaixo são demonstrativos.
                  </p>
                )}
                <div className='flex flex-wrap items-center justify-between gap-4'>
                  <label className='text-sm font-bold' htmlFor='casa-month'>
                    Mês de referência{' '}
                    <input
                      id='casa-month'
                      type='month'
                      value={month}
                      onChange={event => {
                        if (event.target.value) setMonth(event.target.value);
                      }}
                      className='ml-2 min-h-12 max-w-full rounded-lg border border-[#dbe5ed] px-3'
                    />
                  </label>
                  <div className='flex flex-wrap gap-3'>
                    <CasaButton
                      as={Link}
                      to='/financas?visao=lancamentos&acao=transaction'
                    >
                      + Registrar despesa
                    </CasaButton>
                    <CasaButton secondary as={Link} to='/financas'>
                      Abrir Finanças
                    </CasaButton>
                  </div>
                </div>
                <div className='grid gap-4 sm:grid-cols-3'>
                  {[
                    ['Registrado no mês', money(expenseTotal)],
                    ['Contas a acompanhar', bills.length],
                    ['Categorias', 'Moradia e contas'],
                  ].map(([label, value]) => (
                    <CasaCard key={label}>
                      <p className='text-sm text-(--texto-apoio)'>{label}</p>
                      <p className='mt-3 text-2xl font-extrabold'>{value}</p>
                    </CasaCard>
                  ))}
                </div>
                <CasaCard title='Despesas da casa'>
                  <p className='mb-4 text-xs text-(--texto-apoio)'>
                    {finance.data.example
                      ? 'Dados de exemplo de Finanças.'
                      : 'Registros de Finanças deste navegador.'}{' '}
                    Categorias de moradia e contas.
                  </p>
                  {expenses.length ? (
                    <ul className='divide-y divide-[#e6edf2]'>
                      {expenses.map(item => (
                        <li
                          key={item.id}
                          className='flex flex-wrap justify-between gap-3 py-4'
                        >
                          <span>
                            {item.name}
                            <span className='mt-1 block text-xs text-(--texto-apoio)'>
                              {shortDate(item.date)}
                            </span>
                          </span>
                          <strong>{money(item.amount)}</strong>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className='py-6 text-(--texto-apoio)'>
                      Nenhuma despesa da casa registrada neste mês.
                    </p>
                  )}
                </CasaCard>
                {bills.length > 0 && (
                  <CasaCard title='Contas a acompanhar'>
                    <ul className='divide-y divide-[#e6edf2]'>
                      {bills.map(bill => (
                        <li
                          key={bill.id}
                          className='flex flex-wrap justify-between gap-3 py-4'
                        >
                          <span>
                            {bill.name}
                            <span className='mt-1 block text-xs text-(--texto-apoio)'>
                              Vencimento: {shortDate(billDue(bill, month))}
                            </span>
                          </span>
                          <strong>{money(bill.amount)}</strong>
                        </li>
                      ))}
                    </ul>
                    <CasaButton secondary as={Link} to='/financas?visao=contas'>
                      Gerenciar pagamentos
                    </CasaButton>
                  </CasaCard>
                )}
              </div>
            )}
            {view === 'servicos' && (
              <CasaCard title='De que ajuda você precisa?'>
                <div className='mb-5 flex flex-wrap gap-3'>
                  {['Limpeza', 'Manutenção', 'Mudança'].map(category => (
                    <CasaButton
                      key={category}
                      secondary={service !== category}
                      aria-pressed={service === category}
                      onClick={() => setService(category)}
                    >
                      {category}
                    </CasaButton>
                  ))}
                </div>
                <p
                  role='status'
                  className='rounded-lg bg-(--azul-fundo) p-5 text-(--texto-apoio)'
                >
                  Ainda não há empresas de {service.toLocaleLowerCase('pt-BR')}{' '}
                  disponíveis nesta área. Enquanto isso, registre o cuidado para
                  acompanhar o que precisa resolver.
                </p>
                <CasaButton
                  className='mt-5'
                  onClick={() => setDialog({ type: 'form' })}
                >
                  Registrar manutenção
                </CasaButton>
              </CasaCard>
            )}
          </Container>
        )}
      </main>
      <Footer variant='landing' />
      {toast && (
        <div
          role='status'
          className='fixed right-4 bottom-4 left-4 z-40 flex items-center justify-between gap-3 rounded-xl bg-(--azul-titulo) p-4 text-sm text-white shadow-lg sm:left-auto sm:max-w-md'
        >
          {toast}
          <button
            type='button'
            onClick={() => setToast('')}
            aria-label='Fechar aviso'
            className='size-11 text-xl'
          >
            ×
          </button>
        </div>
      )}
      {dialog && (
        <CasaDialog
          title={
            dialog.type === 'form'
              ? dialog.item
                ? 'Editar manutenção'
                : 'Um cuidado para lembrar.'
              : dialog.type === 'remove'
                ? 'Remover residência?'
                : dialog.type === 'delete'
                  ? 'Excluir manutenção?'
                  : dialog.item.title
          }
          onClose={() => setDialog(null)}
        >
          {dialog.type === 'form' ? (
            <MaintenanceForm
              key={dialog.item?.id ?? 'new'}
              item={dialog.item}
              onCancel={() => setDialog(null)}
              onSave={saveMaintenance}
            />
          ) : dialog.type === 'remove' ? (
            <>
              <p className='mb-6 text-(--texto-apoio)'>
                As informações da residência serão removidas. Suas manutenções e
                despesas serão preservadas.
              </p>
              <div className='flex flex-wrap gap-3'>
                <CasaButton
                  onClick={() => {
                    setData(previous => ({
                      ...previous,
                      example: false,
                      residence: null,
                    }));
                    setDialog(null);
                    setToast('Residência removida.');
                  }}
                >
                  Remover residência
                </CasaButton>
                <CasaButton secondary onClick={() => setDialog(null)}>
                  Cancelar
                </CasaButton>
              </div>
            </>
          ) : dialog.type === 'delete' ? (
            <>
              <p className='mb-6'>
                Excluir “{dialog.item.title}”? Esta ação não pode ser desfeita.
              </p>
              <div className='flex flex-wrap gap-3'>
                <CasaButton
                  onClick={() => {
                    setData(previous => ({
                      ...previous,
                      example: false,
                      maintenance: previous.maintenance.filter(
                        item => item.id !== dialog.item.id
                      ),
                    }));
                    setDialog(null);
                    setToast('Manutenção excluída.');
                  }}
                >
                  Excluir
                </CasaButton>
                <CasaButton
                  secondary
                  onClick={() => setDialog({ ...dialog, type: 'detail' })}
                >
                  Cancelar
                </CasaButton>
              </div>
            </>
          ) : (
            <div className='space-y-5'>
              <p className='text-sm text-(--texto-apoio)'>
                {dialog.item.priority} prioridade ·{' '}
                {shortDate(dialog.item.date)} · {dialog.item.room}
              </p>
              {dialog.item.notes && (
                <p className='whitespace-pre-wrap'>{dialog.item.notes}</p>
              )}
              <div className='flex flex-wrap gap-3'>
                <CasaButton
                  secondary
                  onClick={() => setDialog({ ...dialog, type: 'form' })}
                >
                  Editar
                </CasaButton>
                {!dialog.item.completedAt && (
                  <CasaButton
                    onClick={() => {
                      setData(previous =>
                        completeMaintenance(previous, dialog.item)
                      );
                      setDialog(null);
                      setToast(
                        dialog.item.frequency === 'monthly'
                          ? 'Concluída! O próximo cuidado mensal foi agendado.'
                          : 'Manutenção concluída.'
                      );
                    }}
                  >
                    Marcar concluída
                  </CasaButton>
                )}
                <CasaButton secondary onClick={() => navigate('servicos')}>
                  Buscar empresa
                </CasaButton>
                <button
                  type='button'
                  className='min-h-12 px-4 text-sm font-bold text-red-700'
                  onClick={() => setDialog({ ...dialog, type: 'delete' })}
                >
                  Excluir
                </button>
              </div>
            </div>
          )}
        </CasaDialog>
      )}
    </div>
  );
}
