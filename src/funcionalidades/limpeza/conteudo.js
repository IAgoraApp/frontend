import {
  CHAVE_ROTINA,
  lerEstadoRotina,
  redutorTarefas,
  validarTarefa,
} from '../rotina/utilitarios/tarefas';
import { analisarData, chaveData } from '../rotina/utilitarios/datas';

export const CHAVE_LIMPEZA = 'iagora:limpeza:v1';

export const guiasLimpeza = [
  {
    id: 'banheiro',
    room: 'Banheiro',
    title: 'Limpeza do banheiro',
    description:
      'Um passo simples para manter o banheiro limpo, saudável e sem mofo.',
    image: 'guia-banheiro',
    steps: [
      'Retire os itens da bancada e mantenha o ambiente ventilado.',
      'Limpe pia e bancada com o produto indicado para a superfície.',
      'Cuide do vaso sanitário com utensílios exclusivos para essa área.',
      'Limpe superfícies e piso, seguindo as instruções de uso do produto.',
      'Enxágue quando indicado, seque e organize os itens.',
    ],
  },
  {
    id: 'cozinha',
    room: 'Cozinha',
    title: 'Como limpar a cozinha',
    description:
      'Uma bancada livre e pequenos cuidados deixam a cozinha pronta para o dia.',
    image: 'guia-cozinha',
    steps: [
      'Guarde alimentos e retire resíduos das superfícies.',
      'Lave a louça e libere a pia.',
      'Limpe a bancada e os móveis com produto apropriado.',
      'Retire o lixo de acordo com a coleta da sua região.',
      'Cuide do piso e deixe os panos secarem.',
    ],
  },
  {
    id: 'sala',
    room: 'Sala',
    title: 'Sala sempre em ordem',
    description:
      'Organização possível para os espaços que você usa todos os dias.',
    image: 'guia-sala',
    steps: [
      'Recolha objetos e dê a cada um um lugar.',
      'Retire o pó com pano adequado às superfícies.',
      'Aspire ou varra sem arrastar os móveis pesados.',
      'Limpe o piso seguindo a orientação do fabricante.',
      'Abra espaço para circulação e organize o ambiente.',
    ],
  },
  {
    id: 'quarto',
    room: 'Quarto',
    title: 'Um quarto para descansar',
    description: 'Cuidados simples com seu espaço de descanso.',
    image: 'guia-quarto',
    steps: [
      'Separe as roupas limpas e usadas.',
      'Organize os objetos e libere a circulação.',
      'Retire o pó das superfícies.',
      'Cuide do piso e da roupa de cama conforme os rótulos.',
      'Mantenha o ambiente ventilado quando possível.',
    ],
  },
];

export const materiaisLimpeza = [
  'Panos separados por área',
  'Esponja e escova em boas condições',
  'Vassoura, pá e balde',
  'Detergente e produto adequado para cada superfície',
  'Luvas quando indicadas no rótulo',
];

export const cadenciaLimpeza = {
  diaria: [
    [
      'Lavar a louça e liberar a pia',
      'Uma bancada livre já muda a sensação da cozinha.',
    ],
    [
      'Tirar o lixo e separar os recicláveis',
      'Siga os dias de coleta da sua região.',
    ],
    [
      'Dar atenção ao banheiro',
      'Pia, vaso e superfícies: cuide de um ponto por vez.',
    ],
    [
      'Varrer os ambientes mais usados',
      'Entrada, cozinha e o caminho que você faz todo dia.',
    ],
  ],
  semanal: [
    ['Limpar o banheiro', 'Separe utensílios exclusivos para cada área.'],
    ['Trocar a roupa de cama', 'Siga as instruções das etiquetas.'],
    [
      'Tirar o pó e cuidar do piso',
      'Use produtos compatíveis com as superfícies.',
    ],
  ],
  mensal: [
    ['Organizar armários', 'Escolha uma parte de cada vez.'],
    ['Revisar os produtos de limpeza', 'Confira validade e embalagem.'],
    [
      'Cuidar dos cantos menos usados',
      'Inclua apenas o que faz sentido na sua casa.',
    ],
  ],
};

export const abasLimpeza = [
  ['inicio', 'Casa leve'],
  ['biblioteca', 'Biblioteca'],
  ['checklist', 'Meu checklist'],
  ['materiais', 'Materiais'],
];

export const cabecalhosLimpeza = {
  biblioteca: [
    'Um cuidado de cada vez',
    'Guias práticos para facilitar a rotina da sua casa.',
  ],
  checklist: [
    'Pequenas ações, grandes resultados',
    'Acompanhe os cuidados do dia e personalize sua lista.',
  ],
  materiais: [
    'Seu primeiro kit de limpeza',
    'Poucos itens bem escolhidos resolvem boa parte do básico.',
  ],
};

export const estadoInicialLimpeza = () => ({
  version: 1,
  checks: {},
  tasks: [
    {
      id: 'dishes',
      title: 'Lavar a louça',
      room: 'Cozinha',
      frequency: 'Diária',
      materials: '',
    },
    {
      id: 'sink',
      title: 'Limpar a pia da cozinha',
      room: 'Cozinha',
      frequency: 'Diária',
      materials: '',
    },
    {
      id: 'floor',
      title: 'Varrer a sala',
      room: 'Sala',
      frequency: 'Diária',
      materials: '',
    },
    {
      id: 'bathroom',
      title: 'Limpar o banheiro',
      room: 'Banheiro',
      frequency: 'Semanal',
      materials: '',
    },
    {
      id: 'trash',
      title: 'Tirar o lixo',
      room: 'Cozinha',
      frequency: 'Diária',
      materials: '',
    },
  ],
});

export function lerEstadoLimpeza() {
  try {
    const bruto = localStorage.getItem(CHAVE_LIMPEZA);
    if (!bruto) return { dados: estadoInicialLimpeza(), erro: false };
    const dados = JSON.parse(bruto);
    if (
      dados?.version !== 1 ||
      !dados.checks ||
      Array.isArray(dados.checks) ||
      typeof dados.checks !== 'object' ||
      !Array.isArray(dados.tasks) ||
      !dados.tasks.every(
        item =>
          typeof item.id === 'string' &&
          typeof item.title === 'string' &&
          typeof item.room === 'string'
      )
    ) {
      throw new Error('invalido');
    }
    return { dados, erro: false };
  } catch {
    return { dados: estadoInicialLimpeza(), erro: true };
  }
}

export function adicionarLimpezaNaRotina(valores, guia) {
  const data = analisarData(valores.data);
  if (!data) throw new Error('Informe uma data válida.');
  const tarefa = {
    id: crypto.randomUUID(),
    title: guia.title,
    category: 'casa',
    date: valores.data,
    time: valores.horario,
    frequency: valores.frequencia,
    weekdays: valores.frequencia === 'weekly' ? [data.getDay()] : [],
    endDate: '',
    notes: 'Limpeza · ' + guia.room + '\n' + guia.steps.join('\n'),
    reminder: valores.lembrete,
    excludedDates: [],
    icon: 'limpeza',
    source: 'limpeza',
    guideId: guia.id,
  };
  if (Object.keys(validarTarefa(tarefa)).length) {
    throw new Error('Confira data, horário e frequência.');
  }
  const estado = lerEstadoRotina();
  if (
    estado.tasks.some(
      item =>
        item.guideId === guia.id &&
        item.date === tarefa.date &&
        item.time === tarefa.time &&
        item.frequency === tarefa.frequency
    )
  ) {
    return false;
  }
  localStorage.setItem(
    CHAVE_ROTINA,
    JSON.stringify(redutorTarefas(estado, { type: 'add', tasks: [tarefa] }))
  );
  return true;
}

export const chaveHojeLimpeza = () => chaveData();
