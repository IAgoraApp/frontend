import { alterarBancoFinancas, inserir } from '../../app/dados/bancoMvp';

export const frequencias = [
  ['diaria', 'Diária'],
  ['semanal', 'Semanal'],
  ['mensal', 'Mensal'],
  ['anual', 'Anual'],
];

export const tiposConta = [
  ['corrente', 'Conta corrente', 'Building'],
  ['poupanca', 'Poupança', 'MoedaEconomia'],
  ['carteira', 'Carteira', 'Wallet'],
  ['dinheiro', 'Dinheiro', 'Receipt'],
];

export const camposConta = [
  { nome: 'nome', rotulo: 'Nome' },
  {
    nome: 'tipo',
    rotulo: 'Tipo',
    opcoes: tiposConta.map(([id, nome]) => [id, nome]),
  },
  {
    nome: 'saldo_inicial',
    rotulo: 'Saldo inicial (R$)',
    tipo: 'number',
    min: -9999999999999.99,
  },
];

export function tipoNomeConta(tipo) {
  return tiposConta.find(([id]) => id === tipo)?.[1] ?? tipo;
}

export function atualizarFinancas(
  colecao,
  registro,
  atualizar = () => registro
) {
  let salvo;
  alterarBancoFinancas(banco => {
    const atual = banco[colecao].find(
      item => item.id === registro.id && item.user_id === registro.user_id
    );
    if (registro.id && !atual)
      throw new Error('Este registro já foi excluído.');
    const valores = {
      ...atual,
      ...atualizar(atual),
      user_id: registro.user_id,
    };
    if (
      colecao === 'categoria_financas' &&
      banco[colecao].some(
        item =>
          item.user_id === valores.user_id &&
          item.id !== valores.id &&
          item.nome.toLocaleLowerCase('pt-BR') ===
            valores.nome.toLocaleLowerCase('pt-BR')
      )
    )
      throw new Error('Já existe uma categoria com esse nome.');
    if (
      colecao === 'orcamento' &&
      banco[colecao].some(
        item =>
          item.user_id === valores.user_id &&
          item.id !== valores.id &&
          item.categoria_id === valores.categoria_id &&
          item.mes.slice(0, 7) === valores.mes.slice(0, 7)
      )
    )
      throw new Error('Já existe um orçamento para essa categoria neste mês.');
    if (
      colecao === 'recorrencia_financeira' &&
      valores.fim_em &&
      valores.fim_em < valores.inicio_em
    ) {
      throw new Error(
        'A data final deve ser igual ou posterior à data inicial.'
      );
    }
    if (
      ['orcamento', 'transacao_financeira'].includes(colecao) &&
      !banco.categoria_financas.some(
        item =>
          item.id === valores.categoria_id && item.user_id === valores.user_id
      )
    )
      throw new Error('Escolha uma categoria disponível.');
    if (
      valores.conta_id &&
      !banco.conta_financeira.some(
        item => item.id === valores.conta_id && item.user_id === valores.user_id
      )
    )
      throw new Error('Escolha uma conta disponível.');
    salvo = atual
      ? Object.assign(atual, valores)
      : inserir(colecao, valores, banco);
  });
  return salvo;
}

export function excluirFinancas(colecao, registro) {
  alterarBancoFinancas(banco => {
    const vinculo = {
      conta_financeira: 'conta_id',
      recorrencia_financeira: 'recorrencia_id',
    }[colecao];
    if (
      colecao === 'categoria_financas' &&
      [...banco.transacao_financeira, ...banco.orcamento].some(
        item => item.categoria_id === registro.id
      )
    )
      throw new Error(
        'Altere a categoria dos lançamentos e orçamentos vinculados antes de excluí-la.'
      );
    if (vinculo) {
      banco.transacao_financeira.forEach(item => {
        if (item.user_id === registro.user_id && item[vinculo] === registro.id)
          item[vinculo] = null;
      });
    }
    banco[colecao] = banco[colecao].filter(
      item => item.id !== registro.id || item.user_id !== registro.user_id
    );
  });
}

export function saldoMovimentos(itens) {
  return (
    itens.reduce(
      (saldo, item) =>
        item.status === 'pago'
          ? saldo +
            (item.tipo === 'receita' ? 1 : -1) *
              Math.round(Number(item.valor) * 100)
          : saldo,
      0
    ) / 100
  );
}

export function gerarRecorrencia(registro, mes, categoriaId) {
  let quantidade = 0;
  alterarBancoFinancas(banco => {
    const recorrencia = banco.recorrencia_financeira.find(
      item => item.id === registro.id && item.user_id === registro.user_id
    );
    if (!recorrencia?.ativa)
      throw new Error('Ative a recorrência para gerar lançamentos.');
    if (
      !banco.categoria_financas.some(
        item => item.id === categoriaId && item.user_id === registro.user_id
      )
    )
      throw new Error('Escolha uma categoria disponível.');
    const [ano, numeroMes] = mes.split('-').map(Number);
    const dias = new Date(Date.UTC(ano, numeroMes, 0)).getUTCDate();
    const inicio = Date.parse(recorrencia.inicio_em);
    const diaOriginal = Number(recorrencia.inicio_em.slice(-2));
    const vinculados = banco.transacao_financeira.filter(
      item =>
        item.recorrencia_id === registro.id && item.user_id === registro.user_id
    );
    for (let dia = 1; dia <= dias; dia += 1) {
      const data = mes + '-' + String(dia).padStart(2, '0');
      if (
        data < recorrencia.inicio_em ||
        (recorrencia.fim_em && data > recorrencia.fim_em)
      )
        continue;
      const mensal = dia === Math.min(diaOriginal, dias);
      const coincide = {
        diaria: true,
        semanal: (Date.parse(data) - inicio) % (7 * 86400000) === 0,
        mensal,
        anual: mensal && recorrencia.inicio_em.slice(5, 7) === mes.slice(5),
      }[recorrencia.frequencia];
      if (
        !coincide ||
        vinculados.some(item => {
          const ocorrencia = item.vencimento ?? item.competencia;
          return ['mensal', 'anual'].includes(recorrencia.frequencia)
            ? ocorrencia.startsWith(mes)
            : ocorrencia === data;
        })
      )
        continue;
      inserir(
        'transacao_financeira',
        {
          user_id: registro.user_id,
          categoria_id: categoriaId,
          conta_id: null,
          recorrencia_id: registro.id,
          descricao: recorrencia.descricao,
          tipo: recorrencia.tipo,
          valor: recorrencia.valor_previsto,
          competencia: data,
          vencimento: data,
          pago_em: null,
          status: 'pendente',
        },
        banco
      );
      quantidade += 1;
    }
  });
  return quantidade;
}
