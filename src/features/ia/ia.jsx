import { useAvisoPerfilA } from '../../app/avisos/avisosPerfilA';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowUp,
  Check,
  ChevronDown,
  Copy,
  House,
  Flag,
  ListChecks,
  MessageCircle,
  PanelLeft,
  Plus,
  Sparkles,
  Store,
  ShoppingBasket,
  SprayCan,
  Wallet,
  X,
  Trash2,
  Truck,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useBancoMvp } from '../../app/dados/bancoMvp';
import BotaoMenuLateral from '../../app/layouts/components/botaoMenuLateral';
import useMenuLateral from '../../app/layouts/components/useMenuLateral';
import { useRotinaBanco } from '../rotina/hooks/useRotinaBanco';
import { areasCriacao, criarRegistro } from './criarRegistros';
import { areasPreparacao, criarRegistroPreparacao } from './criarPreparacao';
import './ia.css';

const sugestoes = [
  {
    Icone: Truck,
    titulo: 'Minha primeira mudança',
    texto: 'Por onde começar a planejar minha mudança?',
  },
  {
    Icone: House,
    titulo: 'Cuidar do meu canto',
    texto: 'Como organizar os cuidados com a casa?',
  },
  {
    Icone: ListChecks,
    titulo: 'Uma rotina mais leve',
    texto: 'Como montar uma rotina para a semana?',
  },
  {
    Icone: Store,
    titulo: 'Meu negócio por aqui',
    texto: 'Como apresentar meus serviços no IAgora?',
  },
];

function responder(texto, preparacao) {
  const pergunta = texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  if (
    preparacao &&
    /financ|dinheiro|orcamento|reserva|gasto|simul|custo/.test(pergunta)
  )
    return 'Abra Finanças e informe a renda, a reserva e a data da mudança. Em Custos previstos, separe os gastos iniciais dos mensais. Em Meu dinheiro, compare o saldo atual com o previsto após a mudança. Em Metas, você pode usar os custos do imóvel para calcular quanto guardar por mês ou por dia.';
  if (preparacao && /servic|empre|frete|montagem/.test(pergunta))
    return 'Em Empresas e Serviços, pesquise pelo serviço que precisa e confira onde o prestador atende. Para pedir orçamento de mudança, informe origem, destino, data, volume e se vai precisar de desmontagem ou montagem.';
  if (/receita/.test(pergunta))
    return 'Para montar uma receita, me diga quais ingredientes você tem e para quantas pessoas quer cozinhar. Na Cozinha, use Nova receita para guardar os ingredientes, as quantidades e o modo de preparo.';
  if (/atividades de limpeza/.test(pergunta))
    return 'Comece com tarefas pequenas por cômodo:\n\n• Cozinha: limpe bancada e fogão após o uso.\n• Banheiro: lave pia, vaso e box semanalmente.\n• Quarto: troque a roupa de cama uma vez por semana.\n\nEm Limpeza, abra o cômodo e use Adicionar tarefa para registrar os cuidados e escolher a próxima data.';
  if (/servic|negocio|empresa|cliente|anuncio/.test(pergunta))
    return 'Para apresentar seus serviços no IAgora:\n\n1. Complete o perfil da empresa com sua área de atuação e região atendida.\n2. Crie um anúncio com uma descrição clara do que está incluído no serviço.\n3. Adicione fotos que mostrem seu trabalho e revise os dados de contato.\n\nVocê pode acompanhar seus anúncios e os contatos pelo painel da empresa.';
  if (/mudan|morar|alug|apartamento/.test(pergunta))
    return 'Uma mudança fica mais simples quando você separa o que precisa decidir do que precisa fazer. Comece assim:\n\n1. Liste o que importa no novo lugar: localização, espaço e acesso ao transporte.\n2. Anote os custos da mudança e as despesas que vão se repetir todo mês.\n3. Faça uma lista do essencial para os primeiros dias, antes de comprar o restante.\n4. Organize documentos, caixas e transporte em um checklist.\n\nA Minha jornada reúne as etapas da preparação para morar sozinho.';
  if (/rotina|semana|tempo|tarefa/.test(pergunta))
    return 'Experimente começar com uma semana possível:\n\n1. Anote seus compromissos com horário fixo.\n2. Escolha até três prioridades por dia.\n3. Distribua as tarefas da casa em blocos curtos.\n4. Reserve espaço para descanso e imprevistos.\n\nNa página Rotina, você pode cadastrar tarefas e acompanhar a agenda. Ajuste a frequência conforme perceber o que funciona para você.';
  if (/casa|limp|cozinha|comida|refeicao/.test(pergunta))
    return 'Para cuidar do seu canto sem acumular tudo para um dia:\n\n• No dia a dia, cuide da louça e das superfícies que você usou.\n• Durante a semana, distribua roupa, banheiro e limpeza do chão conforme a necessidade.\n• Antes das compras, confira o que já tem e planeje algumas refeições.\n\nNa área Casa, você encontra os espaços de Limpeza e Cozinha para organizar esses cuidados.';
  if (/financ|dinheiro|orcamento|gasto|conta/.test(pergunta))
    return 'Posso mostrar como organizar seus registros no IAgora:\n\n1. Registre entradas e saídas na área de finanças.\n2. Separe os lançamentos por categoria.\n3. Cadastre vencimentos e acompanhe suas metas.\n\nAssim, você reúne as informações para revisar seu planejamento. Esta demonstração não analisa seus dados financeiros.';
  return 'Esta é uma demonstração com respostas prontas sobre o IAgora. Posso orientar sobre mudança, cuidados com a casa, rotina, finanças e divulgação de serviços.\n\nExperimente perguntar “Como montar uma rotina para a semana?” ou escolha um dos assuntos sugeridos em uma nova conversa.';
}

const iconesCriacao = {
  rotina: ListChecks,
  limpeza: SprayCan,
  financas: Wallet,
  compras: ShoppingBasket,
  jornada: ListChecks,
  imoveis: House,
  dinheiro: Wallet,
  metas: Flag,
};

const conversasDaSessao = { itens: [], ativa: null };
const conversasPreparacao = { itens: [], ativa: null };

export default function InteligenciaArtificial() {
  const { pathname, state } = useLocation();
  return <ConversaIA key={pathname} pathname={pathname} state={state} />;
}

function ConversaIA({ pathname, state }) {
  const rascunho = state?.rascunho;
  const preparacao = pathname === '/ia-b';
  const aceitaCriacao = pathname === '/ia' || preparacao;
  const areasDisponiveis = preparacao ? areasPreparacao : areasCriacao;
  const sessao = preparacao ? conversasPreparacao : conversasDaSessao;
  const dados = useBancoMvp();
  const { despachar } = useRotinaBanco();
  const notificar = useAvisoPerfilA();
  const textoInicial =
    typeof rascunho === 'string' ? rascunho.slice(0, 2000) : '';
  const [conversas, setConversas] = useState(() => sessao.itens);
  const [ativa, setAtiva] = useState(() =>
    textoInicial ? null : sessao.ativa
  );
  const [texto, setTexto] = useState(textoInicial);
  const [area, setArea] = useState(() =>
    aceitaCriacao && Object.hasOwn(areasDisponiveis, state?.area)
      ? state.area
      : null
  );
  const [pedidoPendente, setPedidoPendente] = useState('');
  const seletor = useRef(null);
  const areaAtiva = area && areasDisponiveis[area];
  const IconeArea = area && iconesCriacao[area];
  const [historicoAberto, setHistoricoAberto] = useState(false);
  const {
    automatico,
    recolhido: menuRecolhido,
    setRecolhidoManual,
    interacoes,
  } = useMenuLateral();
  const [copiada, setCopiada] = useState(null);
  const [erro, setErro] = useState('');
  const campo = useRef(null);
  const fim = useRef(null);
  const conversa = conversas.find(item => item.id === ativa);
  const mensagens = conversa?.mensagens ?? [];

  useEffect(() => {
    sessao.itens = conversas;
    sessao.ativa = ativa;
  }, [conversas, ativa, sessao]);

  useEffect(() => {
    fim.current?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  }, [conversas, ativa]);

  function escolherArea(proxima) {
    if (proxima !== area) setPedidoPendente('');
    setArea(proxima);
    if (seletor.current) seletor.current.open = false;
    campo.current?.focus();
  }

  function novaConversa() {
    setAtiva(null);
    setTexto('');
    escolherArea(null);
    setErro('');
    setHistoricoAberto(false);
    campo.current?.focus();
  }

  function enviar(pergunta = texto, contexto = area) {
    const conteudo = pergunta.trim();
    if (!conteudo) return;
    if (seletor.current) seletor.current.open = false;
    const id = ativa ?? crypto.randomUUID();
    let resposta;
    if (aceitaCriacao && Object.hasOwn(areasDisponiveis, contexto)) {
      const pedido = pedidoPendente
        ? pedidoPendente + '\n' + conteudo
        : conteudo;
      try {
        resposta = preparacao
          ? criarRegistroPreparacao(contexto, pedido, dados)
          : criarRegistro(contexto, pedido, dados, despachar);
        if (resposta.pendente) setPedidoPendente(pedido.slice(0, 4000));
        else escolherArea(null);
      } catch (falha) {
        resposta = {
          texto:
            falha.message ||
            'Não foi possível criar o registro. Tente novamente.',
        };
      }
    } else {
      resposta = { texto: responder(conteudo, preparacao) };
    }
    const novasMensagens = [
      {
        id: crypto.randomUUID(),
        papel: 'usuario',
        texto: conteudo,
        area: contexto,
      },
      { id: crypto.randomUUID(), papel: 'assistente', ...resposta },
    ];
    setConversas(anteriores =>
      ativa
        ? anteriores.map(item =>
            item.id === ativa
              ? { ...item, mensagens: [...item.mensagens, ...novasMensagens] }
              : item
          )
        : [
            { id, titulo: conteudo.slice(0, 70), mensagens: novasMensagens },
            ...anteriores,
          ]
    );
    setAtiva(id);
    setTexto('');
    setErro('');
    campo.current?.focus();
  }

  async function copiar(mensagem) {
    try {
      await navigator.clipboard.writeText(mensagem.texto);
      if (pathname === '/ia') notificar('Resposta copiada.');
      else setCopiada(mensagem.id);
      setErro('');
    } catch {
      setErro(
        'Não foi possível copiar. Selecione o texto da resposta e copie manualmente.'
      );
    }
  }

  return (
    <main
      className={aceitaCriacao ? 'ia-pagina layout-menu-lateral' : 'ia-pagina'}
      data-menu-recolhido={aceitaCriacao ? menuRecolhido : undefined}
    >
      <div className='ia-barra-mobile'>
        <button
          type='button'
          onClick={() => {
            setHistoricoAberto(!historicoAberto);
            setRecolhidoManual(false);
          }}
          aria-expanded={historicoAberto}
          aria-controls='ia-historico'
        >
          <PanelLeft size={18} /> Conversas
        </button>
        <button type='button' onClick={novaConversa}>
          <Plus size={18} /> Nova conversa
        </button>
      </div>
      <aside
        id='ia-historico'
        className={`ia-historico ${historicoAberto ? 'ia-historico-aberto' : ''}`}
        aria-label='Histórico de conversas'
        {...(aceitaCriacao ? interacoes : {})}
      >
        <div className='ia-menu-topo'>
          <div className='ia-marca menu-lateral-rotulo'>
            <span className='ia-simbolo'>
              <Sparkles size={22} />
            </span>
            <div>
              <h1>IAgora IA</h1>
              <p>Um passo de cada vez.</p>
            </div>
          </div>
          {aceitaCriacao && !automatico && (
            <BotaoMenuLateral
              expandido={!menuRecolhido}
              aoAlternar={() => setRecolhidoManual(valor => !valor)}
              controla='ia-conversas'
            />
          )}
        </div>
        <button
          className='ia-nova'
          type='button'
          onClick={novaConversa}
          aria-label='Nova conversa'
          title={menuRecolhido ? 'Nova conversa' : undefined}
        >
          <Plus size={18} aria-hidden='true' />
          <span className='menu-lateral-rotulo'>Nova conversa</span>
        </button>
        <div
          className='ia-conversas menu-lateral-detalhe'
          id='ia-conversas'
          inert={aceitaCriacao && menuRecolhido}
        >
          <h2>Suas conversas</h2>
          <div className='ia-lista'>
            {!conversas.length && (
              <p className='ia-sem-historico'>
                Sua primeira conversa começa ao lado. Vamos pensar juntos?
              </p>
            )}
            {conversas.map(item => (
              <div
                className={`ia-conversa-item ${ativa === item.id ? 'ia-conversa-ativa' : ''}`}
                key={item.id}
              >
                <button
                  type='button'
                  aria-current={ativa === item.id ? 'true' : undefined}
                  onClick={() => {
                    setAtiva(item.id);
                    setTexto('');
                    escolherArea(null);
                    setHistoricoAberto(false);
                  }}
                >
                  <MessageCircle size={16} />
                  <span>{item.titulo}</span>
                </button>
                <button
                  type='button'
                  className='ia-excluir'
                  aria-label={`Excluir conversa: ${item.titulo}`}
                  onClick={() => {
                    setConversas(anteriores =>
                      anteriores.filter(c => c.id !== item.id)
                    );
                    if (ativa === item.id) novaConversa();
                  }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
          <p className='ia-nota-historico'>
            As conversas ficam disponíveis enquanto esta página estiver aberta
            no navegador.
          </p>
        </div>
      </aside>
      <section className='ia-espaco' aria-label='Chat com IAgora IA'>
        <header className='ia-topo'>
          <span>
            <Sparkles size={17} /> Seu assistente do dia a dia
          </span>
          <span className='ia-demo'>Demonstração</span>
        </header>
        <div className='ia-conteudo'>
          {!mensagens.length ? (
            <div className='ia-boas-vindas'>
              <div className='ia-emblema' aria-hidden='true'>
                <Sparkles size={34} strokeWidth={1.6} />
              </div>
              <h2>Uma mão para o seu próximo passo.</h2>
              <p>
                Da primeira mudança à rotina do seu canto. O que vamos organizar
                hoje?
              </p>
              <div className='ia-sugestoes'>
                {(preparacao
                  ? sugestoes.filter(item => item.Icone !== Store)
                  : sugestoes
                ).map(({ Icone, titulo, texto: sugestao }) => (
                  <button
                    type='button'
                    key={titulo}
                    onClick={() => enviar(sugestao, null)}
                  >
                    <Icone size={21} strokeWidth={1.7} />
                    <strong>{titulo}</strong>
                    <span>{sugestao}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div
              className='ia-mensagens'
              role='log'
              aria-label='Mensagens da conversa'
              aria-live='polite'
              aria-relevant='additions'
            >
              {mensagens.map(mensagem => (
                <article
                  key={mensagem.id}
                  className={`ia-mensagem ia-mensagem-${mensagem.papel}`}
                >
                  <div className='ia-autor'>
                    {mensagem.papel === 'assistente' && <Sparkles size={16} />}
                    <strong>
                      {mensagem.papel === 'usuario' ? 'Você' : 'IAgora IA'}
                    </strong>
                  </div>
                  {mensagem.area && (
                    <span className='ia-mensagem-area'>
                      Criar ·{' '}
                      {
                        (
                          areasDisponiveis[mensagem.area] ??
                          areasCriacao[mensagem.area] ??
                          areasPreparacao[mensagem.area]
                        )?.nome
                      }
                    </span>
                  )}
                  <p>{mensagem.texto}</p>
                  {mensagem.rota && (
                    <Link className='ia-ver-registro' to={mensagem.rota}>
                      Ver registro
                    </Link>
                  )}
                  {mensagem.papel === 'assistente' && (
                    <button
                      className='ia-copiar'
                      type='button'
                      onClick={() => copiar(mensagem)}
                    >
                      {copiada === mensagem.id ? (
                        <Check size={14} />
                      ) : (
                        <Copy size={14} />
                      )}
                      {copiada === mensagem.id
                        ? 'Resposta copiada'
                        : 'Copiar resposta'}
                    </button>
                  )}
                </article>
              ))}
              <div ref={fim} />
            </div>
          )}
        </div>
        <div className='ia-compositor'>
          {erro && (
            <p role='alert' className='ia-erro'>
              {erro}
            </p>
          )}
          <form
            onSubmit={evento => {
              evento.preventDefault();
              enviar();
            }}
          >
            {areaAtiva && (
              <div className='ia-anexo'>
                <IconeArea size={16} aria-hidden='true' />
                <span>{areaAtiva.nome}</span>
                <button
                  type='button'
                  aria-label={'Remover anexo ' + areaAtiva.nome}
                  onClick={() => escolherArea(null)}
                >
                  <X size={15} aria-hidden='true' />
                </button>
              </div>
            )}
            <label className='ia-sr-only' htmlFor='ia-mensagem'>
              Sua mensagem para a IAgora IA
            </label>
            <textarea
              id='ia-mensagem'
              ref={campo}
              rows={2}
              maxLength={2000}
              value={texto}
              placeholder={
                pedidoPendente
                  ? 'Complete os dados do registro…'
                  : (areaAtiva?.exemplo ?? 'Conte o que você precisa resolver…')
              }
              onFocus={() => {
                if (seletor.current) seletor.current.open = false;
              }}
              onChange={evento => setTexto(evento.target.value)}
              onKeyDown={evento => {
                if (
                  evento.key === 'Enter' &&
                  !evento.shiftKey &&
                  !evento.nativeEvent.isComposing
                ) {
                  evento.preventDefault();
                  enviar();
                }
              }}
            />
            <div className='ia-compositor-acoes'>
              {aceitaCriacao ? (
                <details
                  ref={seletor}
                  className='ia-criar'
                  onKeyDown={evento => {
                    if (evento.key === 'Escape' && evento.currentTarget.open) {
                      evento.preventDefault();
                      evento.currentTarget.open = false;
                      evento.currentTarget.querySelector('summary').focus();
                    }
                  }}
                >
                  <summary>
                    <Plus size={17} aria-hidden='true' /> Criar{' '}
                    <ChevronDown size={14} aria-hidden='true' />
                  </summary>
                  <ul aria-label='Áreas para criar registros'>
                    {Object.entries(areasDisponiveis).map(([id, item]) => {
                      const Icone = iconesCriacao[id];
                      return (
                        <li key={id}>
                          <button
                            type='button'
                            aria-pressed={area === id}
                            onClick={() => escolherArea(id)}
                          >
                            <Icone size={17} aria-hidden='true' /> {item.nome}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </details>
              ) : (
                <span>Vamos por partes, juntos.</span>
              )}
              <button
                type='submit'
                className='ia-enviar'
                disabled={!texto.trim()}
                aria-label='Enviar mensagem'
              >
                <ArrowUp size={21} />
              </button>
            </div>
          </form>
          {preparacao && (
            <nav
              aria-label='Ferramentas de planejamento'
              className='flex flex-wrap justify-center gap-3 py-1 text-sm font-semibold'
            >
              <Link className='underline' to='/minhajornada'>
                Minha jornada
              </Link>
              <Link className='underline' to='/financas-b'>
                Planejamento financeiro
              </Link>
            </nav>
          )}
          <p className='ia-aviso'>
            {aceitaCriacao
              ? 'Demonstração local. O modo Criar interpreta pedidos por regras e salva no banco de teste.'
              : 'Demonstração com respostas prontas, sem conexão com uma IA.'}
          </p>
        </div>
      </section>
    </main>
  );
}
