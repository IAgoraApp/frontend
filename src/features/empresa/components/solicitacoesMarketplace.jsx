import { useState } from 'react';
import {
  alterarBancoMarketplace,
  inserir,
  moeda,
  useBancoMvp,
} from '../../../app/dados/bancoMvp';
import {
  chatDaContratacao,
  chatLiberado,
  garantirChat,
  proximosStatus,
  resumoEndereco,
} from '../../marketplace/contratacoes';
import { statusContratacao } from '../../marketplace/marketplaceDados';
import DialogoMarketplace from '../../marketplace/dialogoMarketplace';
import AcordoServico from '../../marketplace/acordoServico';
import { CartaoEmpresa } from './empresaUi';

// Identidade da empresa disponibilizada pelo banco temporário para o painel.
const USUARIO_EMPRESA_MOCK = 4;

export default function SolicitacoesMarketplace() {
  const { b } = useBancoMvp();
  const [acao, setAcao] = useState(null);
  const [conversa, setConversa] = useState(null);
  const [erro, setErro] = useState('');
  const empresa = b.perfil_empresa.find(
    e => e.user_id === USUARIO_EMPRESA_MOCK
  );
  if (!empresa) return null;
  const servicos = new Map(
    b.servico.filter(s => s.empresa_id === empresa.id).map(s => [s.id, s])
  );
  const pedidos = b.servico_contratado
    .filter(p => servicos.has(p.servico_id))
    .slice()
    .reverse();
  const pedidoAtivo = pedidos.find(p => p.id === conversa);
  const chat = b.chat_servico.find(
    c => c.contratado_id === conversa && chatDaContratacao(b, c)
  );
  const mensagens = chat ? b.mensagem.filter(m => m.chat_id === chat.id) : [];

  function confirmar() {
    try {
      alterarBancoMarketplace(db => {
        const pedido = db.servico_contratado.find(
          p => p.id === acao.id && servicos.has(p.servico_id)
        );
        if (
          !proximosStatus[pedido?.status]?.some(
            ([status]) => status === acao.status
          )
        )
          throw new Error(
            'O serviço mudou. Reabra a ação a partir da lista.'
          );
        pedido.status = acao.status;
        if (acao.status === 'concluido')
          pedido.data_conclusao = new Date().toISOString();
      });
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
          p => p.id === conversa && servicos.has(p.servico_id)
        );
        const canal = garantirChat(db, atual, empresa.id);
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
    <CartaoEmpresa titulo='Serviços do Marketplace'>
      <p className='mb-4 text-sm text-(--texto-apoio)'>
        {empresa.nome} · Pagamento combinado diretamente com o cliente.
      </p>
      {!pedidos.length && <p>Ainda não há serviços ou conversas.</p>}
      <ul className='divide-y divide-(--borda-suave)'>
        {pedidos.map(p => (
          <li className='grid gap-2 py-3' key={p.id}>
            <div className='mercado-a-cartao-meta'>
              <strong>{servicos.get(p.servico_id).titulo}</strong>
              <span className='mercado-a-nota'>
                {statusContratacao[p.status]}
              </span>
            </div>
            <p className='text-sm'>{p.descricao}</p>
            {p.endereco_id && (
              <small>
                {resumoEndereco(b.endereco.find(e => e.id === p.endereco_id))}
              </small>
            )}
            <small>
              {b.perfil.find(perfil => perfil.id === p.perfil_id)?.nome}
              {p.data_agendamento &&
                ' · ' +
                  new Date(p.data_agendamento).toLocaleString('pt-BR', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
              {p.valor > 0 && ' · ' + moeda(p.valor)}
            </small>
            <div className='mercado-a-contato-acoes'>
              {proximosStatus[p.status]?.map(([status, rotulo]) => (
                <button
                  key={status}
                  type='button'
                  className={
                    status === 'recusado' ? 'mvp-link' : 'mvp-primario'
                  }
                  onClick={() => {
                    setErro('');
                    setAcao({ id: p.id, status, rotulo });
                  }}
                >
                  {rotulo}
                </button>
              ))}
              {chatLiberado(p) && (
                <button
                  type='button'
                  className='mvp-link'
                  onClick={() => {
                    setErro('');
                    setConversa(p.id);
                  }}
                >
                  Abrir conversa
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
      {acao && (
        <DialogoMarketplace titulo={acao.rotulo} aoFechar={() => setAcao(null)}>
          <p>Confirme a atualização deste serviço.</p>
          {erro && <p role='alert'>{erro}</p>}
          <div className='mercado-a-contato-acoes'>
            <button type='button' className='mvp-primario' onClick={confirmar}>
              Confirmar
            </button>
          </div>
        </DialogoMarketplace>
      )}
      {chatLiberado(pedidoAtivo) && (
        <DialogoMarketplace
          titulo='Conversa com o cliente'
          aoFechar={() => setConversa(null)}
        >
          <AcordoServico
            pedido={pedidoAtivo}
            propostas={b.propostas_marketplace}
            userId={empresa.user_id}
          />
          <ol className='mercado-a-pedido-mensagens'>
            {mensagens.map(m => (
              <li key={m.id}>
                <strong>
                  {m.user_id === empresa.user_id ? 'Empresa' : 'Cliente'}
                </strong>
                <p>{m.mensagem}</p>
              </li>
            ))}
          </ol>
          <form className='mercado-a-pedido-form' onSubmit={enviar}>
            <label>
              Mensagem
              <textarea name='mensagem' required maxLength={2000} rows={2} />
            </label>
            {erro && <p role='alert'>{erro}</p>}
            <button type='submit' className='mvp-primario'>
              Enviar mensagem
            </button>
          </form>
        </DialogoMarketplace>
      )}
    </CartaoEmpresa>
  );
}
