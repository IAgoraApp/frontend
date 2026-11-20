import { usePerfilPreparacao } from '../../app/dados/perfilNavegacao';
import { useAvisoPerfilA } from '../../app/avisos/avisosPerfilA';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import {
  alterarBancoMarketplace,
  inserir,
  moeda,
} from '../../app/dados/bancoMvp';
import { EditorMvp, PaginaMvp, VazioMvp } from '../../shared/ui/mvp';
import DialogoMarketplace from './dialogoMarketplace';
import AcordoServico from './acordoServico';
import CaixaConversas from './CaixaConversas';
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
  const preparacao = usePerfilPreparacao();
  const [params] = useSearchParams();
  const filtro = params.get('status');
  const concluidos = filtro === 'concluidos' || filtro === 'avaliados';
  const avaliados = filtro === 'avaliados';
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
    c =>
      (c.status === 'concluido') === concluidos &&
      (!avaliados ||
        banco.avaliacao_servico.some(
          a => a.contratado_id === c.id && a.perfil_id === perfil.id
        ))
  );
  const chats = banco.chat_servico.filter(
    c => c.perfil_id === perfil.id && chatDaContratacao(banco, c)
  );
  const chat = chats.find(c => c.id === Number(id));
  const chatId = chat?.id;
  const mensagens = banco.mensagem.filter(m => m.chat_id === chatId);
  const empresaAtual = empresa(chat?.empresa_id);
  const vinculoAtual = contratacoes.find(c => c.id === chat?.contratado_id);
  const servicoAtual = banco.servico.find(
    s => s.id === vinculoAtual?.servico_id
  );

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
                aria-current={filtro === 'concluidos' ? 'page' : undefined}
              >
                Concluídos
              </Link>
              <Link
                to='/servicos-contratados?status=avaliados'
                aria-current={avaliados ? 'page' : undefined}
              >
                Minhas avaliações
              </Link>
            </nav>
            <div className='mercado-a-servicos-lista'>
              {!servicosVisiveis.length && (
                <VazioMvp>
                  {avaliados
                    ? 'Você ainda não avaliou nenhum serviço.'
                    : concluidos
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
          <CaixaConversas
            conversas={chats.map(c => {
              const pedido = contratacoes.find(p => p.id === c.contratado_id);
              const servico = banco.servico.find(
                item => item.id === pedido?.servico_id
              );
              return {
                id: c.id,
                titulo: servico?.titulo || 'Serviço indisponível',
                contato: empresa(c.empresa_id)?.nome || 'Empresa indisponível',
              };
            })}
            chat={
              chat && {
                id: chat.id,
                titulo: servicoAtual?.titulo || 'Conversa',
              }
            }
            mensagens={banco.mensagem}
            userId={perfil.user_id}
            rota='/meus-contatos'
            Icone={Building2}
            interlocutor='a empresa'
            vazio='Abra um serviço no catálogo para iniciar uma conversa.'
            conversaAusente={Boolean(id && !chat)}
            subtitulo={
              servicoAtual &&
              [
                empresaAtual?.nome,
                vinculoAtual &&
                  (statusContratacao[vinculoAtual.status] ||
                    vinculoAtual.status),
              ]
                .filter(Boolean)
                .join(' · ')
            }
            contexto={
              chat && (
                <>
                  {vinculoAtual?.endereco_id && (
                    <p className='mercado-a-chat-endereco'>
                      {resumoEndereco(
                        banco.endereco.find(
                          e => e.id === vinculoAtual.endereco_id
                        )
                      )}
                    </p>
                  )}
                  {!preparacao && (
                    <AcordoServico
                      pedido={vinculoAtual}
                      propostas={banco.propostas_marketplace}
                      userId={perfil.user_id}
                    />
                  )}
                </>
              )
            }
            aoExcluir={() => {
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
                    if (!atual) throw new Error('Conversa indisponível.');
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
            aoEnviar={evento => {
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
          />
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
