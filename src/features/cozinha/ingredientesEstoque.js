import { alterarBancoCompras, hoje, inserir } from '../../app/dados/bancoMvp';
import { normalizarTexto } from './content';

function diferenca(a, b) {
  return Math.max(0, Number((a - b).toFixed(2)));
}

export function ingredientesNaDespensa(itens, produtos, estoque) {
  const catalogo = new Map(produtos.map(produto => [produto.id, produto]));
  const quantidades = new Map(
    estoque.map(item => [item.produto_id, Number(item.quantidade)])
  );
  return itens.map(item => {
    const correspondencias =
      item.produto_id || !item.nome_item
        ? []
        : produtos.filter(
            produto =>
              normalizarTexto(produto.nome) === normalizarTexto(item.nome_item)
          );
    const produto = item.produto_id
      ? catalogo.get(item.produto_id)
      : correspondencias.length === 1
        ? correspondencias[0]
        : undefined;
    const disponivel = quantidades.get(produto?.id) || 0;
    const faltando = diferenca(Number(item.quantidade), disponivel);
    if (produto)
      quantidades.set(
        produto.id,
        diferenca(disponivel, Number(item.quantidade))
      );

    return {
      ...item,
      nome: item.nome_item || produto?.nome || 'Ingrediente sem nome',
      produtoId: produto?.id ?? null,
      unidade: produto?.unidade,
      faltando,
    };
  });
}

export function criarListaDaReceita(receita, casaId) {
  let listaId;
  alterarBancoCompras(banco => {
    const itens = banco.receita_item.filter(
      item => item.receita_id === receita.id
    );
    const estoque = banco.estoque_item.filter(item => item.casa_id === casaId);
    const pendencias = new Map();

    for (const ingrediente of ingredientesNaDespensa(
      itens,
      banco.produto,
      estoque
    )) {
      if (!ingrediente.faltando) continue;
      const chave = ingrediente.produtoId ?? normalizarTexto(ingrediente.nome);
      const existente = pendencias.get(chave);
      if (existente) existente.quantidade += ingrediente.faltando;
      else
        pendencias.set(chave, {
          nome_item: ingrediente.nome,
          produto_id: ingrediente.produtoId,
          quantidade: ingrediente.faltando,
        });
    }

    if (!pendencias.size)
      throw new Error('Você já tem os ingredientes desta receita.');
    const lista = inserir(
      'compras',
      { nome: receita.nome, criacao: hoje(), casa_id: casaId },
      banco
    );
    for (const item of pendencias.values()) {
      inserir(
        'compra_item',
        {
          ...item,
          quantidade: Math.ceil(Number(item.quantidade.toFixed(2))),
          compras_id: lista.id,
          comprado: false,
          valor: null,
        },
        banco
      );
    }
    listaId = lista.id;
  });
  return listaId;
}
