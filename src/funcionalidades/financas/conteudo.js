export const visoesFinancas = {
  geral: ['Meu mês', 'Acompanhe seus ganhos, gastos e mantenha o controle.'],
  lancamentos: ['Lançamentos', 'Acompanhe todas as suas entradas e saídas.'],
  categorias: ['Categorias', 'Organize seus gastos e receitas em categorias.'],
  metas: ['Metas', 'Defina seus objetivos e acompanhe seu progresso.'],
  contas: [
    'Contas e boletos',
    'Gerencie suas contas e não perca vencimentos.',
  ],
  relatorios: [
    'Relatórios',
    'Veja um resumo da sua vida financeira ao longo do tempo.',
  ],
  configuracoes: ['Configurações', 'Personalize sua experiência financeira.'],
  orcamento: ['Meu orçamento', 'Um plano possível para o seu mês'],
};

export const abasFinancas = [
  ['geral', 'Visão geral'],
  ['lancamentos', 'Lançamentos'],
  ['categorias', 'Categorias'],
  ['metas', 'Metas'],
];

export const camposOrcamento = [
  ['renda', 'Renda mensal'],
  ['moradia', 'Moradia'],
  ['alimentacao', 'Alimentação'],
  ['transporte', 'Transporte'],
  ['contas', 'Contas e serviços'],
  ['reserva', 'Reserva e objetivos'],
];

export const paletaCoresFinancas = [
  '#102a43',
  '#e03b00',
  '#3f8395',
  '#9db0bf',
  '#348664',
  '#8a659e',
];

export const perguntasSugeridasFinancas = [
  'Como organizar meus gastos?',
  'O que é uma reserva?',
];

export const CHAVE_FINANCAS = 'iagora:financas:v1';

export const formatarMoeda = valor =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    valor / 100
  );

export const hojeIso = () => {
  const data = new Date();
  return new Date(data.getTime() - data.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
};

export const chaveMes = (data = hojeIso()) => data.slice(0, 7);

export const analisarCentavos = valor => {
  const texto = String(valor).trim();
  if (!/^(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d{1,2})?$/.test(texto)) return NaN;
  return Math.round(Number(texto.replaceAll('.', '').replace(',', '.')) * 100);
};

export const formatarDecimal = valor =>
  (valor / 100).toFixed(2).replace('.', ',');

export const dataCurta = valor =>
  new Date(valor + 'T12:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  });

export const criarIdFinancas = () => crypto.randomUUID();

export function estadoInicialFinancas() {
  const mes = chaveMes();
  return {
    version: 1,
    example: true,
    categories: [
      'Moradia',
      'Alimentação',
      'Transporte',
      'Contas',
      'Saúde',
      'Educação',
      'Salário',
      'Outras receitas',
    ].map((nome, indice) => ({
      id: 'category-' + indice,
      name: nome,
      type: indice < 6 ? 'expense' : 'income',
      color: paletaCoresFinancas[indice % paletaCoresFinancas.length],
      limit: 0,
      icon:
        ['Home', 'Utensils', 'Bus', 'Receipt', 'Heart', 'Graduation'][indice] ||
        'Receipt',
    })),
    transactions: [
      {
        id: 'salary',
        name: 'Salário',
        amount: 200000,
        date: mes + '-01',
        categoryId: 'category-6',
        type: 'income',
      },
      {
        id: 'rent',
        name: 'Aluguel',
        amount: 90000,
        date: mes + '-03',
        categoryId: 'category-0',
        type: 'expense',
      },
      {
        id: 'market',
        name: 'Mercado',
        amount: 35000,
        date: mes + '-05',
        categoryId: 'category-1',
        type: 'expense',
      },
      {
        id: 'transport',
        name: 'Transporte',
        amount: 15000,
        date: mes + '-06',
        categoryId: 'category-2',
        type: 'expense',
      },
    ],
    bills: [
      {
        id: 'bill-rent',
        name: 'Aluguel',
        amount: 90000,
        date: mes + '-05',
        repeat: true,
        icon: 'Home',
      },
      {
        id: 'bill-light',
        name: 'Conta de luz',
        amount: 12000,
        date: mes + '-10',
        repeat: true,
        icon: 'Bolt',
      },
      {
        id: 'bill-internet',
        name: 'Internet',
        amount: 9900,
        date: mes + '-12',
        repeat: true,
        icon: 'Wifi',
      },
      {
        id: 'bill-condo',
        name: 'Condomínio',
        amount: 35000,
        date: mes + '-15',
        repeat: true,
        icon: 'Building',
      },
    ],
    goals: [
      {
        id: 'goal-furniture',
        name: 'Comprar meus móveis',
        amount: 300000,
        saved: 120000,
        icon: 'Sofa',
        date: '',
      },
      {
        id: 'goal-trip',
        name: 'Viagem de férias',
        amount: 200000,
        saved: 80000,
        icon: 'Plane',
        date: '',
      },
    ],
    budget: null,
    payments: [],
    preferences: { reminders: true, limits: true, summary: false },
  };
}

function normalizarOrcamento(orcamento) {
  if (!orcamento || typeof orcamento !== 'object') return null;
  const renda = orcamento.renda ?? orcamento.income;
  const moradia = orcamento.moradia ?? orcamento.housing;
  const alimentacao = orcamento.alimentacao ?? orcamento.food;
  const transporte = orcamento.transporte ?? orcamento.transport;
  const contas = orcamento.contas ?? orcamento.bills;
  const reserva = orcamento.reserva ?? orcamento.savings;
  const valores = [renda, moradia, alimentacao, transporte, contas, reserva];
  if (valores.some(valor => !Number.isSafeInteger(valor) || valor < 0)) {
    return null;
  }
  return { renda, moradia, alimentacao, transporte, contas, reserva };
}

export function estadoFinancasValido(estado) {
  if (!estado || estado.version !== 1) return false;
  const valorValido = valor => Number.isSafeInteger(valor) && valor >= 0;
  return (
    ['categories', 'transactions', 'bills', 'goals', 'payments'].every(chave =>
      Array.isArray(estado[chave])
    ) &&
    estado.categories.every(
      item =>
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        ['income', 'expense'].includes(item.type)
    ) &&
    estado.transactions.every(
      item =>
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        valorValido(item.amount) &&
        /^\d{4}-\d{2}-\d{2}$/.test(item.date) &&
        ['income', 'expense'].includes(item.type)
    ) &&
    estado.bills.every(
      item =>
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        valorValido(item.amount) &&
        /^\d{4}-\d{2}-\d{2}$/.test(item.date)
    ) &&
    estado.goals.every(
      item =>
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        valorValido(item.amount) &&
        valorValido(item.saved)
    ) &&
    estado.payments.every(
      item => typeof item.billId === 'string' && typeof item.month === 'string'
    ) &&
    estado.preferences &&
    typeof estado.preferences === 'object' &&
    (estado.budget === null || Boolean(normalizarOrcamento(estado.budget)))
  );
}

export function lerEstadoFinancas() {
  try {
    const bruto = localStorage.getItem(CHAVE_FINANCAS);
    if (!bruto) return { dados: estadoInicialFinancas(), erro: false };
    const dados = JSON.parse(bruto);
    if (!estadoFinancasValido(dados)) {
      return { dados: estadoInicialFinancas(), erro: true };
    }
    return {
      dados: {
        ...dados,
        budget: dados.budget ? normalizarOrcamento(dados.budget) : null,
      },
      erro: false,
    };
  } catch {
    return { dados: estadoInicialFinancas(), erro: true };
  }
}

export function calcularTotais(lancamentos) {
  const entradas = lancamentos
    .filter(item => item.type === 'income')
    .reduce((soma, item) => soma + item.amount, 0);
  const saidas = lancamentos
    .filter(item => item.type === 'expense')
    .reduce((soma, item) => soma + item.amount, 0);
  return { entradas, saidas, saldo: entradas - saidas };
}

export function totaisPorCategoria(categorias, lancamentos) {
  return categorias.map(categoria => ({
    ...categoria,
    spent: lancamentos
      .filter(item => item.categoryId === categoria.id)
      .reduce((soma, item) => soma + item.amount, 0),
  }));
}

export function vencimentoConta(conta, mes) {
  if (!conta.repeat) return conta.date;
  const [ano, numeroMes] = mes.split('-').map(Number);
  const dia = Math.min(
    Number(conta.date.slice(-2)),
    new Date(ano, numeroMes, 0).getDate()
  );
  return mes + '-' + String(dia).padStart(2, '0');
}

export function statusConta(conta, mes, pagamentos) {
  if (pagamentos.some(item => item.billId === conta.id && item.month === mes)) {
    return 'paga';
  }
  return vencimentoConta(conta, mes) < hojeIso() ? 'vencida' : 'pendente';
}

export function salvarRegistroFinancas(estado, colecao, registro) {
  return {
    ...estado,
    example: false,
    [colecao]: estado[colecao].some(item => item.id === registro.id)
      ? estado[colecao].map(item => (item.id === registro.id ? registro : item))
      : [...estado[colecao], registro],
  };
}

export function registrarPagamentoConta(estado, conta, mes) {
  if (estado.payments.some(item => item.billId === conta.id && item.month === mes)) {
    return estado;
  }
  const lancamento = {
    id: criarIdFinancas(),
    name: conta.name,
    amount: conta.amount,
    date: mes === chaveMes() ? hojeIso() : vencimentoConta(conta, mes),
    categoryId: conta.categoryId ?? 'category-3',
    type: 'expense',
    payment: 'Pagamento de conta',
    billId: conta.id,
  };
  return {
    ...estado,
    example: false,
    transactions: [...estado.transactions, lancamento],
    payments: [
      ...estado.payments,
      { billId: conta.id, month: mes, transactionId: lancamento.id },
    ],
  };
}

export function exportarArquivoFinancas(nome, texto, tipo) {
  const url = URL.createObjectURL(new Blob([texto], { type: tipo }));
  const link = document.createElement('a');
  link.href = url;
  link.download = nome;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
