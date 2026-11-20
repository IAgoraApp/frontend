import { useAvisoPerfilA } from '../../app/avisos/avisosPerfilA';
import { useState } from 'react';
import {
  ArrowRight,
  ChartPie,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Plus,
  Sparkles,
  Tags,
  Wallet,
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { dataCurta, hoje, moeda, useBancoMvp } from '../../app/dados/bancoMvp';
import LayoutCasa from '../../app/layouts/casaLayout';
import { MenuLateralCasa } from '../../app/layouts/components/casaNavigation';
import { Container, Titulo } from '../../shared/ui';
import { EditorMvp } from '../../shared/ui/mvp';
import { calcularTotais, formatarMoeda } from './content';
import CartoesMetas, { ProgressoMeta } from './components/financeGoals';
import {
  ContaDoLancamento,
  ContasFinanceiras,
} from './components/financeAccounts';
import CartoesRecorrencias, {
  ResumoRecorrencia,
} from './components/financeRecurrences';
import ExtratoFinancas from './components/financeStatement';
import ColecaoFinancas from './components/financeCollectionA';
import {
  AcaoFinancas,
  BarraProgressoFinancas,
  IconeFinancas,
  PainelFinancas,
  SegmentosFinancas,
} from './components/financeUi';
import {
  GraficoCategorias,
  LinhasLancamentos,
} from './components/financeViews';
import {
  atualizarFinancas,
  camposConta,
  frequencias,
  tipoNomeConta,
  gerarRecorrencia,
  saldoMovimentos,
} from './financasDados';

const abas = [
  ['geral', 'Visão geral'],
  ['lancamentos', 'Lançamentos'],
  ['contas', 'Contas'],
  ['orcamentos', 'Orçamentos'],
  ['metas', 'Metas'],
  ['categorias', 'Categorias'],
  ['recorrencias', 'Recorrências'],
];
const acoesPorVisao = {
  lancamentos: ['lancamento', 'Adicionar lançamento'],
  contas: ['conta', 'Nova conta'],
  orcamentos: ['orcamento', 'Novo orçamento'],
  metas: ['meta', 'Nova meta'],
  categorias: ['categoria', 'Nova categoria'],
  recorrencias: ['recorrencia', 'Nova recorrência'],
};
const secoesFinancas = [
  {
    rota: '/financas',
    nome: 'Visão geral',
    Icone: LayoutGrid,
    inicial: 'geral',
    links: [],
  },
  {
    rota: '/financas',
    nome: 'Movimentações',
    Icone: Wallet,
    links: abas.slice(1, 3),
  },
  {
    rota: '/financas',
    nome: 'Planejamento',
    Icone: ChartPie,
    links: abas.slice(3, 5),
  },
  { rota: '/financas', nome: 'Organização', Icone: Tags, links: abas.slice(5) },
  { rota: '/ia', nome: 'Dicas da IA', Icone: Sparkles, links: [] },
];
const tipos = [
  ['receita', 'Receita'],
  ['despesa', 'Despesa'],
];
const icones = [
  ['wallet', 'Carteira', 'Wallet'],
  ['shopping-cart', 'Compras', 'Cart'],
  ['house', 'Casa', 'Home'],
  ['bus', 'Transporte', 'Bus'],
  ['gamepad-2', 'Lazer', 'Gamepad2'],
  ['bolt', 'Energia', 'Bolt'],
  ['wifi', 'Internet', 'Wifi'],
  ['heart', 'Saúde', 'Heart'],
  ['utensils', 'Restaurante', 'Utensils'],
  ['graduation-cap', 'Educação', 'Graduation'],
  ['plane', 'Viagem', 'Plane'],
  ['sofa', 'Móveis', 'Sofa'],
  ['building', 'Serviços', 'Building'],
  ['receipt', 'Contas', 'Receipt'],
];
const coresCategoriasPadrao = {
  '#22c55e': '#d54c15',
  '#f59e0b': '#102a43',
  '#3b82f6': '#3f7f91',
  '#a855f7': '#8b5775',
  '#10b981': '#18794e',
};
const corCategoria = categoria => {
  const cor = categoria?.cor?.toLowerCase();
  return coresCategoriasPadrao[cor] ?? cor ?? '#526579';
};
const imagemCategoria = icone =>
  icones.find(([id]) => id === icone)?.[2] ?? 'Receipt';
function imagemRegistro(categoria, compacta = false) {
  const cor = corCategoria(categoria);
  return (
    <span
      className={
        'grid shrink-0 place-items-center rounded-full ' +
        (compacta ? 'size-9' : 'size-12')
      }
      style={{
        backgroundColor: `color-mix(in srgb, ${cor} 14%, white)`,
        color: cor,
      }}
    >
      <IconeFinancas
        nome={imagemCategoria(categoria?.icone)}
        classe={compacta ? 'size-4' : 'size-6'}
      />
    </span>
  );
}
const campo = (nome, rotulo, extra) => ({ nome, rotulo, ...extra });
const valor = (nome, rotulo, min = 0.01) =>
  campo(nome, rotulo + ' (R$)', { tipo: 'number', min });
const data = (nome, rotulo, obrigatorio = true) =>
  campo(nome, rotulo, { tipo: 'date', obrigatorio });
const tipoCampo = campo('tipo', 'Tipo', { opcoes: tipos });
function deslocarMes(mes, passos) {
  const periodo = new Date(`${mes}-01T12:00:00Z`);
  periodo.setUTCMonth(periodo.getUTCMonth() + passos);
  const ano = periodo.getUTCFullYear();
  return ano >= 1 && ano <= 9999 ? periodo.toISOString().slice(0, 7) : mes;
}

const mesCampo = (mes, setMes) => (
  <div
    className='inline-flex items-center rounded-lg border border-[#d9e4ec] bg-white'
    role='group'
    aria-label='Navegar pelos meses'
  >
    <button
      type='button'
      aria-label='Mês anterior'
      className='grid h-11 w-8 shrink-0 place-items-center rounded-l-lg hover:bg-(--azul-fundo)'
      onClick={() => setMes(atual => deslocarMes(atual, -1))}
    >
      <ChevronLeft size={18} aria-hidden='true' />
    </button>
    <input
      className='h-11 w-32 min-w-0 border-x border-[#d9e4ec] px-1.5 text-sm font-bold'
      type='month'
      aria-label='Mês de competência'
      min='0001-01'
      max='9999-12'
      value={mes}
      onChange={e => {
        if (e.target.value && e.target.validity.valid) setMes(e.target.value);
      }}
    />
    <button
      type='button'
      aria-label='Próximo mês'
      className='grid h-11 w-8 shrink-0 place-items-center rounded-r-lg hover:bg-(--azul-fundo)'
      onClick={() => setMes(atual => deslocarMes(atual, 1))}
    >
      <ChevronRight size={18} aria-hidden='true' />
    </button>
  </div>
);
const situacao = t =>
  t.status === 'pago'
    ? t.tipo === 'receita'
      ? 'Recebido'
      : 'Pago'
    : 'Pendente';
const adaptar = t => ({
  id: t.id,
  type: t.tipo === 'receita' ? 'income' : 'expense',
  amount: Math.round(Number(t.valor) * 100),
  name: t.descricao,
  categoryId: t.categoria_id,
  date: t.vencimento ?? t.competencia,
  situacao: situacao(t),
});

function AcoesMeta({ meta, executar }) {
  const [aporte, setAporte] = useState(false);
  const notificar = useAvisoPerfilA();
  if (meta.status !== 'ativa') return null;
  const salvarStatus = status => () =>
    atualizarFinancas('meta_financeira', meta, () => ({ status }));
  return (
    <>
      <div className='mt-3 flex flex-wrap gap-2'>
        <AcaoFinancas onClick={() => setAporte(true)}>
          Adicionar valor
        </AcaoFinancas>
        <AcaoFinancas
          secundario
          onClick={() => executar(salvarStatus('concluida'), 'Meta concluída.')}
        >
          Concluir meta
        </AcaoFinancas>
        <AcaoFinancas
          secundario
          onClick={() => executar(salvarStatus('cancelada'), 'Meta cancelada.')}
        >
          Cancelar meta
        </AcaoFinancas>
      </div>
      {aporte && (
        <EditorMvp
          titulo='Adicionar valor à meta'
          inicial={{}}
          campos={[valor('aporte', 'Valor a adicionar')]}
          onClose={() => setAporte(false)}
          onSave={({ aporte }) => {
            atualizarFinancas('meta_financeira', meta, atual => ({
              valor_atual:
                (Math.round(Number(atual.valor_atual) * 100) +
                  Math.round(aporte * 100)) /
                100,
            }));
            notificar('Valor adicionado à meta.');
          }}
        />
      )}
    </>
  );
}

function AcoesRecorrencia({
  registro,
  executar,
  mes,
  categoriaCampo,
  categoriaInicial,
}) {
  const [gerando, setGerando] = useState(false);
  const notificar = useAvisoPerfilA();
  return (
    <>
      <div className='mt-3 flex flex-wrap gap-2'>
        <AcaoFinancas
          secundario
          onClick={() => {
            setGerando(false);
            executar(
              () =>
                atualizarFinancas(
                  'recorrencia_financeira',
                  registro,
                  atual => ({ ativa: !atual.ativa })
                ),
              registro.ativa
                ? 'Recorrência desativada.'
                : 'Recorrência ativada.'
            );
          }}
        >
          {registro.ativa ? 'Desativar' : 'Ativar'}
        </AcaoFinancas>
        {registro.ativa && (
          <AcaoFinancas
            onClick={() => {
              setGerando(true);
            }}
          >
            Gerar lançamentos
          </AcaoFinancas>
        )}
      </div>
      {registro.ativa && gerando && (
        <section
          className='mt-4 rounded-xl border border-(--borda-suave) p-4'
          aria-labelledby='gerar-recorrencia-titulo'
        >
          <h3
            id='gerar-recorrencia-titulo'
            className='font-titulo text-base font-extrabold'
          >
            Gerar lançamentos do mês
          </h3>
          <p className='mt-1 text-sm text-(--texto-apoio)'>
            Os novos lançamentos entram no extrato como pendentes.
          </p>
          <EditorMvp
            titulo='Gerar lançamentos do mês'
            cabecalho={false}
            rotuloSalvar='Gerar'
            inicial={{ mes, categoria_id: categoriaInicial }}
            campos={[
              campo('mes', 'Mês de competência', { tipo: 'month' }),
              categoriaCampo,
            ]}
            onClose={() => setGerando(false)}
            onSave={v => {
              const gerados = gerarRecorrencia(registro, v.mes, v.categoria_id);
              notificar(
                gerados === 0
                  ? 'Nenhum novo lançamento para este mês.'
                  : gerados === 1
                    ? '1 lançamento gerado.'
                    : `${gerados} lançamentos gerados.`
              );
            }}
          />
        </section>
      )}
    </>
  );
}

export default function FinancasA({ usuario, rota = '/financas' }) {
  const { b, perfil, transacoes } = useBancoMvp(usuario);
  const [params, setParams] = useSearchParams();
  const chaveContaAtiva = 'iagora:financas:conta-ativa:' + perfil.user_id;
  const [contaAtivaId, setContaAtivaId] = useState(() => {
    try {
      return Number(localStorage.getItem(chaveContaAtiva)) || null;
    } catch {
      return null;
    }
  });
  function ativarConta(id) {
    setContaAtivaId(id);
    try {
      localStorage.setItem(chaveContaAtiva, String(id));
    } catch {
      // A escolha continua disponível nesta sessão.
    }
  }
  const [mes, setMes] = useState(() => {
    const registroAberto = transacoes.find(
      t => t.id === Number(params.get('lancamento'))
    );
    if (registroAberto?.competencia)
      return registroAberto.competencia.slice(0, 7);
    const atual = hoje().slice(0, 7);
    const meses = transacoes.map(t => t.competencia.slice(0, 7)).sort();
    return meses.includes(atual) ? atual : (meses.at(-1) ?? atual);
  });
  const [categoriaResumo, setCategoriaResumo] = useState(null);
  const [tipoExtrato, setTipoExtrato] = useState('todos');
  const [filtro, setFiltro] = useState('todos');
  const [busca, setBusca] = useState('');
  const [visao, titulo] =
    abas.find(
      ([id]) =>
        id ===
        (params.get('visao') === 'orcamento'
          ? 'orcamentos'
          : params.get('visao'))
    ) ?? abas[0];
  const ehExtrato = visao === 'lancamentos';
  const minhas = colecao =>
    b[colecao].filter(r => r.user_id === perfil.user_id);
  const categorias = minhas('categoria_financas');
  const contas = minhas('conta_financeira');
  const contaAtiva = contas.find(c => c.id === contaAtivaId) ?? contas[0];
  const orcamentos = minhas('orcamento');
  const metas = minhas('meta_financeira');
  const recorrencias = minhas('recorrencia_financeira');
  const registros = transacoes.filter(t => t.competencia?.startsWith(mes));
  const pagos = registros.filter(t => t.status === 'pago');
  const pendente = registros
    .filter(t => t.tipo === 'despesa' && t.status === 'pendente')
    .reduce((soma, t) => soma + Number(t.valor), 0);
  const totais = calcularTotais(pagos.map(adaptar));
  const despesasPagas = pagos.filter(t => t.tipo === 'despesa');
  const categoriaAtiva =
    categoriaResumo?.mes === mes &&
    despesasPagas.some(t => t.categoria_id === categoriaResumo.id)
      ? categoriaResumo.id
      : null;
  const movimentosResumo = categoriaAtiva
    ? despesasPagas.filter(t => t.categoria_id === categoriaAtiva)
    : registros;

  const saldoConta = conta =>
    Number(conta.saldo_inicial) +
    saldoMovimentos(transacoes.filter(t => t.conta_id === conta.id));
  const categoriasGrafico = categorias.map(c => ({
    id: c.id,
    name: c.nome,
    color: corCategoria(c),
    icon: imagemCategoria(c.icone),
    type: 'expense',
  }));
  const categoriaCampo = campo('categoria_id', 'Categoria', {
    numero: true,
    opcoes: categorias.map(c => [c.id, c.nome]),
  });
  const categoriaNome = id =>
    categorias.find(c => c.id === id)?.nome ?? 'Sem categoria';
  const padrao = { user_id: perfil.user_id };
  const lancamentoAberto = Number(params.get('lancamento'));
  const contaAberta = Number(params.get('conta'));
  const visaoAcao = visao === 'geral' ? 'lancamentos' : visao;
  const [tipoNovo, rotuloNovo] = acoesPorVisao[visaoAcao];
  const criarRegistro = params.get('novo') === tipoNovo;

  function fecharRegistro() {
    if (!criarRegistro && !params.has('lancamento') && !params.has('conta'))
      return;
    setParams({ visao }, { replace: true });
  }

  const lancamentosFiltrados = registros.filter(
    t =>
      t.id === lancamentoAberto ||
      ((filtro === 'todos' || t.status === filtro) &&
        (tipoExtrato === 'todos' || t.tipo === tipoExtrato) &&
        [t.descricao, categoriaNome(t.categoria_id)].some(texto =>
          texto
            .toLocaleLowerCase('pt-BR')
            .includes(busca.trim().toLocaleLowerCase('pt-BR'))
        ))
  );

  return (
    <LayoutCasa
      secao={visao}
      navegacao={
        <MenuLateralCasa
          titulo='Finanças'
          IconeTitulo={Wallet}
          rotulo='Navegação de finanças'
          secoes={rota === '/financas' ? secoesFinancas : secoesFinancas.filter(secao => secao.rota === '/financas').map(secao => ({ ...secao, rota }))}
          pathname={rota}
          visao={visao}
        />
      }
    >
      <main
        lang='pt-BR'
        className={
          'min-w-0 bg-(--azul-fundo) font-corpo text-(--azul-titulo) wrap-anywhere [--font-titulo:var(--font-corpo)] [&_:is(a,button,input,select):focus-visible]:outline-2 [&_:is(a,button,input,select):focus-visible]:outline-offset-3 [&_:is(a,button,input,select):focus-visible]:outline-(--laranja-principal) ' +
          (ehExtrato ? 'h-full min-h-0 overflow-hidden' : 'min-h-full')
        }
      >
        <Container
          classe={`casa-pagina-conteudo ${ehExtrato ? 'flex h-full min-h-0 flex-col' : ''}`}
        >
          <div
            className={
              ehExtrato ? 'flex min-h-0 min-w-0 flex-1 flex-col' : 'min-w-0'
            }
          >
            <header className='mb-4 flex shrink-0 flex-wrap items-center justify-between gap-3'>
              <Titulo
                como='h1'
                classe='text-3xl leading-tight font-bold tracking-[-0.02em] sm:text-4xl'
              >
                {titulo}
              </Titulo>
              <div className='flex flex-wrap items-center gap-2'>
                {['geral', 'lancamentos', 'orcamentos'].includes(visao) &&
                  mesCampo(mes, setMes)}
                <Link
                  to={`?visao=${visaoAcao}&novo=${tipoNovo}`}
                  className='inline-flex min-h-11 items-center gap-2 rounded-full bg-(--laranja-principal) px-4 py-2 text-sm font-bold text-white hover:bg-[#c43300]'
                >
                  <Plus size={17} aria-hidden='true' /> {rotuloNovo}
                </Link>
              </div>
            </header>
            <div
              className={
                ehExtrato ? 'flex min-h-0 flex-1 flex-col' : 'space-y-4'
              }
              key={visao}
            >
              {visao === 'geral' && (
                <>
                  <section
                    aria-label='Resumo do mês'
                    className='rounded-2xl border border-(--borda-suave) bg-white p-3 sm:p-4'
                  >
                    <dl className='grid grid-cols-2 gap-x-2 gap-y-2 sm:gap-x-0 lg:grid-cols-4'>
                      {[
                        [
                          'Saldo do mês',
                          formatarMoeda(totais.saldo),
                          'IndicadorSaldo',
                          'text-(--azul-titulo)',
                        ],
                        [
                          'Entradas',
                          formatarMoeda(totais.entradas),
                          'IndicadorEntradas',
                          'text-(--verde-sucesso)',
                        ],
                        [
                          'Saídas',
                          formatarMoeda(totais.saidas),
                          'IndicadorSaidas',
                          'text-(--vermelho-alerta)',
                        ],
                        [
                          'Despesas pendentes',
                          moeda(pendente),
                          'Calendar',
                          'text-[#9d2c08]',
                        ],
                      ].map(([rotulo, montante, icone, cor], indice) => (
                        <div
                          key={rotulo}
                          className='flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 rounded-lg p-2 sm:px-3 lg:border-l lg:border-(--borda-suave) lg:first:border-l-0'
                        >
                          {indice === 3 ? (
                            <span className='grid size-9 shrink-0 place-items-center rounded-full bg-(--laranja-fundo)'>
                              <IconeFinancas nome={icone} classe='size-4' />
                            </span>
                          ) : (
                            <span
                              className={
                                'relative grid size-9 shrink-0 place-items-center ' +
                                cor
                              }
                            >
                              <IconeFinancas nome={icone} classe='size-9' />
                              <span
                                aria-hidden='true'
                                className='absolute text-sm font-bold'
                              >
                                {['=', '+', '−'][indice]}
                              </span>
                            </span>
                          )}
                          <div className='min-w-0'>
                            <dt className='text-xs text-(--texto-apoio)'>
                              {rotulo}
                            </dt>
                            <dd
                              className={
                                'font-titulo text-base font-extrabold tabular-nums sm:text-lg ' +
                                cor
                              }
                            >
                              {montante}
                            </dd>
                          </div>
                        </div>
                      ))}
                    </dl>
                  </section>
                  <div className='grid gap-4 xl:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)]'>
                    <div className='min-w-0 xl:order-2 xl:grid'>
                      <GraficoCategorias
                        dados={{ categories: categoriasGrafico }}
                        lancamentos={despesasPagas.map(adaptar)}
                        contexto='Despesas pagas no mês'
                        categoriaAtiva={categoriaAtiva}
                        aoSelecionarCategoria={id =>
                          setCategoriaResumo(
                            id === categoriaAtiva ? null : { mes, id }
                          )
                        }
                      />
                    </div>
                    <PainelFinancas
                      titulo={
                        categoriaAtiva
                          ? 'Despesas pagas'
                          : 'Últimos lançamentos'
                      }
                      classe='[&>div:first-child]:mb-1'
                      acao={
                        categoriaAtiva ? (
                          <button
                            type='button'
                            onClick={() => setCategoriaResumo(null)}
                            className='min-h-10 cursor-pointer text-sm font-bold text-[#a52f08] hover:underline'
                          >
                            Limpar filtro
                          </button>
                        ) : (
                          <Link
                            to='?visao=lancamentos'
                            className='inline-flex min-h-10 items-center gap-1 text-sm font-bold text-[#a52f08] hover:underline'
                          >
                            Ver todos{' '}
                            <ArrowRight size={15} aria-hidden='true' />
                          </Link>
                        )
                      }
                    >
                      <div id='financas-lancamentos-resumo'>
                        <p
                          role='status'
                          className={
                            categoriaAtiva
                              ? 'mb-2 text-sm text-(--texto-apoio)'
                              : 'sr-only'
                          }
                        >
                          {categoriaAtiva
                            ? categoriaNome(categoriaAtiva) +
                              ' · ' +
                              movimentosResumo.length +
                              (movimentosResumo.length === 1
                                ? ' lançamento'
                                : ' lançamentos')
                            : 'Mostrando os últimos lançamentos do mês.'}
                        </p>
                        <LinhasLancamentos
                          itens={movimentosResumo
                            .map(adaptar)
                            .sort((a, b) => b.date.localeCompare(a.date))
                            .slice(0, categoriaAtiva ? undefined : 5)}
                          categorias={categoriasGrafico}
                          aoAbrir={item =>
                            setParams({
                              visao: 'lancamentos',
                              lancamento: item.id,
                            })
                          }
                          denso
                        />
                      </div>
                    </PainelFinancas>
                  </div>
                  <PainelFinancas
                    titulo='Saldos por conta'
                    classe='[&>div:first-child]:mb-2'
                    acao={
                      <Link
                        to='?visao=contas'
                        className='inline-flex min-h-10 items-center gap-1 text-sm font-bold text-[#a52f08] hover:underline'
                      >
                        Minhas contas{' '}
                        <ArrowRight size={15} aria-hidden='true' />
                      </Link>
                    }
                  >
                    {contas.length ? (
                      <ul className='grid gap-2 sm:grid-cols-2 xl:grid-cols-3'>
                        {contas.map(conta => (
                          <li key={conta.id}>
                            <Link
                              to={'?visao=contas&conta=' + conta.id}
                              className='flex h-full items-center gap-3 rounded-xl bg-(--azul-fundo) px-3 py-2.5 hover:bg-[#e8eff5]'
                            >
                              <span className='grid size-9 shrink-0 place-items-center rounded-full bg-white'>
                                <IconeFinancas
                                  nome={
                                    conta.tipo === 'dinheiro' ||
                                    conta.tipo === 'carteira'
                                      ? 'Receipt'
                                      : 'Building'
                                  }
                                  classe='size-5'
                                />
                              </span>
                              <span className='min-w-0 flex-1'>
                                <span className='block text-xs text-(--texto-apoio)'>
                                  {conta.nome}
                                </span>
                                <strong className='block tabular-nums'>
                                  {moeda(saldoConta(conta))}
                                </strong>
                              </span>
                              <ChevronRight
                                size={16}
                                className='shrink-0'
                                aria-hidden='true'
                              />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className='text-sm text-(--texto-apoio)'>
                        Cadastre uma conta para acompanhar seu saldo e extrato.
                      </p>
                    )}
                  </PainelFinancas>
                </>
              )}
              {visao === 'lancamentos' && (
                <ColecaoFinancas
                  titulo='Extrato do mês'
                  classe='flex min-h-0 flex-1 flex-col [&>div:first-child]:mb-3 [&>div:first-child]:shrink-0'
                  nomeNovo={rotuloNovo}
                  criarAoAbrir={criarRegistro}
                  onCloseRegistro={fecharRegistro}
                  colecao='transacao_financeira'
                  registros={lancamentosFiltrados}
                  filtros={
                    <div className='mb-3 flex shrink-0 flex-wrap items-center justify-between gap-2'>
                      <SegmentosFinancas
                        rotulo='Tipo de lançamento'
                        valor={tipoExtrato}
                        opcoes={[
                          ['todos', 'Todos'],
                          ['receita', 'Entradas'],
                          ['despesa', 'Saídas'],
                        ]}
                        aoAlterar={setTipoExtrato}
                      />
                      <div className='flex w-full min-w-0 gap-2 sm:w-auto'>
                        <label className='flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-lg border border-(--borda-suave) px-2 sm:px-3'>
                          <IconeFinancas nome='Search' classe='size-4' />
                          <input
                            type='search'
                            aria-label='Buscar lançamentos'
                            placeholder='Buscar lançamento'
                            className='w-full min-w-0 text-sm'
                            value={busca}
                            onChange={e => setBusca(e.target.value)}
                          />
                        </label>
                        <select
                          aria-label='Situação dos lançamentos'
                          className='min-h-11 max-w-[47%] rounded-lg border border-(--borda-suave) px-2 text-sm sm:max-w-full sm:px-3'
                          value={filtro}
                          onChange={e => setFiltro(e.target.value)}
                        >
                          <option value='todos'>Todas as situações</option>
                          <option value='pendente'>Pendentes</option>
                          <option value='pago'>Pagos ou recebidos</option>
                        </select>
                      </div>
                    </div>
                  }
                  lista={abrir => (
                    <ExtratoFinancas
                      registros={lancamentosFiltrados}
                      categorias={categorias}
                      imagem={imagemRegistro}
                      aoAbrir={abrir}
                    />
                  )}
                  registroInicial={lancamentoAberto}
                  padrao={{
                    ...padrao,
                    competencia: mes + '-01',
                    status: 'pendente',
                    pago_em: null,
                    recorrencia_id: null,
                    conta_id: contaAtiva?.id ?? null,
                  }}
                  campos={[
                    campo('descricao', 'Descrição'),
                    tipoCampo,
                    valor('valor', 'Valor'),
                    categoriaCampo,
                    campo('conta_id', 'Conta', {
                      numero: true,
                      obrigatorio: false,
                      renderizar: inicial => (
                        <ContaDoLancamento
                          inicial={inicial}
                          contas={contas}
                          saldoConta={saldoConta}
                          userId={perfil.user_id}
                          aoAtivar={ativarConta}
                        />
                      ),
                    }),
                    data('competencia', 'Competência'),
                    data('vencimento', 'Vencimento', false),
                  ]}
                  onSaved={t => {
                    setMes(t.competencia.slice(0, 7));
                    setFiltro('todos');
                    setTipoExtrato('todos');
                    setBusca('');
                  }}
                  detalhe={(t, completo) => {
                    const montante =
                      (t.tipo === 'receita' ? '+ ' : '− ') + moeda(t.valor);
                    const cor =
                      t.tipo === 'receita'
                        ? 'text-(--verde-sucesso)'
                        : 'text-(--vermelho-alerta)';
                    const categoria = categoriaNome(t.categoria_id);
                    if (!completo)
                      return (
                        <>
                          <strong className={cor}>{montante}</strong>
                          {' · ' + categoria + ' · ' + situacao(t)}
                        </>
                      );
                    const dados = [
                      ['Categoria', categoria],
                      [
                        'Conta',
                        contas.find(c => c.id === t.conta_id)?.nome ??
                          'Sem conta vinculada',
                      ],
                      ['Competência', dataCurta(t.competencia)],
                      ...(t.vencimento
                        ? [['Vencimento', dataCurta(t.vencimento)]]
                        : []),
                      ...(t.pago_em
                        ? [[situacao(t) + ' em', dataCurta(t.pago_em)]]
                        : []),
                    ];
                    return (
                      <>
                        <div className='flex flex-wrap items-center justify-between gap-2'>
                          <strong
                            className={
                              'font-titulo text-3xl font-extrabold tabular-nums ' +
                              cor
                            }
                          >
                            {montante}
                          </strong>
                          <span
                            className={
                              'rounded-full px-3 py-1 text-xs font-bold ' +
                              (t.status === 'pago'
                                ? 'bg-[#e7f5ed] text-(--verde-sucesso)'
                                : 'bg-(--laranja-fundo) text-[#a52f08]')
                            }
                          >
                            {situacao(t)}
                          </span>
                        </div>
                        <dl className='grid grid-cols-2 gap-3 border-t border-(--borda-suave) pt-3'>
                          {dados.map(([rotulo, valor]) => (
                            <div key={rotulo}>
                              <dt className='text-xs text-(--texto-apoio)'>
                                {rotulo}
                              </dt>
                              <dd className='font-bold'>{valor}</dd>
                            </div>
                          ))}
                        </dl>
                      </>
                    );
                  }}
                  acoes={(t, executar) => (
                    <AcaoFinancas
                      classe='mt-3'
                      onClick={() =>
                        executar(
                          () =>
                            atualizarFinancas(
                              'transacao_financeira',
                              t,
                              atual => ({
                                status:
                                  atual.status === 'pago' ? 'pendente' : 'pago',
                                pago_em:
                                  atual.status === 'pago' ? null : hoje(),
                              })
                            ),
                          'Situação atualizada.',
                          true
                        )
                      }
                    >
                      {t.status === 'pago'
                        ? 'Voltar a pendente'
                        : t.tipo === 'receita'
                          ? 'Marcar como recebido'
                          : 'Marcar como pago'}
                    </AcaoFinancas>
                  )}
                />
              )}
              {visao === 'contas' && (
                <ColecaoFinancas
                  titulo='Saldos e extratos'
                  nomeNovo={rotuloNovo}
                  criarAoAbrir={criarRegistro}
                  onCloseRegistro={fecharRegistro}
                  colecao='conta_financeira'
                  registros={contas}
                  lista={abrir => (
                    <ContasFinanceiras
                      contas={contas}
                      ativa={contaAtiva}
                      saldoConta={saldoConta}
                      userId={perfil.user_id}
                      aoAtivar={ativarConta}
                      aoAbrir={abrir}
                    />
                  )}
                  registroInicial={contaAberta}
                  padrao={{ ...padrao, saldo_inicial: 0 }}
                  campos={camposConta}
                  onSave={dados => {
                    const conta = atualizarFinancas('conta_financeira', dados);
                    if (!dados.id) ativarConta(conta.id);
                  }}
                  acoes={c =>
                    c.id !== contaAtiva?.id && (
                      <AcaoFinancas onClick={() => ativarConta(c.id)}>
                        Usar como conta ativa
                      </AcaoFinancas>
                    )
                  }
                  detalhe={(c, completo) => {
                    const extrato = transacoes
                      .filter(t => t.conta_id === c.id)
                      .sort((a, b) =>
                        b.competencia.localeCompare(a.competencia)
                      );
                    const saldo = saldoConta(c);
                    return completo ? (
                      <>
                        <div className='flex flex-wrap items-end justify-between gap-3'>
                          <div>
                            <p className='text-xs text-(--texto-apoio)'>
                              Saldo atual
                            </p>
                            <p className='font-titulo text-3xl font-extrabold tabular-nums'>
                              {moeda(saldo)}
                            </p>
                          </div>
                          <p className='text-xs text-(--texto-apoio)'>
                            Saldo inicial{' '}
                            <strong className='block text-sm text-(--azul-titulo)'>
                              {moeda(c.saldo_inicial)}
                            </strong>
                          </p>
                        </div>
                        <h3 className='border-t border-(--borda-suave) pt-3 font-titulo text-base font-extrabold'>
                          Extrato
                        </h3>
                        {extrato.length ? (
                          <ul className='divide-y divide-[#e6edf2]'>
                            {extrato.map(t => (
                              <li
                                key={t.id}
                                className='flex flex-wrap justify-between gap-x-4 py-2'
                              >
                                <span>
                                  {t.descricao}
                                  <small className='block'>
                                    {dataCurta(
                                      t.pago_em ?? t.vencimento ?? t.competencia
                                    )}{' '}
                                    · {situacao(t)}
                                  </small>
                                </span>
                                <strong>
                                  {t.tipo === 'receita' ? '+ ' : '− '}
                                  {moeda(t.valor)}
                                </strong>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>Esta conta ainda não tem movimentações.</p>
                        )}
                      </>
                    ) : (
                      `${tipoNomeConta(c.tipo)} · Saldo atual: ${moeda(saldo)}`
                    );
                  }}
                />
              )}
              {visao === 'categorias' && (
                <ColecaoFinancas
                  titulo='Categorias de lançamentos'
                  nomeNovo={rotuloNovo}
                  criarAoAbrir={criarRegistro}
                  onCloseRegistro={fecharRegistro}
                  colecao='categoria_financas'
                  registros={categorias}
                  padrao={{ ...padrao, icone: 'wallet', cor: '#526579' }}
                  campos={[
                    campo('nome', 'Nome'),
                    campo('cor', 'Cor', { tipo: 'color' }),
                    campo('icone', 'Ícone', {
                      renderizar: (selecionado, campoIcone) => (
                        <div className='grid grid-cols-3 gap-2 sm:grid-cols-4'>
                          {icones.map(([id, nome, icone]) => (
                            <label key={id} className='finance-icon-option'>
                              <input
                                className='sr-only'
                                type='radio'
                                name={campoIcone.nome}
                                value={id}
                                defaultChecked={selecionado === id}
                                required
                              />
                              <span>
                                <IconeFinancas nome={icone} classe='size-5' />
                                {nome}
                              </span>
                            </label>
                          ))}
                        </div>
                      ),
                    }),
                  ]}
                  emGrade
                  imagem={imagemRegistro}
                  detalhe={c => {
                    const quantidade = transacoes.filter(
                      t => t.categoria_id === c.id
                    ).length;
                    return (
                      quantidade +
                      (quantidade === 1 ? ' lançamento' : ' lançamentos')
                    );
                  }}
                />
              )}
              {visao === 'orcamentos' && (
                <ColecaoFinancas
                  titulo='Limites por categoria'
                  nomeNovo={rotuloNovo}
                  criarAoAbrir={criarRegistro}
                  onCloseRegistro={fecharRegistro}
                  colecao='orcamento'
                  registros={orcamentos
                    .filter(o => o.mes.startsWith(mes))
                    .map(o => ({
                      ...o,
                      descricao: categoriaNome(o.categoria_id),
                      mes: o.mes.slice(0, 7),
                    }))}
                  padrao={{ ...padrao, mes }}
                  campos={[
                    categoriaCampo,
                    campo('mes', 'Mês de competência', { tipo: 'month' }),
                    valor('limite', 'Limite mensal'),
                  ]}
                  onSave={({ descricao, ...o }) => {
                    void descricao;
                    atualizarFinancas('orcamento', {
                      ...o,
                      mes: o.mes + '-01',
                    });
                  }}
                  onSaved={o => setMes(o.mes)}
                  imagem={o =>
                    imagemRegistro(
                      categorias.find(c => c.id === o.categoria_id)
                    )
                  }
                  detalhe={o => {
                    const gasto =
                      registros
                        .filter(
                          t =>
                            t.tipo === 'despesa' &&
                            t.categoria_id === o.categoria_id
                        )
                        .reduce(
                          (soma, t) => soma + Math.round(Number(t.valor) * 100),
                          0
                        ) / 100;
                    return (
                      <div className='grid gap-2'>
                        <span>
                          {moeda(gasto)} de {moeda(o.limite)} previstos
                        </span>
                        <BarraProgressoFinancas
                          valor={(100 * gasto) / o.limite}
                          rotulo={'Orçamento de ' + o.descricao}
                        />
                        <span>
                          {gasto > o.limite
                            ? 'Acima do limite em ' + moeda(gasto - o.limite)
                            : moeda(o.limite - gasto) + ' disponíveis'}
                        </span>
                      </div>
                    );
                  }}
                />
              )}
              {visao === 'metas' && (
                <ColecaoFinancas
                  titulo='Objetivos financeiros'
                  nomeNovo={rotuloNovo}
                  criarAoAbrir={criarRegistro}
                  onCloseRegistro={fecharRegistro}
                  colecao='meta_financeira'
                  registros={metas}
                  lista={abrir => (
                    <CartoesMetas metas={metas} aoAbrir={abrir} />
                  )}
                  padrao={{ ...padrao, status: 'ativa', valor_atual: 0 }}
                  campos={[
                    campo('nome', 'Objetivo'),
                    valor('valor_atual', 'Valor guardado', 0),
                    valor('valor_alvo', 'Valor desejado'),
                    data('prazo', 'Prazo', false),
                  ]}
                  detalhe={m => <ProgressoMeta meta={m} mostrarSituacao />}
                  acoes={(meta, executar) => (
                    <AcoesMeta meta={meta} executar={executar} />
                  )}
                />
              )}
              {visao === 'recorrencias' && (
                <ColecaoFinancas
                  titulo='Regras de recorrência'
                  nomeNovo={rotuloNovo}
                  criarAoAbrir={criarRegistro}
                  onCloseRegistro={fecharRegistro}
                  colecao='recorrencia_financeira'
                  registros={recorrencias}
                  lista={abrir => (
                    <CartoesRecorrencias
                      aoAbrir={abrir}
                      registros={recorrencias.map(r => {
                        const vinculo = transacoes.find(
                          t => t.recorrencia_id === r.id
                        );
                        const categoria = categorias.find(
                          c => c.id === vinculo?.categoria_id
                        );
                        return categoria
                          ? { ...r, imagem: imagemRegistro(categoria, true) }
                          : r;
                      })}
                    />
                  )}
                  padrao={{ ...padrao, ativa: true, inicio_em: hoje() }}
                  campos={[
                    campo('descricao', 'Descrição'),
                    tipoCampo,
                    valor('valor_previsto', 'Valor previsto'),
                    campo('frequencia', 'Frequência', { opcoes: frequencias }),
                    data('inicio_em', 'Início'),
                    data('fim_em', 'Fim', false),
                  ]}
                  detalhe={r => <ResumoRecorrencia registro={r} detalhe />}
                  acoes={(r, executar) => (
                    <AcoesRecorrencia
                      registro={r}
                      executar={executar}
                      mes={mes}
                      categoriaCampo={categoriaCampo}
                      categoriaInicial={
                        transacoes.find(t => t.recorrencia_id === r.id)
                          ?.categoria_id
                      }
                    />
                  )}
                />
              )}
            </div>
          </div>
        </Container>
      </main>
    </LayoutCasa>
  );
}
