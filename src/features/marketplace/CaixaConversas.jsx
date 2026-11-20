import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Send, Trash2 } from 'lucide-react';
import { VazioMvp } from '../../shared/ui/mvp';

export default function CaixaConversas({
  conversas,
  chat,
  mensagens,
  userId,
  rota,
  rotaLista = rota,
  Icone,
  interlocutor,
  vazio,
  conversaAusente,
  contexto,
  subtitulo,
  aoExcluir,
  aoEnviar,
  mostrarLeitura = false,
}) {
  const historico = useRef(null);
  const chatId = chat?.id;
  const ultimaMensagem = mensagens.filter(m => m.chat_id === chatId).at(-1)?.id;

  useLayoutEffect(() => {
    const painel = historico.current;
    if (painel) painel.scrollTop = painel.scrollHeight;
  }, [chatId, ultimaMensagem]);

  return (
    <div
      className={
        chat ? 'mercado-a-inbox mercado-a-inbox-aberta' : 'mercado-a-inbox'
      }
    >
      <aside className='mercado-a-conversas' aria-label='Lista de conversas'>
        <h2>Conversas</h2>
        {!conversas.length && <VazioMvp>{vazio}</VazioMvp>}
        <ul>
          {conversas.map(c => {
            const mensagensChat = mensagens.filter(m => m.chat_id === c.id);
            const novas = mensagensChat.filter(
              m => m.user_id !== userId && !m.lida_em
            ).length;
            return (
              <li key={c.id}>
                <Link
                  className='mercado-a-conversa'
                  to={`${rota}/${c.id}`}
                  aria-current={chatId === c.id ? 'page' : undefined}
                >
                  <span className='mercado-a-avatar'>
                    <Icone size={18} aria-hidden='true' />
                  </span>
                  <span className='mercado-a-conversa-resumo'>
                    <strong>{c.titulo}</strong>
                    <small>{c.contato}</small>
                    <span>
                      {mensagensChat.at(-1)?.mensagem || 'Comece a conversa'}
                    </span>
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
          aria-label={`Conversa com ${interlocutor}`}
        >
          <header className='mercado-a-chat-topo'>
            <Link
              className='mercado-a-chat-voltar'
              to={rotaLista}
              aria-label='Voltar à lista de conversas'
            >
              <ArrowLeft size={20} aria-hidden='true' />
            </Link>
            <span className='mercado-a-avatar'>
              <Icone size={18} aria-hidden='true' />
            </span>
            <div>
              <h2>{chat.titulo}</h2>
              {subtitulo && <p>{subtitulo}</p>}
            </div>
            <button
              type='button'
              className='mercado-a-chat-excluir'
              aria-label='Excluir conversa'
              onClick={aoExcluir}
            >
              <Trash2 size={18} aria-hidden='true' />
            </button>
          </header>
          <div className='mercado-a-chat-contexto'>{contexto}</div>
          <ol
            className='mercado-a-mensagens'
            aria-label='Mensagens da conversa'
            aria-live='polite'
            ref={historico}
          >
            {!ultimaMensagem && (
              <li className='mercado-a-chat-inicio'>
                Envie uma mensagem para começar a conversa.
              </li>
            )}
            {mensagens
              .filter(m => m.chat_id === chatId)
              .map(m => (
                <li
                  key={m.id}
                  className='mercado-a-mensagem'
                  data-enviada={m.user_id === userId}
                >
                  <p>{m.mensagem}</p>
                  <time dateTime={m.data}>
                    {new Date(m.data).toLocaleString('pt-BR', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                    {mostrarLeitura && m.user_id === userId && m.lida_em
                      ? ' · Lida'
                      : ''}
                  </time>
                </li>
              ))}
          </ol>
          <form className='mercado-a-compositor' onSubmit={aoEnviar}>
            <textarea
              name='mensagem'
              aria-label={`Mensagem para ${interlocutor}`}
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
            {conversaAusente
              ? 'Conversa não encontrada.'
              : 'Escolha uma conversa para acompanhar o serviço.'}
          </p>
        </div>
      )}
    </div>
  );
}
