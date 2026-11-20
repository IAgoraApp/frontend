import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronRight,
  ClipboardList,
  MapPin,
  MessageCircle,
  Search,
  UserRound,
} from 'lucide-react';
import CaixaConversas from '../../marketplace/CaixaConversas';
import {
  alterarBancoMarketplace,
  inserir,
  moeda,
} from '../../../app/dados/bancoMvp';
import {
  chatDaContratacao,
  chatLiberado,
  garantirChat,
  proximosStatus,
  resumoEndereco,
} from '../../marketplace/contratacoes';
import { FotoServico } from '../../marketplace/catalogoMarketplaceA';
import {
  normalizarBusca,
  statusContratacao,
} from '../../marketplace/marketplaceDados';
import DialogoMarketplace from '../../marketplace/dialogoMarketplace';
import AcordoServico from '../../marketplace/acordoServico';
import { VazioMvp } from '../../../shared/ui/mvp';
import { useAvisoPerfilA } from '../../../app/avisos/avisosPerfilA';

import './atendimentos.css';

const rota = '/empresa/contatos';
const rotaChat = rota + '?visao=chat';
const rotaPedido = id => rota + '?contratacao=' + id;
const filtros = [
  ['todos', 'Todas', null],
  ['negociacao', 'Em negociação', ['pendente']],
  ['ativos', 'Em aberto', ['aceito', 'em_andamento']],
  ['historico', 'Histórico', ['concluido', 'recusado', 'cancelado']],
];

const formatarData = data =>
  new Date(data).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });

function Situacao({ status }) {
  return (
    <span className='atendimento-status' data-status={status}>
      {statusContratacao[status] ?? status}
    </span>
  );
}

export default function SolicitacoesMarketplace({
  b,
  empresa,
  servicos,
  pedidos,
  chatInicial,
}) {
  const [params] = useSearchParams();
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [acao, setAcao] = useState(null);
  const navegar = useNavigate();
  const [erro, setErro] = useState('');
  const notificar = useAvisoPerfilA();
  const porId = new Map(servicos.map(s => [s.id, s]));
  const chats = b.chat_servico.filter(
    c =>
      c.empresa_id === empresa.id &&
      (c.contratado_id == null || chatDaContratacao(b, c))
  );
  const chat = chats.find(c => c.id === chatInicial?.chatId);
  const pedidoAtivo = pedidos.find(p => p.id === chat?.contratado_id);
  const mensagens = b.mensagem.filter(m => m.chat_id === chat?.id);
  const mostrandoChat = !!chatInicial || params.get('visao') === 'chat';
  const selecionado = pedidos.find(
    p => p.id === Number(params.get('contratacao'))
  );
  const servicoSelecionado = porId.get(selecionado?.servico_id);
  const ultimoPorChat = new Map(
    b.mensagem.map(item => [item.chat_id, item.data])
  );
  const conversasOrdenadas = chats.toSorted(
    (a, c) =>
      (ultimoPorChat.get(c.id) ?? '').localeCompare(
        ultimoPorChat.get(a.id) ?? ''
      ) || c.id - a.id
  );
  const cliente = perfilId =>
    b.perfil.find(p => p.id === perfilId)?.nome ?? 'Cliente';

  const consulta = normalizarBusca(busca);
  const situacoes = filtros.find(([id]) => id === filtro)[2];
  const visiveis = pedidos
    .toReversed()
    .filter(
      p =>
        (!situacoes || situacoes.includes(p.status)) &&
        normalizarBusca(
          [p.id, porId.get(p.servico_id)?.titulo, cliente(p.perfil_id)].join(
            ' '
          )
        ).includes(consulta)
    );
  const enderecoDoPedido = pedido =>
    resumoEndereco(b.endereco.find(item => item.id === pedido.endereco_id));

  const chatId = chat?.id;
  const userId = empresa.user_id;
  const mensagensNaoLidas = mensagens.some(
    m => m.user_id !== userId && !m.lida_em
  );
  useEffect(() => {
    if (!chatId || !mensagensNaoLidas) return;
    try {
      alterarBancoMarketplace(db => {
        if (
          !db.chat_servico.some(
            c => c.id === chatId && c.empresa_id === empresa.id
          )
        )
          return;
        const agora = new Date().toISOString();
        for (const mensagem of db.mensagem) {
          if (
            mensagem.chat_id === chatId &&
            mensagem.user_id !== userId &&
            !mensagem.lida_em
          )
            mensagem.lida_em = agora;
        }
      });
    } catch (falha) {
      notificar(falha.message);
    }
  }, [chatId, empresa.id, mensagensNaoLidas, notificar, userId]);

  function abrirConversa(pedidoId) {
    try {
      let canal = chats.find(c => c.contratado_id === pedidoId);
      if (!canal) {
        alterarBancoMarketplace(db => {
          const pedido = db.servico_contratado.find(p => p.id === pedidoId);
          canal = garantirChat(db, pedido, empresa.id);
        });
      }
      navegar(`/empresa/contatos/${canal.id}`);
    } catch (falha) {
      setErro(falha.message);
    }
  }

  function confirmar() {
    try {
      alterarBancoMarketplace(db => {
        if (acao.excluirChat) {
          if (
            !db.chat_servico.some(
              c => c.id === acao.id && c.empresa_id === empresa.id
            )
          )
            throw new Error('A conversa não está disponível.');
          db.chat_servico = db.chat_servico.filter(c => c.id !== acao.id);
          db.mensagem = db.mensagem.filter(m => m.chat_id !== acao.id);
          return;
        }
        const pedido = db.servico_contratado.find(
          p => p.id === acao.id && porId.has(p.servico_id)
        );
        if (
          !proximosStatus[pedido?.status]?.some(
            ([status]) => status === acao.status
          )
        )
          throw new Error('O serviço mudou. Reabra a ação a partir da lista.');
        pedido.status = acao.status;
        if (acao.status === 'concluido')
          pedido.data_conclusao = new Date().toISOString();
      });
      if (acao.excluirChat) {
        notificar('Conversa excluída.');
        navegar(rotaChat, { replace: true });
      }
      if (!acao.excluirChat) notificar('Contratação atualizada.');
      setAcao(null);
    } catch (falha) {
      setErro(falha.message);
    }
  }

  function enviar(evento) {
    evento.preventDefault();
    const form = evento.currentTarget;
    const texto = new FormData(form).get('mensagem').trim();
    if (!texto) return;
    try {
      alterarBancoMarketplace(db => {
        const atual = db.servico_contratado.find(
          p => p.id === pedidoAtivo?.id && porId.has(p.servico_id)
        );
        const canal =
          chat?.contratado_id == null && chat
            ? db.chat_servico.find(
                c =>
                  c.id === chat.id &&
                  c.empresa_id === empresa.id &&
                  c.contratado_id == null
              )
            : garantirChat(db, atual, empresa.id);
        if (!canal) throw new Error('A conversa não está disponível.');
        inserir(
          'mensagem',
          {
            chat_id: canal.id,
            user_id: empresa.user_id,
            mensagem: texto,
            data: new Date().toISOString(),
            lida_em: null,
          },
          db
        );
      });
      setErro('');
      form.reset();
    } catch (falha) {
      setErro(falha.message);
    }
  }

  return (
    <div className='atendimentos-empresa'>
      <nav className='atendimento-abas' aria-label='Opções de atendimento'>
        <Link to={rota} aria-current={mostrandoChat ? undefined : 'page'}>
          <ClipboardList size={19} aria-hidden='true' /> Contratações
        </Link>
        <Link to={rotaChat} aria-current={mostrandoChat ? 'page' : undefined}>
          <MessageCircle size={19} aria-hidden='true' /> Chat
        </Link>
      </nav>
      {erro && !acao && (
        <p role='alert' className='atendimento-erro'>
          {erro}
        </p>
      )}
      {mostrandoChat ? (
        <CaixaConversas
          conversas={conversasOrdenadas.map(c => {
            const pedido = pedidos.find(p => p.id === c.contratado_id);
            return {
              id: c.id,
              titulo: cliente(c.perfil_id),
              contato:
                porId.get(pedido?.servico_id)?.titulo ?? 'Contato inicial',
            };
          })}
          chat={chat && { id: chat.id, titulo: cliente(chat.perfil_id) }}
          mensagens={b.mensagem}
          userId={userId}
          rota={rota}
          rotaLista={rotaChat}
          Icone={UserRound}
          interlocutor='o cliente'
          vazio='Ainda não há conversas.'
          conversaAusente={!!chatInicial && !chat}
          mostrarLeitura
          subtitulo={
            chat &&
            [
              porId.get(pedidoAtivo?.servico_id)?.titulo,
              pedidoAtivo && statusContratacao[pedidoAtivo.status],
            ]
              .filter(Boolean)
              .join(' · ')
          }
          contexto={
            pedidoAtivo && (
              <div className='atendimento-chat-pedido'>
                <span>Contratação #{pedidoAtivo.id}</span>
                <Link to={rotaPedido(pedidoAtivo.id)}>
                  Ver contratação <ChevronRight size={16} aria-hidden='true' />
                </Link>
              </div>
            )
          }
          aoEnviar={enviar}
          aoExcluir={() => {
            setErro('');
            setAcao({
              id: chat.id,
              excluirChat: true,
              rotulo: 'Excluir conversa?',
            });
          }}
        />
      ) : selecionado ? (
        <section
          className='atendimento-detalhe'
          aria-labelledby='atendimento-detalhe-titulo'
        >
          <Link className='atendimento-voltar' to={rota}>
            <ArrowLeft size={17} aria-hidden='true' /> Todas as contratações
          </Link>
          <article className='atendimento-pedido'>
            <header className='atendimento-pedido-topo'>
              <div className='atendimento-foto'>
                <FotoServico servico={servicoSelecionado} />
              </div>
              <div>
                <p>Contratação #{selecionado.id}</p>
                <h2 id='atendimento-detalhe-titulo'>
                  {servicoSelecionado.titulo}
                </h2>
              </div>
              <Situacao status={selecionado.status} />
            </header>
            <dl className='atendimento-fatos'>
              <div>
                <dt>Cliente</dt>
                <dd>{cliente(selecionado.perfil_id)}</dd>
              </div>
              <div>
                <dt>Agendamento</dt>
                <dd>
                  {selecionado.data_agendamento
                    ? formatarData(selecionado.data_agendamento)
                    : 'A combinar'}
                </dd>
              </div>
              <div>
                <dt>Valor do serviço</dt>
                <dd>
                  {selecionado.valor > 0
                    ? moeda(selecionado.valor)
                    : 'A combinar'}
                </dd>
              </div>
            </dl>
            <div className='atendimento-detalhe-corpo'>
              {selecionado.descricao && (
                <div>
                  <h3>Solicitação do cliente</h3>
                  <p>{selecionado.descricao}</p>
                </div>
              )}
              {enderecoDoPedido(selecionado) && (
                <p className='atendimento-endereco'>
                  <MapPin size={17} aria-hidden='true' />{' '}
                  {enderecoDoPedido(selecionado)}
                </p>
              )}
              <AcordoServico
                key={selecionado.id}
                pedido={selecionado}
                propostas={b.propostas_marketplace}
                userId={userId}
              />
            </div>
            <footer className='atendimento-pedido-acoes'>
              {proximosStatus[selecionado.status]?.map(([status, rotulo]) => (
                <button
                  key={status}
                  type='button'
                  className={
                    status === 'recusado' ? 'atendimento-botao' : 'mvp-primario'
                  }
                  onClick={() => {
                    setErro('');
                    setAcao({ id: selecionado.id, status, rotulo });
                  }}
                >
                  {rotulo}
                </button>
              ))}
              {chatLiberado(selecionado) && (
                <button
                  type='button'
                  className='atendimento-botao'
                  onClick={() => abrirConversa(selecionado.id)}
                >
                  <MessageCircle size={17} aria-hidden='true' /> Falar com o
                  cliente
                </button>
              )}
            </footer>
          </article>
        </section>
      ) : (
        <section
          className='atendimento-lista'
          aria-label='Contratações recebidas'
        >
          <div className='atendimento-filtros'>
            <div
              className='atendimento-status-filtros'
              role='group'
              aria-label='Filtrar por situação'
            >
              {filtros.map(([id, titulo, estados]) => (
                <button
                  key={id}
                  type='button'
                  aria-pressed={filtro === id}
                  onClick={() => setFiltro(id)}
                >
                  {titulo}{' '}
                  <span>
                    {estados
                      ? pedidos.filter(pedido =>
                          estados.includes(pedido.status)
                        ).length
                      : pedidos.length}
                  </span>
                </button>
              ))}
            </div>
            <label className='atendimento-busca'>
              <Search size={17} aria-hidden='true' />
              <input
                type='search'
                aria-label='Buscar contratação'
                placeholder='Cliente, serviço ou número'
                value={busca}
                onChange={evento => setBusca(evento.target.value)}
              />
            </label>
          </div>
          {!visiveis.length ? (
            <VazioMvp>
              {pedidos.length
                ? 'Nenhuma contratação encontrada. Ajuste a busca ou o filtro.'
                : 'As solicitações de clientes aparecerão aqui.'}
            </VazioMvp>
          ) : (
            <ul className='atendimento-pedidos'>
              {visiveis.map(p => (
                <li key={p.id}>
                  <article className='atendimento-pedido'>
                    <header className='atendimento-pedido-topo'>
                      <div className='atendimento-foto'>
                        <FotoServico servico={porId.get(p.servico_id)} />
                      </div>
                      <div>
                        <p>Contratação #{p.id}</p>
                        <h2>
                          <Link to={rotaPedido(p.id)}>
                            {porId.get(p.servico_id)?.titulo}
                          </Link>
                        </h2>
                      </div>
                      <Situacao status={p.status} />
                    </header>
                    <dl className='atendimento-fatos'>
                      <div>
                        <dt>Cliente</dt>
                        <dd>{cliente(p.perfil_id)}</dd>
                      </div>
                      <div>
                        <dt>Agendamento</dt>
                        <dd>
                          {p.data_agendamento
                            ? formatarData(p.data_agendamento)
                            : 'A combinar'}
                        </dd>
                      </div>
                      <div>
                        <dt>Valor do serviço</dt>
                        <dd>{p.valor > 0 ? moeda(p.valor) : 'A combinar'}</dd>
                      </div>
                    </dl>
                    <footer className='atendimento-pedido-acoes'>
                      {chatLiberado(p) && (
                        <button
                          className='atendimento-botao'
                          type='button'
                          onClick={() => abrirConversa(p.id)}
                        >
                          <MessageCircle size={17} aria-hidden='true' />{' '}
                          Conversar
                        </button>
                      )}
                      <Link
                        className='atendimento-botao atendimento-botao-destaque'
                        to={rotaPedido(p.id)}
                      >
                        Ver contratação{' '}
                        <ChevronRight size={17} aria-hidden='true' />
                      </Link>
                    </footer>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
      {acao && (
        <DialogoMarketplace titulo={acao.rotulo} aoFechar={() => setAcao(null)}>
          <p>
            {acao.excluirChat
              ? 'As mensagens serão removidas para os participantes. A contratação continua no histórico.'
              : 'Confirme a atualização deste serviço.'}
          </p>
          {erro && <p role='alert'>{erro}</p>}
          <div className='mercado-a-contato-acoes'>
            <button type='button' className='mvp-primario' onClick={confirmar}>
              Confirmar
            </button>
          </div>
        </DialogoMarketplace>
      )}
    </div>
  );
}
