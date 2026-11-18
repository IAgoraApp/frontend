import { useEffect, useRef, useState } from 'react';
import {
  ArrowUp,
  Check,
  Copy,
  House,
  ListChecks,
  MessageCircle,
  PanelLeft,
  Plus,
  Sparkles,
  Store,
  Trash2,
  Truck,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
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

function responder(texto) {
  const pergunta = texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
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

const conversasDaSessao = { itens: [], ativa: null };

export default function InteligenciaArtificial() {
  const rascunho = useLocation().state?.rascunho;
  const textoInicial =
    typeof rascunho === 'string' ? rascunho.slice(0, 2000) : '';
  const [conversas, setConversas] = useState(() => conversasDaSessao.itens);
  const [ativa, setAtiva] = useState(() =>
    textoInicial ? null : conversasDaSessao.ativa
  );
  const [texto, setTexto] = useState(textoInicial);
  const [historicoAberto, setHistoricoAberto] = useState(false);
  const [copiada, setCopiada] = useState(null);
  const [erro, setErro] = useState('');
  const campo = useRef(null);
  const fim = useRef(null);
  const conversa = conversas.find(item => item.id === ativa);
  const mensagens = conversa?.mensagens ?? [];

  useEffect(() => {
    conversasDaSessao.itens = conversas;
    conversasDaSessao.ativa = ativa;
  }, [conversas, ativa]);

  useEffect(() => {
    fim.current?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  }, [conversas, ativa]);

  function novaConversa() {
    setAtiva(null);
    setTexto('');
    setErro('');
    setHistoricoAberto(false);
    campo.current?.focus();
  }

  function enviar(pergunta = texto) {
    const conteudo = pergunta.trim();
    if (!conteudo) return;
    const id = ativa ?? crypto.randomUUID();
    const novasMensagens = [
      { id: crypto.randomUUID(), papel: 'usuario', texto: conteudo },
      {
        id: crypto.randomUUID(),
        papel: 'assistente',
        texto: responder(conteudo),
      },
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
      setCopiada(mensagem.id);
      setErro('');
    } catch {
      setErro(
        'Não foi possível copiar. Selecione o texto da resposta e copie manualmente.'
      );
    }
  }

  return (
    <main className='ia-pagina'>
      <div className='ia-barra-mobile'>
        <button
          type='button'
          onClick={() => setHistoricoAberto(!historicoAberto)}
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
      >
        <div className='ia-marca'>
          <span className='ia-simbolo'>
            <Sparkles size={22} />
          </span>
          <div>
            <h1>IAgora IA</h1>
            <p>Um passo de cada vez.</p>
          </div>
        </div>
        <button className='ia-nova' type='button' onClick={novaConversa}>
          <Plus size={18} /> Nova conversa
        </button>
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
          As conversas ficam disponíveis enquanto esta página estiver aberta no
          navegador.
        </p>
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
                {sugestoes.map(({ Icone, titulo, texto: sugestao }) => (
                  <button
                    type='button'
                    key={titulo}
                    onClick={() => enviar(sugestao)}
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
                  <p>{mensagem.texto}</p>
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
            <label className='ia-sr-only' htmlFor='ia-mensagem'>
              Sua mensagem para a IAgora IA
            </label>
            <textarea
              id='ia-mensagem'
              ref={campo}
              rows={2}
              maxLength={2000}
              value={texto}
              placeholder='Conte o que você precisa resolver…'
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
              <span>Vamos por partes, juntos.</span>
              <button
                type='submit'
                disabled={!texto.trim()}
                aria-label='Enviar mensagem'
              >
                <ArrowUp size={21} />
              </button>
            </div>
          </form>
          <p className='ia-aviso'>
            Demonstração com respostas prontas, sem conexão com uma IA. Enter
            envia; Shift + Enter quebra a linha.
          </p>
        </div>
      </section>
    </main>
  );
}
