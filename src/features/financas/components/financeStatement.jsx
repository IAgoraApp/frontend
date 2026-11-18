import { ChevronRight } from 'lucide-react';
import { dataCurta, moeda } from '../../../app/dados/bancoMvp';

const dataMovimento = item =>
  item.pago_em ?? item.vencimento ?? item.competencia;

export default function ExtratoFinancas({
  registros,
  categorias,
  imagem,
  aoAbrir,
}) {
  const grupos = Object.entries(Object.groupBy(registros, dataMovimento)).sort(
    ([primeira], [segunda]) => segunda.localeCompare(primeira)
  );

  return (
    <div
      role='region'
      aria-label='Lista de lançamentos'
      tabIndex={0}
      className='min-h-0 overflow-y-auto overscroll-y-contain rounded-xl border border-(--borda-suave)'
    >
      {grupos.map(([dia, itens]) => (
        <section key={dia} aria-label={'Movimentações de ' + dataCurta(dia)}>
          <h3 className='border-y border-(--borda-suave) bg-(--azul-fundo) px-4 py-2 text-sm font-bold first:border-t-0'>
            <time dateTime={dia}>{dataCurta(dia)}</time>
          </h3>
          <ul className='divide-y divide-(--borda-suave) px-2 sm:px-4'>
            {itens.map(item => {
              const entrada = item.tipo === 'receita';
              const categoria = categorias.find(
                c => c.id === item.categoria_id
              );
              return (
                <li key={item.id}>
                  <button
                    type='button'
                    onClick={() => aoAbrir(item)}
                    className='flex min-h-16 w-full cursor-pointer items-center gap-2 rounded-lg px-1 py-2 text-left hover:bg-(--azul-fundo) sm:gap-3'
                  >
                    {imagem(categoria, true)}
                    <span className='min-w-0 flex-1'>
                      <strong className='block text-[0.9375rem] font-bold'>
                        {item.descricao}
                      </strong>
                      <span className='block text-[0.8125rem] text-(--texto-apoio)'>
                        {categoria?.nome ?? 'Sem categoria'}
                      </span>
                    </span>
                    <span className='max-w-[42%] text-right'>
                      <strong
                        className={
                          'block text-[0.9375rem] tabular-nums ' +
                          (entrada
                            ? 'text-(--verde-sucesso)'
                            : 'text-(--azul-titulo)')
                        }
                      >
                        {entrada ? '+ ' : '− '}
                        {moeda(item.valor)}
                      </strong>
                      <span
                        className={
                          'block text-[0.8125rem] ' +
                          (item.status === 'pago'
                            ? 'text-(--texto-apoio)'
                            : 'font-bold text-[#9d2c08]')
                        }
                      >
                        {item.status === 'pago'
                          ? entrada
                            ? 'Recebido'
                            : 'Pago'
                          : 'Pendente'}
                      </span>
                    </span>
                    <ChevronRight
                      size={16}
                      className='hidden shrink-0 text-(--texto-apoio) sm:block'
                      aria-hidden='true'
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
