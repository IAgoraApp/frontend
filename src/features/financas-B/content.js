import { analisarNumero } from '../calculadoras/content';

export const CHAVE_PLANEJAMENTO = 'iagora_planejamento_v1';

export const categoriasMudanca = [
  { id: 'moradia', nome: 'Nova moradia', cor: '#102a43' },
  { id: 'casa', nome: 'Itens da casa', cor: '#e03b00' },
  { id: 'transporte', nome: 'Transporte', cor: '#2b6777' },
  { id: 'outros', nome: 'Outros', cor: '#9fb0bf' },
];

export const estadoInicialPlanejamento = {
  exemplo: true,
  periodo: 'Este mês',
  lancamentos: [
    {
      id: 'm1',
      tipo: 'entrada',
      titulo: 'Reserva da mudança',
      data: '01 abr',
      categoria: 'moradia',
      valor: 2000,
    },
    {
      id: 'm2',
      tipo: 'saida',
      titulo: 'Primeiro aluguel',
      data: '03 abr',
      categoria: 'moradia',
      valor: 900,
    },
    {
      id: 'm3',
      tipo: 'saida',
      titulo: 'Kit da casa',
      data: '05 abr',
      categoria: 'casa',
      valor: 350,
    },
    {
      id: 'm4',
      tipo: 'saida',
      titulo: 'Transporte',
      data: '06 abr',
      categoria: 'transporte',
      valor: 150,
    },
  ],
  realidade: {
    entradaMensal: '3.200,00',
    guardado: '4.000,00',
    aluguel: '1.000,00',
    contas: '300,00',
    alimentacao: '500,00',
    transporte: '200,00',
    outros: '200,00',
  },
  custosIniciais: {
    garantia: '3.000,00',
    mudanca: '600,00',
    moveis: '2.000,00',
    primeiraCompra: '400,00',
  },
  metaEconomia: {
    valorFalta: '2.000,00',
    guardarMes: '400,00',
    jaGuardado: '0,00',
  },
};

export function lerEstadoPlanejamento() {
  try {
    const salvo = localStorage.getItem(CHAVE_PLANEJAMENTO);
    if (!salvo) return estadoInicialPlanejamento;
    const analisado = JSON.parse(salvo);
    return {
      ...estadoInicialPlanejamento,
      ...analisado,
      realidade: {
        ...estadoInicialPlanejamento.realidade,
        ...(analisado.realidade || {}),
      },
      custosIniciais: {
        ...estadoInicialPlanejamento.custosIniciais,
        ...(analisado.custosIniciais || {}),
      },
      metaEconomia: {
        ...estadoInicialPlanejamento.metaEconomia,
        ...(analisado.metaEconomia || {}),
      },
    };
  } catch {
    return estadoInicialPlanejamento;
  }
}

export function salvarEstadoPlanejamento(estado) {
  try {
    localStorage.setItem(CHAVE_PLANEJAMENTO, JSON.stringify(estado));
  } catch {
    return false;
  }
  return true;
}

export function resumirRealidade(realidade) {
  const renda = analisarNumero(realidade.entradaMensal);
  const guardado = analisarNumero(realidade.guardado);
  const aluguel = analisarNumero(realidade.aluguel);
  const contas = analisarNumero(realidade.contas);
  const alimentacao = analisarNumero(realidade.alimentacao);
  const transporte = analisarNumero(realidade.transporte);
  const outros = analisarNumero(realidade.outros);
  const custoMensal = aluguel + contas + alimentacao + transporte + outros;
  const margem = renda - custoMensal;
  return {
    renda,
    guardado,
    aluguel,
    contas,
    alimentacao,
    transporte,
    outros,
    custoMensal,
    margem,
  };
}
