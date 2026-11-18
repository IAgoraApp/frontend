import { useState } from 'react';
import { alterarBancoMarketplace, moeda } from '../../app/dados/bancoMvp';
import { atualizarAcordo } from './contratacoes';

const formatarAgendamento = data =>
  new Date(data).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });

export default function AcordoServico({ pedido, propostas, userId }) {
  const [editando, setEditando] = useState(false);
  const [erro, setErro] = useState('');
  const proposta = propostas?.findLast(
    item => item.contratado_id === pedido.id && item.status === 'pendente'
  );
  const minha = proposta?.autor_user_id === userId;

  function executar(tipo, campos = {}) {
    try {
      alterarBancoMarketplace(db =>
        atualizarAcordo(db, pedido.id, userId, {
          tipo,
          propostaId: proposta?.id ?? null,
          ...campos,
        })
      );
      setErro('');
      setEditando(false);
    } catch (falha) {
      setErro(falha.message);
    }
  }

  if (pedido.status !== 'pendente') {
    if (!['aceito', 'em_andamento', 'concluido'].includes(pedido.status))
      return null;
    return (
      <section className='mercado-a-acordo' aria-label='Serviço combinado'>
        <strong>
          {pedido.status === 'concluido'
            ? 'Serviço concluído'
            : 'Serviço marcado'}
        </strong>
        <p>
          {[
            pedido.data_agendamento &&
              formatarAgendamento(pedido.data_agendamento),
            pedido.valor > 0 && moeda(pedido.valor),
          ]
            .filter(Boolean)
            .join(' · ')}
        </p>
      </section>
    );
  }

  return (
    <section className='mercado-a-acordo' aria-label='Acordo do serviço'>
      {proposta && (
        <div className='mercado-a-acordo-resumo'>
          <strong>
            {minha
              ? 'Aguardando confirmação'
              : 'Proposta de serviço'}
          </strong>
          <p>
            {formatarAgendamento(proposta.data_agendamento)} ·{' '}
            {moeda(proposta.valor)}
          </p>
        </div>
      )}
      {editando ? (
        <form
          className='mercado-a-acordo-form'
          onSubmit={evento => {
            evento.preventDefault();
            const dados = new FormData(evento.currentTarget);
            executar('propor', {
              data: dados.get('data'),
              valor: dados.get('valor'),
            });
          }}
        >
          <label>
            Data e horário{' '}
            <input
              name='data'
              type='datetime-local'
              required
              defaultValue={(
                proposta?.data_agendamento ?? pedido.data_agendamento
              )?.slice(0, 16)}
            />
          </label>
          <label>
            Valor combinado (R$){' '}
            <input
              name='valor'
              type='number'
              min='0.01'
              step='0.01'
              required
              defaultValue={
                proposta?.valor ?? (pedido.valor > 0 ? pedido.valor : '')
              }
            />
          </label>
          <p>O pagamento é feito diretamente com a empresa.</p>
          <div className='mercado-a-contato-acoes'>
            <button type='submit' className='mvp-primario'>
              Enviar proposta
            </button>
            <button
              type='button'
              className='mvp-link'
              onClick={() => {
                setEditando(false);
                setErro('');
              }}
            >
              Voltar
            </button>
          </div>
        </form>
      ) : (
        <div className='mercado-a-contato-acoes'>
          {proposta && !minha && (
            <button
              type='button'
              className='mvp-primario'
              onClick={() => executar('confirmar')}
            >
              Aceitar proposta
            </button>
          )}
          <button
            type='button'
            className={proposta ? 'mvp-link' : 'mvp-primario'}
            onClick={() => {
              setErro('');
              setEditando(true);
            }}
          >
            {proposta
              ? minha
                ? 'Revisar proposta'
                : 'Enviar contraproposta'
              : 'Confirmar serviço'}
          </button>
          {proposta && (
            <button
              type='button'
              className='mvp-link'
              onClick={() => executar(minha ? 'retirar' : 'recusar')}
            >
              {minha ? 'Retirar proposta' : 'Recusar proposta'}
            </button>
          )}
        </div>
      )}
      {erro && (
        <p role='alert' className='mvp-confirmacao'>
          {erro}
        </p>
      )}
    </section>
  );
}
