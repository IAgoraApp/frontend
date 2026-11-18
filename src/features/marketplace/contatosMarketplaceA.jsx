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
  hoje,
  inserir,
  moeda,
} from '../../app/dados/bancoMvp';
import { EditorMvp, PaginaMvp, VazioMvp } from '../../shared/ui/mvp';
import DialogoMarketplace from './dialogoMarketplace';
import NavegacaoMarketplace from './navegacaoMarketplace';
import { statusContratacao } from './marketplaceDados';

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
const camposSolicitacao = [
  { nome: 'descricao', rotulo: 'Descrição', tipo: 'textarea' },
  {
    nome: 'data_agendamento',
    rotulo: 'Data desejada',
    tipo: 'datetime-local',
    obrigatorio: false,
  },
];

export default function ContatosMarketplaceA({
  banco,
  perfil,
  id,
  aoConversar,
  erroChat,
}) {
  const navegar = useNavigate();
  const [params] = useSearchParams();
  const mostrarSolicitacoes = !id && params.get('visao') === 'solicitacoes';
  const historico = useRef(null);
  const [edicao, setEdicao] = useState(null);
  const [confirmacao, setConfirmacao] = useState(null);
  const [aviso, setAviso] = useState('');
  const [erro, setErro] = useState('');
  const empresa = idEmpresa =>
    banco.perfil_empresa.find(e => e.id === idEmpresa);
  const contratacoes = banco.servico_contratado.filter(
    c => c.perfil_id === perfil.id
  );
  const chats = banco.chat_servico.filter(c => c.perfil_id === perfil.id);
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
      setAviso(sucesso);
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
      if (!contratacao) throw new Error('Solicitação indisponível.');
      if (edicao.tipo === 'solicitacao') {
        if (contratacao.status !== 'pendente')
          throw new Error('A solicitação já saiu do estado pendente.');
        if (
          valores.data_agendamento &&
          valores.data_agendamento < `${hoje()}T00:00`
        )
          throw new Error('Escolha uma data a partir de hoje.');
        contratacao.descricao = valores.descricao;
        contratacao.data_agendamento = valores.data_agendamento;
      } else {
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
      }
    });
    setAviso(
      edicao.tipo === 'solicitacao'
        ? 'Solicitação atualizada.'
        : 'Avaliação salva.'
    );
  }

  return (
    <PaginaMvp cabecalho={false}>
      <div className='mercado-a'>
        <header className='mercado-a-cabecalho'>
          <h1>Serviços e conversas</h1>
          <NavegacaoMarketplace ativa='contatos' />
        </header>
        <div className='mercado-a-caixa-topo'>
          {mostrarSolicitacoes ? (
            <Link className='mercado-a-voltar' to='/meus-contatos'>
              <ArrowLeft size={17} aria-hidden='true' /> Voltar às conversas
            </Link>
          ) : (
            <Link
              className='mercado-a-voltar'
              to='/meus-contatos?visao=solicitacoes'
            >
              Minhas solicitações
            </Link>
          )}
        </div>
        {aviso && (
          <p className='mvp-sucesso' role='status'>
            {aviso}
          </p>
        )}
        {(erro || erroChat) && !confirmacao && (
          <p className='mvp-confirmacao' role='alert'>
            {erro || erroChat}
          </p>
        )}
        {mostrarSolicitacoes ? (
          <section className='mvp-painel'>
            <div className='mvp-painel-topo'>
              <h2>Minhas contratações</h2>
            </div>
            {!contratacoes.length && (
              <VazioMvp>Você ainda não solicitou um serviço.</VazioMvp>
            )}
            {contratacoes.map(c => {
              const servico = banco.servico.find(s => s.id === c.servico_id);
              const avaliacao = banco.avaliacao_servico.find(
                a => a.contratado_id === c.id && a.perfil_id === perfil.id
              );
              return (
                <article className='mercado-a-contratacao' key={c.id}>
                  <div className='mercado-a-cartao-meta'>
                    <strong>{servico?.titulo || 'Serviço indisponível'}</strong>
                    <span className='mercado-a-nota'>
                      {statusContratacao[c.status] || c.status}
                    </span>
                  </div>
                  <p>{c.descricao}</p>
                  <small>
                    {c.data_agendamento
                      ? new Date(c.data_agendamento).toLocaleString('pt-BR', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })
                      : 'Sem data combinada'}
                    {c.valor > 0 && ` · ${moeda(c.valor)}`}
                  </small>
                  {avaliacao && (
                    <p>
                      Sua avaliação: {avaliacao.nota} de 5
                      {avaliacao.comentario ? ` · ${avaliacao.comentario}` : ''}
                    </p>
                  )}
                  <div className='mercado-a-contato-acoes'>
                    {servico && (
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
                    {c.status === 'pendente' && (
                      <>
                        <button
                          type='button'
                          className='mvp-link'
                          onClick={() =>
                            setEdicao({ tipo: 'solicitacao', contratacao: c })
                          }
                        >
                          Editar solicitação
                        </button>
                        <button
                          type='button'
                          className='mvp-link'
                          onClick={() => {
                            setErro('');
                            setConfirmacao({
                              titulo: 'Cancelar solicitação?',
                              acao: () =>
                                alterarBancoMarketplace(db => {
                                  const atual = db.servico_contratado.find(
                                    item =>
                                      item.id === c.id &&
                                      item.perfil_id === perfil.id
                                  );
                                  if (atual?.status !== 'pendente')
                                    throw new Error(
                                      'A solicitação já saiu do estado pendente.'
                                    );
                                  atual.status = 'cancelado';
                                }),
                              sucesso: 'Solicitação cancelada.',
                            });
                          }}
                        >
                          Cancelar solicitação
                        </button>
                      </>
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
                        {avaliacao ? 'Editar avaliação' : 'Avaliar'}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
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
                <VazioMvp>As conversas com empresas aparecerão aqui.</VazioMvp>
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
                            {empresa(c.empresa_id)?.nome ||
                              'Empresa indisponível'}
                          </strong>
                          {nomeServico && <small>{nomeServico}</small>}
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
                    <h2>{empresaAtual?.nome || 'Conversa'}</h2>
                    {servicoAtual && (
                      <p>
                        {servicoAtual.titulo}
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
                        titulo: 'Excluir conversa?',
                        texto:
                          'O histórico de mensagens desta conversa será removido.',
                        acao: () => {
                          alterarBancoMarketplace(db => {
                            const atual = db.chat_servico.find(
                              c => c.id === chat.id && c.perfil_id === perfil.id
                            );
                            if (!atual)
                              throw new Error('Conversa indisponível.');
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
                      executar(
                        () =>
                          alterarBancoMarketplace(db => {
                            if (
                              !db.chat_servico.some(
                                c =>
                                  c.id === chat.id && c.perfil_id === perfil.id
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
                          }),
                        'Mensagem enviada.'
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
                  {id ? 'Conversa não encontrada.' : 'Selecione uma conversa.'}
                </p>
              </div>
            )}
          </div>
        )}
        {edicao && !confirmacao && (
          <DialogoMarketplace
            titulo={
              edicao.tipo === 'solicitacao'
                ? 'Editar solicitação'
                : 'Avaliação do serviço'
            }
            aoFechar={() => setEdicao(null)}
          >
            <div className='mercado-a-editor'>
              <EditorMvp
                cabecalho={false}
                titulo='Editar registro'
                inicial={
                  edicao.tipo === 'solicitacao'
                    ? {
                        ...edicao.contratacao,
                        data_agendamento:
                          edicao.contratacao.data_agendamento?.slice(0, 16),
                      }
                    : edicao.avaliacao || { nota: 5 }
                }
                campos={
                  edicao.tipo === 'solicitacao'
                    ? camposSolicitacao
                    : camposAvaliacao
                }
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
