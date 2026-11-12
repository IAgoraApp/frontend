import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Botao,
  CampoFormulario,
  Container,
  EstadoVazio,
  Titulo,
} from '../../compartilhado/interface/indice';
import Rodape from '../../compartilhado/Rodape';
import AssistenteFinancas from '../financas/componentes/AssistenteFinancas';
import { IconeFinancas } from '../financas/componentes/InterfaceFinancas';
import {
  lerEstadoPlataforma,
  salvarEstadoPlataforma,
} from '../../aplicacao/estado/estadoPlataforma';
import { analisarNumero, formatarMoeda } from '../calculadoras/conteudo';
import {
  categoriasMudanca,
  lerEstadoPlanejamento,
  salvarEstadoPlanejamento,
} from './conteudo';
import {
  VisaoCenario,
  VisaoCompararCenarios,
  VisaoCustoDeVida,
  VisaoCustosIniciais,
  VisaoMetaEconomia,
  VisaoRealidade,
} from './componentes/VisoesPlanejamento';
import fechoCarteira from '../../ativos/vetores/calculadoras/fecho-carteira.svg';
import moedaGrande from '../../ativos/vetores/calculadoras/moeda-grande.svg';
import moedaMedia from '../../ativos/vetores/calculadoras/moeda-media.svg';
import moedaPequena from '../../ativos/vetores/calculadoras/moeda-pequena.svg';

function RoscaCategoriasMudanca({ lancamentos }) {
  const saidas = lancamentos.filter(item => item.tipo === 'saida');
  const totalSaidas = saidas.reduce((acc, item) => acc + item.valor, 0);

  const resumoPorCategoria = categoriasMudanca.map(cat => {
    const soma = saidas
      .filter(item => item.categoria === cat.id)
      .reduce((acc, item) => acc + item.valor, 0);
    const percentual = totalSaidas ? Math.round((soma / totalSaidas) * 100) : 0;
    return { ...cat, valor: soma, percentual };
  });

  const raio = 64;
  const circunferencia = 2 * Math.PI * raio;
  let acumulado = 0;

  return (
    <section className='rounded-xl border border-[#d9e4ec] bg-(--azul-fundo) p-5 sm:p-6'>
      <Titulo classe='text-xl font-extrabold'>Gastos por categoria</Titulo>
      <div className='mt-5 flex flex-col items-center gap-6 sm:flex-row'>
        <div className='relative flex size-44 shrink-0 items-center justify-center'>
          <svg
            viewBox='0 0 180 180'
            className='size-full -rotate-90'
            role='img'
            aria-label='Distribuição dos gastos planejados por categoria'
          >
            <circle
              cx='90'
              cy='90'
              r={raio}
              fill='none'
              stroke='#dde6ee'
              strokeWidth='22'
            />
            {totalSaidas > 0 &&
              resumoPorCategoria.map(cat => {
                if (!cat.valor) return null;
                const fracao = cat.valor / totalSaidas;
                const comprimento = fracao * circunferencia;
                const deslocamento = -acumulado * circunferencia;
                acumulado += fracao;
                return (
                  <circle
                    key={cat.id}
                    cx='90'
                    cy='90'
                    r={raio}
                    fill='none'
                    stroke={cat.cor}
                    strokeWidth='22'
                    strokeDasharray={`${comprimento} ${circunferencia}`}
                    strokeDashoffset={deslocamento}
                  />
                );
              })}
          </svg>
          <div className='absolute inset-0 flex flex-col items-center justify-center text-center'>
            <strong className='font-titulo text-xl font-extrabold text-(--azul-titulo)'>
              {formatarMoeda(totalSaidas, 0)}
            </strong>
            <span className='text-xs text-(--texto-apoio)'>em gastos</span>
          </div>
        </div>

        <ul className='w-full space-y-3'>
          {resumoPorCategoria.map(cat => (
            <li
              key={cat.id}
              className='flex items-center justify-between gap-3 text-sm'
            >
              <span className='flex items-center gap-2.5 text-(--azul-titulo)'>
                <span
                  aria-hidden='true'
                  className='size-2.5 shrink-0 rounded-full'
                  style={{ backgroundColor: cat.cor }}
                />
                {cat.nome}
              </span>
              <span className='flex items-center gap-4 tabular-nums'>
                <strong className='font-bold text-(--azul-titulo)'>
                  {formatarMoeda(cat.valor, 2)}
                </strong>
                <span className='w-9 text-right text-(--texto-apoio)'>
                  {cat.percentual}%
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function Planejamento() {
  const [parametros, definirParametros] = useSearchParams();
  const [dados, setDados] = useState(lerEstadoPlanejamento);
  const [estadoPlataforma, setEstadoPlataforma] = useState(lerEstadoPlataforma);
  const [aba, setAba] = useState('geral');
  const [adicionando, setAdicionando] = useState(false);
  const [tituloNovo, setTituloNovo] = useState('');
  const [valorNovo, setValorNovo] = useState('');
  const [tipoNovo, setTipoNovo] = useState('saida');
  const [categoriaNova, setCategoriaNova] = useState('moradia');
  const [aviso, setAviso] = useState('');

  useEffect(() => {
    salvarEstadoPlanejamento(dados);
  }, [dados]);

  useEffect(() => {
    const atualizar = () => setEstadoPlataforma(lerEstadoPlataforma());
    window.addEventListener('iagora:estado', atualizar);
    return () => window.removeEventListener('iagora:estado', atualizar);
  }, []);

  useEffect(() => {
    if (!aviso) return;
    const id = window.setTimeout(() => setAviso(''), 4000);
    return () => window.clearTimeout(id);
  }, [aviso]);

  const visaoParam = parametros.get('visao');
  const visao = [
    'realidade',
    'cenario',
    'custos-iniciais',
    'comparar-cenarios',
    'meta-economia',
    'custo-de-vida',
  ].includes(visaoParam)
    ? visaoParam
    : 'hub';

  function abrirVisao(proxima, faltaParaMeta = null) {
    if (typeof faltaParaMeta === 'number') {
      setDados(anterior => ({
        ...anterior,
        metaEconomia: {
          ...anterior.metaEconomia,
          valorFalta: formatarMoeda(faltaParaMeta, 2).replace(/^R\$\s?/, ''),
        },
      }));
    }
    definirParametros(
      anterior => {
        const atualizado = new URLSearchParams(anterior);
        if (!proxima || proxima === 'hub') atualizado.delete('visao');
        else atualizado.set('visao', proxima);
        return atualizado;
      },
      { preventScrollReset: false }
    );
  }

  function adicionarLancamento(evento) {
    evento.preventDefault();
    const valor = analisarNumero(valorNovo);
    if (!tituloNovo.trim() || valor <= 0) return;
    const hoje = new Date();
    const meses = [
      'jan',
      'fev',
      'mar',
      'abr',
      'mai',
      'jun',
      'jul',
      'ago',
      'set',
      'out',
      'nov',
      'dez',
    ];
    const dataFormatada = `${String(hoje.getDate()).padStart(2, '0')} ${meses[hoje.getMonth()]}`;
    setDados(anterior => ({
      ...anterior,
      exemplo: false,
      lancamentos: [
        ...anterior.lancamentos,
        {
          id: `lanc-${Date.now()}`,
          tipo: tipoNovo,
          titulo: tituloNovo.trim(),
          data: dataFormatada,
          categoria: categoriaNova,
          valor,
        },
      ],
    }));
    setTituloNovo('');
    setValorNovo('');
    setAdicionando(false);
    setAviso('Lançamento adicionado ao seu plano de mudança.');
  }

  function removerLancamento(id) {
    setDados(anterior => ({
      ...anterior,
      exemplo: false,
      lancamentos: anterior.lancamentos.filter(item => item.id !== id),
    }));
  }

  const disponivel = dados.lancamentos
    .filter(item => item.tipo === 'entrada')
    .reduce((acc, item) => acc + item.valor, 0);
  const planejado = dados.lancamentos
    .filter(item => item.tipo === 'saida')
    .reduce((acc, item) => acc + item.valor, 0);
  const aindaLivre = disponivel - planejado;

  return (
    <div
      lang='pt-BR'
      className='min-w-0 flex-1 bg-white font-corpo text-(--azul-titulo) [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-(--laranja-principal)'
    >
      <main>
        <Container classe='py-8 sm:py-10'>
          {visao === 'realidade' && (
            <VisaoRealidade
              realidade={dados.realidade}
              aoAlterar={(chave, valor) =>
                setDados(anterior => ({
                  ...anterior,
                  exemplo: false,
                  realidade: { ...anterior.realidade, [chave]: valor },
                }))
              }
              aoAbrirVisao={abrirVisao}
              aoVoltar={() => abrirVisao('hub')}
            />
          )}

          {visao === 'cenario' && (
            <VisaoCenario
              realidade={dados.realidade}
              aoAbrirVisao={abrirVisao}
              aoVoltar={() => abrirVisao('realidade')}
            />
          )}

          {visao === 'custos-iniciais' && (
            <VisaoCustosIniciais
              custos={dados.custosIniciais}
              guardado={dados.realidade.guardado}
              aoAlterar={(chave, valor) =>
                setDados(anterior => ({
                  ...anterior,
                  exemplo: false,
                  custosIniciais: { ...anterior.custosIniciais, [chave]: valor },
                }))
              }
              aoAbrirVisao={abrirVisao}
              aoVoltar={() => abrirVisao('hub')}
            />
          )}

          {visao === 'comparar-cenarios' && (
            <VisaoCompararCenarios
              realidade={dados.realidade}
              aoAplicarCenario={novoAluguel => {
                setDados(anterior => ({
                  ...anterior,
                  exemplo: false,
                  realidade: {
                    ...anterior.realidade,
                    aluguel: `${novoAluguel},00`,
                  },
                }));
                abrirVisao('cenario');
              }}
              aoAbrirVisao={abrirVisao}
              aoVoltar={() => abrirVisao('cenario')}
            />
          )}

          {visao === 'meta-economia' && (
            <VisaoMetaEconomia
              meta={dados.metaEconomia}
              aoAlterar={(chave, valor) =>
                setDados(anterior => ({
                  ...anterior,
                  exemplo: false,
                  metaEconomia: { ...anterior.metaEconomia, [chave]: valor },
                }))
              }
              aoSalvarMeta={(restante, meses) => {
                const novaMeta = {
                  id: `meta-mudanca-${Date.now()}`,
                  titulo: `Meta inicial da mudança (${formatarMoeda(restante, 0)})`,
                  atual: 0,
                  objetivo: Math.max(1, restante),
                  prazo: `${meses} meses`,
                  concluida: false,
                };
                const proximo = {
                  ...estadoPlataforma,
                  metasJornada: [novaMeta, ...(estadoPlataforma.metasJornada || [])],
                };
                salvarEstadoPlataforma(proximo);
                setEstadoPlataforma(proximo);
                setAviso('Meta salva na sua jornada!');
                abrirVisao('hub');
              }}
              aoVoltar={() => abrirVisao('custos-iniciais')}
            />
          )}

          {visao === 'custo-de-vida' && (
            <VisaoCustoDeVida
              aoAbrirVisao={abrirVisao}
              aoVoltar={() => abrirVisao('realidade')}
            />
          )}

          {visao === 'hub' && (
            <>
              <section className='grid items-center gap-8 pb-10 lg:grid-cols-[1.2fr_0.8fr]'>
                <div className='space-y-5'>
                  <p className='text-xs font-bold tracking-wider text-(--texto-apoio) uppercase'>
                    ANTES DAS CHAVES · SEU PLANO FINANCEIRO
                  </p>
                  <h1 className='font-titulo text-[clamp(2.5rem,5vw,4.25rem)] leading-[1.06] font-extrabold text-(--azul-titulo)'>
                    Sua mudança.
                    <span className='mt-2 inline-block -rotate-1 bg-(--laranja-principal) px-4 py-1 text-white'>
                      No seu plano.
                    </span>
                  </h1>
                  <p className='max-w-lg text-lg text-(--texto-apoio)'>
                    Planeje a chegada e as primeiras contas do seu novo canto.
                  </p>
                  <Botao
                    type='button'
                    cor='laranja'
                    classe='rounded-full px-8 min-h-[52px]'
                    onClick={() => abrirVisao('realidade')}
                  >
                    Começar tutorial <span className='ml-2'>→</span>
                  </Botao>
                </div>

                <div
                  aria-hidden='true'
                  className='relative mx-auto hidden h-[240px] w-[300px] sm:block'
                >
                  <div className='animar-pulsar absolute top-6 left-2 h-[96px] w-[184px] rotate-6 rounded-[10px] border border-white bg-[#f4f7fa] p-4 shadow-xs'>
                    <span className='font-titulo text-2xl font-extrabold text-(--azul-titulo)'>
                      R$
                    </span>
                    <span className='ml-3 text-[11px] font-bold text-(--azul-titulo)'>
                      SEU MÊS
                    </span>
                    <div className='mt-4 h-[2px] w-4/5 bg-[#9fb0bf]' />
                    <div className='mt-2 h-[2px] w-1/2 bg-[#9fb0bf]' />
                  </div>
                  <img
                    src={moedaGrande}
                    alt=''
                    className='animar-moeda absolute top-4 right-5 size-11'
                  />
                  <img
                    src={moedaMedia}
                    alt=''
                    className='animar-moeda absolute bottom-12 left-7 size-6 [animation-delay:0.25s]'
                  />
                  <img
                    src={moedaPequena}
                    alt=''
                    className='animar-moeda absolute bottom-10 left-15 size-4 [animation-delay:0.5s]'
                  />
                  <div className='absolute right-4 bottom-8 h-[102px] w-[196px] rounded-[12px] border-2 border-white bg-(--laranja-principal) shadow-sm'>
                    <div className='mt-8 h-[62px] rounded-[10px] border border-white bg-[#b64217]' />
                    <img
                      src={fechoCarteira}
                      alt=''
                      className='absolute right-2 bottom-4 h-7 w-14 object-contain'
                    />
                  </div>
                  <div className='absolute right-6 bottom-0 -rotate-3 bg-(--laranja-principal) px-4 py-1.5 shadow-xs'>
                    <span className='text-[11px] font-bold tracking-wider text-white uppercase'>
                      um respiro pro seu bolso ↗
                    </span>
                  </div>
                </div>
              </section>

              <section className='border-t border-[#e6edf2] py-10 text-center'>
                <p className='text-xs font-bold tracking-wider text-(--laranja-principal) uppercase'>
                  TRÊS PASSOS PRA SAIR DO ZERO
                </p>
                <Titulo classe='mt-2 text-2xl font-extrabold sm:text-3xl'>
                  Seu caminho para organizar melhor suas finanças.
                </Titulo>
                <p className='mt-2 text-sm text-(--texto-apoio) sm:text-base'>
                  Um passo a passo simples para aprender e aplicar no seu dia.
                </p>

                <div className='relative mx-auto mt-8 grid max-w-4xl gap-6 sm:grid-cols-3'>
                  <div
                    aria-hidden='true'
                    className='absolute top-7 right-[18%] left-[18%] hidden h-px bg-[#dbe5ed] sm:block'
                  />
                  {[
                    ['01', '1 · Entenda sua renda', 'realidade', true],
                    ['02', '2 · Separe os gastos', 'custos-iniciais', false],
                    ['03', '3 · Planeje a chegada', 'meta-economia', false],
                  ].map(([numero, rotulo, destino, destaque]) => (
                    <button
                      key={numero}
                      type='button'
                      onClick={() => abrirVisao(destino)}
                      className='relative z-10 flex flex-col items-center gap-3'
                    >
                      <span
                        className={
                          'font-titulo flex size-14 items-center justify-center rounded-full bg-white text-lg font-extrabold ' +
                          (destaque
                            ? 'border-2 border-(--laranja-principal) text-(--laranja-principal)'
                            : 'border border-[#9fb0bf] text-(--azul-titulo)')
                        }
                      >
                        {numero}
                      </span>
                      <span className='text-sm font-bold text-(--azul-titulo)'>
                        {rotulo}
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              <section className='space-y-6 border-t border-[#e6edf2] pt-8'>
                <div className='flex flex-col justify-between gap-4 lg:flex-row lg:items-center'>
                  <div>
                    <span className='text-xs font-bold tracking-wider text-(--laranja-principal) uppercase'>
                      SEU DINHEIRO EM PERSPECTIVA
                    </span>
                    <Titulo
                      como='h2'
                      classe='mt-1 text-3xl font-extrabold sm:text-4xl'
                    >
                      Minha mudança.
                    </Titulo>
                    <p className='mt-1 text-sm text-(--texto-apoio) sm:text-base'>
                      Veja o que já separou e os gastos previstos para começar.
                    </p>
                  </div>

                  <div className='flex flex-wrap items-center gap-3'>
                    <select
                      aria-label='Período de referência'
                      value={dados.periodo}
                      onChange={e =>
                        setDados(anterior => ({
                          ...anterior,
                          periodo: e.target.value,
                        }))
                      }
                      className='min-h-11 rounded-lg border border-[#dbe5ed] bg-white px-4 text-sm font-bold text-(--azul-titulo)'
                    >
                      <option value='Este mês'>Este mês</option>
                      <option value='Próximo mês'>Próximo mês</option>
                      <option value='Planejamento completo'>
                        Planejamento completo
                      </option>
                    </select>
                    <Botao
                      type='button'
                      cor='laranja'
                      classe='rounded-full px-6'
                      onClick={() => setAdicionando(atual => !atual)}
                    >
                      + Adicionar lançamento
                    </Botao>
                  </div>
                </div>

                {adicionando && (
                  <form
                    onSubmit={adicionarLancamento}
                    className='grid gap-4 rounded-xl border border-[#dbe5ed] bg-(--azul-fundo) p-5 sm:grid-cols-4 sm:items-end'
                  >
                    <CampoFormulario
                      id='mudanca-titulo'
                      rotulo='Descrição'
                      placeholder='Ex.: Compra do fogão'
                      value={tituloNovo}
                      onChange={e => setTituloNovo(e.target.value)}
                      classeEntrada='bg-white'
                      required
                    />
                    <CampoFormulario
                      id='mudanca-valor'
                      rotulo='Valor (R$)'
                      placeholder='350,00'
                      value={valorNovo}
                      onChange={e => setValorNovo(e.target.value)}
                      classeEntrada='bg-white'
                      required
                    />
                    <label className='flex flex-col gap-1.5 text-sm font-bold text-(--azul-titulo)'>
                      Tipo e categoria
                      <select
                        value={`${tipoNovo}:${categoriaNova}`}
                        onChange={e => {
                          const [t, c] = e.target.value.split(':');
                          setTipoNovo(t);
                          setCategoriaNova(c);
                        }}
                        className='min-h-12 rounded-lg border border-[#dbe5ed] bg-white px-3 text-sm font-normal'
                      >
                        <option value='entrada:moradia'>
                          Entrada · Reserva
                        </option>
                        <option value='saida:moradia'>
                          Gasto · Nova moradia
                        </option>
                        <option value='saida:casa'>
                          Gasto · Itens da casa
                        </option>
                        <option value='saida:transporte'>
                          Gasto · Transporte
                        </option>
                        <option value='saida:outros'>Gasto · Outros</option>
                      </select>
                    </label>
                    <div className='flex gap-2'>
                      <Botao type='submit' cor='laranja' classe='rounded-full px-6'>
                        Salvar
                      </Botao>
                      <Botao
                        type='button'
                        variante='secundario'
                        classe='rounded-full border border-[#dbe5ed] bg-white px-4'
                        onClick={() => setAdicionando(false)}
                      >
                        Cancelar
                      </Botao>
                    </div>
                  </form>
                )}

                <div className='flex flex-wrap items-center justify-between gap-4 border-b border-[#e6edf2]'>
                  <nav
                    aria-label='Abas do planejamento da mudança'
                    className='flex gap-6 overflow-x-auto'
                  >
                    {[
                      ['geral', 'Visão geral'],
                      ['lancamentos', 'Lançamentos'],
                      ['categorias', 'Categorias'],
                      ['metas', 'Metas'],
                    ].map(([chave, rotulo]) => (
                      <button
                        key={chave}
                        type='button'
                        onClick={() => setAba(chave)}
                        className={
                          'min-h-12 shrink-0 border-b-[3px] px-1 py-3 text-sm ' +
                          (aba === chave
                            ? 'border-(--laranja-principal) font-bold text-(--laranja-principal)'
                            : 'border-transparent text-(--texto-apoio) hover:text-(--laranja-principal)')
                        }
                      >
                        {rotulo}
                      </button>
                    ))}
                  </nav>

                  <span className='pb-2 text-xs text-(--texto-apoio)'>
                    {dados.exemplo
                      ? 'ⓘ Dados de exemplo'
                      : '✓ Salvo neste navegador'}
                  </span>
                </div>

                {aba === 'geral' && (
                  <>
                    <div className='grid gap-4 md:grid-cols-3'>
                      <div className='flex items-center gap-4 rounded-xl border border-[#dbe5ed] bg-white p-5'>
                        <span className='flex size-10 items-center justify-center rounded-full bg-[#e6f5ec] font-bold text-(--verde-sucesso)'>
                          +
                        </span>
                        <div>
                          <p className='text-xs text-(--texto-apoio)'>
                            Disponível
                          </p>
                          <p className='font-titulo text-2xl font-extrabold text-(--verde-sucesso)'>
                            {formatarMoeda(disponivel, 2)}
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center gap-4 rounded-xl border border-[#dbe5ed] bg-white p-5'>
                        <span className='flex size-10 items-center justify-center rounded-full bg-(--laranja-fundo) font-bold text-(--laranja-principal)'>
                          -
                        </span>
                        <div>
                          <p className='text-xs text-(--texto-apoio)'>
                            Planejado
                          </p>
                          <p className='font-titulo text-2xl font-extrabold text-[#b42318]'>
                            {formatarMoeda(planejado, 2)}
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center gap-4 rounded-xl border border-[#dbe5ed] bg-white p-5'>
                        <span className='flex size-10 items-center justify-center rounded-full bg-(--azul-fundo) font-bold text-(--azul-titulo)'>
                          =
                        </span>
                        <div>
                          <p className='text-xs text-(--texto-apoio)'>
                            Ainda livre
                          </p>
                          <p className='font-titulo text-2xl font-extrabold text-(--azul-titulo)'>
                            {formatarMoeda(aindaLivre, 2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className='grid gap-6 lg:grid-cols-2'>
                      <RoscaCategoriasMudanca lancamentos={dados.lancamentos} />

                      <section className='rounded-xl border border-[#d9e4ec] bg-white p-5 sm:p-6'>
                        <Titulo classe='text-xl font-extrabold'>
                          Últimos lançamentos
                        </Titulo>
                        <ul className='mt-4 divide-y divide-[#eef2f5]'>
                          {dados.lancamentos.slice(-5).map(item => (
                            <li
                              key={item.id}
                              className='flex items-center justify-between gap-4 py-3 text-sm'
                            >
                              <div className='flex items-center gap-3'>
                                <span
                                  className={
                                    'flex size-8 items-center justify-center rounded-full text-xs font-bold ' +
                                    (item.tipo === 'entrada'
                                      ? 'bg-[#e6f5ec] text-(--verde-sucesso)'
                                      : 'bg-(--laranja-fundo) text-(--laranja-principal)')
                                  }
                                >
                                  {item.tipo === 'entrada' ? '+' : '-'}
                                </span>
                                <strong className='font-bold text-(--azul-titulo)'>
                                  {item.titulo}
                                </strong>
                              </div>
                              <span className='text-xs text-(--texto-apoio)'>
                                {item.data}
                              </span>
                              <strong
                                className={
                                  'tabular-nums ' +
                                  (item.tipo === 'entrada'
                                    ? 'text-(--verde-sucesso)'
                                    : 'text-[#b42318]')
                                }
                              >
                                {item.tipo === 'entrada' ? '+ ' : '- '}
                                {formatarMoeda(item.valor, 2)}
                              </strong>
                            </li>
                          ))}
                        </ul>
                      </section>
                    </div>
                  </>
                )}

                {aba === 'lancamentos' && (
                  <section className='rounded-xl border border-[#d9e4ec] bg-white p-5 sm:p-6'>
                    {dados.lancamentos.length ? (
                      <ul className='divide-y divide-[#eef2f5]'>
                        {dados.lancamentos.map(item => (
                          <li
                            key={item.id}
                            className='flex flex-wrap items-center justify-between gap-4 py-3 text-sm'
                          >
                            <div>
                              <strong className='text-(--azul-titulo)'>
                                {item.titulo}
                              </strong>
                              <span className='ml-3 text-xs text-(--texto-apoio)'>
                                {item.data}
                              </span>
                            </div>
                            <div className='flex items-center gap-4'>
                              <strong
                                className={
                                  item.tipo === 'entrada'
                                    ? 'text-(--verde-sucesso)'
                                    : 'text-[#b42318]'
                                }
                              >
                                {item.tipo === 'entrada' ? '+ ' : '- '}
                                {formatarMoeda(item.valor, 2)}
                              </strong>
                              <button
                                type='button'
                                onClick={() => removerLancamento(item.id)}
                                className='min-h-11 text-xs font-bold text-(--texto-apoio) hover:text-[#b42318]'
                              >
                                Remover
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <EstadoVazio
                        titulo='Nenhum lançamento na mudança'
                        descricao='Adicione sua reserva inicial ou gastos previstos para acompanhar o plano.'
                        textoAcao='Adicionar lançamento'
                        aoClicar={() => setAdicionando(true)}
                      />
                    )}
                  </section>
                )}

                {aba === 'categorias' && (
                  <RoscaCategoriasMudanca lancamentos={dados.lancamentos} />
                )}

                {aba === 'metas' && (
                  <section className='space-y-4 rounded-xl border border-[#d9e4ec] bg-(--azul-fundo) p-5 sm:p-6'>
                    <div className='flex flex-wrap items-center justify-between gap-3'>
                      <Titulo classe='text-xl font-extrabold'>
                        Metas para a mudança
                      </Titulo>
                      <Botao
                        type='button'
                        cor='laranja'
                        classe='rounded-full px-6'
                        onClick={() => abrirVisao('meta-economia')}
                      >
                        Simular nova meta
                      </Botao>
                    </div>
                    <div className='space-y-3'>
                      {(estadoPlataforma.metasJornada || []).map(meta => (
                        <div
                          key={meta.id}
                          className='flex flex-wrap items-center justify-between gap-3 rounded-lg bg-white p-4'
                        >
                          <div>
                            <strong className='block text-sm font-bold text-(--azul-titulo)'>
                              {meta.titulo}
                            </strong>
                            <span className='text-xs text-(--texto-apoio)'>
                              Prazo: {meta.prazo}
                            </span>
                          </div>
                          <span className='text-sm font-bold text-(--laranja-principal)'>
                            {meta.atual} / {meta.objetivo}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                <AssistenteFinancas />
              </section>
            </>
          )}
        </Container>

        {visao === 'hub' && (
          <section className='mt-8 bg-(--laranja-principal) py-10 text-white sm:py-14'>
            <Container classe='flex flex-col items-start justify-between gap-7 lg:flex-row lg:items-center'>
              <div>
                <p className='text-xs font-bold tracking-[0.08em] uppercase'>
                  QUE TAL MONTAR SEU ORÇAMENTO?
                </p>
                <Titulo classe='mt-4 max-w-2xl text-3xl leading-tight font-extrabold text-white! sm:text-[clamp(2rem,3.5vw,3rem)]'>
                  Bora fazer seu dinheiro
                  <br className='hidden sm:block' /> render melhor?
                </Titulo>
                <p className='mt-4'>
                  Organize suas contas e descubra seus próximos passos.
                </p>
              </div>
              <div className='flex flex-wrap items-center gap-6'>
                <Botao
                  type='button'
                  cor='marinho'
                  classe='rounded-full px-8 min-h-[52px]'
                  onClick={() => abrirVisao('realidade')}
                >
                  Montar meu orçamento <span className='ml-3'>→</span>
                </Botao>
                <span className='relative inline-flex h-20 w-20 shrink-0 items-center justify-center'>
                  <IconeFinancas nome='MoedaEconomia' />
                  <strong className='font-titulo absolute -rotate-12 text-xl font-extrabold text-(--azul-titulo)'>
                    R$
                  </strong>
                </span>
              </div>
            </Container>
          </section>
        )}
      </main>
      <Rodape />
      {aviso && (
        <div
          role='status'
          className='fixed right-4 bottom-4 left-4 z-40 flex items-center justify-between gap-3 rounded-xl bg-(--azul-titulo) p-4 text-sm text-white shadow-lg sm:left-auto sm:max-w-md'
        >
          <span>{aviso}</span>
          <button
            type='button'
            onClick={() => setAviso('')}
            aria-label='Fechar aviso'
            className='size-11 shrink-0 text-xl'
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
