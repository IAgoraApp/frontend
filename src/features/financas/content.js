export const views = {
  geral: ['Meu mês.', 'Acompanhe seus ganhos, gastos e mantenha o controle.'],
  lancamentos: ['Lançamentos.', 'Acompanhe todas as suas entradas e saídas.'],
  categorias: ['Categorias.', 'Organize seus gastos e receitas em categorias.'],
  metas: ['Metas.', 'Defina seus objetivos e acompanhe seu progresso.'],
  contas: [
    'Contas e boletos.',
    'Gerencie suas contas e não perca vencimentos.',
  ],
  relatorios: [
    'Relatórios.',
    'Veja um resumo da sua vida financeira ao longo do tempo.',
  ],
  configuracoes: ['Configurações.', 'Personalize sua experiência financeira.'],
  orcamento: ['Meu orçamento.', 'Um plano possível para o seu mês.'],
};
export const tabs = [
  ['geral', 'Visão geral'],
  ['lancamentos', 'Lançamentos'],
  ['categorias', 'Categorias'],
  ['metas', 'Metas'],
];
export const budgetFields = [
  ['income', 'Renda mensal'],
  ['housing', 'Moradia'],
  ['food', 'Alimentação'],
  ['transport', 'Transporte'],
  ['bills', 'Contas e serviços'],
  ['savings', 'Reserva e objetivos'],
];
export const palette = [
  '#102a43',
  '#d54c15',
  '#3f8395',
  '#9db0bf',
  '#348664',
  '#8a659e',
];
export const questions = [
  'Como organizar meus gastos?',
  'O que é uma reserva?',
];

export const storageKey = 'iagora:financas:v1';
export const money = value =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    value / 100
  );
export const today = () => {
  const date = new Date();
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
};
export const monthKey = (date = today()) => date.slice(0, 7);
export const cents = value => {
  const text = String(value).trim();
  if (!/^(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d{1,2})?$/.test(text)) return NaN;
  return Math.round(Number(text.replaceAll('.', '').replace(',', '.')) * 100);
};
export const decimal = value => (value / 100).toFixed(2).replace('.', ',');
export const shortDate = value =>
  new Date(value + 'T12:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  });
export const id = () => crypto.randomUUID();
export function initialState() {
  const month = monthKey();
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
    ].map((name, i) => ({
      id: 'category-' + i,
      name,
      type: i < 6 ? 'expense' : 'income',
      color: palette[i % palette.length],
      limit: 0,
      icon:
        ['Home', 'Utensils', 'Bus', 'Receipt', 'Heart', 'Graduation'][i] ||
        'Receipt',
    })),
    transactions: [
      {
        id: 'salary',
        name: 'Salário',
        amount: 200000,
        date: month + '-01',
        categoryId: 'category-6',
        type: 'income',
      },
      {
        id: 'rent',
        name: 'Aluguel',
        amount: 90000,
        date: month + '-03',
        categoryId: 'category-0',
        type: 'expense',
      },
      {
        id: 'market',
        name: 'Mercado',
        amount: 35000,
        date: month + '-05',
        categoryId: 'category-1',
        type: 'expense',
      },
      {
        id: 'transport',
        name: 'Transporte',
        amount: 15000,
        date: month + '-06',
        categoryId: 'category-2',
        type: 'expense',
      },
    ],
    bills: [
      {
        id: 'bill-rent',
        name: 'Aluguel',
        amount: 90000,
        date: month + '-05',
        repeat: true,
        icon: 'Home',
      },
      {
        id: 'bill-light',
        name: 'Conta de luz',
        amount: 12000,
        date: month + '-10',
        repeat: true,
        icon: 'Bolt',
      },
      {
        id: 'bill-internet',
        name: 'Internet',
        amount: 9900,
        date: month + '-12',
        repeat: true,
        icon: 'Wifi',
      },
      {
        id: 'bill-condo',
        name: 'Condomínio',
        amount: 35000,
        date: month + '-15',
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
export function validState(state) {
  if (!state || state.version !== 1) return false;
  const amountValid = value => Number.isSafeInteger(value) && value >= 0;
  return (
    ['categories', 'transactions', 'bills', 'goals', 'payments'].every(key =>
      Array.isArray(state[key])
    ) &&
    state.categories.every(
      x =>
        typeof x.id === 'string' &&
        typeof x.name === 'string' &&
        ['income', 'expense'].includes(x.type)
    ) &&
    state.transactions.every(
      x =>
        typeof x.id === 'string' &&
        typeof x.name === 'string' &&
        amountValid(x.amount) &&
        /^\d{4}-\d{2}-\d{2}$/.test(x.date) &&
        ['income', 'expense'].includes(x.type)
    ) &&
    state.bills.every(
      x =>
        typeof x.id === 'string' &&
        typeof x.name === 'string' &&
        amountValid(x.amount) &&
        /^\d{4}-\d{2}-\d{2}$/.test(x.date)
    ) &&
    state.goals.every(
      x =>
        typeof x.id === 'string' &&
        typeof x.name === 'string' &&
        amountValid(x.amount) &&
        amountValid(x.saved)
    ) &&
    state.payments.every(
      x => typeof x.billId === 'string' && typeof x.month === 'string'
    ) &&
    state.preferences &&
    typeof state.preferences === 'object' &&
    (state.budget === null ||
      ['income', 'housing', 'food', 'transport', 'bills', 'savings'].every(
        key => amountValid(state.budget[key])
      ))
  );
}
export function readState() {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return { data: initialState() };
    const data = JSON.parse(raw);
    return validState(data) ? { data } : { data: initialState(), error: true };
  } catch {
    return { data: initialState(), error: true };
  }
}
export function totals(transactions) {
  const income = transactions
    .filter(x => x.type === 'income')
    .reduce((sum, x) => sum + x.amount, 0);
  const expense = transactions
    .filter(x => x.type === 'expense')
    .reduce((sum, x) => sum + x.amount, 0);
  return { income, expense, balance: income - expense };
}
export function categoryTotals(categories, transactions) {
  return categories.map(category => ({
    ...category,
    spent: transactions
      .filter(x => x.categoryId === category.id)
      .reduce((sum, x) => sum + x.amount, 0),
  }));
}
export function billDue(bill, month) {
  if (!bill.repeat) return bill.date;
  const [year, number] = month.split('-').map(Number);
  const day = Math.min(
    Number(bill.date.slice(-2)),
    new Date(year, number, 0).getDate()
  );
  return month + '-' + String(day).padStart(2, '0');
}
export function billStatus(bill, month, payments) {
  if (payments.some(x => x.billId === bill.id && x.month === month))
    return 'paid';
  return billDue(bill, month) < today() ? 'overdue' : 'pending';
}
export function saveRecord(state, collection, record) {
  return {
    ...state,
    example: false,
    [collection]: state[collection].some(x => x.id === record.id)
      ? state[collection].map(x => (x.id === record.id ? record : x))
      : [...state[collection], record],
  };
}
export function payBill(state, bill, month) {
  if (state.payments.some(x => x.billId === bill.id && x.month === month))
    return state;
  const transaction = {
    id: id(),
    name: bill.name,
    amount: bill.amount,
    date: month === monthKey() ? today() : billDue(bill, month),
    categoryId: bill.categoryId ?? 'category-3',
    type: 'expense',
    payment: 'Pagamento de conta',
    billId: bill.id,
  };
  return {
    ...state,
    example: false,
    transactions: [...state.transactions, transaction],
    payments: [
      ...state.payments,
      { billId: bill.id, month, transactionId: transaction.id },
    ],
  };
}

export function exportFile(name, text, type) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
