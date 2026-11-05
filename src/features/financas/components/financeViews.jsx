import { useState } from 'react';
import { Title } from '../../../shared/ui';
import { Action, Empty, Icon, Panel, Progress, Segments } from './financeUi';
import {
  billDue,
  billStatus,
  categoryTotals,
  money,
  shortDate,
  totals,
} from '../content';
import { budgetFields } from '../content';

export function Summary({ transactions, stacked = false }) {
  const result = totals(transactions);
  return (
    <div
      className={
        stacked
          ? 'grid gap-5 py-2'
          : 'grid gap-5 py-7 sm:grid-cols-3 sm:divide-x sm:divide-[#e6edf2]'
      }
    >
      {[
        ['Entradas', 'income', 'IndicatorEntradasIcon', 'text-[#087c4d]'],
        ['Saídas', 'expense', 'IndicatorSaidasIcon', 'text-[#bd241c]'],
        ['Saldo', 'balance', 'IndicatorSaldoIcon', 'text-(--azul-titulo)'],
      ].map(([label, key, icon, color]) => (
        <div key={key} className='flex min-w-0 items-center gap-4 sm:px-4'>
          <span
            className={
              'relative flex size-14 shrink-0 items-center justify-center ' +
              color
            }
          >
            <Icon name={icon} className='size-14' />
            <strong aria-hidden='true' className='absolute text-xl'>
              {key === 'income' ? '+' : key === 'expense' ? '−' : '='}
            </strong>
          </span>
          <div className='min-w-0'>
            <p className='text-sm font-medium text-(--texto-apoio)'>{label}</p>
            <p
              className={
                'mt-1 text-[clamp(1.25rem,2.1vw,2rem)] leading-tight font-bold break-all ' +
                color
              }
            >
              {money(result[key])}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
export function CategoryChart({ data, transactions }) {
  const result = categoryTotals(data.categories, transactions).filter(
    x => x.type === 'expense'
  );
  const total = totals(transactions).expense;
  let cursor = 0;
  const slices = result
    .filter(x => x.spent > 0)
    .map(category => {
      const start = cursor;
      cursor += total ? (category.spent / total) * 100 : 0;
      return category.color + ' ' + start + '% ' + cursor + '%';
    });
  return (
    <Panel title='Gastos por categoria' neutral className='border-0'>
      <div className='flex flex-col items-center gap-6 sm:flex-row lg:flex-col xl:flex-row'>
        <div
          role='img'
          aria-label={
            total ? 'Total em gastos: ' + money(total) : 'Sem gastos neste mês'
          }
          className='flex size-48 shrink-0 items-center justify-center rounded-full'
          style={{
            background: total
              ? 'conic-gradient(' + slices.join(',') + ')'
              : '#d9e4ec',
          }}
        >
          <div className='flex size-36 flex-col items-center justify-center rounded-full bg-(--azul-fundo) p-3 text-center'>
            <strong className='text-lg'>{money(total)}</strong>
            <span className='mt-1 text-xs text-(--texto-apoio)'>em gastos</span>
          </div>
        </div>
        <ul className='w-full min-w-0 flex-1 space-y-5'>
          {(total ? result.filter(x => x.spent > 0) : result.slice(0, 4)).map(
            category => (
              <li
                key={category.id}
                className='flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm'
              >
                <span
                  className='size-3 shrink-0 rounded-full'
                  style={{ backgroundColor: category.color }}
                />
                <span className='min-w-0 flex-1'>{category.name}</span>
                <strong>{money(category.spent)}</strong>
                <span className='w-9 text-right text-(--texto-apoio)'>
                  {total ? Math.round((category.spent / total) * 100) : 0}%
                </span>
              </li>
            )
          )}
        </ul>
      </div>
    </Panel>
  );
}
export function TransactionRows({
  items,
  categories,
  compact = false,
  onOpen,
  onCreate,
}) {
  return items.length ? (
    <ul className='divide-y divide-[#e6edf2]'>
      {items.map(item => (
        <li key={item.id}>
          <button
            type='button'
            onClick={() => onOpen(item)}
            className='grid min-h-18 w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg py-3 text-left hover:bg-(--azul-fundo) sm:gap-4'
          >
            <span
              aria-hidden='true'
              className={
                'relative flex size-9 shrink-0 items-center justify-center font-bold ' +
                (item.type === 'income' ? 'text-[#087c4d]' : 'text-[#bd241c]')
              }
            >
              <Icon
                name={
                  item.type === 'income'
                    ? 'TransactionIndicatorSalario'
                    : 'TransactionIndicatorAluguel'
                }
                className='size-9'
              />
              <span className='absolute'>
                {item.type === 'income' ? '+' : '−'}
              </span>
            </span>
            <span className='min-w-0'>
              <span className='block text-sm font-bold'>{item.name}</span>
              <span className='mt-1 block text-xs text-(--texto-apoio)'>
                {!compact &&
                  (categories.find(category => category.id === item.categoryId)
                    ?.name || 'Sem categoria') + ' · '}
                {shortDate(item.date)}
                {item.repeat ? ' · Mensal' : ''}
              </span>
            </span>
            <span
              className={
                'text-right text-xs font-bold sm:text-sm ' +
                (item.type === 'income' ? 'text-[#087c4d]' : 'text-[#bd241c]')
              }
            >
              {item.type === 'income' ? '+ ' : '− '}
              {money(item.amount)}
            </span>
          </button>
        </li>
      ))}
    </ul>
  ) : (
    <Empty onCreate={onCreate}>Nenhum lançamento neste período.</Empty>
  );
}
export function Transactions({ items, categories, onOpen, onCreate }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const normalized = search.trim().toLocaleLowerCase('pt-BR');
  const visible = items.filter(
    item =>
      (filter === 'all' || item.type === filter) &&
      (category === 'all' || item.categoryId === category) &&
      item.name.toLocaleLowerCase('pt-BR').includes(normalized)
  );
  return (
    <Panel>
      <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
        <Segments
          label='Filtrar lançamentos'
          options={[
            ['all', 'Todas'],
            ['income', 'Entradas'],
            ['expense', 'Saídas'],
          ]}
          value={filter}
          onChange={setFilter}
        />
        <div className='flex w-full flex-wrap gap-3 md:w-auto'>
          <label className='flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-lg border border-[#dbe5ed] px-3'>
            <Icon name='IconSearch' className='size-5' />
            <input
              aria-label='Buscar lançamento'
              type='search'
              placeholder='Buscar lançamento...'
              value={search}
              onChange={event => setSearch(event.target.value)}
              className='min-w-0 flex-1 bg-transparent py-2 text-sm'
            />
          </label>
          <select
            aria-label='Filtrar por categoria'
            value={category}
            onChange={event => setCategory(event.target.value)}
            className='min-h-11 max-w-full rounded-lg border border-[#dbe5ed] bg-white px-3 text-sm'
          >
            <option value='all'>Todas as categorias</option>
            {categories.map(item => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <TransactionRows
        items={visible}
        categories={categories}
        onOpen={onOpen}
        onCreate={onCreate}
      />
      <p className='mt-4 text-xs text-(--texto-apoio)' aria-live='polite'>
        {visible.length} lançamento(s) encontrado(s)
      </p>
    </Panel>
  );
}
export function Categories({ data, transactions, onOpen }) {
  const [type, setType] = useState('expense');
  const items = categoryTotals(data.categories, transactions).filter(
    category => category.type === type
  );
  const total =
    type === 'expense'
      ? totals(transactions).expense
      : totals(transactions).income;
  return (
    <div className='space-y-5'>
      <Segments
        label='Tipo de categoria'
        options={[
          ['expense', 'Despesas'],
          ['income', 'Receitas'],
        ]}
        value={type}
        onChange={setType}
      />
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {items.map(item => (
          <button
            type='button'
            key={item.id}
            onClick={() => onOpen(item)}
            className='rounded-xl border border-[#d9e4ec] p-5 text-left hover:bg-(--azul-fundo)'
          >
            <div className='flex items-center gap-3'>
              <span className='flex size-12 shrink-0 items-center justify-center rounded-full bg-(--azul-fundo)'>
                <Icon name={'Icon' + item.icon} className='size-6' />
              </span>
              <span className='font-bold'>{item.name}</span>
              <span
                className='ml-auto size-3 shrink-0 rounded-full'
                style={{ backgroundColor: item.color }}
              />
            </div>
            <div className='mt-5 flex flex-wrap justify-between gap-2'>
              <strong>{money(item.spent)}</strong>
              <span className='text-sm text-(--texto-apoio)'>
                {total ? Math.round((item.spent / total) * 100) : 0}%
              </span>
            </div>
            {item.limit > 0 && (
              <div className='mt-4 space-y-2'>
                <Progress
                  label={'Limite de ' + item.name}
                  value={(item.spent / item.limit) * 100}
                  color={item.color}
                />
                <p className='text-xs text-(--texto-apoio)'>
                  Limite: {money(item.limit)}
                  {item.spent > item.limit ? ' · Limite ultrapassado' : ''}
                </p>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
export function Goals({ data, onOpen, onCreate }) {
  return (
    <div className='grid gap-5 sm:grid-cols-2'>
      {data.goals.length ? (
        data.goals.map(goal => (
          <button
            type='button'
            key={goal.id}
            onClick={() => onOpen(goal)}
            className='space-y-5 rounded-xl border border-[#d9e4ec] p-6 text-left hover:bg-(--azul-fundo)'
          >
            <div className='flex items-center gap-3'>
              <span className='flex size-12 items-center justify-center rounded-full bg-[#e6f1f7]'>
                <Icon name={'Icon' + goal.icon} className='size-6' />
              </span>
              <Title className='text-xl font-bold'>{goal.name}</Title>
            </div>
            <p className='text-2xl font-bold'>{money(goal.amount)}</p>
            <div className='flex flex-wrap justify-between gap-2 text-sm'>
              <span className='text-(--texto-apoio)'>
                {money(goal.saved)} guardados
              </span>
              <strong>{Math.round((goal.saved / goal.amount) * 100)}%</strong>
            </div>
            <Progress
              value={(goal.saved / goal.amount) * 100}
              label={goal.name}
            />
            <p className='text-sm text-(--texto-apoio)'>
              {goal.saved >= goal.amount
                ? 'Objetivo conquistado!'
                : 'Faltam ' + money(goal.amount - goal.saved)}
              {goal.date && ' · Até ' + shortDate(goal.date)}
            </p>
          </button>
        ))
      ) : (
        <Panel className='sm:col-span-2'>
          <Empty onCreate={onCreate}>
            Sua próxima conquista começa com uma meta.
          </Empty>
        </Panel>
      )}
    </div>
  );
}
export function Bills({ data, month, onOpen, onCreate }) {
  const [filter, setFilter] = useState('all');
  const items = data.bills
    .filter(
      bill =>
        (bill.repeat
          ? bill.date.slice(0, 7) <= month
          : bill.date.slice(0, 7) === month) &&
        (filter === 'all' || billStatus(bill, month, data.payments) === filter)
    )
    .sort((a, b) => billDue(a, month).localeCompare(billDue(b, month)));
  return (
    <Panel>
      <Segments
        label='Filtrar contas'
        options={[
          ['all', 'Todas'],
          ['pending', 'A vencer'],
          ['overdue', 'Vencidas'],
          ['paid', 'Concluídas'],
        ]}
        value={filter}
        onChange={setFilter}
      />
      <ul className='mt-5 divide-y divide-[#e6edf2]'>
        {items.map(bill => {
          const status = billStatus(bill, month, data.payments);
          return (
            <li key={bill.id}>
              <button
                type='button'
                onClick={() => onOpen(bill)}
                className='flex w-full flex-wrap items-center gap-4 rounded-lg py-5 text-left hover:bg-(--azul-fundo)'
              >
                <span className='flex size-11 items-center justify-center rounded-full bg-[#e6f1f7]'>
                  <Icon name={'Icon' + bill.icon} className='size-6' />
                </span>
                <span className='min-w-0 flex-1'>
                  <strong className='block'>{bill.name}</strong>
                  <span className='mt-1 block text-xs text-(--texto-apoio)'>
                    {bill.repeat
                      ? 'Todo dia ' + Number(billDue(bill, month).slice(-2))
                      : shortDate(bill.date)}
                  </span>
                </span>
                <strong>{money(bill.amount)}</strong>
                <span
                  className={
                    'rounded-full px-3 py-1.5 text-xs font-bold ' +
                    (status === 'paid'
                      ? 'bg-green-50 text-green-800'
                      : status === 'overdue'
                        ? 'bg-red-50 text-red-800'
                        : 'bg-[#fff2e8] text-[#ad451b]')
                  }
                >
                  {
                    { paid: 'Paga', overdue: 'Vencida', pending: 'A vencer' }[
                      status
                    ]
                  }
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {!items.length && (
        <Empty onCreate={onCreate}>
          Nenhuma conta encontrada neste período.
        </Empty>
      )}
    </Panel>
  );
}
export function Reports({ data, month }) {
  const [year, number] = month.split('-').map(Number);
  const months = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(year, number - 7 + i, 1);
    const key =
      date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
    return {
      key,
      label: date.toLocaleDateString('pt-BR', { month: 'short' }),
      ...totals(data.transactions.filter(item => item.date.startsWith(key))),
    };
  });
  const max = Math.max(...months.map(item => Math.abs(item.balance)), 1);
  return (
    <div className='grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]'>
      <Panel title='Evolução do saldo'>
        <div
          role='img'
          aria-label='Saldos mensais'
          className='flex h-64 items-end justify-around gap-2 border-b border-[#dbe5ed] pb-2'
        >
          {months.map(item => (
            <div
              key={item.key}
              className='flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2'
            >
              <span className='max-w-full text-center text-[10px] text-(--texto-apoio) sm:text-xs'>
                {money(item.balance)}
              </span>
              <div
                className={
                  'w-full max-w-12 rounded-t-md ' +
                  (item.balance < 0 ? 'bg-[#bd241c]' : 'bg-[#3f8395]')
                }
                style={{
                  height:
                    Math.max(2, (Math.abs(item.balance) / max) * 75) + '%',
                }}
              />
              <span className='text-xs text-(--texto-apoio)'>{item.label}</span>
            </div>
          ))}
        </div>
        <p className='mt-4 text-xs text-(--texto-apoio)'>
          Valores calculados a partir dos seus lançamentos. Vermelho indica
          saldo negativo.
        </p>
      </Panel>
      <Panel title='Resumo do período'>
        <Summary
          stacked
          transactions={data.transactions.filter(item =>
            item.date.startsWith(month)
          )}
        />
      </Panel>
    </div>
  );
}
export function Budget({ budget, onEdit }) {
  return (
    <Panel
      title='Seu plano do mês'
      action={
        <Action secondary onClick={onEdit}>
          {budget ? 'Editar orçamento' : 'Montar orçamento'}
        </Action>
      }
    >
      {budget ? (
        <>
          <p className='mb-6 text-3xl font-extrabold'>
            {money(budget.income)}{' '}
            <span className='text-sm font-normal text-(--texto-apoio)'>
              de renda mensal
            </span>
          </p>
          <div className='space-y-5'>
            {budgetFields.slice(1).map(([key, label]) => (
              <div key={key}>
                <div className='mb-2 flex flex-wrap justify-between gap-3 text-sm'>
                  <span>{label}</span>
                  <strong>{money(budget[key])}</strong>
                </div>
                <Progress
                  value={
                    budget.income ? (budget[key] / budget.income) * 100 : 0
                  }
                  label={label}
                />
              </div>
            ))}
          </div>
          <p className='mt-6 rounded-lg bg-(--azul-fundo) p-4 text-sm'>
            Disponível depois de distribuir a renda:{' '}
            <strong>
              {money(
                budget.income -
                  budgetFields
                    .slice(1)
                    .reduce((sum, [key]) => sum + budget[key], 0)
              )}
            </strong>
          </p>
        </>
      ) : (
        <Empty onCreate={onEdit}>
          Defina os limites que fazem sentido para sua realidade.
        </Empty>
      )}
    </Panel>
  );
}
