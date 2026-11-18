import { useAvisoPerfilA } from '../../app/avisos/avisosPerfilA';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  MessageCircle,
  Send,
  Trash2,
} from 'lucide-react';
import {
  alterarBancoMarketplace,
  inserir,
  moeda,
} from '../../app/dados/bancoMvp';
import { EditorMvp, PaginaMvp, VazioMvp } from '../../shared/ui/mvp';
import DialogoMarketplace from './dialogoMarketplace';
import AcordoServico from './acordoServico';
import NavegacaoMarketplace from './navegacaoMarketplace';
import { statusContratacao } from './marketplaceDados';
import {
  chatDaContratacao,
  chatLiberado,
  resumoEndereco,
} from './contratacoes';

const camposAvaliacao = [
  {
    nome: 'nota',
    rotulo: 'Nota',
    numero: true,
    opcoes: [1, 2, 3, 4, 5].map(n => [n, `${n} de 5`]),
  },
  {
    nome: 'comentario',
    rotulo: 'Comentário',
    tipo: 'textarea',
    obrigatorio: false,
  },
];
export default function ContatosMarketplaceA({
  ehMeusServicos,
  banco,
  perfil,
  id,
  aoConversar,
  erroChat,
}) {
  const navegar = useNavigate();
  const [params] = useSearchParams();
  const concluidos = params.get('status') === 'concluidos';
  const historico = useRef(null);
  const [edicao, setEdicao] = useState(null);
  const [confirmacao, setConfirmacao] = useState(null);
  const notificar = useAvisoPerfilA();
  const [erro, setErro] = useState('');
  const empresa = idEmpresa =>
    banco.perfil_empresa.find(e => e.id === idEmpresa);
  const contratacoes = banco.servico_contratado.filter(
    c => c.perfil_id === perfil.id
  );
  const servicosMarcados = contratacoes.filter(c =>
    ['aceito', 'em_andamento', 'concluido'].includes(c.status)
  );
  const servicosVisiveis = servicosMarcados.filter(
    c => (c.status === 'concluido') === concluidos
  );
  const chats = banco.chat_servico.filter(
    c => c.perfil_id === perfil.id && chatDaContratacao(banco, c)
  );
  const chat = chats.find(c => c.id === Number(id));
  const chatId = chat?.id;
  const mensagens = banco.mensagem.filter(m => m.chat_id === chatId);
  const ultimaMensagem = mensagens.at(-1)?.id;
  const empresaAtual = empresa(chat?.empresa_id);
  const vinculoAtual = contratacoes.find(c => c.id === chat?.contratado_id);
  const servicoAtual = banco.servico.find(
    s => s.id === vinculoAtual?.servico_id
  );

  useLayoutEffect(() => {
    const painel = historico.current;
    if (painel) painel.scrollTop = painel.scrollHeight;
  }, [chatId, ultimaMensagem]);

  const naoLidas = mensagens.some(
    m => m.user_id !== perfil.user_id && !m.lida_em
  );

  useEffect(() => {
    if (!naoLidas || !chatId) return;
    try {
      alterarBancoMarketplace(db => {
        const agora = new Date().toISOString();
        for (const mensagem of db.mensagem) {
          if (
            mensagem.chat_id === chatId &&
            mensagem.user_id !== perfil.user_id &&
            !mensagem.lida_em
          )
            mensagem.lida_em = agora;
        }
      });
    } catch {
      // As mensagens continuam acessíveis sem salvar o recibo de leitura.
    }
  }, [chatId, naoLidas, perfil.user_id]);

  function executar(acao, sucesso) {
    try {
      acao();
      setErro('');
      if (sucesso !== undefined) notificar(sucesso);
      return true;
    } catch (falha) {
      setErro(falha.message);
      return false;
    }
  }

  function salvarEdicao(valores) {
    alterarBancoMarketplace(db => {
      const contratacao = db.servico_contratado.find(
        c => c.id === edicao.contratacao.id && c.perfil_id === perfil.id
      );
      if (!contratacao) throw new Error('Serviço indisponível.');
      if (contratacao.status !== 'concluido')
        throw new Error('A avaliação fica disponível após a conclusão.');
      const avaliacao = db.avaliacao_servico.find(
        a => a.contratado_id === contratacao.id
      );
      if (avaliacao && avaliacao.id !== edicao.avaliacao?.id)
        throw new Error('Esta contratação já foi avaliada.');
      const dados = {
        nota: valores.nota,
        comentario: valores.comentario,
        contratado_id: contratacao.id,
        perfil_id: perfil.id,
      };
      if (avaliacao) Object.assign(avaliacao, dados);
      else
        inserir(
          'avaliacao_servico',
          { ...dados, data_avaliacao: new Date().toISOString() },
          db
        );
    });
    notificar('Avaliação salva.');
  }

  return (
    <PaginaMvp cabecalho={false}>
      <div className='mercado-a'>
        <header className='mercado-a-cabecalho'>
          <h1>{ehMeusServicos ? 'Meus serviços' : 'Conversas'}</h1>
          <NavegacaoMarketplace
            ativa={ehMeusServicos ? 'servicos' : 'contatos'}
          />
        </header>
        {(erro || erroChat) && !confirmacao && (
          <p className='mvp-confirmacao' role='alert'>
            {erro || erroChat}
          </p>
        )}
        {ehMeusServicos ? (
          <section aria-label='Serviços contratados e concluídos'>
            <nav
              className='mercado-a-filtros-servicos'
              aria-label='Situação do serviço'
            >
              <Link
                to='/servicos-contratados'
                aria-current={!concluidos ? 'page' : undefined}
              >
                Contratados
              </Link>
              <Link
                to='/servicos-contratados?status=concluidos'
                aria-current={concluidos ? 'page' : undefined}
              >
                Concluídos
              </Link>
            </nav>
            <div className='mercado-a-servicos-lista'>
              {!servicosVisiveis.length && (
                <VazioMvp>
                  {concluidos
                    ? 'Nenhum serviço concluído para avaliar.'
                    : 'Os serviços aparecem aqui após a confirmação do acordo.'}
                </VazioMvp>
              )}
              {servicosVisiveis
                .slice()
                .reverse()
                .map(c => {
                  const servico = banco.servico.find(
                    s => s.id === c.servico_id
                  );
                  const avaliacao = banco.avaliacao_servico.find(
                    a => a.contratado_id === c.id && a.perfil_id === perfil.id
                  );
                  return (
                    <article className='mercado-a-contratacao' key={c.id}>
                      <div className='mercado-a-cartao-meta'>
                        <strong>
                          {servico?.titulo || 'Serviço indisponível'}
                        </strong>
                        <span className='mercado-a-nota'>
                          {statusContratacao[c.status] || c.status}
                        </span>
                      </div>
                      <p>{c.descricao}</p>
                      {c.endereco_id && (
                        <small>
                          {resumoEndereco(
                            banco.endereco.find(e => e.id === c.endereco_id)
                          )}
                        </small>
                      )}
                      <small>
                        {c.data_agendamento
                          ? new Date(c.data_agendamento).toLocaleString(
                              'pt-BR',
                              {
                                dateStyle: 'short',
                                timeStyle: 'short',
                              }
                            )
                          : 'Sem data combinada'}
                        {c.valor > 0 && ` · ${moeda(c.valor)}`}
                      </small>
                      {avaliacao && (
                        <p>
                          Sua avaliação: {avaliacao.nota} de 5
                          {avaliacao.comentario
                            ? ` · ${avaliacao.comentario}`
                            : ''}
                        </p>
                      )}
                      <div className='mercado-a-contato-acoes'>
                        {servico && chatLiberado(c) && (
                          <button
                            type='button'
                            className='mvp-link'
                            onClick={() =>
                              executar(
                                () => aoConversar(servico.empresa_id, c.id),
                                ''
                              )
                            }
                          >
                            Conversar
                          </button>
                        )}
                        {c.status === 'concluido' && (
                          <button
                            type='button'
                            className='mvp-link'
                            onClick={() =>
                              setEdicao({
                                tipo: 'avaliacao',
                                contratacao: c,
                                avaliacao,
                              })
                            }
                          >
                            {avaliacao ? 'Editar avaliação' : 'Avaliar serviço'}
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
            </div>
          </section>
        ) : (
          <div
            className={
              chat
                ? 'mercado-a-inbox mercado-a-inbox-aberta'
                : 'mercado-a-inbox'
            }
          >
            <aside
              className='mercado-a-conversas'
              aria-label='Lista de conversas'
            >
              <h2>Conversas</h2>
              {!chats.length && (
                <VazioMvp>
                  Abra um serviço no catálogo para iniciar uma conversa.
                </VazioMvp>
              )}
              <ul>
                {chats.map(c => {
                  const historicoChat = banco.mensagem.filter(
                    m => m.chat_id === c.id
                  );
                  const ultima = historicoChat.at(-1);
                  const novas = historicoChat.filter(
                    m => m.user_id !== perfil.user_id && !m.lida_em
                  ).length;
                  const vinculo = contratacoes.find(
                    item => item.id === c.contratado_id
                  );
                  const nomeServico = banco.servico.find(
                    s => s.id === vinculo?.servico_id
                  )?.titulo;
                  return (
                    <li key={c.id}>
                      <Link
                        className='mercado-a-conversa'
                        to={`/meus-contatos/${c.id}`}
                        aria-current={chatId === c.id ? 'page' : undefined}
                      >
                        <span className='mercado-a-avatar'>
                          <Building2 size={18} aria-hidden='true' />
                        </span>
                        <span className='mercado-a-conversa-resumo'>
                          <strong>
                            {nomeServico || 'Serviço indisponível'}
                          </strong>
                          <small>
                            {empresa(c.empresa_id)?.nome ||
                              'Empresa indisponível'}
                          </small>
                          <span>{ultima?.mensagem || 'Comece a conversa'}</span>
                        </span>
                        {novas > 0 && (
                          <span
                            className='mercado-a-nao-lidas'
                            aria-label={`${novas} mensagens não lidas`}
                          >
                            {novas}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </aside>
            {chat ? (
              <section
                className='mercado-a-chat'
                key={chat.id}
                aria-label='Conversa com a empresa'
              >
                <header className='mercado-a-chat-topo'>
                  <Link
                    className='mercado-a-chat-voltar'
                    to='/meus-contatos'
                    aria-label='Voltar à lista de conversas'
                  >
                    <ArrowLeft size={20} aria-hidden='true' />
                  </Link>
                  <span className='mercado-a-avatar'>
                    <Building2 size={18} aria-hidden='true' />
                  </span>
                  <div>
                    <h2>{servicoAtual?.titulo || 'Conversa'}</h2>
                    {servicoAtual && (
                      <p>
                        {empresaAtual?.nome}
                        {vinculoAtual &&
                          ` · ${statusContratacao[vinculoAtual.status] || vinculoAtual.status}`}
                      </p>
                    )}
                  </div>
                  <button
                    type='button'
                    className='mercado-a-chat-excluir'
                    aria-label='Excluir conversa'
                    onClick={() => {
                      setErro('');
                      setConfirmacao({
                        titulo:
                          vinculoAtual.status === 'pendente'
                            ? 'Encerrar negociação?'
                            : 'Excluir conversa?',
                        texto:
                          vinculoAtual.status === 'pendente'
                            ? 'A negociação será encerrada e o histórico será removido.'
                            : 'O histórico de mensagens desta conversa será removido.',
                        acao: () => {
                          alterarBancoMarketplace(db => {
                            const atual = db.chat_servico.find(
                              c => c.id === chat.id && c.perfil_id === perfil.id
                            );
                            if (!atual)
                              throw new Error('Conversa indisponível.');
                            const pedido = db.servico_contratado.find(
                              c =>
                                c.id === atual.contratado_id &&
                                c.perfil_id === perfil.id
                            );
                            if (pedido?.status === 'pendente')
                              pedido.status = 'cancelado';
                            db.chat_servico = db.chat_servico.filter(
                              c => c.id !== chat.id
                            );
                            db.mensagem = db.mensagem.filter(
                              m => m.chat_id !== chat.id
                            );
                          });
                          navegar('/meus-contatos', { replace: true });
                        },
                        sucesso: 'Conversa excluída.',
                      });
                    }}
                  >
                    <Trash2 size={18} aria-hidden='true' />
                  </button>
                </header>
                <div className='mercado-a-chat-contexto'>
                  {vinculoAtual?.endereco_id && (
                    <p className='mercado-a-chat-endereco'>
                      {resumoEndereco(
                        banco.endereco.find(
                          e => e.id === vinculoAtual.endereco_id
                        )
                      )}
                    </p>
                  )}
                  <AcordoServico
                    pedido={vinculoAtual}
                    propostas={banco.propostas_marketplace}
                    userId={perfil.user_id}
                  />
                </div>
                <ol
                  className='mercado-a-mensagens'
                  aria-label='Mensagens da conversa'
                  aria-live='polite'
                  ref={historico}
                >
                  {!mensagens.length && (
                    <li className='mercado-a-chat-inicio'>
                      Envie uma mensagem para começar a conversa.
                    </li>
                  )}
                  {mensagens.map(m => (
                    <li
                      key={m.id}
                      className='mercado-a-mensagem'
                      data-enviada={m.user_id === perfil.user_id}
                    >
                      <p>{m.mensagem}</p>
                      <time dateTime={m.data}>
                        {new Date(m.data).toLocaleString('pt-BR', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                      </time>
                    </li>
                  ))}
                </ol>
                <form
                  className='mercado-a-compositor'
                  onSubmit={evento => {
                    evento.preventDefault();
                    const form = evento.currentTarget;
                    const mensagem = new FormData(form).get('mensagem').trim();
                    if (!mensagem) return;
                    if (
                      executar(() =>
                        alterarBancoMarketplace(db => {
                          if (
                            !db.chat_servico.some(
                              c =>
                                c.id === chat.id &&
                                c.perfil_id === perfil.id &&
                                chatDaContratacao(db, c)
                            )
                          )
                            throw new Error('Conversa indisponível.');
                          inserir(
                            'mensagem',
                            {
                              chat_id: chat.id,
                              user_id: perfil.user_id,
                              mensagem,
                              data: new Date().toISOString(),
                              lida_em: null,
                            },
                            db
                          );
                        })
                      )
                    )
                      form.reset();
                  }}
                >
                  <textarea
                    name='mensagem'
                    aria-label='Mensagem para a empresa'
                    placeholder='Escreva sua mensagem'
                    rows={1}
                    maxLength={2000}
                    required
                  />
                  <button
                    type='submit'
                    className='mvp-primario'
                    aria-label='Enviar mensagem'
                  >
                    <Send size={19} aria-hidden='true' />
                  </button>
                </form>
              </section>
            ) : (
              <div className='mercado-a-chat-vazio'>
                <MessageCircle size={28} aria-hidden='true' />
                <p>
                  {id
                    ? 'Conversa não encontrada.'
                    : 'Escolha uma conversa para acompanhar o serviço.'}
                </p>
              </div>
            )}
          </div>
        )}
        {edicao && !confirmacao && (
          <DialogoMarketplace
            titulo='Avaliação do serviço'
            aoFechar={() => setEdicao(null)}
          >
            <div className='mercado-a-editor'>
              <EditorMvp
                cabecalho={false}
                titulo='Editar registro'
                inicial={edicao.avaliacao || { nota: 5 }}
                campos={camposAvaliacao}
                onSave={salvarEdicao}
                onClose={() => setEdicao(null)}
                acaoSecundaria={
                  edicao.avaliacao && (
                    <button
                      type='button'
                      className='mvp-link'
                      onClick={() => {
                        setErro('');
                        setConfirmacao({
                          titulo: 'Excluir avaliação?',
                          acao: () =>
                            alterarBancoMarketplace(db => {
                              db.avaliacao_servico =
                                db.avaliacao_servico.filter(
                                  a =>
                                    a.id !== edicao.avaliacao.id ||
                                    a.perfil_id !== perfil.id
                                );
                            }),
                          sucesso: 'Avaliação excluída.',
                        });
                      }}
                    >
                      Excluir avaliação
                    </button>
                  )
                }
              />
            </div>
          </DialogoMarketplace>
        )}
        {confirmacao && (
          <DialogoMarketplace
            titulo={confirmacao.titulo}
            aoFechar={() => {
              setConfirmacao(null);
              setErro('');
            }}
          >
            {confirmacao.texto && <p>{confirmacao.texto}</p>}
            {erro && (
              <p className='mvp-confirmacao' role='alert'>
                {erro}
              </p>
            )}
            <div className='mercado-a-contato-acoes'>
              <button
                type='button'
                className='mvp-link'
                onClick={() => {
                  setConfirmacao(null);
                  setErro('');
                }}
              >
                Voltar
              </button>
              <button
                type='button'
                className='mvp-primario'
                onClick={() => {
                  if (executar(confirmacao.acao, confirmacao.sucesso)) {
                    setConfirmacao(null);
                    setEdicao(null);
                  }
                }}
              >
                Confirmar
              </button>
            </div>
          </DialogoMarketplace>
        )}
      </div>
    </PaginaMvp>
  );
}
