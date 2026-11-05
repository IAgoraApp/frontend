import { categories, frequencies } from '../content.js';
import { addDays, dateKey, nextWeekday, parseDate } from './dates.js';

export const storageKey = 'iagora:rotina:v1';

export function createId() {
  return crypto.randomUUID();
}

export function validateTask(task) {
  const errors = {};
  if (!task.title?.trim()) errors.title = 'Dê um título para a tarefa.';
  if (task.title?.trim().length > 120) errors.title = 'Use até 120 caracteres.';
  if (!categories.some(category => category.id === task.category)) {
    errors.category = 'Selecione uma categoria.';
  }
  if (!parseDate(task.date)) errors.date = 'Informe uma data válida.';
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(task.time ?? '')) {
    errors.time = 'Informe um horário válido.';
  }
  if (!frequencies.some(item => item.id === task.frequency)) {
    errors.frequency = 'Selecione uma frequência.';
  }
  if (task.frequency === 'weekly' && !task.weekdays?.length) {
    errors.weekdays = 'Escolha pelo menos um dia da semana.';
  }
  if (task.endDate && (!parseDate(task.endDate) || task.endDate < task.date)) {
    errors.endDate =
      'A repetição precisa terminar na data inicial ou depois dela.';
  }
  return errors;
}

export function occursOn(task, day) {
  if (day < task.date || (task.endDate && day > task.endDate)) return false;
  if (task.excludedDates?.includes(day)) return false;
  if (task.frequency === 'none') return day === task.date;
  if (task.frequency === 'daily') return true;
  const date = parseDate(day);
  if (task.frequency === 'weekly') return task.weekdays.includes(date.getDay());
  // Uma tarefa do dia 31 cai no último dia dos meses mais curtos.
  const lastDay = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();
  return date.getDate() === Math.min(parseDate(task.date).getDate(), lastDay);
}

export function occurrencesBetween(
  tasks,
  completions,
  start,
  end,
  includeCompleted = false
) {
  const completed = new Set(
    completions.map(item => `${item.taskId}:${item.occurrenceDate}`)
  );
  const occurrences = [];
  for (let day = start; day <= end; day = addDays(day, 1)) {
    for (const task of tasks) {
      if (!occursOn(task, day)) continue;
      const occurrenceId = `${task.id}:${day}`;
      const done = completed.has(occurrenceId);
      if (done && !includeCompleted) continue;
      occurrences.push({
        ...task,
        occurrenceDate: day,
        occurrenceId,
        completed: done,
      });
    }
  }
  return occurrences.sort((a, b) =>
    `${a.occurrenceDate}T${a.time}`.localeCompare(
      `${b.occurrenceDate}T${b.time}`
    )
  );
}

export function taskReducer(state, action) {
  switch (action.type) {
    case 'add':
      return { ...state, tasks: [...state.tasks, ...action.tasks] };
    case 'update':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.id ? { ...task, ...action.changes } : task
        ),
      };
    case 'complete': {
      const { occurrence, completedAt } = action;
      if (
        state.completions.some(
          item =>
            item.taskId === occurrence.id &&
            item.occurrenceDate === occurrence.occurrenceDate
        )
      )
        return state;
      return {
        ...state,
        completions: [
          ...state.completions,
          {
            id: occurrence.occurrenceId,
            taskId: occurrence.id,
            occurrenceDate: occurrence.occurrenceDate,
            title: occurrence.title,
            category: occurrence.category,
            icon: occurrence.icon,
            time: occurrence.time,
            completedAt,
          },
        ],
      };
    }
    case 'undo': {
      const completion = state.completions.find(item => item.id === action.id);
      if (!completion) return state;
      const taskExists = state.tasks.some(
        task => task.id === completion.taskId
      );
      return {
        ...state,
        tasks: taskExists
          ? state.tasks
          : [
              ...state.tasks,
              {
                id: completion.taskId,
                title: completion.title,
                category: completion.category,
                date: completion.occurrenceDate,
                time: completion.time,
                frequency: 'none',
                weekdays: [],
                endDate: '',
                notes: '',
                reminder: 'none',
                icon: completion.icon,
                excludedDates: [],
              },
            ],
        completions: state.completions.filter(item => item.id !== action.id),
      };
    }
    case 'delete':
      return {
        ...state,
        tasks:
          action.scope === 'series' || action.occurrence.frequency === 'none'
            ? state.tasks.filter(
                task =>
                  task.id !== action.occurrence.id &&
                  task.parentId !== action.occurrence.id
              )
            : state.tasks.map(task =>
                task.id === action.occurrence.id
                  ? {
                      ...task,
                      excludedDates: [
                        ...(task.excludedDates ?? []),
                        action.occurrence.occurrenceDate,
                      ],
                    }
                  : task
              ),
      };
    case 'reschedule': {
      const { occurrence, date, time, scope, newId } = action;
      if (scope === 'series' || occurrence.frequency === 'none') {
        return taskReducer(state, {
          type: 'update',
          id: occurrence.id,
          changes: {
            date,
            time,
            weekdays:
              occurrence.frequency === 'weekly'
                ? occurrence.weekdays.map(
                    day =>
                      (day +
                        parseDate(date).getDay() -
                        parseDate(occurrence.occurrenceDate).getDay() +
                        7) %
                      7
                  )
                : occurrence.weekdays,
          },
        });
      }
      if (date === occurrence.occurrenceDate && time === occurrence.time)
        return state;
      const next = taskReducer(state, {
        type: 'delete',
        occurrence,
        scope: 'occurrence',
      });
      return {
        ...next,
        tasks: [
          ...next.tasks,
          {
            ...state.tasks.find(task => task.id === occurrence.id),
            id: newId,
            parentId: occurrence.id,
            date,
            time,
            frequency: 'none',
            weekdays: [],
            endDate: '',
            excludedDates: [],
          },
        ],
      };
    }
    case 'agenda':
      return { ...state, agenda: { ...state.agenda, ...action.changes } };
    default:
      return state;
  }
}

export function initialState(today = dateKey()) {
  const defaults = {
    frequency: 'none',
    weekdays: [],
    endDate: '',
    notes: '',
    reminder: 'none',
    excludedDates: [],
  };
  const tasks = [
    {
      id: 'seed-dishes',
      title: 'Lavar a louça',
      category: 'cozinha',
      date: today,
      time: '14:00',
      frequency: 'daily',
      icon: 'spray',
      notes:
        'Lave os itens usados no almoço e deixe a pia livre. Usar detergente neutro.',
      reminder: '15',
    },
    {
      id: 'seed-study',
      title: 'Estudar para o curso',
      category: 'pessoal',
      date: today,
      time: '19:00',
      icon: 'study',
    },
    {
      id: 'seed-trash',
      title: 'Recolher o lixo',
      category: 'casa',
      date: addDays(today, 1),
      time: '08:00',
      icon: 'trash',
    },
    {
      id: 'seed-laundry',
      title: 'Lavar a roupa',
      category: 'casa',
      date: addDays(today, 1),
      time: '09:00',
      icon: 'spray',
    },
    {
      id: 'seed-wardrobe',
      title: 'Organizar o guarda-roupa',
      category: 'casa',
      date: addDays(today, 1),
      time: '14:00',
      icon: 'shirt',
    },
  ].map(task => ({ ...defaults, ...task }));
  const history = [
    ['Lavar a louça', 'cozinha', 'spray', '14:00', -1],
    ['Recolher o lixo', 'casa', 'trash', '08:00', -1],
    ['Organizar o guarda-roupa', 'casa', 'shirt', '14:00', -2],
    ['Limpar o banheiro', 'casa', 'spray', '09:00', -2],
  ];
  const completions = history.map(
    ([title, category, icon, time, offset], i) => {
      const day = addDays(today, offset);
      const id = `seed-history-${i}`;
      tasks.push({ ...defaults, id, title, category, icon, time, date: day });
      return {
        id: `${id}:${day}`,
        taskId: id,
        occurrenceDate: day,
        title,
        category,
        icon,
        time,
        completedAt: `${day}T${time}:00`,
      };
    }
  );
  return {
    version: 1,
    tasks,
    completions,
    agenda: {
      connected: false,
      preferences: { tasks: true, reminders: true, updates: true },
    },
  };
}

export function readState() {
  try {
    const value = JSON.parse(localStorage.getItem(storageKey));
    if (
      value?.version === 1 &&
      Array.isArray(value.tasks) &&
      Array.isArray(value.completions) &&
      value.tasks.every(
        task =>
          typeof task.id === 'string' &&
          Object.keys(validateTask(task)).length === 0 &&
          Array.isArray(task.weekdays) &&
          Array.isArray(task.excludedDates)
      ) &&
      value.completions.every(
        item =>
          typeof item.id === 'string' &&
          parseDate(item.occurrenceDate) &&
          typeof item.completedAt === 'string' &&
          typeof item.title === 'string' &&
          categories.some(category => category.id === item.category)
      ) &&
      value.agenda &&
      typeof value.agenda.connected === 'boolean' &&
      value.agenda.preferences
    ) {
      return value;
    }
  } catch {
    // O estado da sessão continua utilizável se o armazenamento estiver bloqueado.
  }
  return initialState();
}

export function buildSuggestions(prompt, today = dateKey()) {
  const normalized = prompt
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  let suggestions = [
    {
      title: 'Revisar a geladeira',
      category: 'cozinha',
      icon: 'spray',
      day: 1,
      duration: 10,
    },
    {
      title: 'Limpar a cozinha',
      category: 'cozinha',
      icon: 'spray',
      day: 3,
      duration: 20,
    },
    {
      title: 'Trocar roupa de cama',
      category: 'casa',
      icon: 'shirt',
      day: 5,
      duration: 15,
    },
  ];
  if (/estud|curso|aprender/.test(normalized)) {
    suggestions = [
      {
        title: 'Planejar os estudos da semana',
        category: 'pessoal',
        icon: 'study',
        day: 1,
        duration: 15,
      },
      {
        title: 'Revisar o conteúdo do curso',
        category: 'pessoal',
        icon: 'study',
        day: 3,
        duration: 30,
      },
      {
        title: 'Praticar o que aprendeu',
        category: 'pessoal',
        icon: 'study',
        day: 5,
        duration: 25,
      },
    ];
  } else if (/cozinha|geladeira|louca/.test(normalized)) {
    suggestions = suggestions.map((item, i) => ({
      ...item,
      category: 'cozinha',
      title: [
        'Revisar a geladeira',
        'Limpar a pia e a bancada',
        'Organizar os armários',
      ][i],
      icon: 'spray',
    }));
  }
  return suggestions.map((item, i) => ({
    ...item,
    id: `suggestion-${i}`,
    date: nextWeekday(item.day, today),
    time: ['09:00', '14:00', '10:00'][i],
    frequency: 'weekly',
    weekdays: [item.day],
    endDate: '',
    notes: `Reserve cerca de ${item.duration} minutos. Adapte ao seu ritmo.`,
    reminder: 'none',
    excludedDates: [],
  }));
}
