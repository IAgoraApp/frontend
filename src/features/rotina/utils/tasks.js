import { categoriasRotina, frequenciasRotina } from '../content.js';
import {
  adicionarDias,
  chaveData,
  proximoDiaSemana,
  analisarData,
} from './dates.js';

export const CHAVE_ROTINA = 'iagora:rotina:v1';

export function criarId() {
  return crypto.randomUUID();
}

export function validarTarefa(tarefa) {
  const erros = {};
  if (!tarefa.title?.trim()) erros.title = 'Dê um título para a tarefa.';
  if (tarefa.title?.trim().length > 120) erros.title = 'Use até 120 caracteres.';
  if (!categoriasRotina.some(categoria => categoria.id === tarefa.category)) {
    erros.category = 'Selecione uma categoria.';
  }
  if (!analisarData(tarefa.date)) erros.date = 'Informe uma data válida.';
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(tarefa.time ?? '')) {
    erros.time = 'Informe um horário válido.';
  }
  if (!frequenciasRotina.some(item => item.id === tarefa.frequency)) {
    erros.frequency = 'Selecione uma frequência.';
  }
  if (tarefa.frequency === 'weekly' && !tarefa.weekdays?.length) {
    erros.weekdays = 'Escolha pelo menos um dia da semana.';
  }
  if (
    tarefa.endDate &&
    (!analisarData(tarefa.endDate) || tarefa.endDate < tarefa.date)
  ) {
    erros.endDate =
      'A repetição precisa terminar na data inicial ou depois dela.';
  }
  return erros;
}

export function ocorreEm(tarefa, dia) {
  if (dia < tarefa.date || (tarefa.endDate && dia > tarefa.endDate)) return false;
  if (tarefa.excludedDates?.includes(dia)) return false;
  if (tarefa.frequency === 'none') return dia === tarefa.date;
  if (tarefa.frequency === 'daily') return true;
  const data = analisarData(dia);
  if (tarefa.frequency === 'weekly')
    return tarefa.weekdays.includes(data.getDay());
  const ultimoDia = new Date(
    data.getFullYear(),
    data.getMonth() + 1,
    0
  ).getDate();
  return (
    data.getDate() === Math.min(analisarData(tarefa.date).getDate(), ultimoDia)
  );
}

export function ocorrenciasEntre(
  tarefas,
  conclusoes,
  inicio,
  fim,
  incluirConcluidas = false
) {
  const concluidas = new Set(
    conclusoes.map(item => `${item.taskId}:${item.occurrenceDate}`)
  );
  const ocorrencias = [];
  for (let dia = inicio; dia <= fim; dia = adicionarDias(dia, 1)) {
    for (const tarefa of tarefas) {
      if (!ocorreEm(tarefa, dia)) continue;
      const occurrenceId = `${tarefa.id}:${dia}`;
      const concluida = concluidas.has(occurrenceId);
      if (concluida && !incluirConcluidas) continue;
      ocorrencias.push({
        ...tarefa,
        occurrenceDate: dia,
        occurrenceId,
        completed: concluida,
      });
    }
  }
  return ocorrencias.sort((a, b) =>
    `${a.occurrenceDate}T${a.time}`.localeCompare(
      `${b.occurrenceDate}T${b.time}`
    )
  );
}

export function redutorTarefas(estado, acao) {
  switch (acao.type) {
    case 'add':
      return { ...estado, tasks: [...estado.tasks, ...acao.tasks] };
    case 'update':
      return {
        ...estado,
        tasks: estado.tasks.map(tarefa =>
          tarefa.id === acao.id ? { ...tarefa, ...acao.changes } : tarefa
        ),
      };
    case 'complete': {
      const { occurrence, completedAt } = acao;
      if (
        estado.completions.some(
          item =>
            item.taskId === occurrence.id &&
            item.occurrenceDate === occurrence.occurrenceDate
        )
      ) {
        return estado;
      }
      return {
        ...estado,
        completions: [
          ...estado.completions,
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
      const conclusao = estado.completions.find(item => item.id === acao.id);
      if (!conclusao) return estado;
      const tarefaExiste = estado.tasks.some(
        tarefa => tarefa.id === conclusao.taskId
      );
      return {
        ...estado,
        tasks: tarefaExiste
          ? estado.tasks
          : [
              ...estado.tasks,
              {
                id: conclusao.taskId,
                title: conclusao.title,
                category: conclusao.category,
                date: conclusao.occurrenceDate,
                time: conclusao.time,
                frequency: 'none',
                weekdays: [],
                endDate: '',
                notes: '',
                reminder: 'none',
                icon: conclusao.icon,
                excludedDates: [],
              },
            ],
        completions: estado.completions.filter(item => item.id !== acao.id),
      };
    }
    case 'delete':
      return {
        ...estado,
        tasks:
          acao.scope === 'series' || acao.occurrence.frequency === 'none'
            ? estado.tasks.filter(
                tarefa =>
                  tarefa.id !== acao.occurrence.id &&
                  tarefa.parentId !== acao.occurrence.id
              )
            : estado.tasks.map(tarefa =>
                tarefa.id === acao.occurrence.id
                  ? {
                      ...tarefa,
                      excludedDates: [
                        ...(tarefa.excludedDates ?? []),
                        acao.occurrence.occurrenceDate,
                      ],
                    }
                  : tarefa
              ),
      };
    case 'reschedule': {
      const { occurrence, date, time, scope, newId } = acao;
      if (scope === 'series' || occurrence.frequency === 'none') {
        return redutorTarefas(estado, {
          type: 'update',
          id: occurrence.id,
          changes: {
            date,
            time,
            weekdays:
              occurrence.frequency === 'weekly'
                ? occurrence.weekdays.map(
                    dia =>
                      (dia +
                        analisarData(date).getDay() -
                        analisarData(occurrence.occurrenceDate).getDay() +
                        7) %
                      7
                  )
                : occurrence.weekdays,
          },
        });
      }
      if (date === occurrence.occurrenceDate && time === occurrence.time) {
        return estado;
      }
      const proximo = redutorTarefas(estado, {
        type: 'delete',
        occurrence,
        scope: 'occurrence',
      });
      return {
        ...proximo,
        tasks: [
          ...proximo.tasks,
          {
            ...estado.tasks.find(tarefa => tarefa.id === occurrence.id),
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
      return { ...estado, agenda: { ...estado.agenda, ...acao.changes } };
    default:
      return estado;
  }
}

export function estadoInicialRotina(hoje = chaveData()) {
  const padroes = {
    frequency: 'none',
    weekdays: [],
    endDate: '',
    notes: '',
    reminder: 'none',
    excludedDates: [],
  };
  const tarefas = [
    {
      id: 'semente-louca',
      title: 'Lavar a louça',
      category: 'cozinha',
      date: hoje,
      time: '14:00',
      frequency: 'daily',
      icon: 'limpeza',
      notes:
        'Lave os itens usados no almoço e deixe a pia livre. Usar detergente neutro.',
      reminder: '15',
    },
    {
      id: 'semente-estudos',
      title: 'Estudar para o curso',
      category: 'pessoal',
      date: hoje,
      time: '19:00',
      icon: 'estudos',
    },
    {
      id: 'semente-lixo',
      title: 'Recolher o lixo',
      category: 'casa',
      date: adicionarDias(hoje, 1),
      time: '08:00',
      icon: 'excluir',
    },
    {
      id: 'semente-roupa',
      title: 'Lavar a roupa',
      category: 'casa',
      date: adicionarDias(hoje, 1),
      time: '09:00',
      icon: 'limpeza',
    },
    {
      id: 'semente-armario',
      title: 'Organizar o guarda-roupa',
      category: 'casa',
      date: adicionarDias(hoje, 1),
      time: '14:00',
      icon: 'roupas',
    },
  ].map(tarefa => ({ ...padroes, ...tarefa }));
  const historico = [
    ['Lavar a louça', 'cozinha', 'limpeza', '14:00', -1],
    ['Recolher o lixo', 'casa', 'excluir', '08:00', -1],
    ['Organizar o guarda-roupa', 'casa', 'roupas', '14:00', -2],
    ['Limpar o banheiro', 'casa', 'limpeza', '09:00', -2],
  ];
  const conclusoes = historico.map(
    ([titulo, categoria, icone, horario, deslocamento], indice) => {
      const dia = adicionarDias(hoje, deslocamento);
      const id = `semente-historico-${indice}`;
      tarefas.push({
        ...padroes,
        id,
        title: titulo,
        category: categoria,
        icon: icone,
        time: horario,
        date: dia,
      });
      return {
        id: `${id}:${dia}`,
        taskId: id,
        occurrenceDate: dia,
        title: titulo,
        category: categoria,
        icon: icone,
        time: horario,
        completedAt: `${dia}T${horario}:00`,
      };
    }
  );
  return {
    version: 1,
    tasks: tarefas,
    completions: conclusoes,
    agenda: {
      connected: false,
      preferences: { tasks: true, reminders: true, updates: true },
    },
  };
}

const mapaIconesLegado = {
  edit: 'editar',
  spark: 'brilho',
  calendar: 'calendario',
  list: 'lista',
  clock: 'relogio',
  trash: 'excluir',
  study: 'estudos',
  spray: 'limpeza',
  shirt: 'roupas',
};

export function lerEstadoRotina() {
  try {
    const valor = JSON.parse(localStorage.getItem(CHAVE_ROTINA));
    if (
      valor?.version === 1 &&
      Array.isArray(valor.tasks) &&
      Array.isArray(valor.completions) &&
      valor.tasks.every(
        tarefa =>
          typeof tarefa.id === 'string' &&
          Object.keys(validarTarefa(tarefa)).length === 0 &&
          Array.isArray(tarefa.weekdays) &&
          Array.isArray(tarefa.excludedDates)
      ) &&
      valor.completions.every(
        item =>
          typeof item.id === 'string' &&
          analisarData(item.occurrenceDate) &&
          typeof item.completedAt === 'string' &&
          typeof item.title === 'string' &&
          categoriasRotina.some(categoria => categoria.id === item.category)
      ) &&
      valor.agenda &&
      typeof valor.agenda.connected === 'boolean' &&
      valor.agenda.preferences
    ) {
      return {
        ...valor,
        tasks: valor.tasks.map(tarefa => ({
          ...tarefa,
          icon: mapaIconesLegado[tarefa.icon] ?? tarefa.icon ?? 'lista',
        })),
        completions: valor.completions.map(item => ({
          ...item,
          icon: mapaIconesLegado[item.icon] ?? item.icon ?? 'lista',
        })),
      };
    }
  } catch (erro) {
    void erro;
  }
  return estadoInicialRotina();
}

export function construirSugestoes(comando, hoje = chaveData()) {
  const normalizado = comando
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  let sugestoes = [
    {
      title: 'Revisar a geladeira',
      category: 'cozinha',
      icon: 'limpeza',
      day: 1,
      duration: 10,
    },
    {
      title: 'Limpar a cozinha',
      category: 'cozinha',
      icon: 'limpeza',
      day: 3,
      duration: 20,
    },
    {
      title: 'Trocar roupa de cama',
      category: 'casa',
      icon: 'roupas',
      day: 5,
      duration: 15,
    },
  ];
  if (/estud|curso|aprender/.test(normalizado)) {
    sugestoes = [
      {
        title: 'Planejar os estudos da semana',
        category: 'pessoal',
        icon: 'estudos',
        day: 1,
        duration: 15,
      },
      {
        title: 'Revisar o conteúdo do curso',
        category: 'pessoal',
        icon: 'estudos',
        day: 3,
        duration: 30,
      },
      {
        title: 'Praticar o que aprendeu',
        category: 'pessoal',
        icon: 'estudos',
        day: 5,
        duration: 25,
      },
    ];
  } else if (/cozinha|geladeira|louca/.test(normalizado)) {
    sugestoes = sugestoes.map((item, indice) => ({
      ...item,
      category: 'cozinha',
      title: [
        'Revisar a geladeira',
        'Limpar a pia e a bancada',
        'Organizar os armários',
      ][indice],
      icon: 'limpeza',
    }));
  }
  return sugestoes.map((item, indice) => ({
    ...item,
    id: `sugestao-${indice}`,
    date: proximoDiaSemana(item.day, hoje),
    time: ['09:00', '14:00', '10:00'][indice],
    frequency: 'weekly',
    weekdays: [item.day],
    endDate: '',
    notes: `Reserve cerca de ${item.duration} minutos. Adapte ao seu ritmo.`,
    reminder: 'none',
    excludedDates: [],
  }));
}
