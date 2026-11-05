import FinanceDetail from './financeDetail';
import { exportFile } from '../content';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Title } from '../../../shared/ui';
import Footer from '../../../shared/footer';
import FinanceForm from './financeForm';
import FinanceAssistant from './financeAssistant';
import { Action, Dialog, Icon, Panel, ViewPanel } from './financeUi';
import {
  Bills,
  Budget,
  Categories,
  CategoryChart,
  Goals,
  Reports,
  Summary,
  TransactionRows,
  Transactions,
} from './financeViews';
import { tabs, views } from '../content';
import {
  billDue,
  billStatus,
  decimal,
  id,
  money,
  monthKey,
  payBill,
  readState,
  saveRecord,
  storageKey,
  totals,
} from '../content';

const collections = {
  transaction: 'transactions',
  category: 'categories',
  bill: 'bills',
  goal: 'goals',
};
const formKinds = [...Object.keys(collections), 'budget'];
const pageClass =
  'font-body text-(--azul-titulo) leading-normal wrap-anywhere [overflow-anchor:none] [font-optical-sizing:none] [&_:is(button,summary)]:cursor-pointer [&_button:disabled]:cursor-default [&_:is(a,button,input,select,summary):focus-visible]:outline-2 [&_:is(a,button,input,select,summary):focus-visible]:outline-offset-3 [&_:is(a,button,input,select,summary):focus-visible]:outline-(--laranja-principal)';
export default function FinanceSection() {
  const [loaded] = useState(readState);
  const [data, setData] = useState(loaded.data);
  const [storageError, setStorageError] = useState(
    loaded.error
      ? 'Não foi possível carregar os dados salvos. Uma prévia de exemplo foi aberta; os dados anteriores não serão sobrescritos.'
      : ''
  );
  const [allowSave, setAllowSave] = useState(!loaded.error);
  const [params, setParams] = useSearchParams();
  const view = Object.hasOwn(views, params.get('visao'))
    ? params.get('visao')
    : 'geral';
  const kind = formKinds.includes(params.get('acao'))
    ? params.get('acao')
    : null;
  const editingId = params.get('editar');
  const record =
    kind && collections[kind] && editingId
      ? data[collections[kind]].find(item => item.id === editingId)
      : null;
  const [month, setMonth] = useState(monthKey);
  const [dialog, setDialog] = useState(null);
  const [toast, setToast] = useState('');
  const toolsRef = useRef(null);
  const items = data.transactions.filter(item => item.date.startsWith(month));
  const result = totals(items);
  const primaryKind =
    {
      categorias: 'category',
      metas: 'goal',
      contas: 'bill',
      orcamento: 'budget',
    }[view] ?? 'transaction';
  const primaryLabel = {
    category: 'Nova categoria',
    goal: 'Nova meta',
    bill: 'Nova conta',
    budget: data.budget ? 'Editar orçamento' : 'Montar orçamento',
    transaction: 'Adicionar lançamento',
  }[primaryKind];

  useEffect(() => {
    if (!allowSave) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch {
      const timer = window.setTimeout(
        () =>
          setStorageError(
            'Não foi possível salvar no navegador. Suas alterações continuam nesta sessão.'
          ),
        0
      );
      return () => window.clearTimeout(timer);
    }
  }, [data, allowSave]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 5000);
    return () => window.clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [kind, editingId]);
  function navigate(next) {
    setParams(previous => {
      const updated = new URLSearchParams(previous);
      updated.set('visao', next);
      updated.delete('acao');
      updated.delete('editar');
      return updated;
    });
    if (toolsRef.current) toolsRef.current.open = false;
    setDialog(null);
  }
  function openForm(next, item) {
    setDialog(null);
    setParams(previous => {
      const updated = new URLSearchParams(previous);
      updated.set('acao', next);
      if (item) updated.set('editar', item.id);
      else updated.delete('editar');
      return updated;
    });
  }
  function closeForm() {
    setParams(previous => {
      const updated = new URLSearchParams(previous);
      updated.delete('acao');
      updated.delete('editar');
      return updated;
    });
  }
  function save(values) {
    if (kind === 'budget')
      setData(previous => ({ ...previous, example: false, budget: values }));
    else
      setData(previous => {
        let next = saveRecord(previous, collections[kind], values);
        if (kind === 'transaction') {
          const linked = previous.bills.find(
            bill => bill.sourceTransactionId === values.id
          );
          if (values.repeat && values.type === 'expense') {
            const bill = {
              id: linked?.id ?? id(),
              name: values.name,
              amount: values.amount,
              date: values.date,
              repeat: true,
              icon: 'Receipt',
              categoryId: values.categoryId,
              sourceTransactionId: values.id,
            };
            next = saveRecord(next, 'bills', bill);
            if (!linked)
              next.payments = [
                ...next.payments,
                {
                  billId: bill.id,
                  month: monthKey(values.date),
                  transactionId: values.id,
                },
              ];
          } else if (linked) {
            next = {
              ...next,
              bills: next.bills.filter(bill => bill.id !== linked.id),
              payments: next.payments.filter(
                payment => payment.billId !== linked.id
              ),
            };
          }
        }
        return next;
      });
    if (kind === 'transaction') setMonth(monthKey(values.date));
    closeForm();
    setToast('Salvo! Seu planejamento foi atualizado.');
  }
  function remove(itemKind, item) {
    setData(previous => {
      const next = {
        ...previous,
        example: false,
        [collections[itemKind]]: previous[collections[itemKind]].filter(
          entry => entry.id !== item.id
        ),
      };
      if (itemKind === 'transaction')
        next.payments = previous.payments.filter(
          payment => payment.transactionId !== item.id
        );
      if (itemKind === 'bill')
        next.payments = previous.payments.filter(
          payment => payment.billId !== item.id
        );
      return next;
    });
    setDialog(null);
    setToast('Registro excluído.');
  }
  function exportCsv() {
    const quote = value =>
      '"' +
      String(value)
        .replaceAll('"', '""')
        .replace(/^[=+@-]/, "'$&") +
      '"';
    const rows = [
      ['Descrição', 'Tipo', 'Valor (R$)', 'Data', 'Categoria'],
      ...items.map(item => [
        item.name,
        item.type === 'income' ? 'Entrada' : 'Saída',
        decimal(item.amount),
        item.date,
        data.categories.find(category => category.id === item.categoryId)
          ?.name ?? '',
      ]),
    ];
    exportFile(
      'financas-' + month + '.csv',
      '\uFEFF' + rows.map(row => row.map(quote).join(';')).join('\r\n'),
      'text/csv;charset=utf-8'
    );
    setToast('Relatório exportado.');
  }
  function exportCalendar() {
    const escape = text =>
      text
        .replaceAll('\\', '\\\\')
        .replaceAll(';', '\\;')
        .replaceAll(',', '\\,')
        .replace(/\r?\n/g, '\\n');
    const events = data.bills
      .filter(bill =>
        bill.repeat
          ? bill.date.slice(0, 7) <= month
          : bill.date.startsWith(month)
      )
      .map(bill =>
        [
          'BEGIN:VEVENT',
          'UID:' + bill.id + '-' + month + '@iagora.local',
          'DTSTAMP:' +
            new Date()
              .toISOString()
              .replace(/[-:]/g, '')
              .replace(/\.\d{3}/, ''),
          'DTSTART;VALUE=DATE:' + billDue(bill, month).replaceAll('-', ''),
          'SUMMARY:' + escape(bill.name),
          'DESCRIPTION:' + escape('Vencimento: ' + money(bill.amount)),
          'END:VEVENT',
        ].join('\r\n')
      );
    exportFile(
      'vencimentos-' + month + '.ics',
      [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Iagora//Financas//PT-BR',
        ...events,
        'END:VCALENDAR',
      ].join('\r\n'),
      'text/calendar;charset=utf-8'
    );
    setToast('Arquivo de vencimentos exportado para importar na sua agenda.');
  }
  const openDetail = (itemKind, item) =>
    setDialog({ type: 'detail', kind: itemKind, item });
  const dueCount = data.bills.filter(
    bill =>
      (bill.repeat
        ? bill.date.slice(0, 7) <= month
        : bill.date.startsWith(month)) &&
      billStatus(bill, month, data.payments) !== 'paid'
  ).length;

  return (
    <div lang='pt-BR' className={'min-w-0 flex-1 bg-white ' + pageClass}>
      <main className='min-w-0'>
        <Container className='pt-6 pb-8 sm:pt-9'>
          {storageError && (
            <div
              role='alert'
              className='mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950'
            >
              <p>{storageError}</p>
              {!allowSave && (
                <button
                  type='button'
                  className='mt-2 min-h-11 font-bold underline'
                  onClick={() => setDialog({ type: 'reset' })}
                >
                  Iniciar novos dados neste navegador
                </button>
              )}
            </div>
          )}
          {kind ? (
            editingId && !record && kind !== 'budget' ? (
              <Panel title='Registro não encontrado'>
                <p className='mb-4 text-(--texto-apoio)'>
                  Este registro pode ter sido excluído.
                </p>
                <Action onClick={closeForm}>Voltar</Action>
              </Panel>
            ) : (
              <FinanceForm
                key={kind + ':' + (record?.id ?? 'new')}
                kind={kind}
                record={record}
                data={data}
                balance={
                  totals(
                    data.transactions.filter(item =>
                      item.date.startsWith(
                        record?.date.slice(0, 7) ?? monthKey()
                      )
                    )
                  ).balance
                }
                onSave={save}
                onBack={closeForm}
              />
            )
          ) : (
            <>
              <div className='flex flex-col justify-between gap-6 lg:flex-row lg:items-center'>
                <div className='min-w-0 flex-1'>
                  <span className='inline-block rotate-[1.4deg] bg-(--laranja-principal) px-3 py-1.5 text-xs font-bold text-white'>
                    {view === 'geral'
                      ? 'SEU DINHEIRO EM PERSPECTIVA'
                      : 'FINANÇAS'}
                  </span>
                  <Title
                    as='h1'
                    className='mt-3 grid text-4xl leading-[1.08] font-extrabold tracking-tight sm:text-5xl'
                  >
                    {Object.entries(views).map(([key, copy]) => (
                      <span
                        key={key}
                        aria-hidden={view !== key}
                        className={
                          'col-start-1 row-start-1 ' +
                          (view === key ? '' : 'invisible')
                        }
                      >
                        {copy[0]}
                      </span>
                    ))}
                  </Title>
                  <p className='mt-3 grid text-base text-(--texto-apoio) sm:text-lg'>
                    {Object.entries(views).map(([key, copy]) => (
                      <span
                        key={key}
                        aria-hidden={view !== key}
                        className={
                          'col-start-1 row-start-1 ' +
                          (view === key ? '' : 'invisible')
                        }
                      >
                        {copy[1]}
                      </span>
                    ))}
                  </p>
                </div>
                <div className='flex min-h-[6.75rem] flex-wrap content-start items-center gap-3 sm:min-h-12 lg:w-[27rem] lg:shrink-0'>
                  {!['metas', 'configuracoes', 'orcamento'].includes(view) && (
                    <label className='flex min-h-12 min-w-0 items-center gap-2 rounded-lg border border-[#d9e2ec] px-3 text-sm font-bold'>
                      <span className='sr-only'>Mês de referência</span>
                      <input
                        type='month'
                        aria-label='Mês de referência'
                        value={month}
                        onChange={event => {
                          if (/^\d{4}-\d{2}$/.test(event.target.value))
                            setMonth(event.target.value);
                        }}
                        className='max-w-full bg-transparent py-2'
                      />
                    </label>
                  )}
                  {view !== 'configuracoes' && view !== 'relatorios' && (
                    <Action onClick={() => openForm(primaryKind)}>
                      + {primaryLabel}
                    </Action>
                  )}
                  {view === 'relatorios' && (
                    <Action onClick={exportCsv}>Exportar CSV</Action>
                  )}
                </div>
              </div>
              <div className='mt-7 flex flex-wrap items-end gap-x-4 gap-y-3 border-b border-[#e6edf2]'>
                <nav
                  aria-label='Áreas de finanças'
                  className='flex min-w-0 max-w-full gap-5 overflow-x-auto sm:gap-8'
                >
                  {tabs.map(([key, label]) => (
                    <button
                      type='button'
                      key={key}
                      onClick={() => navigate(key)}
                      aria-current={view === key ? 'page' : undefined}
                      className={
                        'min-h-13 shrink-0 border-b-[3px] px-1 py-4 text-sm ' +
                        (view === key
                          ? 'border-(--laranja-principal) font-bold text-(--laranja-principal)'
                          : 'border-transparent text-(--texto-apoio) hover:text-(--laranja-principal)')
                      }
                    >
                      {label}
                    </button>
                  ))}
                </nav>
                <details
                  ref={toolsRef}
                  className='relative mb-1 ml-auto'
                  onKeyDown={event => {
                    if (event.key === 'Escape') {
                      event.currentTarget.open = false;
                      event.currentTarget.querySelector('summary')?.focus();
                    }
                  }}
                >
                  <summary className='flex min-h-11 list-none items-center gap-2 rounded-lg px-3 text-sm font-bold hover:bg-(--azul-fundo)'>
                    Ferramentas <span aria-hidden='true'>⌄</span>
                  </summary>
                  <div className='absolute right-0 z-20 mt-2 w-60 rounded-xl border border-[#d9e4ec] bg-white p-2 shadow-lg'>
                    {[
                      ['contas', 'Contas e boletos'],
                      ['orcamento', 'Meu orçamento'],
                      ['relatorios', 'Relatórios'],
                      ['configuracoes', 'Configurações'],
                    ].map(([key, label]) => (
                      <button
                        type='button'
                        key={key}
                        onClick={() => navigate(key)}
                        className='flex min-h-11 w-full items-center rounded-lg px-3 text-left text-sm hover:bg-(--azul-fundo)'
                      >
                        {label}
                        {key === 'contas' && dueCount > 0 && (
                          <span className='ml-auto rounded-full bg-[#fff2e8] px-2 text-xs text-(--laranja-principal)'>
                            {dueCount}
                          </span>
                        )}
                      </button>
                    ))}
                    {data.example && (
                      <button
                        type='button'
                        onClick={() => {
                          toolsRef.current.open = false;
                          setDialog({ type: 'reset' });
                        }}
                        className='min-h-11 w-full rounded-lg px-3 text-left text-sm hover:bg-(--azul-fundo)'
                      >
                        Começar sem exemplos
                      </button>
                    )}
                  </div>
                </details>
                <p className='mb-4 flex items-center gap-2 text-xs text-(--texto-apoio)'>
                  <span className='relative inline-flex size-4 shrink-0 items-center justify-center'>
                    <Icon name='ExampleDataInfo' className='size-4' />
                    <span
                      aria-hidden='true'
                      className='absolute text-[10px] font-bold text-(--laranja-principal)'
                    >
                      i
                    </span>
                  </span>
                  {data.example ? 'Dados de exemplo' : 'Salvo neste navegador'}
                </p>
              </div>
              <div className='min-w-0'>
                <ViewPanel active={view === 'geral'} flush>
                  <>
                    <Summary transactions={items} />
                    <div className='grid gap-6 lg:grid-cols-2'>
                      <CategoryChart data={data} transactions={items} />
                      <Panel
                        title='Últimos lançamentos'
                        action={
                          <button
                            type='button'
                            className='min-h-11 text-sm font-bold text-(--laranja-principal)'
                            onClick={() => navigate('lancamentos')}
                          >
                            Ver todos →
                          </button>
                        }
                      >
                        <TransactionRows
                          items={items.slice(-4)}
                          categories={data.categories}
                          compact
                          onOpen={item => openDetail('transaction', item)}
                          onCreate={() => openForm('transaction')}
                        />
                      </Panel>
                    </div>
                    <div className='mt-6 space-y-3'>
                      {data.preferences.reminders && dueCount > 0 && (
                        <button
                          type='button'
                          onClick={() => navigate('contas')}
                          className='flex min-h-12 w-full flex-wrap items-center justify-between gap-2 rounded-lg bg-[#fff2e8] px-4 py-3 text-left text-sm'
                        >
                          <span>
                            {dueCount} conta(s) para acompanhar neste mês.
                          </span>
                          <strong className='text-(--laranja-principal)'>
                            Ver contas →
                          </strong>
                        </button>
                      )}
                      {data.preferences.summary && (
                        <p className='rounded-lg bg-(--azul-fundo) p-4 text-sm'>
                          Resumo do mês: {items.length} lançamento(s),{' '}
                          {money(result.income)} em entradas e{' '}
                          {money(result.expense)} em saídas.
                        </p>
                      )}
                      {data.preferences.limits &&
                        data.categories
                          .filter(
                            category =>
                              category.limit > 0 &&
                              items
                                .filter(
                                  item =>
                                    item.categoryId === category.id &&
                                    item.type === 'expense'
                                )
                                .reduce((sum, item) => sum + item.amount, 0) >=
                                category.limit * 0.8
                          )
                          .map(category => (
                            <button
                              type='button'
                              key={category.id}
                              onClick={() => navigate('categorias')}
                              className='block min-h-12 w-full rounded-lg bg-amber-50 p-4 text-left text-sm'
                            >
                              {category.name} chegou a 80% ou mais do limite.{' '}
                              <strong>Revisar categoria →</strong>
                            </button>
                          ))}
                    </div>
                  </>
                </ViewPanel>
                <ViewPanel active={view === 'lancamentos'}>
                  <Transactions
                    items={items}
                    categories={data.categories}
                    onOpen={item => openDetail('transaction', item)}
                    onCreate={() => openForm('transaction')}
                  />
                </ViewPanel>
                <ViewPanel active={view === 'categorias'}>
                  <Categories
                    data={data}
                    transactions={items}
                    onOpen={item => openForm('category', item)}
                  />
                </ViewPanel>
                <ViewPanel active={view === 'metas'}>
                  <Goals
                    data={data}
                    onOpen={item => openDetail('goal', item)}
                    onCreate={() => openForm('goal')}
                  />
                </ViewPanel>
                <ViewPanel active={view === 'contas'}>
                  <Bills
                    data={data}
                    month={month}
                    onOpen={item => openDetail('bill', item)}
                    onCreate={() => openForm('bill')}
                  />
                </ViewPanel>
                <ViewPanel active={view === 'relatorios'}>
                  <Reports data={data} month={month} />
                </ViewPanel>
                <ViewPanel active={view === 'orcamento'}>
                  <Budget
                    budget={data.budget}
                    onEdit={() => openForm('budget')}
                  />
                </ViewPanel>
                <ViewPanel active={view === 'configuracoes'}>
                  <Panel title='Suas finanças, do seu jeito'>
                    <div className='divide-y divide-[#e6edf2]'>
                      {[
                        [
                          'reminders',
                          'Lembrar vencimentos',
                          'Exibir avisos de contas pendentes nesta página.',
                        ],
                        [
                          'limits',
                          'Avisar ao chegar perto do limite',
                          'Exibir categorias que alcançaram 80% do limite mensal.',
                        ],
                        [
                          'summary',
                          'Resumo mensal',
                          'Exibir um resumo ao abrir a visão geral.',
                        ],
                      ].map(([key, label, description]) => (
                        <label
                          key={key}
                          className='flex min-h-24 items-center justify-between gap-5 py-5'
                        >
                          <span>
                            <strong className='block'>{label}</strong>
                            <span className='mt-1 block text-sm text-(--texto-apoio)'>
                              {description}
                            </span>
                          </span>
                          <input
                            type='checkbox'
                            role='switch'
                            checked={Boolean(data.preferences[key])}
                            onChange={event =>
                              setData(previous => ({
                                ...previous,
                                preferences: {
                                  ...previous.preferences,
                                  [key]: event.target.checked,
                                },
                              }))
                            }
                            className='size-6 shrink-0 accent-(--laranja-principal)'
                          />
                        </label>
                      ))}
                      <button
                        type='button'
                        onClick={exportCalendar}
                        className='flex min-h-24 w-full items-center gap-4 py-5 text-left'
                      >
                        <Icon name='IconCalendar' className='size-6' />
                        <span>
                          <strong className='block'>
                            Exportar vencimentos para a agenda
                          </strong>
                          <span className='mt-1 block text-sm text-(--texto-apoio)'>
                            Baixe o arquivo do mês e importe no Google Agenda.
                          </span>
                        </span>
                        <span className='ml-auto'>→</span>
                      </button>
                      <button
                        type='button'
                        onClick={() => setDialog({ type: 'bank' })}
                        className='flex min-h-24 w-full items-center gap-4 py-5 text-left'
                      >
                        <Icon name='IconBuilding' className='size-6' />
                        <span>
                          <strong className='block'>Integração bancária</strong>
                          <span className='mt-1 block text-sm text-(--texto-apoio)'>
                            Saiba mais sobre as conexões opcionais.
                          </span>
                        </span>
                        <span className='ml-auto'>→</span>
                      </button>
                    </div>
                  </Panel>
                </ViewPanel>
              </div>
              <FinanceAssistant />
            </>
          )}
        </Container>
        {!kind && (
          <section className='bg-(--laranja-principal) py-10 text-white sm:py-14'>
            <Container className='flex flex-col items-start justify-between gap-7 lg:flex-row lg:items-center'>
              <div>
                <p className='text-xs font-bold'>
                  QUE TAL MONTAR SEU ORÇAMENTO?
                </p>
                <Title className='mt-4 max-w-2xl text-3xl leading-tight font-extrabold sm:text-[clamp(2rem,3.5vw,3rem)]'>
                  Bora fazer seu dinheiro
                  <br className='hidden sm:block' /> render melhor?
                </Title>
                <p className='mt-4'>
                  Organize suas contas e descubra seus próximos passos.
                </p>
              </div>
              <div className='flex flex-wrap items-center gap-6'>
                <Action
                  onClick={() => openForm('budget')}
                  navy
                  className='px-8'
                >
                  Montar meu orçamento <span className='ml-5'>→</span>
                </Action>
                <span className='relative inline-flex h-20 w-20 shrink-0 items-center justify-center'>
                  <Icon name='BudgetCtaSavingsCoin' />
                  <strong className='absolute -rotate-12 text-xl text-(--azul-titulo)'>
                    R$
                  </strong>
                </span>
              </div>
            </Container>
          </section>
        )}
      </main>
      <Footer variant='landing' />
      {toast && (
        <div
          role='status'
          className='fixed right-4 bottom-4 left-4 z-40 flex items-center justify-between gap-3 rounded-xl bg-(--azul-titulo) p-4 text-sm text-white shadow-lg sm:left-auto sm:max-w-md'
        >
          <span>{toast}</span>
          <button
            type='button'
            onClick={() => setToast('')}
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
            dialog.type === 'delete'
              ? 'Excluir registro?'
              : dialog.type === 'bank'
                ? 'Integração bancária'
                : dialog.type === 'reset'
                  ? 'Iniciar novos dados?'
                  : (dialog.item?.name ?? 'Detalhes')
          }
          onClose={() => setDialog(null)}
        >
          {dialog.type === 'delete' ? (
            <>
              <p className='mb-6 text-(--texto-apoio)'>
                Deseja excluir “{dialog.item.name}”? Esta ação não pode ser
                desfeita.
                {dialog.kind === 'bill'
                  ? ' Os pagamentos já registrados serão mantidos nos lançamentos.'
                  : ''}
              </p>
              <div className='flex flex-wrap gap-3'>
                <Action onClick={() => remove(dialog.kind, dialog.item)}>
                  Excluir
                </Action>
                <Action
                  secondary
                  onClick={() => setDialog({ ...dialog, type: 'detail' })}
                >
                  Cancelar
                </Action>
              </div>
            </>
          ) : dialog.type === 'bank' ? (
            <>
              <p className='mb-6 leading-relaxed text-(--texto-apoio)'>
                A conexão com bancos ainda não está disponível. Você pode
                registrar entradas e saídas manualmente e acompanhar seu
                planejamento.
              </p>
              <Action
                onClick={() => {
                  setDialog(null);
                  openForm('transaction');
                }}
              >
                Adicionar lançamento
              </Action>
            </>
          ) : dialog.type === 'reset' ? (
            <>
              <p className='mb-6 text-(--texto-apoio)'>
                Os registros atuais serão substituídos por um planejamento
                vazio. Deseja continuar?
              </p>
              <div className='flex flex-wrap gap-3'>
                <Action
                  onClick={() => {
                    setData(previous => ({
                      ...previous,
                      example: false,
                      transactions: [],
                      bills: [],
                      goals: [],
                      payments: [],
                      budget: null,
                    }));
                    setAllowSave(true);
                    setStorageError('');
                    setDialog(null);
                  }}
                >
                  Iniciar planejamento
                </Action>
                <Action secondary onClick={() => setDialog(null)}>
                  Cancelar
                </Action>
              </div>
            </>
          ) : (
            <FinanceDetail
              dialog={dialog}
              data={data}
              month={month}
              onEdit={() => openForm(dialog.kind, dialog.item)}
              onDelete={() => setDialog({ ...dialog, type: 'delete' })}
              onPay={() => {
                setData(previous => payBill(previous, dialog.item, month));
                setDialog(null);
                setToast('Conta paga! A saída foi adicionada aos lançamentos.');
              }}
              onDeposit={value => {
                setData(previous => ({
                  ...previous,
                  example: false,
                  goals: previous.goals.map(goal =>
                    goal.id === dialog.item.id
                      ? { ...goal, saved: goal.saved + value }
                      : goal
                  ),
                }));
                setDialog(null);
                setToast('Meta atualizada!');
              }}
            />
          )}
        </Dialog>
      )}
    </div>
  );
}
