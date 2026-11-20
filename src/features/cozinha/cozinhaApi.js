import { contaApi } from '../../app/dados/contaApi';
import { listarApi } from '../../app/dados/contratoApi';

export async function carregarCozinha(usuario, casa, opcoes) {
  const [
    produtos,
    publicas,
    privadas,
    favoritas,
    receitasUsuario,
    itensCompra,
  ] = await Promise.all([
    listarApi('/produtos', opcoes),
    listarApi('/receitas', opcoes),
    listarApi(`/receitas/user/${usuario}`, opcoes),
    listarApi(`/users/${usuario}/receitas-favoritas`, opcoes),
    listarApi(`/users/${usuario}/receitas`, opcoes),
    Promise.all(
      (casa.compras ?? []).map(lista =>
        listarApi(`/compras/${lista.id}/itens`, opcoes)
      )
    ),
  ]);
  const disponiveis = [
    ...new Map(
      [...privadas, ...publicas].map(receita => [receita.id, receita])
    ).values(),
  ];
  const ingredientes = await Promise.all(
    disponiveis.map(receita =>
      listarApi(`/receitas/${receita.id}/itens`, opcoes)
    )
  );
  return {
    produto: produtos,
    receitas: disponiveis.map(receita => ({
      ...receita,
      status:
        receita.status_publicacao ??
        (receita.publica ? 'publicada' : 'rascunho'),
    })),
    receita_item: ingredientes.flat(),
    receita_favorita: favoritas.map(receita => ({
      receita_id: receita.id,
      user_id: usuario,
    })),
    receita_usuario: receitasUsuario,
    compra_item: itensCompra.flat(),
  };
}

function gravar(caminho, id, dados) {
  return contaApi(id ? `${caminho}/${id}` : caminho, {
    metodo: dados ? (id ? 'PATCH' : 'POST') : 'DELETE',
    dados,
  });
}

export function salvarEstoque(id, dados) {
  return gravar('/estoque-itens', id, dados);
}

export function salvarProduto(dados) {
  return gravar('/produtos', null, dados);
}

export function salvarListaCompras(id, dados) {
  return gravar('/compras', id, dados);
}

export function salvarItemCompra(listaId, id, dados) {
  return gravar(`/compras/${listaId}/itens`, id, dados);
}

export function marcarComprado(listaId, id, comprado) {
  return contaApi(`/compras/${listaId}/itens/${id}/comprado`, {
    metodo: 'PATCH',
    dados: { comprado },
  });
}

export function favoritarReceita(id, userId, favorito) {
  return contaApi(`/receitas/${id}/favoritos`, {
    metodo: favorito ? 'POST' : 'DELETE',
    params: { userId },
  });
}

export function planejarReceita(id, userId, status, existe) {
  if (!status && !existe) return;
  return contaApi(`/users/${userId}/receitas/${id}`, {
    metodo: status ? (existe ? 'PATCH' : 'POST') : 'DELETE',
    dados: status ? { status } : undefined,
  });
}

export function excluirReceita(id) {
  return gravar('/receitas', id);
}

export function adicionarAoEstoque(casaId, produtoId, quantidade) {
  return contaApi(`/estoque-itens/casa/${casaId}/adicionar`, {
    metodo: 'POST',
    dados: { produtoId, quantidade },
  });
}

export async function salvarReceitaApi(receita, ingredientes, userId, arquivo) {
  const { id, nome, preparo, descricao, tipo, imagem, status } = receita;
  const dados = {
    userId,
    publica: false,
    nome,
    preparo,
    descricao,
    tipo: tipo ?? '',
    imagem: arquivo ? undefined : imagem,
    statusPublicacao: status,
    ingredientes: ingredientes.map(item => ({
      nomeItem: item.nome_item.trim() || null,
      produtoId: Number(item.produto_id) || null,
      quantidade: Number(item.quantidade),
    })),
  };
  let corpo = dados;
  if (arquivo) {
    corpo = new FormData();
    corpo.append('receita', new Blob([JSON.stringify(dados)], { type: 'application/json' }));
    corpo.append('arquivo', arquivo);
  }
  const resposta = await gravar('/receitas', id, corpo);
  return resposta?.id ?? id;
}
