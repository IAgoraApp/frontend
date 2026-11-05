import { useState } from 'react';
import {
  CasaButton as Action,
  CasaCard as Card,
} from '../../casa/components/casaUi';
import { formatAmount } from '../content';

export default function ShoppingList({
  items,
  onEdit,
  onToggle,
  onGenerate,
  onClear,
  onExport,
}) {
  const [category, setCategory] = useState('Todos');
  const [pending, setPending] = useState(false);
  const visible = items.filter(
    item =>
      (category === 'Todos' || category === item.category) &&
      (!pending || !item.bought)
  );
  return (
    <div className='space-y-5'>
      <div className='flex flex-wrap gap-3'>
        <Action onClick={() => onEdit(null)}>+ Adicionar item</Action>
        <Action secondary onClick={onGenerate}>
          Gerar a partir do plano
        </Action>
        <Action secondary onClick={onExport} disabled={!items.length}>
          Baixar lista
        </Action>
      </div>
      <div
        className='flex flex-wrap gap-3'
        role='group'
        aria-label='Categoria dos itens'
      >
        {['Todos', 'Frescos', 'Básicos', 'Outros'].map(value => (
          <Action
            key={value}
            secondary={value !== category}
            aria-pressed={value === category}
            onClick={() => setCategory(value)}
          >
            {value} (
            {
              items.filter(item => value === 'Todos' || item.category === value)
                .length
            }
            )
          </Action>
        ))}
      </div>
      <label className='flex min-h-11 items-center gap-3 text-sm'>
        <input
          type='checkbox'
          checked={pending}
          onChange={event => setPending(event.target.checked)}
          className='size-5 accent-(--laranja-principal)'
        />
        Mostrar apenas pendentes
      </label>
      <Card>
        {visible.length ? (
          <ul className='divide-y divide-[#e6edf2]'>
            {visible.map(item => (
              <li
                key={item.id}
                className='flex items-center justify-between gap-3 py-3'
              >
                <label className='flex min-h-12 min-w-0 flex-1 items-center gap-4'>
                  <input
                    type='checkbox'
                    checked={item.bought}
                    onChange={() => onToggle(item.id)}
                    className='size-5 shrink-0 accent-(--laranja-principal)'
                  />
                  <span
                    className={
                      item.bought ? 'text-(--texto-apoio) line-through' : ''
                    }
                  >
                    <strong className='block'>{item.name}</strong>
                    <span className='mt-1 block text-sm text-(--texto-apoio)'>
                      {formatAmount(item.amount)} {item.unit} · {item.category}
                    </span>
                  </span>
                </label>
                <button
                  type='button'
                  aria-label={'Editar ' + item.name}
                  onClick={() => onEdit(item)}
                  className='min-h-11 px-3 text-sm font-bold text-(--laranja-principal)'
                >
                  Editar
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p role='status' className='py-8 text-center text-(--texto-apoio)'>
            Nenhum item encontrado. Adicione um item ou gere a lista a partir do
            seu plano.
          </p>
        )}
      </Card>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <p className='text-sm text-(--texto-apoio)'>
          {items.filter(item => item.bought).length} de {items.length}{' '}
          comprado(s)
        </p>
        <Action
          secondary
          disabled={!items.some(item => item.bought)}
          onClick={onClear}
        >
          Limpar comprados
        </Action>
      </div>
    </div>
  );
}
