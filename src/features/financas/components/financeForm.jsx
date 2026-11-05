import { useState } from 'react';
import { FormField, Title } from '../../../shared/ui';
import { Action, Panel, Segments } from './financeUi';
import { budgetFields, palette } from '../content';
import { cents, decimal, id, money, today } from '../content';

const inputClass =
  'h-[52px] w-full min-w-0 rounded-lg border border-[#dbe5ed] bg-white px-4 text-base';
function Select({ name, label, value, onChange, children }) {
  return (
    <div className='flex min-w-0 flex-col gap-2 text-sm font-bold'>
      <label htmlFor={'finance-' + name}>{label}</label>
      <select
        id={'finance-' + name}
        name={name}
        value={value}
        onChange={onChange}
        className={inputClass}
      >
        {children}
      </select>
    </div>
  );
}
const headings = {
  transaction: [
    'Cada movimento, no seu lugar.',
    'Registre uma entrada ou saída para acompanhar seu mês.',
  ],
  category: ['Nova categoria.', 'Uma organização que faz sentido para você.'],
  bill: ['Nova conta.', 'Um vencimento no radar.'],
  goal: ['Nova meta.', 'Um objetivo com próximos passos.'],
  budget: [
    'Um plano possível para o seu mês.',
    'Defina limites que façam sentido para sua realidade.',
  ],
};
export default function FinanceForm({
  kind,
  record,
  data,
  balance,
  onSave,
  onBack,
}) {
  const [values, setValues] = useState(() => {
    if (kind === 'budget')
      return Object.fromEntries(
        budgetFields.map(([key]) => [key, decimal(data.budget?.[key] ?? 0)])
      );
    return {
      name: record?.name ?? '',
      amount: record ? decimal(record.amount ?? 0) : '',
      saved: decimal(record?.saved ?? 0),
      date: record?.date ?? (kind === 'goal' ? '' : today()),
      type: record?.type ?? 'expense',
      categoryId: record?.categoryId ?? '',
      payment: record?.payment ?? 'Pix',
      repeat: record?.repeat ?? kind === 'bill',
      color: record?.color ?? palette[1],
      limit: decimal(record?.limit ?? 0),
    };
  });
  const [error, setError] = useState('');
  const update = event =>
    setValues(previous => ({
      ...previous,
      [event.target.name]:
        event.target.type === 'checkbox'
          ? event.target.checked
          : event.target.value,
    }));
  const numeric = (name, label, required = true) => (
    <FormField
      id={'finance-' + name}
      name={name}
      label={label}
      value={values[name]}
      onChange={update}
      inputMode='decimal'
      placeholder='0,00'
      required={required}
      maxLength={18}
    />
  );
  const amount = cents(values.amount) || 0;
  const allocations = budgetFields
    .slice(1)
    .reduce((sum, [key]) => sum + (cents(values[key]) || 0), 0);
  const income = cents(values.income) || 0;
  const projected =
    balance +
    (values.type === 'income' ? amount : -amount) -
    (record && kind === 'transaction'
      ? record.type === 'income'
        ? record.amount
        : -record.amount
      : 0);
  function submit(event) {
    event.preventDefault();
    setError('');
    if (kind === 'budget') {
      const result = Object.fromEntries(
        budgetFields.map(([key]) => [key, cents(values[key])])
      );
      if (
        Object.values(result).some(
          value => !Number.isSafeInteger(value) || value < 0
        ) ||
        result.income <= 0
      ) {
        setError(
          'Informe a renda e os limites válidos, usando vírgula para os centavos.'
        );
        return;
      }
      if (
        budgetFields.slice(1).reduce((sum, [key]) => sum + result[key], 0) >
        result.income
      ) {
        setError(
          'Os limites ultrapassam sua renda. Ajuste os valores antes de salvar.'
        );
        return;
      }
      onSave(result);
      return;
    }
    if (!values.name.trim()) {
      setError('Preencha a descrição.');
      return;
    }
    if (kind === 'category') {
      if (
        data.categories.some(
          category =>
            category.id !== record?.id &&
            category.type === values.type &&
            category.name.toLocaleLowerCase('pt-BR') ===
              values.name.trim().toLocaleLowerCase('pt-BR')
        )
      ) {
        setError('Já existe uma categoria com este nome e tipo.');
        return;
      }
      const limit = cents(values.limit);
      if (!Number.isSafeInteger(limit) || limit < 0) {
        setError('Informe um limite válido.');
        return;
      }
      onSave({
        ...record,
        id: record?.id ?? id(),
        name: values.name.trim(),
        type: values.type,
        color: values.color,
        limit,
        icon: record?.icon ?? 'Receipt',
      });
      return;
    }
    const parsedAmount = cents(values.amount);
    if (!Number.isSafeInteger(parsedAmount) || parsedAmount <= 0) {
      setError('Informe um valor maior que zero, como 120,50.');
      return;
    }
    if (
      kind === 'transaction' &&
      !data.categories.some(
        category =>
          category.id === values.categoryId && category.type === values.type
      )
    ) {
      setError('Selecione uma categoria para o lançamento.');
      return;
    }
    const saved = cents(values.saved);
    if (
      kind === 'goal' &&
      (!Number.isSafeInteger(saved) || saved < 0 || saved > parsedAmount)
    ) {
      setError('O valor guardado deve estar entre zero e o valor do objetivo.');
      return;
    }
    if (kind === 'goal' && values.date && values.date < today()) {
      setError('Escolha um prazo a partir de hoje.');
      return;
    }
    onSave({
      ...record,
      ...values,
      name: values.name.trim(),
      id: record?.id ?? id(),
      amount: parsedAmount,
      saved: kind === 'goal' ? saved : undefined,
      icon: record?.icon ?? (kind === 'goal' ? 'Sofa' : 'Receipt'),
    });
  }
  return (
    <div className='space-y-7'>
      <button
        type='button'
        onClick={onBack}
        className='min-h-11 text-sm font-bold text-(--texto-apoio) hover:text-(--laranja-principal)'
      >
        ← Voltar
      </button>
      <div>
        <span className='inline-block rotate-[1.4deg] bg-(--laranja-principal) px-3 py-1.5 text-xs font-bold text-white'>
          SEU DINHEIRO EM PERSPECTIVA
        </span>
        <Title
          as='h1'
          className='mt-3 text-3xl leading-tight font-extrabold sm:text-5xl'
        >
          {record
            ? 'Editar ' +
              ({
                transaction: 'lançamento.',
                category: 'categoria.',
                bill: 'conta.',
                goal: 'meta.',
              }[kind] ?? 'orçamento.')
            : headings[kind][0]}
        </Title>
        <p className='mt-3 text-(--texto-apoio)'>{headings[kind][1]}</p>
      </div>
      <div className='grid items-start gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]'>
        <Panel>
          <form className='space-y-6' onSubmit={submit}>
            {kind === 'budget' ? (
              <div className='grid gap-5 sm:grid-cols-2'>
                {budgetFields.map(([key, label]) => (
                  <div
                    key={key}
                    className={
                      key === 'income' || key === 'savings'
                        ? 'sm:col-span-2'
                        : ''
                    }
                  >
                    {numeric(key, label + ' (R$)')}
                  </div>
                ))}
              </div>
            ) : (
              <>
                {(kind === 'transaction' || kind === 'category') && (
                  <Segments
                    label='Tipo de movimento'
                    value={values.type}
                    options={
                      kind === 'transaction'
                        ? [
                            ['expense', 'Saída'],
                            ['income', 'Entrada'],
                          ]
                        : [
                            ['expense', 'Despesa'],
                            ['income', 'Receita'],
                          ]
                    }
                    onChange={type =>
                      setValues(previous => ({
                        ...previous,
                        type,
                        categoryId: '',
                      }))
                    }
                  />
                )}
                <FormField
                  id='finance-name'
                  name='name'
                  label={
                    kind === 'transaction'
                      ? 'Descrição'
                      : kind === 'goal'
                        ? 'Objetivo'
                        : 'Nome'
                  }
                  required
                  maxLength={100}
                  autoFocus
                  value={values.name}
                  onChange={update}
                  placeholder={
                    kind === 'goal' ? 'Ex.: Comprar meus móveis' : 'Digite aqui'
                  }
                />
                {kind === 'category' ? (
                  <div className='grid gap-5 sm:grid-cols-2'>
                    <Select
                      name='color'
                      label='Cor'
                      value={values.color}
                      onChange={update}
                    >
                      {palette.map((color, index) => (
                        <option key={color} value={color}>
                          {
                            [
                              'Azul',
                              'Laranja',
                              'Turquesa',
                              'Cinza',
                              'Verde',
                              'Roxo',
                            ][index]
                          }
                        </option>
                      ))}
                    </Select>
                    {numeric('limit', 'Limite mensal (R$)')}
                  </div>
                ) : (
                  <>
                    <div className='grid gap-5 sm:grid-cols-2'>
                      {numeric(
                        'amount',
                        kind === 'goal' ? 'Valor total (R$)' : 'Valor (R$)'
                      )}
                      <FormField
                        id='finance-date'
                        name='date'
                        type='date'
                        label={
                          kind === 'goal'
                            ? 'Prazo (opcional)'
                            : kind === 'bill'
                              ? 'Vencimento'
                              : 'Data'
                        }
                        required={kind !== 'goal'}
                        min={kind === 'goal' ? today() : undefined}
                        value={values.date}
                        onChange={update}
                      />
                    </div>
                    {kind === 'goal' &&
                      numeric('saved', 'Valor já guardado (R$)')}
                    {kind === 'transaction' && (
                      <div className='grid gap-5 sm:grid-cols-2'>
                        <Select
                          name='categoryId'
                          label='Categoria'
                          value={values.categoryId}
                          onChange={update}
                        >
                          <option value=''>Selecionar categoria</option>
                          {data.categories
                            .filter(category => category.type === values.type)
                            .map(category => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                        </Select>
                        <Select
                          name='payment'
                          label='Forma de pagamento'
                          value={values.payment}
                          onChange={update}
                        >
                          {[
                            'Pix',
                            'Dinheiro',
                            'Débito',
                            'Crédito',
                            'Transferência',
                            'Boleto',
                          ].map(name => (
                            <option key={name}>{name}</option>
                          ))}
                        </Select>
                      </div>
                    )}
                    {(kind === 'bill' ||
                      (kind === 'transaction' &&
                        values.type === 'expense' &&
                        !record?.billId)) && (
                      <label className='flex min-h-14 items-center gap-3 rounded-lg bg-(--azul-fundo) p-4 text-sm'>
                        <input
                          type='checkbox'
                          name='repeat'
                          checked={values.repeat}
                          onChange={update}
                          className='size-5 accent-(--laranja-principal)'
                        />
                        <span>
                          <strong>Repetir todo mês</strong>
                          <span className='mt-1 block text-(--texto-apoio)'>
                            Você poderá ajustar ou encerrar a recorrência.
                          </span>
                        </span>
                      </label>
                    )}
                  </>
                )}
              </>
            )}
            {error && (
              <p
                role='alert'
                className='rounded-lg bg-red-50 p-4 text-sm text-red-800'
              >
                {error}
              </p>
            )}
            <div className='flex flex-wrap gap-3'>
              <Action type='submit'>
                {kind === 'budget'
                  ? 'Salvar orçamento'
                  : kind === 'transaction'
                    ? 'Salvar lançamento'
                    : 'Salvar'}
              </Action>
              <Action type='button' secondary onClick={onBack}>
                Cancelar
              </Action>
            </div>
          </form>
        </Panel>
        <aside className='space-y-5'>
          <Panel neutral>
            <p className='text-xs font-bold text-(--laranja-principal)'>
              {kind === 'budget'
                ? 'SEU PLANO DO MÊS'
                : kind === 'goal'
                  ? 'SUA CONQUISTA'
                  : 'SEU MÊS EM PERSPECTIVA'}
            </p>
            <Title className='mt-4 text-3xl font-extrabold'>
              {kind === 'budget'
                ? money(income - allocations)
                : kind === 'transaction'
                  ? money(projected)
                  : values.name || 'Um passo de cada vez.'}
            </Title>
            <p className='mt-3 text-sm text-(--texto-apoio)'>
              {kind === 'budget'
                ? 'livres depois de distribuir sua renda'
                : kind === 'transaction'
                  ? 'Saldo previsto depois de salvar este lançamento.'
                  : kind === 'goal'
                    ? money(cents(values.saved) || 0) +
                      ' de ' +
                      money(amount) +
                      ' guardados'
                    : kind === 'bill'
                      ? money(amount) + ' · Confira a data de vencimento.'
                      : 'Ela ficará disponível nos seus próximos lançamentos.'}
            </p>
            {kind === 'budget' && (
              <div className='mt-5 space-y-3'>
                {budgetFields.slice(1).map(([key, label]) => (
                  <div
                    key={key}
                    className='flex flex-wrap justify-between gap-2 text-sm'
                  >
                    <span>{label}</span>
                    <strong>{money(cents(values[key]) || 0)}</strong>
                  </div>
                ))}
              </div>
            )}
          </Panel>
          <p className='rounded-xl bg-(--azul-fundo) p-5 text-sm leading-relaxed text-(--texto-apoio)'>
            Comece pelo essencial. Você pode revisar seus registros e ajustar o
            planejamento quando precisar.
          </p>
        </aside>
      </div>
    </div>
  );
}
