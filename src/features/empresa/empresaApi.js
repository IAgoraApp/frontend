import { carregarCobrancas } from '../perfil/cobrancasApi';
import { contaApi } from '../../app/dados/contaApi';
import {
  listarApi,
  opcionalApi,
  registroDaApi,
} from '../../app/dados/contratoApi';

export async function carregarEmpresa(opcoes, detalhe) {
  const empresa = await opcionalApi('/empresas/meu-perfil', opcoes);
  if (!empresa) return {};
  const [servicos, pedidos, publicacoes, planos, chats, cobrancas, endereco] =
    await Promise.all([
      listarApi('/empresas/meus-servicos', opcoes),
      listarApi('/empresas/contratacoes', opcoes),
      listarApi('/empresas/minhas-publicacoes', opcoes),
      listarApi('/planos-publicacao', opcoes),
      listarApi('/chats-servico', opcoes),
      detalhe.cobrancas ? carregarCobrancas(opcoes) : {},
      empresa.enderecoId
        ? opcionalApi('/empresas/meu-perfil/endereco', opcoes)
        : null,
    ]);
  const chat = chats.find(item => item.id === detalhe.chat);
  const [mensagens, propostas, avaliacoes] = await Promise.all([
    chat ? listarApi(`/chats-servico/${chat.id}/mensagens`, opcoes) : [],
    chat?.contratado_id
      ? listarApi(`/contratacoes/${chat.contratado_id}/propostas`, opcoes)
      : [],
    detalhe.servico && servicos.some(item => item.id === detalhe.servico)
      ? listarApi(`/servicos/${detalhe.servico}/avaliacoes`, opcoes)
      : [],
  ]);
  return {
    perfil_empresa: [registroDaApi(empresa)],
    validacoes_empresa:
      empresa.statusValidacao === 'pendente' ? [empresa.id] : [],
    servico: servicos,
    servico_contratado: pedidos,
    publicacao_servico: publicacoes,
    plano_publicacao: planos,
    ...cobrancas,
    chat_servico: chats,
    mensagem: mensagens,
    propostas_marketplace: propostas,
    avaliacao_servico: avaliacoes,
    endereco: [endereco, ...pedidos.map(pedido => pedido.endereco)]
      .filter(Boolean).map(registroDaApi),
  };
}

export async function salvarAnuncio(id, dados) {
  const resposta = await contaApi(id ? `/servicos/${id}` : '/servicos', {
    metodo: id ? 'PATCH' : 'POST',
    dados: {
      titulo: dados.titulo,
      descricao: dados.descricao,
      categoria: dados.categoria,
      preco: dados.tipo_preco === 'orcamento' ? null : dados.preco,
      tipoPreco: dados.tipo_preco,
      disponibilidade: dados.disponibilidade,
      fotos: dados.fotos,
    },
  });
  return resposta ?? { id };
}

export function acionarAnuncio(id, acao) {
  if (acao === 'excluir')
    return contaApi(`/servicos/${id}`, { metodo: 'DELETE' });
  if (acao === 'validar')
    return contaApi(`/servicos/${id}/enviar-validacao`, { metodo: 'POST' });
  return contaApi(`/servicos/${id}/${acao}`, { metodo: 'PATCH' });
}

export async function enviarImagemEmpresa(arquivo, idServico) {
  const dados = new FormData();
  dados.append('arquivo', arquivo);
  const { url } = await contaApi(
    idServico
      ? `/servicos/${idServico}/imagens`
      : '/empresas/meu-perfil/imagens',
    { metodo: 'POST', dados }
  );
  return url;
}

export function contratarAnuncio(id, planoId, renovacao) {
  return renovacao
    ? contaApi(`/publicacoes-servico/${renovacao}/renovar`, { metodo: 'POST' })
    : contaApi(`/servicos/${id}/publicacoes`, {
        metodo: 'POST',
        dados: { planoId },
      });
}

export function cancelarAnuncio(id) {
  return contaApi(`/publicacoes-servico/${id}/cancelar`, { metodo: 'PATCH' });
}

export function cobrarAnuncio(publicacaoId, metodoId) {
  return contaApi('/pagamentos', {
    metodo: 'POST',
    dados: { publicacaoId, metodoId },
  });
}

export function salvarPerfilEmpresa(dados, existe) {
  return contaApi(existe ? '/empresas/meu-perfil' : '/empresas/perfil', {
    metodo: existe ? 'PATCH' : 'POST',
    dados,
  });
}

export function validarPerfilEmpresa() {
  return contaApi('/empresas/meu-perfil/enviar-validacao', { metodo: 'POST' });
}

export function salvarEnderecoComercial(dados) {
  return contaApi('/empresas/meu-perfil/endereco', {
    metodo: 'PATCH',
    dados,
  });
}
