import { useDadosServidor } from '../../app/dados/contextoServidor';
import { salvarCusto, salvarPlano, salvarSituacaoFinanceira } from './planejamentoApi';
import { useState } from 'react';
import { House, Flag, List, Pencil, Plus, Wallet } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAvisoPerfilA } from '../../app/avisos/avisosPerfilA';
import { useBancoMvp } from '../../app/dados/bancoMvp';
import LayoutCasa from '../../app/layouts/casaLayout';
import { MenuLateralCasa } from '../../app/layouts/components/casaNavigation';
import { Container, Titulo } from '../../shared/ui';
import { EditorMvp } from '../../shared/ui/mvp';
import { BotaoCasa, CartaoCasa, DialogoCasa } from '../casa/components/casaUi';
import { listar, modelo } from '../preparacao/modelo';
import MeuPlano from './components/MeuPlano';
import EditorImovel from '../encontrar-casa/EditorImovel';
import MeuDinheiro from './components/MeuDinheiro';
import CustosIniciais from './components/CustosIniciais';
import MetasMudanca from './components/MetasMudanca';
import {
  alterarDinheiro,
  lerMeuDinheiro,
  resumirOrcamento,
  validarValor,
} from './dinheiroDados';
import {
  gravarPrevisaoMudanca,
  lerPrevisaoMudanca,
} from '../preparacao/previsaoMudanca';
import '../casa/casaA.css';
import {
  editarMoradia,
  planoDeReferencia,
  planoDoImovel,
} from './moradiaDados';
import './financasB.css';

const rota = '/financas-b';
const camposSituacaoFinanceira = [
  {
    nome: 'renda',
    rotulo: 'Renda líquida mensal (R$)',
    tipo: 'number',
    obrigatorio: false,
  },
  {
    nome: 'reserva',
    rotulo: 'Reserva atual (R$)',
    tipo: 'number',
    obrigatorio: false,
  },
  {
    nome: 'data',
    rotulo: 'Data prevista da mudança',
    tipo: 'date',
    obrigatorio: false,
  },
];

const secoes = [
  { rota, nome: 'Meu plano', Icone: House, visaoDireta: 'plano', links: [] },
  {
    rota,
    nome: 'Meu dinheiro',
    Icone: Wallet,
    visaoDireta: 'dinheiro',
    links: [],
  },
  {
    rota,
    nome: 'Custos previstos',
    Icone: List,
    visaoDireta: 'custos',
    links: [],
  },
  { rota, nome: 'Metas', Icone: Flag, visaoDireta: 'metas', links: [] },
];

export default function Planejamento() {
  const servidor = useDadosServidor();
  const { b, perfil } = useBancoMvp();
  const usuario = perfil?.user_id;
  const [params, setParams] = useSearchParams();
  const [editor, setEditor] = useState(null);
  const [adicionandoImovel, setAdicionandoImovel] = useState(false);
  const [editarSituacao, setEditarSituacao] = useState(false);
  const [excluir, setExcluir] = useState(false);
  const [erro, setErro] = useState('');
  const notificar = useAvisoPerfilA();
  const planos = listar(b, 'plano_moradia', usuario);
  const idPlano = Number(
    params.get('plano') ??
      (params.get('entidade') === 'plano_moradia' ? params.get('id') : null)
  );
  const visao = ['custos', 'dinheiro', 'metas'].includes(params.get('visao'))
    ? params.get('visao')
    : 'plano';
  const imoveis = listar(b, 'casa_desejada', usuario);
  const planoReferencia =
    planos.find(item => item.id === idPlano) ??
    (visao === 'custos' && !params.has('imovel')
      ? (planos.find(item => item.status === 'ativo') ?? planos[0])
      : undefined);
  const imovel =
    imoveis.find(item => item.id === Number(params.get('imovel'))) ??
    imoveis.find(
      item =>
        planoDoImovel(b, usuario, item.id)?.id === planoReferencia?.id &&
        planoReferencia != null
    ) ??
    imoveis[0];
  const visaoDinheiro = visao === 'dinheiro' || visao === 'metas';
  const usaImovel = visao === 'plano' || visaoDinheiro || params.has('imovel');
  const referenciaDoImovel = planoDeReferencia(b, usuario, imovel);
  const planoSelecionado = planos.find(
    item =>
      item.id === idPlano &&
      !imoveis.some(
        opcao =>
          opcao.id !== imovel?.id &&
          planoDoImovel(b, usuario, opcao.id)?.id === item.id
      )
  );
  const plano = usaImovel
    ? visaoDinheiro || visao === 'custos'
      ? (planoSelecionado ?? referenciaDoImovel)
      : referenciaDoImovel
    : (planos.find(item => item.id === idPlano) ??
      planos.find(item => item.status === 'ativo') ??
      planos[0]);
  const custos = plano ? listar(b, 'custo_moradia', usuario, plano.id) : [];
  const dadosDinheiro = lerMeuDinheiro(b, usuario);
  const planoMudanca = plano ?? planoSelecionado ?? referenciaDoImovel;
  const resumoDinheiro = resumirOrcamento(b, usuario, imovel, planoMudanca);
  const { renda, reserva } = resumoDinheiro;
  const dataMudanca = lerPrevisaoMudanca(b, usuario);
  const rotaMeuPlano = rota + (imovel ? '?imovel=' + imovel.id : '');
  const rotaCustosMeta =
    rota +
    '?' +
    new URLSearchParams({
      visao: 'custos',
      ...(planoMudanca && { plano: planoMudanca.id }),
      ...(imovel && plano === planoMudanca && { imovel: imovel.id }),
    });
  async function salvarSituacao(valores) {
    if (servidor) {
      await salvarSituacaoFinanceira({
        renda: valores.renda == null ? null : validarValor(valores.renda, 'a renda'),
        reserva: valores.reserva == null ? null : validarValor(valores.reserva, 'a reserva'),
        mudancaPrevista: valores.data || null,
      });
      await servidor.atualizar();
    } else alterarDinheiro(usuario, (registro, banco) => {
      registro.renda =
        valores.renda == null ? renda : validarValor(valores.renda, 'a renda');
      registro.reserva =
        valores.reserva == null
          ? reserva
          : validarValor(valores.reserva, 'a reserva');
      if (valores.data !== dataMudanca)
        gravarPrevisaoMudanca(banco, usuario, valores.data);
    });
    notificar('Dados financeiros atualizados.');
  }

  function abrirEditor(
    entidade,
    registro,
    pai,
    tipo,
    imovelId,
    categoria,
    grupo
  ) {
    setEditor({ entidade, registro, pai, tipo, imovelId, categoria, grupo });
    setExcluir(false);
    setErro('');
  }

  async function salvar(valores) {
    const { entidade, registro, pai, imovelId } = editor;
    let id;
    if (servidor) {
      if (entidade === 'plano_moradia') {
        id = await salvarPlano(registro?.id, valores, imovelId, registro?.status);
      } else {
        const idPlano = pai ?? await salvarPlano(null, {
          nome: imovel.titulo, renda_mensal: 0, reserva_atual: 0,
        }, imovelId);
        await salvarCusto(idPlano, registro?.id, valores);
      }
      await servidor.atualizar();
    } else id = editarMoradia(
      usuario,
      entidade,
      pai,
      registro,
      valores,
      imovelId
    );
    if (entidade === 'plano_moradia') {
      setParams(
        id
          ? { plano: id, visao, ...(imovelId && { imovel: imovelId }) }
          : { visao: 'plano', ...(imovelId && { imovel: imovelId }) }
      );
    } else if (entidade === 'custo_moradia' && imovelId && !pai) {
      setParams({ visao: 'custos', imovel: imovelId });
    }
    notificar(valores ? 'Alterações salvas.' : 'Registro excluído.');
  }

  const config = editor && modelo[editor.entidade];
  const adicionarInicial = grupo =>
    abrirEditor(
      'custo_moradia',
      null,
      plano?.id,
      'inicial',
      plano ? undefined : imovel?.id,
      grupo.categoria,
      grupo
    );

  const imovelDoPlano = plano
    ? b.vinculos_planos_imoveis?.find(
        item => item.plano_id === plano.id && item.user_id === usuario
      )?.imovel_id
    : imovel?.id;
  const escopoCustos = imovelDoPlano
    ? 'imovel:' + imovelDoPlano
    : 'plano:' + plano?.id;

  return (
    <LayoutCasa
      secao={visao === 'metas' ? visao + (params.get('meta') ?? '') : visao}
      navegacao={
        <MenuLateralCasa
          titulo='Finanças'
          IconeTitulo={Wallet}
          rotulo='Navegação de finanças'
          secoes={secoes}
          pathname={rota}
          visao={visao}
          parametros={{
            ...((plano ?? planoMudanca) && {
              plano: (plano ?? planoMudanca).id,
            }),
            ...((usaImovel || planoReferencia) &&
              imovel && { imovel: imovel.id }),
          }}
        />
      }
    >
      <main
        data-visao={visao}
        className='moradia-financas min-h-full min-w-0 bg-(--azul-fundo) font-corpo text-(--azul-titulo)'
      >
        <Container classe='casa-pagina-conteudo space-y-4'>
          <header className='flex flex-wrap items-center justify-between gap-3'>
            <div>
              <Titulo
                como='h1'
                classe='text-3xl leading-tight font-bold tracking-[-0.02em] sm:text-4xl'
              >
                {{
                  plano: 'Meu plano',
                  dinheiro: 'Meu dinheiro',
                  custos: 'Custos previstos',
                  metas: 'Metas',
                }[visao] ?? 'Planejamento de moradia'}
              </Titulo>
              <p className='mt-1 text-sm text-(--texto-apoio)'>
                {{
                  plano:
                    'Organize quanto você pretende gastar por mês em cada imóvel.',
                  dinheiro:
                    'Acompanhe seus gastos de hoje e veja como a mudança afeta seu saldo.',
                  custos: 'Organize os gastos de entrada para cada imóvel.',
                  metas:
                    'Escolha um valor ou use a estimativa da mudança para planejar quanto guardar.',
                }[visao] ?? 'Estime o custo de viver por conta própria.'}
              </p>
            </div>
            {visaoDinheiro && imoveis.length > 1 && (
              <label className='dinheiro-imovel'>
                Imóvel de referência
                <select
                  value={imovel?.id ?? ''}
                  onChange={evento =>
                    setParams(anteriores => {
                      const proximos = new URLSearchParams(anteriores);
                      proximos.set('imovel', evento.target.value);
                      return proximos;
                    })
                  }
                >
                  {imoveis.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.titulo}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {visao !== 'plano' && !usaImovel && (
              <BotaoCasa
                type='button'
                onClick={() => abrirEditor('plano_moradia')}
              >
                <Plus size={17} /> Novo plano
              </BotaoCasa>
            )}
          </header>

          {visao === 'dinheiro' ? (
            <MeuDinheiro
              usuario={usuario}
              dados={dadosDinheiro}
              resumo={resumoDinheiro}
              rotaPlano={rotaMeuPlano}
              editarSituacao={() => setEditarSituacao(true)}
            />
          ) : visao === 'metas' ? (
            <MetasMudanca
              usuario={usuario}
              dados={dadosDinheiro}
              resumo={resumoDinheiro}
              rotaPlano={rotaMeuPlano}
              rotaCustos={rotaCustosMeta}
              dataMudanca={dataMudanca}
            />
          ) : visao === 'plano' ? (
            <MeuPlano
              usuario={usuario}
              imoveis={imoveis}
              imovel={imovel}
              endereco={b.endereco.find(
                item => item.id === imovel?.endereco_id
              )}
              resumo={resumoDinheiro}
              custos={custos}
              plano={plano}
              selecionar={opcao => setParams({ imovel: opcao.id })}
              adicionarImovel={() => setAdicionandoImovel(true)}
              rotaDinheiro={
                rota +
                '?visao=dinheiro' +
                (imovel ? '&imovel=' + imovel.id : '')
              }
            />
          ) : !plano && !(visao === 'custos' && imovel) ? (
            <CartaoCasa titulo='Monte o orçamento do imóvel'>
              <p className='text-sm text-(--texto-apoio)'>
                Salve os primeiros gastos em Meu plano para continuar.
              </p>
              <Link
                className='moradia-link mt-2 inline-block'
                to={rota + (imovel ? '?imovel=' + imovel.id : '')}
              >
                Abrir Meu plano
              </Link>
            </CartaoCasa>
          ) : (
            <>
              {plano && (
                <div className='moradia-seletor'>
                  <label>
                    <span>Plano de moradia</span>
                    <select
                      value={plano.id}
                      onChange={evento =>
                        setParams({
                          visao,
                          plano: evento.target.value,
                          ...(usaImovel &&
                            imovel &&
                            evento.target.value === String(plano.id) && {
                              imovel: imovel.id,
                            }),
                        })
                      }
                    >
                      {planos.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.nome}
                        </option>
                      ))}
                    </select>
                  </label>
                  <BotaoCasa secundario como={Link} to={rotaMeuPlano}>
                    <Pencil size={15} aria-hidden='true' /> Editar plano
                  </BotaoCasa>
                </div>
              )}

              {visao === 'custos' && (
                <CustosIniciais
                  key={escopoCustos}
                  registros={custos}
                  banco={b}
                  usuario={usuario}
                  escopo={escopoCustos}
                  adicionar={adicionarInicial}
                  editar={(item, grupo) =>
                    abrirEditor(
                      'custo_moradia',
                      item,
                      plano.id,
                      'inicial',
                      undefined,
                      item.categoria,
                      grupo
                    )
                  }
                />
              )}
            </>
          )}
        </Container>

        {adicionandoImovel && (
          <EditorImovel
            usuario={usuario}
            aoFechar={() => setAdicionandoImovel(false)}
            aoSalvar={id => {
              setParams({ imovel: id });
              notificar('Imóvel adicionado.');
            }}
          />
        )}
        {editarSituacao && (
          <DialogoCasa
            titulo='Renda, reserva e mudança'
            aoFechar={() => setEditarSituacao(false)}
          >
            <p className='mb-4 text-sm text-(--texto-apoio)'>
              Estes dados são usados em Meu dinheiro, Meu plano e Metas.
            </p>
            <EditorMvp
              cabecalho={false}
              campos={camposSituacaoFinanceira}
              inicial={{ renda, reserva, data: dataMudanca }}
              onSave={salvarSituacao}
              onClose={() => setEditarSituacao(false)}
              rotuloSalvar='Salvar dados'
            />
          </DialogoCasa>
        )}
        {editor && (
          <DialogoCasa
            titulo={
              excluir
                ? 'Excluir ' + config.singular + '?'
                : (editor.registro ? 'Editar ' : 'Adicionar ') +
                  (editor.grupo ? 'gasto inicial' : config.singular)
            }
            classe={editor.grupo ? 'custos-entrada-modal' : ''}
            aoFechar={() => setEditor(null)}
          >
            {editor.grupo && !excluir && (
              <div className='custos-entrada-banner'>
                <img src={editor.grupo.foto} alt='' />
                <div>
                  <strong>{editor.grupo.titulo}</strong>
                  <p>Informe um valor estimado para este gasto único.</p>
                </div>
              </div>
            )}
            {excluir ? (
              <>
                <p className='text-sm text-(--texto-apoio)'>
                  {config.filhos?.length
                    ? 'O plano e os custos vinculados serão excluídos.'
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
                    onClick={async () => {
                      try {
                        await salvar(null);
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
                  (editor.entidade === 'plano_moradia'
                    ? {
                        nome: editor.imovelId ? imovel?.titulo : '',
                        renda_mensal: 0,
                        reserva_atual: 0,
                      }
                    : {
                        tipo: editor.tipo,
                        categoria: editor.categoria,
                        valor: 0,
                      })
                }
                campos={[
                  ...config.campos
                    .filter(
                      campo =>
                        !editor.grupo || ['nome', 'valor'].includes(campo.nome)
                    )
                    .map(campo => ({
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
                ]}
                onSave={valores =>
                  salvar(
                    editor.grupo
                      ? {
                          ...valores,
                          tipo: 'inicial',
                          categoria: editor.categoria,
                        }
                      : valores
                  )
                }
                onClose={() => setEditor(null)}
                rotuloSalvar={
                  editor.grupo
                    ? editor.registro
                      ? 'Salvar alterações'
                      : 'Salvar gasto'
                    : 'Salvar'
                }
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
