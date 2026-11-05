import {
  readState as readRoutine,
  taskReducer,
  storageKey as routineKey,
  validateTask,
} from '../rotina/utils/tasks';
import { dateKey, parseDate } from '../rotina/utils/dates';

export const storageKey = 'iagora:limpeza:v1';
export const guides = [
  {
    id: 'banheiro',
    room: 'Banheiro',
    title: 'Limpeza do banheiro',
    description:
      'Um passo simples para manter o banheiro limpo, saudável e sem mofo.',
    image: 'PhotoGuiaBanheiro',
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
    image: 'PhotoGuiaCozinha',
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
    image: 'PhotoGuiaSala',
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
    image: 'PhotoGuiaQuarto',
    steps: [
      'Separe as roupas limpas e usadas.',
      'Organize os objetos e libere a circulação.',
      'Retire o pó das superfícies.',
      'Cuide do piso e da roupa de cama conforme os rótulos.',
      'Mantenha o ambiente ventilado quando possível.',
    ],
  },
];
export const materials = [
  'Panos separados por área',
  'Esponja e escova em boas condições',
  'Vassoura, pá e balde',
  'Detergente e produto adequado para cada superfície',
  'Luvas quando indicadas no rótulo',
];
export const cadence = {
  daily: [
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
  weekly: [
    ['Limpar o banheiro', 'Separe utensílios exclusivos para cada área.'],
    ['Trocar a roupa de cama', 'Siga as instruções das etiquetas.'],
    [
      'Tirar o pó e cuidar do piso',
      'Use produtos compatíveis com as superfícies.',
    ],
  ],
  monthly: [
    ['Organizar armários', 'Escolha uma parte de cada vez.'],
    ['Revisar os produtos de limpeza', 'Confira validade e embalagem.'],
    [
      'Cuidar dos cantos menos usados',
      'Inclua apenas o que faz sentido na sua casa.',
    ],
  ],
};
export const tabs = [
  ['inicio', 'Casa leve'],
  ['biblioteca', 'Biblioteca'],
  ['checklist', 'Meu checklist'],
  ['materiais', 'Materiais'],
];
export const headings = {
  biblioteca: [
    'Um cuidado de cada vez.',
    'Guias práticos para facilitar a rotina da sua casa.',
  ],
  checklist: [
    'Pequenas ações, grandes resultados.',
    'Acompanhe os cuidados do dia e personalize sua lista.',
  ],
  materiais: [
    'Seu primeiro kit de limpeza.',
    'Poucos itens bem escolhidos resolvem boa parte do básico.',
  ],
};
export const initialState = () => ({
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
export function readState() {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return { data: initialState(), error: false };
    const data = JSON.parse(raw);
    if (
      data?.version !== 1 ||
      !data.checks ||
      Array.isArray(data.checks) ||
      typeof data.checks !== 'object' ||
      !Array.isArray(data.tasks) ||
      !data.tasks.every(
        item =>
          typeof item.id === 'string' &&
          typeof item.title === 'string' &&
          typeof item.room === 'string'
      )
    )
      throw new Error('invalid');
    return { data, error: false };
  } catch {
    return { data: initialState(), error: true };
  }
}
export function addToRoutine(values, guide) {
  if (!parseDate(values.date)) throw new Error('Informe uma data válida.');
  const task = {
    id: crypto.randomUUID(),
    title: guide.title,
    category: 'casa',
    date: values.date,
    time: values.time,
    frequency: values.frequency,
    weekdays:
      values.frequency === 'weekly' ? [parseDate(values.date).getDay()] : [],
    endDate: '',
    notes: 'Limpeza · ' + guide.room + '\n' + guide.steps.join('\n'),
    reminder: values.reminder,
    excludedDates: [],
    icon: 'spray',
    source: 'limpeza',
    guideId: guide.id,
  };
  if (Object.keys(validateTask(task)).length)
    throw new Error('Confira data, horário e frequência.');
  const state = readRoutine();
  if (
    state.tasks.some(
      item =>
        item.guideId === guide.id &&
        item.date === task.date &&
        item.time === task.time &&
        item.frequency === task.frequency
    )
  )
    return false;
  localStorage.setItem(
    routineKey,
    JSON.stringify(taskReducer(state, { type: 'add', tasks: [task] }))
  );
  return true;
}
export const todayKey = () => dateKey();
