import { useState } from 'react';
import { ChevronRight, Repeat } from 'lucide-react';
import { dataCurta, moeda } from '../../../app/dados/bancoMvp';
import { frequencias } from '../financasDados';
import { EstadoVazioFinancas, SegmentosFinancas } from './financeUi';

export function ResumoRecorrencia({ registro, detalhe = false }) {
  const receita = registro.tipo === 'receita';
  const frequencia = frequencias.find(
    ([id]) => id === registro.frequencia
  )?.[1];
  return (
    <div className='grid gap-2'>
      <div className='flex flex-wrap items-baseline gap-x-2 gap-y-0.5'>
        <strong
          className={
            'font-titulo text-[1.4rem] leading-tight font-extrabold tabular-nums ' +
            (receita ? 'text-(--verde-sucesso)' : 'text-(--azul-titulo)')
          }
        >
          {moeda(registro.valor_previsto)}
        </strong>
        <span className='text-xs text-(--texto-apoio)'>por lançamento</span>
      </div>
      <p className='flex items-center gap-1.5 text-sm text-(--texto-apoio)'>
        <Repeat size={15} aria-hidden='true' /> {frequencia} ·{' '}
        {receita ? 'Receita' : 'Despesa'}
      </p>
      {detalhe && (
        <dl className='grid grid-cols-2 gap-3 border-t border-(--borda-suave) pt-3 text-sm'>
          <div>
            <dt className='text-xs text-(--texto-apoio)'>Início</dt>
            <dd className='font-bold'>{dataCurta(registro.inicio_em)}</dd>
          </div>
          <div>
            <dt className='text-xs text-(--texto-apoio)'>Fim</dt>
            <dd className='font-bold'>
              {registro.fim_em ? dataCurta(registro.fim_em) : 'Sem data final'}
            </dd>
          </div>
          <div>
            <dt className='text-xs text-(--texto-apoio)'>Situação</dt>
            <dd className='font-bold'>
              {registro.ativa ? 'Ativa' : 'Desativada'}
            </dd>
          </div>
        </dl>
      )}
    </div>
  );
}

export default function CartoesRecorrencias({ registros, aoAbrir }) {
  const [filtro, setFiltro] = useState('todas');
  const ativas = registros.filter(r => r.ativa).length;
  const visiveis = registros.filter(
    r => filtro === 'todas' || r.ativa === (filtro === 'ativas')
  );

  return (
    <>
      <div className='mb-4'>
        <SegmentosFinancas
          rotulo='Situação das recorrências'
          valor={filtro}
          aoAlterar={setFiltro}
          opcoes={[
            ['todas', 'Todas (' + registros.length + ')'],
            ['ativas', 'Ativas (' + ativas + ')'],
            [
              'desativadas',
              'Desativadas (' + (registros.length - ativas) + ')',
            ],
          ]}
        />
      </div>
      {visiveis.length ? (
        <ul className='grid gap-3 md:grid-cols-2 xl:grid-cols-3'>
          {visiveis.map(registro => (
            <li key={registro.id}>
              <button
                type='button'
                onClick={() => aoAbrir(registro)}
                className='flex h-full w-full cursor-pointer flex-col gap-4 rounded-xl border border-(--borda-suave) bg-white p-4 text-left hover:border-(--laranja-destaque) hover:bg-[#fffaf6]'
              >
                <span className='flex w-full items-center gap-2'>
                  {registro.imagem ?? (
                    <span className='grid size-9 shrink-0 place-items-center rounded-full bg-(--azul-fundo)'>
                      <Repeat size={17} aria-hidden='true' />
                    </span>
                  )}
                  <span
                    className={
                      'ml-auto rounded-full px-2.5 py-1 text-xs font-bold ' +
                      (registro.ativa
                        ? 'bg-[#e7f5ed] text-(--verde-sucesso)'
                        : 'bg-(--azul-fundo) text-(--texto-apoio)')
                    }
                  >
                    {registro.ativa ? 'Ativa' : 'Desativada'}
                  </span>
                </span>
                <strong className='block font-titulo text-lg leading-tight font-extrabold'>
                  {registro.descricao}
                </strong>
                <div className='mt-auto flex w-full items-end gap-2 border-t border-(--borda-suave) pt-3'>
                  <div className='min-w-0 flex-1'>
                    <ResumoRecorrencia registro={registro} />
                  </div>
                  <ChevronRight
                    size={17}
                    className='shrink-0 text-(--texto-apoio)'
                    aria-hidden='true'
                  />
                </div>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <EstadoVazioFinancas>
          Nenhuma recorrência com essa situação.
        </EstadoVazioFinancas>
      )}
    </>
  );
}
