import { alterarBancoCobrancas, inserir } from '../../app/dados/bancoMvp';

export const emAndamento = ['ativa', 'pendente', 'atrasada'];

function obter(b, colecao, userId, id) {
  const item = b[colecao].find(r => r.user_id === userId && r.id === id);
  if (!item) throw new Error('Registro indisponível.');
  return item;
}

function cancelarPendencias(b, assinatura) {
  b.pagamento.forEach(p => {
    if (
      p.assinatura_id === assinatura.id &&
      p.user_id === assinatura.user_id &&
      p.status === 'pendente'
    )
      p.status = 'cancelado';
  });
}

export function salvarPlano(userId, planoId) {
  alterarBancoCobrancas(b => {
    if (!b.plano_assinatura.some(p => p.id === planoId && p.ativo))
      throw new Error('Este plano está indisponível.');
    const atual = b.assinatura.find(
      a => a.user_id === userId && emAndamento.includes(a.status)
    );
    if (!atual) {
      inserir(
        'assinatura',
        {
          user_id: userId,
          plano_id: planoId,
          status: 'pendente',
          inicio: new Date().toISOString(),
          proxima_cobranca: null,
          cancelada_em: null,
        },
        b
      );
    } else if (atual.plano_id !== planoId) {
      cancelarPendencias(b, atual);
      Object.assign(atual, {
        plano_id: planoId,
        status: 'pendente',
        proxima_cobranca: null,
      });
    }
  });
}

export function cancelarAssinatura(userId, id) {
  alterarBancoCobrancas(b => {
    const assinatura = obter(b, 'assinatura', userId, id);
    if (!emAndamento.includes(assinatura.status))
      throw new Error('A assinatura já foi encerrada.');
    cancelarPendencias(b, assinatura);
    Object.assign(assinatura, {
      status: 'cancelada',
      cancelada_em: new Date().toISOString(),
      proxima_cobranca: null,
    });
  });
}

export function criarCobranca(userId, assinaturaId, metodoId) {
  alterarBancoCobrancas(b => {
    const assinatura = obter(b, 'assinatura', userId, assinaturaId);
    if (!['pendente', 'atrasada'].includes(assinatura.status))
      throw new Error('A assinatura já está ativa ou encerrada.');
    if (
      b.pagamento.some(
        p =>
          p.user_id === userId &&
          p.assinatura_id === assinaturaId &&
          p.status === 'pendente'
      )
    )
      throw new Error('Já existe uma cobrança pendente para essa assinatura.');
    const plano = b.plano_assinatura.find(p => p.id === assinatura.plano_id);
    if (!plano) throw new Error('Plano indisponível.');
    if (
      Number(plano.preco) > 0 &&
      !obter(b, 'metodo_pagamento', userId, metodoId).ativo
    )
      throw new Error('Escolha um método ativo.');
    inserir(
      'pagamento',
      {
        user_id: userId,
        assinatura_id: assinaturaId,
        metodo_id: metodoId ?? null,
        publicacao_id: null,
        valor: plano.preco,
        status: 'pendente',
        gateway: 'mock',
        transacao_externa_id: null,
        criado_em: new Date().toISOString(),
        pago_em: null,
      },
      b
    );
  });
}

export function atualizarCobranca(userId, id, confirmar) {
  alterarBancoCobrancas(b => {
    const pagamento = obter(b, 'pagamento', userId, id);
    if (pagamento.status !== 'pendente')
      throw new Error('Esta cobrança já foi processada.');
    if (!confirmar) {
      pagamento.status = 'cancelado';
      return;
    }
    const assinatura = obter(b, 'assinatura', userId, pagamento.assinatura_id);
    if (
      pagamento.gateway !== 'mock' ||
      !emAndamento.includes(assinatura.status)
    )
      throw new Error('Esta cobrança não está disponível para teste.');
    pagamento.status = 'pago';
    pagamento.pago_em = new Date().toISOString();
    assinatura.status = 'ativa';
  });
}

export function cadastrarMetodoTeste(
  userId,
  { apelido, bandeira, ultimos_digitos }
) {
  if (!/^\d{4}$/.test(ultimos_digitos ?? ''))
    throw new Error('Informe quatro dígitos fictícios.');
  alterarBancoCobrancas(b => {
    const principal = !b.metodo_pagamento.some(
      m => m.user_id === userId && m.ativo && m.principal
    );
    inserir(
      'metodo_pagamento',
      {
        user_id: userId,
        tipo: 'cartao',
        apelido,
        bandeira,
        ultimos_digitos,
        token_gateway: 'tok_mock_' + crypto.randomUUID(),
        validade_mes: null,
        validade_ano: null,
        principal,
        ativo: true,
      },
      b
    );
  });
}

export function atualizarMetodo(userId, id, acao, apelido) {
  alterarBancoCobrancas(b => {
    const metodo = obter(b, 'metodo_pagamento', userId, id);
    if (!metodo.ativo) throw new Error('Este método está desativado.');
    if (acao === 'apelido') {
      metodo.apelido = apelido;
    } else if (acao === 'desativar') {
      metodo.ativo = false;
      metodo.principal = false;
    } else if (acao === 'principal') {
      b.metodo_pagamento.forEach(m => {
        if (m.user_id === userId) m.principal = m.id === id;
      });
    }
  });
}
