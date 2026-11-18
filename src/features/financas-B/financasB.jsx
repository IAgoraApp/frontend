import { useState } from 'react';
import {
  ChartNoAxesCombined,
  House,
  List,
  Pencil,
  Plus,
  Wallet,
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAvisoPerfilA } from '../../app/avisos/avisosPerfilA';
import { dataCurta, moeda, useBancoMvp } from '../../app/dados/bancoMvp';
import LayoutCasa from '../../app/layouts/casaLayout';
import { MenuLateralCasa } from '../../app/layouts/components/casaNavigation';
import { Container, Titulo } from '../../shared/ui';
import { EditorMvp } from '../../shared/ui/mvp';
import { BotaoCasa, CartaoCasa, DialogoCasa } from '../casa/components/casaUi';
import {
  estimarReserva,
  listar,
  modelo,
  resumoMoradia,
} from '../preparacao/modelo';
import { editarMoradia } from './moradiaDados';
import './financasB.css';

const rota = '/financas-b';
const secoes = [
  {
    rota,
    nome: 'Planejamento de moradia',
    Icone: House,
    inicial: 'plano',
    links: [
      ['plano', 'Meu plano', rota, House],
      ['custos', 'Custos previstos', rota, List],
      ['simulacoes', 'Simulações', rota, ChartNoAxesCombined],
    ],
  },
];

function Medida({ titulo, disponivel, previsto, saldo, periodo }) {
  const proporcao =
    Math.max(disponivel, previsto) > 0
      ? previsto / Math.max(disponivel, previsto)
      : 0;
  return (
    <div className='moradia-medida'>
      <dl>
        <dt>{titulo}</dt>
        <dd className={saldo < 0 ? 'text-(--vermelho-alerta)' : ''}>
          {saldo < 0 && <span>Faltam </span>}
          {moeda(Math.abs(saldo))}
        </dd>
      </dl>
      <div className='moradia-medida-trilho' aria-hidden='true'>
        <div
          data-deficit={saldo < 0}
          style={{ width: proporcao * 100 + '%' }}
        />
      </div>
      <p>
        {moeda(previsto)} em gastos {periodo} de {moeda(disponivel)} disponíveis
      </p>
    </div>
  );
}

function Balanco({ registro, custos, simulacao = false }) {
  const reserva = simulacao ? registro.reserva : registro.reserva_atual;
  const { mensal, inicial, saldoMensal, saldoInicial } = resumoMoradia(
    registro.renda_mensal,
    reserva,
    custos
  );
  const estimativa = estimarReserva(reserva, { mensal, inicial }, 3);
  return (
    <CartaoCasa
      titulo={
        simulacao
          ? 'Resultado da simulação'
          : 'Quanto preciso para morar sozinho?'
      }
    >
      <div className='moradia-balanco'>
        <Medida
          titulo='Saldo mensal previsto'
          disponivel={registro.renda_mensal}
          previsto={mensal}
          saldo={saldoMensal}
          periodo='mensais'
        />
        <Medida
          titulo='Reserva após a mudança'
          disponivel={reserva}
          previsto={inicial}
          saldo={saldoInicial}
          periodo='iniciais'
        />
      </div>
      {custos.length > 0 && (
        <div className='mt-4 rounded-lg bg-(--azul-fundo) p-4'>
          <h3 className='font-bold'>Reserva para um cenário de 3 meses</h3>
          <p>Gastos iniciais mais três meses de gastos mensais registrados.</p>
          <p className='mt-1'>
            Estimativa de {moeda(estimativa.alvo)}.{' '}
            {estimativa.falta
              ? 'Faltam ' + moeda(estimativa.falta) + ' na reserva.'
              : 'A reserva informada cobre este cenário.'}
          </p>
        </div>
      )}
    </CartaoCasa>
  );
}

function Custos({ registros, adicionar, editar }) {
  return (
    <div className='grid gap-4 lg:grid-cols-2'>
      {[
        ['mensal', 'Gastos mensais', 'Aluguel, contas e outros gastos do mês.'],
        [
          'inicial',
          'Gastos iniciais',
          'Caução, móveis e outros gastos da mudança.',
        ],
      ].map(([tipo, titulo, descricao]) => {
        const itens = registros.filter(registro => registro.tipo === tipo);
        return (
          <CartaoCasa
            key={tipo}
            titulo={titulo}
            acao={
              <BotaoCasa
                secundario
                type='button'
                onClick={() => adicionar(tipo)}
              >
                <Plus size={16} /> Adicionar
              </BotaoCasa>
            }
          >
            <p className='mb-3 text-sm text-(--texto-apoio)'>{descricao}</p>
            {itens.length ? (
              <>
                <ul className='divide-y divide-(--borda-suave)'>
                  {itens.map(item => (
                    <li key={item.id}>
                      <button
                        type='button'
                        className='moradia-linha'
                        onClick={() => editar(item)}
                        aria-label={'Editar ' + item.nome}
                      >
                        <span>
                          <strong>{item.nome}</strong>
                          <small>{item.categoria}</small>
                        </span>
                        <strong className='tabular-nums'>
                          {moeda(item.valor)}
                        </strong>
                        <Pencil size={15} aria-hidden='true' />
                      </button>
                    </li>
                  ))}
                </ul>
                <p className='mt-2 flex justify-between gap-2 border-t border-(--borda-suave) pt-3 text-sm font-bold'>
                  <span>Total</span>
                  <span>
                    {moeda(
                      itens.reduce(
                        (total, item) => total + Number(item.valor),
                        0
                      )
                    )}
                  </span>
                </p>
              </>
            ) : (
              <p className='rounded-xl bg-(--azul-fundo) p-3 text-sm'>
                Nenhum gasto adicionado.
              </p>
            )}
          </CartaoCasa>
        );
      })}
    </div>
  );
}

function Comparacao({ plano, custos, simulacoes, itens, abrir }) {
  const cenarios = [
    [
      plano,
      resumoMoradia(plano.renda_mensal, plano.reserva_atual, custos),
      true,
    ],
    ...simulacoes.map(item => [
      item,
      resumoMoradia(
        item.renda_mensal,
        item.reserva,
        itens.filter(custo => custo.simulacao_id === item.id)
      ),
      false,
    ]),
  ];
  return (
    <CartaoCasa titulo='Comparar cenários'>
      <div className='overflow-x-auto'>
        <table className='moradia-tabela'>
          <thead>
            <tr>
              <th scope='col'>Cenário</th>
              <th scope='col'>Gastos mensais</th>
              <th scope='col'>Saldo mensal</th>
              <th scope='col'>Gastos iniciais</th>
              <th scope='col'>Saldo da reserva</th>
            </tr>
          </thead>
          <tbody>
            {cenarios.map(([item, resumo, base]) => (
              <tr key={(base ? 'plano-' : 'simulacao-') + item.id}>
                <th scope='row'>
                  {base ? (
                    'Plano de moradia'
                  ) : (
                    <Link to={abrir(item.id)}>{item.nome}</Link>
                  )}
                </th>
                {[
                  resumo.mensal,
                  resumo.saldoMensal,
                  resumo.inicial,
                  resumo.saldoInicial,
                ].map((valor, indice) => (
                  <td
                    key={indice}
                    className={valor < 0 ? 'text-(--vermelho-alerta)' : ''}
                  >
                    {moeda(valor)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CartaoCasa>
  );
}

export default function Planejamento() {
  const { b, perfil } = useBancoMvp();
  const usuario = perfil?.user_id;
  const [params, setParams] = useSearchParams();
  const [editor, setEditor] = useState(null);
  const [excluir, setExcluir] = useState(false);
  const [erro, setErro] = useState('');
  const notificar = useAvisoPerfilA();
  const planos = listar(b, 'plano_moradia', usuario);
  const idPlano = Number(
    params.get('plano') ??
      (params.get('entidade') === 'plano_moradia' ? params.get('id') : null)
  );
  const plano =
    planos.find(item => item.id === idPlano) ??
    planos.find(item => item.status === 'ativo') ??
    planos[0];
  const visao = ['custos', 'simulacoes'].includes(params.get('visao'))
    ? params.get('visao')
    : 'plano';
  const custos = plano ? listar(b, 'custo_moradia', usuario, plano.id) : [];
  const simulacoes = plano
    ? listar(b, 'simulacao_moradia', usuario, plano.id)
    : [];
  const simulacao = simulacoes.find(
    item => item.id === Number(params.get('simulacao'))
  );
  const itens = simulacao
    ? listar(b, 'simulacao_item', usuario, simulacao.id)
    : [];
  const abrirSimulacao = id =>
    rota +
    '?' +
    new URLSearchParams({
      visao: 'simulacoes',
      plano: plano.id,
      ...(id && { simulacao: id }),
    });

  function abrirEditor(entidade, registro, pai, tipo) {
    setEditor({ entidade, registro, pai, tipo });
    setExcluir(false);
    setErro('');
  }

  function salvar(valores, copiar) {
    const { entidade, registro, pai } = editor;
    const id = editarMoradia(usuario, entidade, pai, registro, valores, copiar);
    if (entidade === 'plano_moradia') {
      setParams(id ? { plano: id, visao } : { visao: 'plano' });
    } else if (entidade === 'simulacao_moradia') {
      setParams({
        visao: 'simulacoes',
        plano: plano.id,
        ...(id && { simulacao: id }),
      });
    }
    notificar(valores ? 'Alterações salvas.' : 'Registro excluído.');
  }

  const config = editor && modelo[editor.entidade];
  const novaSimulacao =
    editor?.entidade === 'simulacao_moradia' && !editor.registro;
  const novoCusto = tipo =>
    abrirEditor(
      simulacao && visao === 'simulacoes' ? 'simulacao_item' : 'custo_moradia',
      null,
      simulacao && visao === 'simulacoes' ? simulacao.id : plano.id,
      tipo
    );

  return (
    <LayoutCasa
      secao={visao}
      navegacao={
        <MenuLateralCasa
          titulo='Finanças'
          IconeTitulo={Wallet}
          rotulo='Navegação de finanças'
          secoes={secoes}
          pathname={rota}
          visao={visao}
          parametros={plano && { plano: plano.id }}
        />
      }
    >
      <main className='moradia-financas min-h-full min-w-0 bg-(--azul-fundo) font-corpo text-(--azul-titulo)'>
        <Container classe='casa-pagina-conteudo space-y-4'>
          <header className='flex flex-wrap items-center justify-between gap-3'>
            <div>
              <Titulo
                como='h1'
                classe='text-3xl leading-tight font-bold tracking-[-0.02em] sm:text-4xl'
              >
                Planejamento de moradia
              </Titulo>
              <p className='mt-1 text-sm text-(--texto-apoio)'>
                Estime o custo de viver por conta própria e compare cenários
                para a mudança.
              </p>
              <p className='mt-1 text-xs text-(--texto-apoio)'>
                Os planos desta prévia ficam salvos neste navegador.
              </p>
            </div>
            <BotaoCasa
              type='button'
              onClick={() => abrirEditor('plano_moradia')}
            >
              <Plus size={17} /> Novo plano
            </BotaoCasa>
          </header>

          {!plano ? (
            <CartaoCasa titulo='Crie seu primeiro plano'>
              <p className='text-sm text-(--texto-apoio)'>
                Comece pela sua renda e reserva. Depois, adicione os gastos do
                mês e da mudança.
              </p>
            </CartaoCasa>
          ) : (
            <>
              <div className='moradia-seletor'>
                <label>
                  <span>Plano de moradia</span>
                  <select
                    value={plano.id}
                    onChange={evento =>
                      setParams({ visao, plano: evento.target.value })
                    }
                  >
                    {planos.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.nome}
                      </option>
                    ))}
                  </select>
                </label>
                <div className='flex flex-wrap items-center gap-2'>
                  <span className='moradia-status'>
                    {modelo.plano_moradia.status[plano.status]}
                  </span>
                  <BotaoCasa
                    secundario
                    type='button'
                    onClick={() => abrirEditor('plano_moradia', plano)}
                  >
                    <Pencil size={15} /> Editar plano
                  </BotaoCasa>
                </div>
              </div>

              {visao === 'plano' && (
                <>
                  <Balanco registro={plano} custos={custos} />
                  <CartaoCasa titulo='Dados do plano'>
                    <dl className='grid gap-4 sm:grid-cols-3'>
                      {[
                        ['Renda mensal', moeda(plano.renda_mensal)],
                        ['Reserva atual', moeda(plano.reserva_atual)],
                        [
                          'Mudança prevista',
                          plano.mudanca_prevista
                            ? dataCurta(plano.mudanca_prevista)
                            : 'Sem data',
                        ],
                      ].map(([titulo, valor]) => (
                        <div key={titulo}>
                          <dt className='text-sm text-(--texto-apoio)'>
                            {titulo}
                          </dt>
                          <dd className='font-bold'>{valor}</dd>
                        </div>
                      ))}
                    </dl>
                    <div className='mt-5 flex flex-wrap gap-4 text-sm font-bold'>
                      <Link
                        className='moradia-link'
                        to={'?visao=custos&plano=' + plano.id}
                      >
                        Ver custos previstos
                      </Link>
                      <Link className='moradia-link' to={abrirSimulacao()}>
                        Ver simulações
                      </Link>
                    </div>
                  </CartaoCasa>
                </>
              )}

              {visao === 'custos' && (
                <Custos
                  registros={custos}
                  adicionar={novoCusto}
                  editar={item => abrirEditor('custo_moradia', item, plano.id)}
                />
              )}

              {visao === 'simulacoes' && (
                <>
                  <CartaoCasa
                    titulo='Simulações'
                    acao={
                      <BotaoCasa
                        type='button'
                        onClick={() =>
                          abrirEditor('simulacao_moradia', null, plano.id)
                        }
                      >
                        <Plus size={17} /> Nova simulação
                      </BotaoCasa>
                    }
                  >
                    {simulacoes.length ? (
                      <nav
                        aria-label='Cenários do plano'
                        className='flex flex-wrap gap-2'
                      >
                        {simulacoes.map(item => (
                          <Link
                            className='moradia-cenario'
                            key={item.id}
                            to={abrirSimulacao(item.id)}
                            aria-current={
                              simulacao?.id === item.id ? 'page' : undefined
                            }
                          >
                            {item.nome}
                          </Link>
                        ))}
                      </nav>
                    ) : (
                      <p className='text-sm text-(--texto-apoio)'>
                        Crie um cenário para testar outra renda, reserva ou
                        combinação de gastos.
                      </p>
                    )}
                  </CartaoCasa>
                  {simulacao && (
                    <>
                      <CartaoCasa
                        titulo={simulacao.nome}
                        acao={
                          <BotaoCasa
                            secundario
                            type='button'
                            onClick={() =>
                              abrirEditor(
                                'simulacao_moradia',
                                simulacao,
                                plano.id
                              )
                            }
                          >
                            <Pencil size={15} /> Editar simulação
                          </BotaoCasa>
                        }
                      >
                        <p className='text-sm text-(--texto-apoio)'>
                          Renda mensal de {moeda(simulacao.renda_mensal)} e
                          reserva de {moeda(simulacao.reserva)}.
                        </p>
                      </CartaoCasa>
                      <Balanco registro={simulacao} custos={itens} simulacao />
                      <Custos
                        registros={itens}
                        adicionar={novoCusto}
                        editar={item =>
                          abrirEditor('simulacao_item', item, simulacao.id)
                        }
                      />
                    </>
                  )}
                  {simulacoes.length > 0 && (
                    <Comparacao
                      plano={plano}
                      custos={custos}
                      simulacoes={simulacoes}
                      itens={b.simulacao_item}
                      abrir={abrirSimulacao}
                    />
                  )}
                </>
              )}
            </>
          )}
        </Container>

        {editor && (
          <DialogoCasa
            titulo={
              excluir
                ? 'Excluir ' + config.singular + '?'
                : (editor.registro ? 'Editar ' : 'Adicionar ') + config.singular
            }
            aoFechar={() => setEditor(null)}
          >
            {excluir ? (
              <>
                <p className='text-sm text-(--texto-apoio)'>
                  {config.filhos?.length
                    ? 'O registro e os custos ou simulações vinculados serão excluídos.'
                    : 'O gasto será removido dos valores previstos.'}
                </p>
                {erro && (
                  <p
                    role='alert'
                    className='mt-2 text-sm text-(--vermelho-alerta)'
                  >
                    {erro}
                  </p>
                )}
                <div className='mt-5 flex flex-wrap justify-end gap-2'>
                  <BotaoCasa
                    secundario
                    type='button'
                    onClick={() => setExcluir(false)}
                  >
                    Cancelar
                  </BotaoCasa>
                  <BotaoCasa
                    type='button'
                    onClick={() => {
                      try {
                        salvar(null);
                        setEditor(null);
                      } catch (falha) {
                        setErro(falha.message);
                      }
                    }}
                  >
                    Excluir {config.singular}
                  </BotaoCasa>
                </div>
              </>
            ) : (
              <EditorMvp
                cabecalho={false}
                inicial={
                  editor.registro ??
                  (novaSimulacao
                    ? {
                        renda_mensal: plano.renda_mensal,
                        reserva: plano.reserva_atual,
                      }
                    : editor.entidade === 'plano_moradia'
                      ? { renda_mensal: 0, reserva_atual: 0 }
                      : { tipo: editor.tipo, valor: 0 })
                }
                campos={[
                  ...config.campos.map(campo => ({
                    ...campo,
                    limite: campo.maxLength,
                    obrigatorio: !campo.opcional,
                    opcoes: campo.opcoes && Object.entries(campo.opcoes),
                  })),
                  ...(editor.entidade === 'plano_moradia' && editor.registro
                    ? [
                        {
                          nome: 'status',
                          rotulo: 'Situação',
                          opcoes: Object.entries(config.status),
                        },
                      ]
                    : []),
                  ...(novaSimulacao && custos.length
                    ? [
                        {
                          nome: 'copiarCustos',
                          rotulo: 'Despesas do cenário',
                          opcoes: [
                            ['sim', 'Copiar custos do plano'],
                            ['nao', 'Começar sem custos'],
                          ],
                          obrigatorio: false,
                        },
                      ]
                    : []),
                ]}
                onSave={({ copiarCustos, ...valores }) =>
                  salvar(valores, copiarCustos === 'sim')
                }
                onClose={() => setEditor(null)}
                rotuloSalvar='Salvar'
                acaoSecundaria={
                  editor.registro && (
                    <button
                      className='mr-auto text-(--vermelho-alerta)'
                      type='button'
                      onClick={() => setExcluir(true)}
                    >
                      Excluir {config.singular}
                    </button>
                  )
                }
              />
            )}
          </DialogoCasa>
        )}
      </main>
    </LayoutCasa>
  );
}
