import { useState } from 'react';
import { BotaoCasa, CartaoCasa } from '../../casa/componentes/indice';
import { formatarQuantidade } from '../conteudo';

export default function ListaCompras({
  itens,
  aoEditar,
  aoAlternar,
  aoGerar,
  aoLimpar,
  aoExportar,
}) {
  const [categoria, setCategoria] = useState('Todos');
  const [pendentes, setPendentes] = useState(false);

  const visiveis = itens.filter(
    item =>
      (categoria === 'Todos' || categoria === item.category) &&
      (!pendentes || !item.bought)
  );

  return (
    <div className='space-y-5'>
      <div className='flex flex-wrap gap-3'>
        <BotaoCasa onClick={() => aoEditar(null)}>+ Adicionar item</BotaoCasa>
        <BotaoCasa secundario onClick={aoGerar}>
          Gerar a partir do plano
        </BotaoCasa>
        <BotaoCasa secundario onClick={aoExportar} disabled={!itens.length}>
          Baixar lista
        </BotaoCasa>
      </div>

      <div
        className='flex flex-wrap gap-3'
        role='group'
        aria-label='Categoria dos itens'
      >
        {['Todos', 'Frescos', 'Básicos', 'Outros'].map(valor => (
          <BotaoCasa
            key={valor}
            secundario={valor !== categoria}
            aria-pressed={valor === categoria}
            onClick={() => setCategoria(valor)}
          >
            {valor} (
            {
              itens.filter(item => valor === 'Todos' || item.category === valor)
                .length
            }
            )
          </BotaoCasa>
        ))}
      </div>

      <label className='flex min-h-11 items-center gap-3 text-sm'>
        <input
          type='checkbox'
          checked={pendentes}
          onChange={evento => setPendentes(evento.target.checked)}
          className='size-5 accent-(--laranja-principal)'
        />
        Mostrar apenas pendentes
      </label>

      <CartaoCasa>
        {visiveis.length ? (
          <ul className='divide-y divide-[#e6edf2]'>
            {visiveis.map(item => (
              <li
                key={item.id}
                className='flex items-center justify-between gap-3 py-3'
              >
                <label className='flex min-h-12 min-w-0 flex-1 items-center gap-4'>
                  <input
                    type='checkbox'
                    checked={item.bought}
                    onChange={() => aoAlternar(item.id)}
                    className='size-5 shrink-0 accent-(--laranja-principal)'
                  />
                  <span
                    className={
                      item.bought ? 'text-(--texto-apoio) line-through' : ''
                    }
                  >
                    <strong className='block'>{item.name}</strong>
                    <span className='mt-1 block text-sm text-(--texto-apoio)'>
                      {formatarQuantidade(item.amount)} {item.unit} ·{' '}
                      {item.category}
                    </span>
                  </span>
                </label>
                <button
                  type='button'
                  aria-label={'Editar ' + item.name}
                  onClick={() => aoEditar(item)}
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
      </CartaoCasa>

      <div className='flex flex-wrap items-center justify-between gap-3'>
        <p className='text-sm text-(--texto-apoio)'>
          {itens.filter(item => item.bought).length} de {itens.length}{' '}
          comprado(s)
        </p>
        <BotaoCasa
          secundario
          disabled={!itens.some(item => item.bought)}
          onClick={aoLimpar}
        >
          Limpar comprados
        </BotaoCasa>
      </div>
    </div>
  );
}
