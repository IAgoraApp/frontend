import { contaApi } from '../../app/dados/contaApi';
import { listarApi, registroDaApi } from '../../app/dados/contratoApi';

const rotas = {
  categoria_financas: '/categorias-financas',
  conta_financeira: '/contas-financeiras',
  transacao_financeira: '/transacoes-financeiras',
  orcamento: '/orcamentos',
  meta_financeira: '/metas-financeiras',
  recorrencia_financeira: '/recorrencias-financeiras',
};

const campos = {
  categoria_financas: ['nome', 'cor', 'icone'],
  conta_financeira: ['nome', 'tipo', 'saldo_inicial'],
  transacao_financeira: [
    'categoria_id',
    'conta_id',
    'recorrencia_id',
    'descricao',
    'tipo',
    'valor',
    'competencia',
    'vencimento',
  ],
  orcamento: ['categoria_id', 'mes', 'limite'],
  meta_financeira: ['nome', 'valor_atual', 'valor_alvo', 'prazo'],
  recorrencia_financeira: [
    'descricao',
    'tipo',
    'valor_previsto',
    'frequencia',
    'inicio_em',
    'fim_em',
  ],
};

export async function carregarFinancas(usuario, opcoes) {
  const colecoes = await Promise.all(
    Object.entries(rotas).map(async ([colecao, caminho]) => [
      colecao,
      await listarApi(`${caminho}/usuario/${usuario}`, opcoes),
    ])
  );
  return Object.fromEntries(colecoes);
}

export async function editarFinancas(colecao, registro, alteracoes) {
  const id = registro.id;
  const base = rotas[colecao];
  const caminho = id ? `${base}/${id}` : base;
  if (!alteracoes) return contaApi(caminho, { metodo: 'DELETE' });

  let acao;
  if (colecao === 'meta_financeira')
    acao = { concluida: 'concluir', cancelada: 'cancelar' }[alteracoes.status];
  if (
    colecao === 'transacao_financeira' &&
    alteracoes.status !== registro.status
  ) {
    acao = { pago: 'pagar', pendente: 'pendente' }[alteracoes.status];
  }
  if (
    colecao === 'recorrencia_financeira' &&
    Object.hasOwn(alteracoes, 'ativa') &&
    registro.ativa !== alteracoes.ativa
  ) {
    acao = alteracoes.ativa ? 'ativar' : 'desativar';
  }
  if (id && acao) {
    await contaApi(caminho + '/' + acao, { metodo: 'PATCH' });
    return { ...registro, ...alteracoes };
  }

  const dados = Object.fromEntries(
    campos[colecao].map(campo => [
      campo.replace(/_([a-z])/g, (_, letra) => letra.toUpperCase()),
      alteracoes[campo],
    ])
  );
  const resultado = await contaApi(caminho, {
    metodo: id ? 'PATCH' : 'POST',
    dados,
  });
  return resultado ? registroDaApi(resultado) : { ...registro, ...alteracoes };
}

export async function gerarMesRecorrente(id, mes, categoriaId) {
  const resultado = await contaApi(
    `/recorrencias-financeiras/${id}/gerar-mes`,
    {
      metodo: 'POST',
      dados: { mes, categoriaId },
    }
  );
  return resultado.quantidade;
}
