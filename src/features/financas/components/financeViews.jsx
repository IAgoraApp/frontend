import { useState } from 'react';
import { Titulo } from '../../../shared/ui/index';
import {
  AcaoFinancas,
  BarraProgressoFinancas,
  EstadoVazioFinancas,
  IconeFinancas,
  PainelFinancas,
  SegmentosFinancas,
} from './financeUi';
import {
  calcularTotais,
  camposOrcamento,
  dataCurta,
  formatarMoeda,
  statusConta,
  totaisPorCategoria,
  vencimentoConta,
} from '../content';

export function ResumoFinancas({ lancamentos, empilhado = false }) {
  const resultado = calcularTotais(lancamentos);
  return (
    <div
      className={
        empilhado
          ? 'grid gap-5 py-2'
          : 'grid gap-5 py-7 sm:grid-cols-3 sm:divide-x sm:divide-[#e6edf2]'
      }
    >
      {[
        ['Entradas', 'entradas', 'IndicadorEntradas', 'text-[#18794e]'],
        ['Saídas', 'saidas', 'IndicadorSaidas', 'text-[#b42318]'],
        ['Saldo', 'saldo', 'IndicadorSaldo', 'text-(--azul-titulo)'],
      ].map(([rotulo, chave, icone, cor]) => (
        <div key={chave} className='flex min-w-0 items-center gap-4 sm:px-4'>
          <span
            className={
              'relative flex size-14 shrink-0 items-center justify-center ' +
              cor
            }
          >
            <IconeFinancas nome={icone} classe='size-14' />
            <strong aria-hidden='true' className='absolute text-xl'>
              {chave === 'entradas' ? '+' : chave === 'saidas' ? '−' : '='}
            </strong>
          </span>
          <div className='min-w-0'>
            <p className='text-sm font-medium text-(--texto-apoio)'>{rotulo}</p>
            <p
              className={
                'mt-1 font-titulo text-[clamp(1.25rem,2.1vw,2rem)] leading-tight font-extrabold break-all ' +
                cor
              }
            >
              {formatarMoeda(resultado[chave])}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function GraficoCategorias({ dados, lancamentos }) {
  const resultado = totaisPorCategoria(dados.categories, lancamentos).filter(
    item => item.type === 'expense'
  );
  const total = calcularTotais(lancamentos).saidas;
  let cursor = 0;
  const fatias = resultado
    .filter(item => item.spent > 0)
    .map(categoria => {
      const inicio = cursor;
      cursor += total ? (categoria.spent / total) * 100 : 0;
      return categoria.color + ' ' + inicio + '% ' + cursor + '%';
    });

  return (
    <PainelFinancas titulo='Gastos por categoria' neutro classe='border-0'>
      <div className='flex flex-col items-center gap-6 sm:flex-row lg:flex-col xl:flex-row'>
        <div
          role='img'
          aria-label={
            total
              ? 'Total em gastos: ' + formatarMoeda(total)
              : 'Sem gastos neste mês'
          }
          className='flex size-48 shrink-0 items-center justify-center rounded-full'
          style={{
            background: total
              ? 'conic-gradient(' + fatias.join(',') + ')'
              : '#d9e4ec',
          }}
        >
          <div className='flex size-36 flex-col items-center justify-center rounded-full bg-(--azul-fundo) p-3 text-center'>
            <strong className='font-titulo text-lg font-extrabold'>
              {formatarMoeda(total)}
            </strong>
            <span className='mt-1 text-xs text-(--texto-apoio)'>em gastos</span>
          </div>
        </div>
        <ul className='w-full min-w-0 flex-1 space-y-5'>
          {(total
            ? resultado.filter(item => item.spent > 0)
            : resultado.slice(0, 4)
          ).map(categoria => (
            <li
              key={categoria.id}
              className='flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm'
            >
              <span
                className='size-3 shrink-0 rounded-full'
                style={{ backgroundColor: categoria.color }}
              />
              <span className='min-w-0 flex-1'>{categoria.name}</span>
              <strong>{formatarMoeda(categoria.spent)}</strong>
              <span className='w-9 text-right text-(--texto-apoio)'>
                {total ? Math.round((categoria.spent / total) * 100) : 0}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </PainelFinancas>
  );
}

export function LinhasLancamentos({
  itens,
  categorias,
  compacto = false,
  aoAbrir,
  aoCriar,
}) {
  return itens.length ? (
    <ul className='divide-y divide-[#e6edf2]'>
      {itens.map(item => (
        <li key={item.id}>
          <button
            type='button'
            onClick={() => aoAbrir(item)}
            className='grid min-h-18 w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg py-3 text-left hover:bg-(--azul-fundo) sm:gap-4'
          >
            <span
              aria-hidden='true'
              className={
                'relative flex size-9 shrink-0 items-center justify-center font-bold ' +
                (item.type === 'income' ? 'text-[#18794e]' : 'text-[#b42318]')
              }
            >
              <IconeFinancas
                nome={
                  item.type === 'income'
                    ? 'IndicadorSalario'
                    : 'IndicadorAluguel'
                }
                classe='size-9'
              />
              <span className='absolute'>
                {item.type === 'income' ? '+' : '−'}
              </span>
            </span>
            <span className='min-w-0'>
              <span className='block text-sm font-bold'>{item.name}</span>
              <span className='mt-1 block text-xs text-(--texto-apoio)'>
                {!compacto &&
                  (categorias.find(cat => cat.id === item.categoryId)?.name ||
                    'Sem categoria') + ' · '}
                {dataCurta(item.date)}
                {item.repeat ? ' · Mensal' : ''}
              </span>
            </span>
            <span
              className={
                'text-right text-xs font-bold sm:text-sm ' +
                (item.type === 'income' ? 'text-[#18794e]' : 'text-[#b42318]')
              }
            >
              {item.type === 'income' ? '+ ' : '− '}
              {formatarMoeda(item.amount)}
            </span>
          </button>
        </li>
      ))}
    </ul>
  ) : (
    <EstadoVazioFinancas aoCriar={aoCriar}>
      Nenhum lançamento neste período.
    </EstadoVazioFinancas>
  );
}

export function ListaLancamentos({ itens, categorias, aoAbrir, aoCriar }) {
  const [filtro, setFiltro] = useState('todos');
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('todas');
  const buscaNormalizada = busca.trim().toLocaleLowerCase('pt-BR');
  const visiveis = itens.filter(
    item =>
      (filtro === 'todos' || item.type === filtro) &&
      (categoria === 'todas' || item.categoryId === categoria) &&
      item.name.toLocaleLowerCase('pt-BR').includes(buscaNormalizada)
  );

  return (
    <PainelFinancas>
      <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
        <SegmentosFinancas
          rotulo='Filtrar lançamentos'
          opcoes={[
            ['todos', 'Todas'],
            ['income', 'Entradas'],
            ['expense', 'Saídas'],
          ]}
          valor={filtro}
          aoAlterar={setFiltro}
        />
        <div className='flex w-full flex-wrap gap-3 md:w-auto'>
          <label className='flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-lg border border-[#dbe5ed] px-3'>
            <IconeFinancas nome='Search' classe='size-5' />
            <input
              aria-label='Buscar lançamento'
              type='search'
              placeholder='Buscar lançamento...'
              value={busca}
              onChange={evento => setBusca(evento.target.value)}
              className='min-w-0 flex-1 bg-transparent py-2 text-sm'
            />
          </label>
          <select
            aria-label='Filtrar por categoria'
            value={categoria}
            onChange={evento => setCategoria(evento.target.value)}
            className='min-h-11 max-w-full rounded-lg border border-[#dbe5ed] bg-white px-3 text-sm'
          >
            <option value='todas'>Todas as categorias</option>
            {categorias.map(item => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <LinhasLancamentos
        itens={visiveis}
        categorias={categorias}
        aoAbrir={aoAbrir}
        aoCriar={aoCriar}
      />
      <p className='mt-4 text-xs text-(--texto-apoio)' aria-live='polite'>
        {visiveis.length} lançamento(s) encontrado(s)
      </p>
    </PainelFinancas>
  );
}

export function ListaCategorias({ dados, lancamentos, aoAbrir }) {
  const [tipo, setTipo] = useState('expense');
  const itens = totaisPorCategoria(dados.categories, lancamentos).filter(
    categoria => categoria.type === tipo
  );
  const total =
    tipo === 'expense'
      ? calcularTotais(lancamentos).saidas
      : calcularTotais(lancamentos).entradas;

  return (
    <div className='space-y-5'>
      <SegmentosFinancas
        rotulo='Tipo de categoria'
        opcoes={[
          ['expense', 'Despesas'],
          ['income', 'Receitas'],
        ]}
        valor={tipo}
        aoAlterar={setTipo}
      />
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {itens.map(item => (
          <button
            type='button'
            key={item.id}
            onClick={() => aoAbrir(item)}
            className='rounded-xl border border-[#d9e4ec] p-5 text-left hover:bg-(--azul-fundo)'
          >
            <div className='flex items-center gap-3'>
              <span className='flex size-12 shrink-0 items-center justify-center rounded-full bg-(--azul-fundo)'>
                <IconeFinancas nome={item.icon} classe='size-6' />
              </span>
              <span className='font-bold'>{item.name}</span>
              <span
                className='ml-auto size-3 shrink-0 rounded-full'
                style={{ backgroundColor: item.color }}
              />
            </div>
            <div className='mt-5 flex flex-wrap justify-between gap-2'>
              <strong>{formatarMoeda(item.spent)}</strong>
              <span className='text-sm text-(--texto-apoio)'>
                {total ? Math.round((item.spent / total) * 100) : 0}%
              </span>
            </div>
            {item.limit > 0 && (
              <div className='mt-4 space-y-2'>
                <BarraProgressoFinancas
                  rotulo={'Limite de ' + item.name}
                  valor={(item.spent / item.limit) * 100}
                  cor={item.color}
                />
                <p className='text-xs text-(--texto-apoio)'>
                  Limite: {formatarMoeda(item.limit)}
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

export function ListaMetas({ dados, aoAbrir, aoCriar }) {
  return (
    <div className='grid gap-5 sm:grid-cols-2'>
      {dados.goals.length ? (
        dados.goals.map(meta => (
          <button
            type='button'
            key={meta.id}
            onClick={() => aoAbrir(meta)}
            className='space-y-5 rounded-xl border border-[#d9e4ec] p-6 text-left hover:bg-(--azul-fundo)'
          >
            <div className='flex items-center gap-3'>
              <span className='flex size-12 items-center justify-center rounded-full bg-[#e6f1f7]'>
                <IconeFinancas nome={meta.icon} classe='size-6' />
              </span>
              <Titulo classe='text-xl font-bold'>{meta.name}</Titulo>
            </div>
            <p className='font-titulo text-2xl font-extrabold'>
              {formatarMoeda(meta.amount)}
            </p>
            <div className='flex flex-wrap justify-between gap-2 text-sm'>
              <span className='text-(--texto-apoio)'>
                {formatarMoeda(meta.saved)} guardados
              </span>
              <strong>{Math.round((meta.saved / meta.amount) * 100)}%</strong>
            </div>
            <BarraProgressoFinancas
              valor={(meta.saved / meta.amount) * 100}
              rotulo={meta.name}
            />
            <p className='text-sm text-(--texto-apoio)'>
              {meta.saved >= meta.amount
                ? 'Objetivo conquistado!'
                : 'Faltam ' + formatarMoeda(meta.amount - meta.saved)}
              {meta.date && ' · Até ' + dataCurta(meta.date)}
            </p>
          </button>
        ))
      ) : (
        <PainelFinancas classe='sm:col-span-2'>
          <EstadoVazioFinancas aoCriar={aoCriar}>
            Sua próxima conquista começa com uma meta.
          </EstadoVazioFinancas>
        </PainelFinancas>
      )}
    </div>
  );
}

export function ListaContas({ dados, mes, aoAbrir, aoCriar }) {
  const [filtro, setFiltro] = useState('todas');
  const itens = dados.bills
    .filter(
      conta =>
        (conta.repeat
          ? conta.date.slice(0, 7) <= mes
          : conta.date.slice(0, 7) === mes) &&
        (filtro === 'todas' || statusConta(conta, mes, dados.payments) === filtro)
    )
    .sort((a, b) =>
      vencimentoConta(a, mes).localeCompare(vencimentoConta(b, mes))
    );

  return (
    <PainelFinancas>
      <SegmentosFinancas
        rotulo='Filtrar contas'
        opcoes={[
          ['todas', 'Todas'],
          ['pendente', 'A vencer'],
          ['vencida', 'Vencidas'],
          ['paga', 'Concluídas'],
        ]}
        valor={filtro}
        aoAlterar={setFiltro}
      />
      <ul className='mt-5 divide-y divide-[#e6edf2]'>
        {itens.map(conta => {
          const situacao = statusConta(conta, mes, dados.payments);
          return (
            <li key={conta.id}>
              <button
                type='button'
                onClick={() => aoAbrir(conta)}
                className='flex w-full flex-wrap items-center gap-4 rounded-lg py-5 text-left hover:bg-(--azul-fundo)'
              >
                <span className='flex size-11 items-center justify-center rounded-full bg-[#e6f1f7]'>
                  <IconeFinancas nome={conta.icon} classe='size-6' />
                </span>
                <span className='min-w-0 flex-1'>
                  <strong className='block'>{conta.name}</strong>
                  <span className='mt-1 block text-xs text-(--texto-apoio)'>
                    {conta.repeat
                      ? 'Todo dia ' + Number(vencimentoConta(conta, mes).slice(-2))
                      : dataCurta(conta.date)}
                  </span>
                </span>
                <strong>{formatarMoeda(conta.amount)}</strong>
                <span
                  className={
                    'rounded-full px-3 py-1.5 text-xs font-bold ' +
                    (situacao === 'paga'
                      ? 'bg-[#ecfdf3] text-[#18794e]'
                      : situacao === 'vencida'
                        ? 'bg-[#fef3f2] text-[#b42318]'
                        : 'bg-(--laranja-fundo) text-(--laranja-principal)')
                  }
                >
                  {
                    { paga: 'Paga', vencida: 'Vencida', pendente: 'A vencer' }[
                      situacao
                    ]
                  }
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {!itens.length && (
        <EstadoVazioFinancas aoCriar={aoCriar}>
          Nenhuma conta encontrada neste período.
        </EstadoVazioFinancas>
      )}
    </PainelFinancas>
  );
}

export function RelatoriosFinancas({ dados, mes }) {
  const [ano, numeroMes] = mes.split('-').map(Number);
  const meses = Array.from({ length: 7 }, (_, indice) => {
    const data = new Date(ano, numeroMes - 7 + indice, 1);
    const chave =
      data.getFullYear() + '-' + String(data.getMonth() + 1).padStart(2, '0');
    return {
      chave,
      rotulo: data.toLocaleDateString('pt-BR', { month: 'short' }),
      ...calcularTotais(
        dados.transactions.filter(item => item.date.startsWith(chave))
      ),
    };
  });
  const maximo = Math.max(...meses.map(item => Math.abs(item.saldo)), 1);

  return (
    <div className='grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]'>
      <PainelFinancas titulo='Evolução do saldo'>
        <div
          role='img'
          aria-label='Saldos mensais'
          className='flex h-64 items-end justify-around gap-2 border-b border-[#dbe5ed] pb-2'
        >
          {meses.map(item => (
            <div
              key={item.chave}
              className='flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2'
            >
              <span className='max-w-full text-center text-[10px] text-(--texto-apoio) sm:text-xs'>
                {formatarMoeda(item.saldo)}
              </span>
              <div
                className={
                  'w-full max-w-12 rounded-t-md ' +
                  (item.saldo < 0 ? 'bg-[#b42318]' : 'bg-[#3f8395]')
                }
                style={{
                  height: Math.max(2, (Math.abs(item.saldo) / maximo) * 75) + '%',
                }}
              />
              <span className='text-xs text-(--texto-apoio)'>{item.rotulo}</span>
            </div>
          ))}
        </div>
        <p className='mt-4 text-xs text-(--texto-apoio)'>
          Valores calculados a partir dos seus lançamentos. Vermelho indica
          saldo negativo.
        </p>
      </PainelFinancas>
      <PainelFinancas titulo='Resumo do período'>
        <ResumoFinancas
          empilhado
          lancamentos={dados.transactions.filter(item =>
            item.date.startsWith(mes)
          )}
        />
      </PainelFinancas>
    </div>
  );
}

export function VisaoOrcamento({ orcamento, aoEditar }) {
  return (
    <PainelFinancas
      titulo='Seu plano do mês'
      acao={
        <AcaoFinancas secundario onClick={aoEditar}>
          {orcamento ? 'Editar orçamento' : 'Montar orçamento'}
        </AcaoFinancas>
      }
    >
      {orcamento ? (
        <>
          <p className='mb-6 font-titulo text-3xl font-extrabold'>
            {formatarMoeda(orcamento.renda)}{' '}
            <span className='font-corpo text-sm font-normal text-(--texto-apoio)'>
              de renda mensal
            </span>
          </p>
          <div className='space-y-5'>
            {camposOrcamento.slice(1).map(([chave, rotulo]) => (
              <div key={chave}>
                <div className='mb-2 flex flex-wrap justify-between gap-3 text-sm'>
                  <span>{rotulo}</span>
                  <strong>{formatarMoeda(orcamento[chave])}</strong>
                </div>
                <BarraProgressoFinancas
                  valor={
                    orcamento.renda
                      ? (orcamento[chave] / orcamento.renda) * 100
                      : 0
                  }
                  rotulo={rotulo}
                />
              </div>
            ))}
          </div>
          <p className='mt-6 rounded-lg bg-(--azul-fundo) p-4 text-sm'>
            Disponível depois de distribuir a renda:{' '}
            <strong>
              {formatarMoeda(
                orcamento.renda -
                  camposOrcamento
                    .slice(1)
                    .reduce((soma, [chave]) => soma + orcamento[chave], 0)
              )}
            </strong>
          </p>
        </>
      ) : (
        <EstadoVazioFinancas aoCriar={aoEditar}>
          Defina os limites que fazem sentido para sua realidade.
        </EstadoVazioFinancas>
      )}
    </PainelFinancas>
  );
}
