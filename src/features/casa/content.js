import {
  adicionarDias,
  analisarData,
  chaveData,
} from '../rotina/utils/dates';

export const CHAVE_CASA = 'iagora:casa:v1';

export const comodosCasa = [
  'Sala',
  'Cozinha',
  'Quarto',
  'Banheiro',
  'Lavanderia',
  'Varanda',
  'Escritório',
  'Garagem',
];

export const visoesCasa = {
  residencia: [
    'Meu canto, organizado.',
    'As informações da sua residência e os cuidados que merecem atenção.',
  ],
  cadastrar: [
    'Cadastrar residência.',
    'Informe o essencial para organizar os cuidados da sua casa.',
  ],
  editar: [
    'Editar minha casa.',
    'Atualize as informações da sua residência.',
  ],
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

export const dicasCuidadoCasa = [
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

export function estadoInicialCasa() {
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
        date: chaveData(),
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
        date: adicionarDias(chaveData(), 3),
        frequency: 'none',
        notes: '',
        completedAt: null,
      },
      {
        id: 'air',
        title: 'Limpar filtro do ar-condicionado',
        room: 'Sala',
        priority: 'Baixa',
        date: adicionarDias(chaveData(), 7),
        frequency: 'monthly',
        notes: 'Consulte as instruções do fabricante.',
        completedAt: null,
      },
    ],
  };
}

export function lerEstadoCasa() {
  try {
    const bruto = localStorage.getItem(CHAVE_CASA);
    if (!bruto) return { dados: estadoInicialCasa(), erro: false };
    const valor = JSON.parse(bruto);
    if (
      valor?.version !== 1 ||
      !Array.isArray(valor.maintenance) ||
      !valor.checks ||
      typeof valor.checks !== 'object' ||
      Array.isArray(valor.checks) ||
      !valor.maintenance.every(
        item =>
          typeof item.id === 'string' &&
          typeof item.title === 'string' &&
          typeof item.room === 'string' &&
          typeof item.notes === 'string' &&
          ['Alta', 'Média', 'Baixa'].includes(item.priority) &&
          ['none', 'monthly'].includes(item.frequency) &&
          analisarData(item.date) &&
          (item.completedAt === null ||
            (typeof item.completedAt === 'string' &&
              Number.isFinite(Date.parse(item.completedAt))))
      ) ||
      (valor.residence !== null &&
        (!valor.residence ||
          typeof valor.residence.name !== 'string' ||
          typeof valor.residence.type !== 'string' ||
          typeof valor.residence.location !== 'string' ||
          !Array.isArray(valor.residence.rooms) ||
          !valor.residence.rooms.every(comodo => typeof comodo === 'string')))
    ) {
      throw new Error('invalido');
    }
    return { dados: valor, erro: false };
  } catch {
    return { dados: estadoInicialCasa(), erro: true };
  }
}

export function concluirManutencao(estado, item) {
  const concluida = { ...item, completedAt: new Date().toISOString() };
  if (item.completedAt) return estado;
  let manutencoes = estado.maintenance.map(entrada =>
    entrada.id === item.id ? concluida : entrada
  );
  if (item.frequency === 'monthly') {
    const data = new Date(item.date + 'T12:00:00');
    const dia = data.getDate();
    data.setDate(1);
    data.setMonth(data.getMonth() + 1);
    data.setDate(
      Math.min(
        dia,
        new Date(data.getFullYear(), data.getMonth() + 1, 0).getDate()
      )
    );
    manutencoes = [
      ...manutencoes,
      {
        ...item,
        id: crypto.randomUUID(),
        date: chaveData(data),
        completedAt: null,
      },
    ];
  }
  return { ...estado, example: false, maintenance: manutencoes };
}
