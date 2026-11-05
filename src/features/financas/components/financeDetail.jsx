import { useState } from 'react';
import { FormField } from '../../../shared/ui';
import { Action } from './financeUi';
import { billDue, billStatus, cents, money, shortDate } from '../content';
export default function FinanceDetail({
  dialog,
  data,
  month,
  onEdit,
  onDelete,
  onPay,
  onDeposit,
}) {
  const { item, kind } = dialog;
  const [deposit, setDeposit] = useState('');
  const [error, setError] = useState('');
  const paid =
    kind === 'bill' && billStatus(item, month, data.payments) === 'paid';
  return (
    <div className='space-y-5'>
      <p className='text-3xl font-extrabold'>{money(item.amount)}</p>
      {kind === 'transaction' && (
        <dl className='grid grid-cols-2 gap-3 text-sm'>
          <dt className='text-(--texto-apoio)'>Tipo</dt>
          <dd>{item.type === 'income' ? 'Entrada' : 'Saída'}</dd>
          <dt className='text-(--texto-apoio)'>Categoria</dt>
          <dd>
            {
              data.categories.find(category => category.id === item.categoryId)
                ?.name
            }
          </dd>
          <dt className='text-(--texto-apoio)'>Data</dt>
          <dd>{shortDate(item.date)}</dd>
          <dt className='text-(--texto-apoio)'>Pagamento</dt>
          <dd>{item.payment ?? 'Não informado'}</dd>
        </dl>
      )}
      {kind === 'bill' && (
        <>
          <p className='text-sm text-(--texto-apoio)'>
            Vencimento: {shortDate(billDue(item, month))} ·{' '}
            {paid
              ? 'Paga'
              : billStatus(item, month, data.payments) === 'overdue'
                ? 'Vencida'
                : 'A vencer'}
          </p>
          {!paid && <Action onClick={onPay}>Marcar como paga</Action>}
        </>
      )}
      {kind === 'goal' && (
        <>
          <p className='text-(--texto-apoio)'>
            {money(item.saved)} guardados · Faltam{' '}
            {money(Math.max(0, item.amount - item.saved))}
          </p>
          {item.saved < item.amount && (
            <form
              className='space-y-3'
              onSubmit={event => {
                event.preventDefault();
                const amount = cents(deposit);
                if (
                  !Number.isSafeInteger(amount) ||
                  amount <= 0 ||
                  amount > item.amount - item.saved
                ) {
                  setError(
                    'Informe um valor maior que zero e até ' +
                      money(item.amount - item.saved) +
                      '.'
                  );
                  return;
                }
                onDeposit(amount);
              }}
            >
              <FormField
                id='finance-deposit'
                label='Adicionar ao valor guardado (R$)'
                value={deposit}
                onChange={event => setDeposit(event.target.value)}
                inputMode='decimal'
                required
                maxLength={18}
                placeholder='0,00'
              />
              {error && (
                <p role='alert' className='text-sm text-red-800'>
                  {error}
                </p>
              )}
              <Action type='submit'>Atualizar progresso</Action>
              <p className='text-xs text-(--texto-apoio)'>
                Este acompanhamento não gera um lançamento financeiro.
              </p>
            </form>
          )}
        </>
      )}
      <div className='flex flex-wrap items-center gap-3 border-t border-[#e6edf2] pt-5'>
        <Action secondary onClick={onEdit}>
          Editar
        </Action>
        <button
          type='button'
          onClick={onDelete}
          className='min-h-11 rounded-full px-5 text-sm font-bold text-red-700 hover:bg-red-50'
        >
          Excluir
        </button>
      </div>
    </div>
  );
}
