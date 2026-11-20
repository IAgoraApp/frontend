import { contaApi } from '../../app/dados/contaApi';
import {
  listarApi,
  opcionalApi,
  registroDaApi,
} from '../../app/dados/contratoApi';

export async function carregarMarketplace(detalhe, profissional, opcoes) {
  const [empresas, servicos, favoritos, contratacoes, chats, avaliacoes] =
    await Promise.all([
      listarApi('/empresas', opcoes),
      listarApi('/servicos', opcoes),
      listarApi('/servicos-favoritos', opcoes),
      profissional ? [] : listarApi('/contratacoes', opcoes),
      profissional ? [] : listarApi('/chats-servico', opcoes),
      profissional ? [] : listarApi('/minhas-avaliacoes', opcoes),
    ]);
  const chat = chats.find(item => item.id === detalhe.chat);
  const [mensagens, propostas, avaliacoesServico] = await Promise.all([
    chat ? listarApi(`/chats-servico/${chat.id}/mensagens`, opcoes) : [],
    chat?.contratado_id
      ? listarApi(`/contratacoes/${chat.contratado_id}/propostas`, opcoes)
      : [],
    servicos.some(servico => servico.id === detalhe.servico)
      ? listarApi(`/servicos/${detalhe.servico}/avaliacoes`, opcoes)
      : [],
  ]);
  const antigos = [
    ...new Set(contratacoes.map(pedido => pedido.servico_id)),
  ].filter(id => !servicos.some(item => item.id === id));
  const historico = await Promise.all(
    antigos.map(async id => {
      const servico = await opcionalApi(`/servicos/${id}`, opcoes);
      return servico ? registroDaApi(servico) : null;
    })
  );
  return {
    perfil_empresa: empresas,
    servico: [...servicos, ...historico.filter(Boolean)],
    servico_favorito: favoritos,
    servico_contratado: contratacoes,
    chat_servico: chats,
    endereco: contratacoes.map(pedido => pedido.endereco).filter(Boolean),
    mensagem: mensagens,
    propostas_marketplace: propostas,
    avaliacao_servico: [
      ...new Map(
        [...avaliacoes, ...avaliacoesServico].map(item => [item.id, item])
      ).values(),
    ],
  };
}

export function favoritarServico(id, favorito) {
  return contaApi(`/servicos/${id}/favorito`, {
    metodo: favorito ? 'PUT' : 'DELETE',
  });
}

export function abrirConversa({ empresaId, contratadoId }) {
  return contaApi('/chats-servico', {
    metodo: 'POST',
    dados: { empresaId, contratadoId },
  });
}

export function pedirAtendimento(id, dados) {
  return contaApi(`/servicos/${id}/contratar-com-conversa`, {
    metodo: 'POST',
    dados,
  });
}

export function salvarMensagem(id, mensagem) {
  return contaApi(`/chats-servico/${id}/mensagens`, {
    metodo: 'POST',
    dados: { mensagem },
  });
}

export function marcarMensagensLidas(id) {
  return contaApi(`/chats-servico/${id}/mensagens/lidas`, { metodo: 'PATCH' });
}

export function editarProposta(id, propostaId, acao, campos) {
  const caminho = `/contratacoes/${id}/propostas`;
  return acao === 'propor'
    ? contaApi(caminho, {
        metodo: 'POST',
        dados: { dataAgendamento: campos.data, valor: Number(campos.valor) },
      })
    : contaApi(`${caminho}/${propostaId}/${acao}`, { metodo: 'PATCH' });
}

export function mudarContratacao(id, acao) {
  return contaApi(`/contratacoes/${id}/${acao}`, { metodo: 'PATCH' });
}

export function ocultarConversa(id) {
  return contaApi(`/chats-servico/${id}`, { metodo: 'DELETE' });
}

export function gravarAvaliacao(contratacaoId, id, dados) {
  return contaApi(
    id ? `/avaliacoes/${id}` : `/contratacoes/${contratacaoId}/avaliacao`,
    {
      metodo: dados ? (id ? 'PATCH' : 'POST') : 'DELETE',
      dados,
    }
  );
}
