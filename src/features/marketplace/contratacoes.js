import { inserir } from '../../app/dados/bancoMvp';

export function chatLiberado(contratacao) {
  return ['pendente', 'aceito', 'em_andamento', 'concluido'].includes(
    contratacao?.status
  );
}

export function chatDaContratacao(db, chat) {
  const pedido = db.servico_contratado.find(c => c.id === chat?.contratado_id);
  return (
    chatLiberado(pedido) &&
    pedido.perfil_id === chat.perfil_id &&
    db.servico.some(
      s => s.id === pedido.servico_id && s.empresa_id === chat.empresa_id
    )
  );
}

export function garantirChat(db, pedido, empresaId) {
  if (
    !chatLiberado(pedido) ||
    !db.servico.some(
      s => s.id === pedido.servico_id && s.empresa_id === empresaId
    )
  )
    throw new Error(
      'Esta conversa precisa estar vinculada a um serviço válido.'
    );
  return (
    db.chat_servico.find(
      c =>
        c.contratado_id === pedido.id &&
        c.perfil_id === pedido.perfil_id &&
        c.empresa_id === empresaId
    ) ??
    inserir(
      'chat_servico',
      {
        perfil_id: pedido.perfil_id,
        empresa_id: empresaId,
        contratado_id: pedido.id,
      },
      db
    )
  );
}

export const proximosStatus = {
  pendente: [['recusado', 'Encerrar negociação']],
  aceito: [['em_andamento', 'Iniciar serviço']],
  em_andamento: [['concluido', 'Concluir serviço']],
};

export function resumoEndereco(endereco) {
  return [
    endereco?.rua,
    endereco?.numero,
    endereco?.complemento,
    endereco?.bairro,
    [endereco?.cidade, endereco?.estado].filter(Boolean).join(' - '),
    endereco?.cep,
  ]
    .filter(Boolean)
    .join(', ');
}

export function atualizarAcordo(db, pedidoId, userId, acao) {
  const pedido = db.servico_contratado.find(item => item.id === pedidoId);
  const servico = db.servico.find(item => item.id === pedido?.servico_id);
  const empresa = db.perfil_empresa.find(
    item => item.id === servico?.empresa_id
  );
  const cliente = db.perfil.find(item => item.id === pedido?.perfil_id);
  if (
    pedido?.status !== 'pendente' ||
    !cliente ||
    !empresa ||
    ![cliente.user_id, empresa.user_id].includes(userId)
  )
    throw new Error('Esta conversa não está disponível para negociação.');

  db.propostas_marketplace ??= [];
  const atual = db.propostas_marketplace.findLast(
    item => item.contratado_id === pedido.id && item.status === 'pendente'
  );
  if ((atual?.id ?? null) !== acao.propostaId)
    throw new Error('A proposta mudou. Confira os termos atualizados.');

  if (acao.tipo === 'propor') {
    const data = Date.parse(acao.data);
    const valor = Number(acao.valor);
    if (!Number.isFinite(data) || data <= Date.now())
      throw new Error('Escolha uma data e um horário futuros.');
    if (!/^\d{1,8}(\.\d{1,2})?$/.test(acao.valor) || valor <= 0)
      throw new Error('Informe um valor combinado maior que zero.');
    if (atual) atual.status = 'substituida';
    inserir(
      'propostas_marketplace',
      {
        contratado_id: pedido.id,
        autor_user_id: userId,
        data_agendamento: acao.data,
        valor,
        status: 'pendente',
      },
      db
    );
    return;
  }

  if (
    !atual ||
    (acao.tipo === 'retirar'
      ? atual.autor_user_id !== userId
      : atual.autor_user_id === userId)
  )
    throw new Error('Você não pode executar esta ação na proposta.');

  if (acao.tipo === 'confirmar') {
    if (Date.parse(atual.data_agendamento) <= Date.now())
      throw new Error('O horário da proposta já passou. Envie uma nova data.');
    atual.status = 'confirmada';
    pedido.status = 'aceito';
    pedido.data_agendamento = atual.data_agendamento;
    pedido.valor = atual.valor;
    return;
  }

  atual.status = acao.tipo === 'retirar' ? 'retirada' : 'recusada';
}
