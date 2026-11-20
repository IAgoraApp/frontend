import { contaApi } from '../../app/dados/contaApi';
import { listarApi } from '../../app/dados/contratoApi';

export async function carregarCobrancas(opcoes) {
  const [planos, assinaturas, metodos, pagamentos] = await Promise.all([
    listarApi('/planos-assinatura', opcoes),
    listarApi('/assinaturas/historico', opcoes),
    listarApi('/metodos-pagamento', opcoes),
    listarApi('/pagamentos', opcoes),
  ]);
  return {
    plano_assinatura: planos,
    assinatura: assinaturas,
    metodo_pagamento: metodos,
    pagamento: pagamentos,
  };
}

export const selecionarPlano = (planoId, id) =>
  contaApi(id ? `/assinaturas/${id}/alterar-plano` : '/assinaturas', {
    metodo: id ? 'PATCH' : 'POST',
    dados: { planoId },
  });

export const cancelarPlano = id =>
  contaApi(`/assinaturas/${id}/cancelar`, { metodo: 'PATCH' });

export const gerarCobranca = (assinaturaId, metodoId) =>
  contaApi('/pagamentos', {
    metodo: 'POST',
    dados: { assinaturaId, metodoId },
  });

export const resolverCobranca = (id, confirmar) =>
  contaApi(`/pagamentos/${id}/${confirmar ? 'confirmar' : 'cancelar'}`, {
    metodo: 'POST',
  });

export function editarMetodo(id, acao, apelido) {
  return contaApi(
    `/metodos-pagamento/${id}${acao === 'apelido' ? '' : '/' + acao}`,
    {
      metodo: 'PATCH',
      dados: acao === 'apelido' ? { apelido } : undefined,
    }
  );
}

export function criarMetodoTeste({ apelido, bandeira, ultimos_digitos }) {
  return contaApi('/metodos-pagamento/teste', {
    metodo: 'POST',
    dados: { apelido, bandeira, ultimosDigitos: ultimos_digitos },
  });
}
