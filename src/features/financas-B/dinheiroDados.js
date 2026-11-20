import { alterarBancoPreparacao } from '../../app/dados/bancoMvp';
import { listar } from '../preparacao/modelo';
import { planoDeReferencia } from './moradiaDados';
import { tipoValorImovel } from '../preparacao/valorImovel';

export const destinosGasto = [
  ['continua', 'Continua após a mudança'],
  ['termina', 'Termina após a mudança'],
  ['transferido', 'Já previsto em Meu plano'],
];
export const categoriasGasto = [
  ['moradia', 'Moradia'],
  ['servicos', 'Contas e serviços'],
  ['alimentacao', 'Alimentação'],
  ['transporte', 'Transporte'],
  ['organizacao', 'Limpeza e higiene'],
  ['saude', 'Saúde'],
  ['educacao', 'Educação'],
  ['lazer', 'Lazer'],
  ['outros', 'Outros'],
];

export const nomeCustoImovel = 'Aluguel ou prestação';
const ehAluguelMensal = item =>
  item.categoria === 'moradia' &&
  [nomeCustoImovel, 'Aluguel'].includes(item.nome);

export function entradaMudanca(custos, mensalComGastosMantidos) {
  const iniciais = custos.filter(item => item.tipo === 'inicial');
  const normalizar = nome =>
    nome
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .trim()
      .toLowerCase();
  const mes = iniciais.find(item =>
    /^(?:gastos do )?primeiro mes(?: de gastos| da mudanca| de moradia)?$/.test(
      normalizar(item.nome)
    )
  );
  const aluguel =
    !mes &&
    iniciais.find(item =>
      /^(?:primeiro aluguel|aluguel do primeiro mes|primeiro mes de aluguel)$/.test(
        normalizar(item.nome)
      )
    );
  const recorrente = custos.find(
    item => item.tipo === 'mensal' && ehAluguelMensal(item)
  );
  const margem = mes
    ? centavos(mes.valor)
    : aluguel
      ? mensalComGastosMantidos -
        centavos(recorrente?.valor) +
        centavos(aluguel.valor)
      : mensalComGastosMantidos;
  const inicial = iniciais
    .filter(item => item !== mes && item !== aluguel)
    .reduce((total, item) => total + centavos(item.valor), 0);
  return { margem, inicial, valorCadastrado: Boolean(mes || aluguel) };
}

export const centavos = valor => Math.round(Number(valor ?? 0) * 100);

export function custosDoPlano(imovel, custos) {
  if (tipoValorImovel(imovel) !== 'mensal' || imovel.valor == null)
    return custos;
  return [
    ...custos.filter(
      item => !(item.tipo === 'mensal' && ehAluguelMensal(item))
    ),
    {
      tipo: 'mensal',
      categoria: 'moradia',
      nome: nomeCustoImovel,
      valor: imovel.valor,
    },
  ];
}

export function lerMeuDinheiro(banco, usuario) {
  return (
    banco.dinheiro_preparacao?.find(item => item.user_id === usuario) ?? {
      renda: null,
      gastos: [],
      metas: [],
    }
  );
}

export function resumirOrcamento(
  banco,
  usuario,
  imovel,
  planoMudanca = planoDeReferencia(banco, usuario, imovel)
) {
  const dadosDinheiro = lerMeuDinheiro(banco, usuario);
  const custosPrevistos = custosDoPlano(
    imovel,
    planoMudanca ? listar(banco, 'custo_moradia', usuario, planoMudanca.id) : []
  );
  const gastosAtuais = dadosDinheiro.gastos.reduce(
    (total, item) => total + centavos(item.valor),
    0
  );
  const gastosMantidos = dadosDinheiro.gastos
    .filter(item => item.destino === 'continua')
    .reduce((total, item) => total + centavos(item.valor), 0);
  const planejamentoMensal = custosPrevistos
    .filter(item => item.tipo === 'mensal')
    .reduce((total, item) => total + centavos(item.valor), 0);
  const inicial = custosPrevistos
    .filter(item => item.tipo === 'inicial')
    .reduce((total, item) => total + centavos(item.valor), 0);
  const renda =
    dadosDinheiro.renda ??
    (planoMudanca?.renda_mensal > 0 ? planoMudanca.renda_mensal : null);
  const gastosFuturos = (planejamentoMensal + gastosMantidos) / 100;
  const reserva = dadosDinheiro.reserva ?? planoMudanca?.reserva_atual ?? 0;
  const temCustoMensal =
    gastosMantidos > 0 || custosPrevistos.some(item => item.tipo === 'mensal');
  const temCustoInicial = custosPrevistos.some(item => item.tipo === 'inicial');
  const temPlano = temCustoMensal || temCustoInicial;
  const compra = tipoValorImovel(imovel) === 'total';
  const precoCompra = compra ? centavos(imovel?.valor) : 0;
  const mesesMeta = compra ? 6 : 1;
  const entrada = compra
    ? { margem: centavos(gastosFuturos) * mesesMeta, inicial }
    : entradaMudanca(custosPrevistos, planejamentoMensal + gastosMantidos);
  return {
    temCustoMensal,
    temCustoInicial,
    custosIniciais: inicial / 100,
    renda,
    reserva,
    temPlano,
    gastosAtuais: gastosAtuais / 100,
    gastosFuturos,
    agora: renda == null ? null : (centavos(renda) - gastosAtuais) / 100,
    depois:
      renda == null
        ? null
        : (centavos(renda) - planejamentoMensal - gastosMantidos) / 100,
    alvo: (precoCompra + entrada.inicial + entrada.margem) / 100,
    estimativaMudanca: {
      compra,
      precoCompra: precoCompra / 100,
      custosIniciais: entrada.inicial / 100,
      margem: entrada.margem / 100,
      valorCadastrado: entrada.valorCadastrado,
      meses: mesesMeta,
    },
  };
}

export function alterarDinheiro(usuario, operacao) {
  alterarBancoPreparacao(banco => {
    banco.dinheiro_preparacao ??= [];
    let registro = banco.dinheiro_preparacao.find(
      item => item.user_id === usuario
    );
    if (!registro) {
      registro = { user_id: usuario, renda: null, gastos: [], metas: [] };
      banco.dinheiro_preparacao.push(registro);
    }
    operacao(registro, banco);
  });
}

export function validarValor(valor, nome) {
  if (!Number.isFinite(valor) || valor < 0 || valor > 9999999999.99)
    throw new Error('Informe um valor válido para ' + nome + '.');
  return centavos(valor) / 100;
}
