import { dateKey, addDays, parseDate } from '../rotina/utils/dates';

export const storageKey = 'iagora:casa:v1';
export const rooms = [
  'Sala',
  'Cozinha',
  'Quarto',
  'Banheiro',
  'Lavanderia',
  'Varanda',
  'Escritório',
  'Garagem',
];
export const views = {
  residencia: [
    'Meu canto, organizado.',
    'As informações da sua residência e os cuidados que merecem atenção.',
  ],
  cadastrar: [
    'Cadastrar residência.',
    'Informe o essencial para organizar os cuidados da sua casa.',
  ],
  editar: ['Editar minha casa.', 'Atualize as informações da sua residência.'],
  manutencoes: [
    'Tudo em dia, sem imprevistos.',
    'Acompanhe os cuidados da sua residência.',
  ],
  historico: [
    'Cada cuidado faz diferença.',
    'Consulte as manutenções que você já resolveu.',
  ],
  despesas: [
    'As contas do seu canto.',
    'Consulte as despesas da casa sem duplicar o controle financeiro.',
  ],
  servicos: [
    'Uma mão extra para sua casa.',
    'Encontre ajuda para limpeza, manutenção e mudança.',
  ],
};
export const careTips = [
  [
    'Olhar a geladeira antes de comprar',
    'Evite desperdício e monte uma lista que faça sentido.',
  ],
  [
    'Separar um dia para os cuidados da casa',
    'Distribua tarefas para não deixar tudo para o fim de semana.',
  ],
  [
    'Perceber o que precisa de manutenção',
    'Vazamentos, tomadas e reparos pedem atenção especializada.',
  ],
];
export function initialCasa() {
  return {
    version: 1,
    example: true,
    residence: {
      name: 'Minha casa',
      type: 'Apartamento',
      location: 'São Paulo, SP',
      rooms: ['Sala', 'Cozinha', 'Quarto', 'Banheiro', 'Lavanderia'],
    },
    checks: {},
    maintenance: [
      {
        id: 'tap',
        title: 'Revisar torneira da cozinha',
        room: 'Cozinha',
        priority: 'Alta',
        date: dateKey(),
        frequency: 'none',
        notes:
          'A torneira está pingando. Procure uma empresa de manutenção para avaliar o reparo.',
        completedAt: null,
      },
      {
        id: 'lamp',
        title: 'Trocar lâmpada do banheiro',
        room: 'Banheiro',
        priority: 'Média',
        date: addDays(dateKey(), 3),
        frequency: 'none',
        notes: '',
        completedAt: null,
      },
      {
        id: 'air',
        title: 'Limpar filtro do ar-condicionado',
        room: 'Sala',
        priority: 'Baixa',
        date: addDays(dateKey(), 7),
        frequency: 'monthly',
        notes: 'Consulte as instruções do fabricante.',
        completedAt: null,
      },
    ],
  };
}
export function readCasa() {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return { data: initialCasa(), error: false };
    const value = JSON.parse(raw);
    if (
      value?.version !== 1 ||
      !Array.isArray(value.maintenance) ||
      !value.checks ||
      typeof value.checks !== 'object' ||
      Array.isArray(value.checks) ||
      !value.maintenance.every(
        item =>
          typeof item.id === 'string' &&
          typeof item.title === 'string' &&
          typeof item.room === 'string' &&
          typeof item.notes === 'string' &&
          ['Alta', 'Média', 'Baixa'].includes(item.priority) &&
          ['none', 'monthly'].includes(item.frequency) &&
          parseDate(item.date) &&
          (item.completedAt === null ||
            (typeof item.completedAt === 'string' &&
              Number.isFinite(Date.parse(item.completedAt))))
      ) ||
      (value.residence !== null &&
        (!value.residence ||
          typeof value.residence.name !== 'string' ||
          typeof value.residence.type !== 'string' ||
          typeof value.residence.location !== 'string' ||
          !Array.isArray(value.residence.rooms) ||
          !value.residence.rooms.every(room => typeof room === 'string')))
    )
      throw new Error('invalid');
    return { data: value, error: false };
  } catch {
    return { data: initialCasa(), error: true };
  }
}
export function completeMaintenance(state, item) {
  const done = { ...item, completedAt: new Date().toISOString() };
  if (item.completedAt) return state;
  let maintenance = state.maintenance.map(entry =>
    entry.id === item.id ? done : entry
  );
  if (item.frequency === 'monthly') {
    const date = new Date(item.date + 'T12:00:00');
    const day = date.getDate();
    date.setDate(1);
    date.setMonth(date.getMonth() + 1);
    date.setDate(
      Math.min(
        day,
        new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
      )
    );
    maintenance = [
      ...maintenance,
      {
        ...item,
        id: crypto.randomUUID(),
        date: dateKey(date),
        completedAt: null,
      },
    ];
  }
  return { ...state, example: false, maintenance };
}
