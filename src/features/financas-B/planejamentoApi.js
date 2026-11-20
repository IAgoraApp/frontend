import { contaApi } from '../../app/dados/contaApi';
import { listarApi } from '../../app/dados/contratoApi';

export async function carregarDinheiro(usuario, opcoes) {
  const [situacao, gastos, metas] = await Promise.all([
    contaApi('/meu-dinheiro', opcoes),
    listarApi('/meu-dinheiro/gastos', opcoes),
    listarApi('/metas-mudanca', opcoes),
  ]);
  return {
    dinheiro_preparacao: [
      {
        ...situacao,
        user_id: usuario,
        gastos,
        metas: metas.map(({ estimativa_mudanca, ...meta }) => ({
          ...meta,
          estimativaMudanca: estimativa_mudanca,
        })),
      },
    ],
  };
}

export function salvarSituacaoFinanceira(dados) {
  return contaApi('/meu-dinheiro', { metodo: 'PATCH', dados });
}

function salvarItem(rota, id, dados) {
  return contaApi(id ? `${rota}/${id}` : rota, {
    metodo: dados ? (id ? 'PATCH' : 'POST') : 'DELETE',
    dados,
  });
}

export function salvarGastoAtual(id, gasto) {
  return salvarItem('/meu-dinheiro/gastos', id, gasto);
}

export function salvarMetaMudanca(id, meta) {
  return salvarItem('/metas-mudanca', id, meta);
}

export async function carregarMoradia(usuario, opcoes) {
  const [imoveis, planos] = await Promise.all([
    listarApi('/casas-desejadas', opcoes),
    listarApi(`/planos-moradia/user/${usuario}`, opcoes),
  ]);
  // O endereço vem incluído apenas nas respostas de imóveis da própria conta.
  const enderecos = imoveis.map(item => item.endereco).filter(Boolean);
  const [custos, categorias] = await Promise.all([
    Promise.all(
      planos.map(item => listarApi(`/planos-moradia/${item.id}/custos`, opcoes))
    ),
    Promise.all([
      ...imoveis.map(item =>
        consultarCategorias({ casaDesejadaId: item.id }, opcoes)
      ),
      ...planos
        .filter(item => !item.casa_desejada_id)
        .map(item => consultarCategorias({ planoId: item.id }, opcoes)),
    ]),
  ]);
  return {
    casa_desejada: imoveis,
    endereco: enderecos,
    plano_moradia: planos,
    custo_moradia: custos.flat(),
    categorias_custos_preparacao: categorias.flat().map(item => ({
      ...item,
      usuario,
      escopo: item.casa_desejada_id
        ? 'imovel:' + item.casa_desejada_id
        : 'plano:' + item.plano_id,
    })),
    vinculos_planos_imoveis: planos
      .filter(item => item.casa_desejada_id)
      .map(item => ({
        user_id: usuario,
        plano_id: item.id,
        imovel_id: item.casa_desejada_id,
      })),
  };
}

export async function salvarImovelApi(id, valores) {
  if (!valores) return salvarItem('/casas-desejadas', id);
  const { titulo, descricao, tipo, valor, valor_tipo, mobilia } = valores;
  const camposEndereco = [
    'rua',
    'numero',
    'complemento',
    'bairro',
    'cidade',
    'estado',
    'cep',
  ];
  const endereco = Object.fromEntries(
    camposEndereco.map(campo => [campo, valores[campo]])
  );
  const temEndereco = Object.values(endereco).some(Boolean);
  if (
    temEndereco &&
    ['rua', 'bairro', 'cidade', 'estado', 'cep'].some(campo => !endereco[campo])
  )
    throw new Error(
      'Preencha rua, bairro, cidade, estado e CEP para salvar o endereço.'
    );
  const resposta = await salvarItem('/casas-desejadas', id, {
    titulo,
    descricao: descricao ?? '',
    tipo,
    valor,
    valorTipo: valor_tipo,
    mobilia,
    ...(temEndereco && { endereco }),
  });
  return resposta?.id ?? id;
}

export async function salvarPlano(id, dados, casaDesejadaId, statusAnterior) {
  if (!dados) return salvarItem('/planos-moradia', id);
  const { nome, renda_mensal, reserva_atual, mudanca_prevista, status } = dados;
  const resultado = await salvarItem('/planos-moradia', id, {
    nome,
    rendaMensal: renda_mensal,
    reservaAtual: reserva_atual,
    mudancaPrevista: mudanca_prevista,
    casaDesejadaId,
  });
  if (id && status && status !== statusAnterior) {
    const acao = {
      ativo: 'reativar',
      arquivado: 'arquivar',
      concluido: 'concluir',
    }[status];
    await contaApi(`/planos-moradia/${id}/${acao}`, { metodo: 'PATCH' });
  }
  return resultado?.id ?? id;
}

export function salvarCusto(planoId, id, dados) {
  return salvarItem(
    id ? '/custos-moradia' : `/planos-moradia/${planoId}/custos`,
    id,
    dados
  );
}

function consultarCategorias(params, opcoes) {
  return listarApi('/categorias-custo-inicial', { ...opcoes, params });
}

export function editarCategoriaCusto(escopo, categoria, dados) {
  const [tipo, id] = escopo.split(':');
  const params = {
    [tipo === 'imovel' ? 'casaDesejadaId' : 'planoId']: Number(id),
  };
  if (!dados)
    return contaApi(`/categorias-custo-inicial/${categoria}`, {
      metodo: 'DELETE',
      params,
    });
  return contaApi('/categorias-custo-inicial', {
    metodo: 'POST',
    dados: {
      ...params,
      categoria,
      titulo: dados.titulo,
      foto: String(dados.foto),
    },
  });
}

export async function salvarCustosMensais(plano, imovel, gastos) {
  const dados = gastos.map(gasto => {
    const valor = gasto.valor === '' ? null : Number(gasto.valor);
    if (
      valor != null &&
      (!Number.isFinite(valor) || valor < 0 || valor > 9999999999.99)
    )
      throw new Error('Revise o valor de ' + gasto.nome + '.');
    return {
      nome: gasto.nome,
      categoria: gasto.categoria,
      tipo: 'mensal',
      valor: valor == null ? null : Math.round(valor * 100) / 100,
    };
  });
  return contaApi('/planos-moradia/custos-mensais', {
    metodo: 'PUT',
    dados: { planoId: plano?.id, casaDesejadaId: imovel.id, custos: dados },
  });
}
