import { CalendarDays, ChevronRight } from 'lucide-react';
import { dataCurta, moeda } from '../../../app/dados/bancoMvp';
import porquinho from '../assets/porquinho-metas.webp';
import { BarraProgressoFinancas } from './financeUi';

const situacoes = {
  ativa: ['Em andamento', 'bg-white text-(--azul-titulo)'],
  concluida: ['Concluída', 'bg-[#e7f5ed] text-(--verde-sucesso)'],
  cancelada: ['Cancelada', 'bg-white text-(--texto-apoio)'],
};

export function ProgressoMeta({ meta, mostrarSituacao = false }) {
  const progresso = Number(meta.valor_atual) / Number(meta.valor_alvo);
  const restante = Math.max(
    0,
    Number(meta.valor_alvo) - Number(meta.valor_atual)
  );

  return (
    <div className='grid gap-2'>
      {mostrarSituacao && (
        <p className='text-xs font-bold text-(--texto-apoio)'>
          {situacoes[meta.status]?.[0]}
        </p>
      )}
      <p>
        <strong className='font-titulo text-2xl font-extrabold tabular-nums'>
          {moeda(meta.valor_atual)}
        </strong>
        <span className='ml-1.5 text-sm text-(--texto-apoio)'>
          de {moeda(meta.valor_alvo)}
        </span>
      </p>
      <BarraProgressoFinancas
        valor={100 * progresso}
        rotulo={'Progresso de ' + meta.nome}
        cor={meta.status === 'concluida' ? '#18794e' : undefined}
      />
      <div className='flex flex-wrap justify-between gap-x-3 gap-y-1 text-xs text-(--texto-apoio)'>
        <span>
          {restante ? 'Faltam ' + moeda(restante) : 'Valor alvo alcançado'}
        </span>
        {meta.prazo && (
          <span className='inline-flex items-center gap-1'>
            <CalendarDays size={14} aria-hidden='true' />
            <span className='sr-only'>Prazo </span>
            {dataCurta(meta.prazo)}
          </span>
        )}
      </div>
    </div>
  );
}

export default function CartoesMetas({ metas, aoAbrir }) {
  return (
    <ul
      className={
        'grid gap-4 md:grid-cols-2' +
        (metas.length > 2 ? ' xl:grid-cols-3' : '')
      }
    >
      {metas.map(meta => {
        const [rotulo, cor] = situacoes[meta.status] ?? situacoes.ativa;
        const fundo =
          meta.status === 'ativa'
            ? 'bg-(--pessego-suave)'
            : 'bg-(--azul-fundo)';
        return (
          <li key={meta.id}>
            <button
              type='button'
              onClick={() => aoAbrir(meta)}
              className='flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-(--borda-suave) bg-white text-left hover:border-(--laranja-destaque)'
            >
              <div
                className={
                  'flex min-h-32 w-full items-center gap-2 px-4 py-3 ' + fundo
                }
              >
                <div className='min-w-0 flex-1'>
                  <span
                    className={
                      'inline-block rounded-full px-2.5 py-1 text-xs font-bold ' +
                      cor
                    }
                  >
                    {rotulo}
                  </span>
                  <strong className='mt-2 block font-titulo text-xl leading-tight font-extrabold'>
                    {meta.nome}
                  </strong>
                </div>
                <img
                  src={porquinho}
                  alt=''
                  width='88'
                  height='88'
                  className='size-[5.5rem] shrink-0 object-contain'
                />
              </div>
              <div className='flex w-full flex-1 items-center gap-3 p-4'>
                <div className='min-w-0 flex-1'>
                  <ProgressoMeta meta={meta} />
                </div>
                <ChevronRight
                  size={18}
                  className='shrink-0 text-(--texto-apoio)'
                  aria-hidden='true'
                />
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
