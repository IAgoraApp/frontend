import test from 'node:test';
import assert from 'node:assert/strict';
import {
  adicionarDias,
  diasCalendario,
  chaveData,
  analisarData,
} from './dates.js';
import {
  construirSugestoes,
  estadoInicialRotina,
  ocorrenciasEntre,
  redutorTarefas,
  validarTarefa,
} from './tasks.js';

const tarefaDiaria = {
  id: 'diaria',
  title: 'Lavar a louça',
  category: 'cozinha',
  date: '2026-07-17',
  time: '14:00',
  frequency: 'daily',
  weekdays: [],
  excludedDates: [],
  endDate: '',
  reminder: 'none',
  notes: '',
};
const estadoBase = {
  version: 1,
  tasks: [tarefaDiaria],
  completions: [],
  agenda: { connected: false, preferences: {} },
};

test('datas locais, anos bissextos e calendários de cinco e seis semanas', () => {
  assert.equal(analisarData('2026-02-30'), null);
  assert.equal(chaveData(analisarData('2024-02-29')), '2024-02-29');
  assert.equal(adicionarDias('2024-02-28', 2), '2024-03-01');
  assert.equal(diasCalendario(new Date(2026, 6, 1)).length, 35);
  assert.equal(diasCalendario(new Date(2026, 7, 1)).length, 42);
  assert.equal(analisarData(diasCalendario(new Date(2026, 7, 1))[0]).getDay(), 1);
});

test('concluir uma ocorrência não conclui a repetição inteira e desfazer restaura o dia', () => {
  const ocorrencia = ocorrenciasEntre(
    estadoBase.tasks,
    [],
    '2026-07-17',
    '2026-07-17'
  )[0];
  const concluido = redutorTarefas(estadoBase, {
    type: 'complete',
    occurrence: ocorrencia,
    completedAt: '2026-07-17T14:10:00Z',
  });
  assert.equal(
    ocorrenciasEntre(
      concluido.tasks,
      concluido.completions,
      '2026-07-17',
      '2026-07-18'
    ).length,
    1
  );
  const duplicado = redutorTarefas(concluido, {
    type: 'complete',
    occurrence: ocorrencia,
    completedAt: '2026-07-17T14:10:00Z',
  });
  assert.equal(duplicado.completions.length, 1);
  const desfeito = redutorTarefas(concluido, {
    type: 'undo',
    id: ocorrencia.occurrenceId,
  });
  assert.equal(
    ocorrenciasEntre(
      desfeito.tasks,
      desfeito.completions,
      '2026-07-17',
      '2026-07-18'
    ).length,
    2
  );
});

test('reagendar apenas uma ocorrência preserva os demais dias e não duplica o horário original', () => {
  const ocorrencia = ocorrenciasEntre(
    estadoBase.tasks,
    [],
    '2026-07-17',
    '2026-07-17'
  )[0];
  const proximo = redutorTarefas(estadoBase, {
    type: 'reschedule',
    occurrence: ocorrencia,
    scope: 'occurrence',
    date: '2026-07-18',
    time: '09:00',
    newId: 'movida',
  });
  const tarefas = ocorrenciasEntre(proximo.tasks, [], '2026-07-17', '2026-07-19');
  assert.equal(
    tarefas.some(tarefa => tarefa.occurrenceDate === '2026-07-17'),
    false
  );
  assert.deepEqual(
    tarefas
      .filter(tarefa => tarefa.occurrenceDate === '2026-07-18')
      .map(tarefa => tarefa.time),
    ['09:00', '14:00']
  );
  assert.equal(
    tarefas.filter(tarefa => tarefa.occurrenceDate === '2026-07-19').length,
    1
  );
  assert.equal(
    redutorTarefas(estadoBase, {
      type: 'reschedule',
      occurrence: ocorrencia,
      scope: 'occurrence',
      date: '2026-07-17',
      time: '14:00',
      newId: 'nao-usado',
    }),
    estadoBase
  );
});

test('excluir ocorrência e série tem escopos diferentes e mantém o histórico', () => {
  const ocorrencia = ocorrenciasEntre(
    estadoBase.tasks,
    [],
    '2026-07-17',
    '2026-07-17'
  )[0];
  const uma = redutorTarefas(estadoBase, {
    type: 'delete',
    occurrence: ocorrencia,
    scope: 'occurrence',
  });
  assert.equal(
    ocorrenciasEntre(uma.tasks, [], '2026-07-17', '2026-07-18').length,
    1
  );
  const concluido = redutorTarefas(estadoBase, {
    type: 'complete',
    occurrence: ocorrencia,
    completedAt: '2026-07-17T14:00:00Z',
  });
  const removido = redutorTarefas(concluido, {
    type: 'delete',
    occurrence: ocorrencia,
    scope: 'series',
  });
  assert.equal(removido.tasks.length, 0);
  assert.equal(removido.completions.length, 1);
  const restaurado = redutorTarefas(removido, {
    type: 'undo',
    id: ocorrencia.occurrenceId,
  });
  assert.equal(restaurado.tasks.length, 1);
  assert.equal(restaurado.tasks[0].frequency, 'none');
});

test('repetições semanais respeitam dias e término, e mensais acomodam meses curtos', () => {
  const semanal = {
    ...tarefaDiaria,
    frequency: 'weekly',
    weekdays: [1, 3, 5],
    endDate: '2026-07-24',
  };
  assert.deepEqual(
    ocorrenciasEntre([semanal], [], '2026-07-17', '2026-07-31').map(
      tarefa => tarefa.occurrenceDate
    ),
    ['2026-07-17', '2026-07-20', '2026-07-22', '2026-07-24']
  );
  const mensal = { ...tarefaDiaria, date: '2024-01-31', frequency: 'monthly' };
  assert.deepEqual(
    ocorrenciasEntre([mensal], [], '2024-02-01', '2024-03-31').map(
      tarefa => tarefa.occurrenceDate
    ),
    ['2024-02-29', '2024-03-31']
  );
});

test('reagendar uma série semanal conserva a quantidade e a distância entre os dias', () => {
  const semanal = { ...tarefaDiaria, frequency: 'weekly', weekdays: [1, 3, 5] };
  const original = { ...estadoBase, tasks: [semanal] };
  const ocorrencia = ocorrenciasEntre(
    original.tasks,
    [],
    '2026-07-17',
    '2026-07-17'
  )[0];
  const horarioAlterado = redutorTarefas(original, {
    type: 'reschedule',
    occurrence: ocorrencia,
    scope: 'series',
    date: '2026-07-17',
    time: '16:00',
  });
  assert.deepEqual(horarioAlterado.tasks[0].weekdays, [1, 3, 5]);
  const deslocado = redutorTarefas(original, {
    type: 'reschedule',
    occurrence: ocorrencia,
    scope: 'series',
    date: '2026-07-18',
    time: '16:00',
  });
  assert.deepEqual(deslocado.tasks[0].weekdays, [2, 4, 6]);
});

test('validação rejeita horário, data e repetição inválidos; sugestões usam datas futuras', () => {
  const erros = validarTarefa({
    ...tarefaDiaria,
    title: ' ',
    date: '2026-02-30',
    time: '25:00',
    frequency: 'weekly',
    weekdays: [],
  });
  assert.deepEqual(Object.keys(erros), ['title', 'date', 'time', 'weekdays']);
  const sugestoes = construirSugestoes('estudos', '2026-07-17');
  assert.ok(
    sugestoes.every(
      tarefa =>
        tarefa.date >= '2026-07-17' &&
        Object.keys(validarTarefa(tarefa)).length === 0
    )
  );
  assert.ok(sugestoes.every(tarefa => tarefa.category === 'pessoal'));
  assert.equal(estadoInicialRotina('2026-07-17').completions.length, 4);
});
