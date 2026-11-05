import test from 'node:test';
import assert from 'node:assert/strict';
import { addDays, calendarDays, dateKey, parseDate } from './dates.js';
import {
  buildSuggestions,
  initialState,
  occurrencesBetween,
  taskReducer,
  validateTask,
} from './tasks.js';

const daily = {
  id: 'daily',
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
const state = {
  version: 1,
  tasks: [daily],
  completions: [],
  agenda: { connected: false, preferences: {} },
};

test('datas locais, anos bissextos e calendários de cinco e seis semanas', () => {
  assert.equal(parseDate('2026-02-30'), null);
  assert.equal(dateKey(parseDate('2024-02-29')), '2024-02-29');
  assert.equal(addDays('2024-02-28', 2), '2024-03-01');
  assert.equal(calendarDays(new Date(2026, 6, 1)).length, 35);
  assert.equal(calendarDays(new Date(2026, 7, 1)).length, 42);
  assert.equal(parseDate(calendarDays(new Date(2026, 7, 1))[0]).getDay(), 1);
});

test('concluir uma ocorrência não conclui a repetição inteira e desfazer restaura o dia', () => {
  const occurrence = occurrencesBetween(
    state.tasks,
    [],
    '2026-07-17',
    '2026-07-17'
  )[0];
  const completed = taskReducer(state, {
    type: 'complete',
    occurrence,
    completedAt: '2026-07-17T14:10:00Z',
  });
  assert.equal(
    occurrencesBetween(
      completed.tasks,
      completed.completions,
      '2026-07-17',
      '2026-07-18'
    ).length,
    1
  );
  const duplicate = taskReducer(completed, {
    type: 'complete',
    occurrence,
    completedAt: '2026-07-17T14:10:00Z',
  });
  assert.equal(duplicate.completions.length, 1);
  const undone = taskReducer(completed, {
    type: 'undo',
    id: occurrence.occurrenceId,
  });
  assert.equal(
    occurrencesBetween(
      undone.tasks,
      undone.completions,
      '2026-07-17',
      '2026-07-18'
    ).length,
    2
  );
});

test('reagendar apenas uma ocorrência preserva os demais dias e não duplica o horário original', () => {
  const occurrence = occurrencesBetween(
    state.tasks,
    [],
    '2026-07-17',
    '2026-07-17'
  )[0];
  const next = taskReducer(state, {
    type: 'reschedule',
    occurrence,
    scope: 'occurrence',
    date: '2026-07-18',
    time: '09:00',
    newId: 'moved',
  });
  const tasks = occurrencesBetween(next.tasks, [], '2026-07-17', '2026-07-19');
  assert.equal(
    tasks.some(task => task.occurrenceDate === '2026-07-17'),
    false
  );
  assert.deepEqual(
    tasks
      .filter(task => task.occurrenceDate === '2026-07-18')
      .map(task => task.time),
    ['09:00', '14:00']
  );
  assert.equal(
    tasks.filter(task => task.occurrenceDate === '2026-07-19').length,
    1
  );
  assert.equal(
    taskReducer(state, {
      type: 'reschedule',
      occurrence,
      scope: 'occurrence',
      date: '2026-07-17',
      time: '14:00',
      newId: 'unused',
    }),
    state
  );
});

test('excluir ocorrência e série tem escopos diferentes e mantém o histórico', () => {
  const occurrence = occurrencesBetween(
    state.tasks,
    [],
    '2026-07-17',
    '2026-07-17'
  )[0];
  const one = taskReducer(state, {
    type: 'delete',
    occurrence,
    scope: 'occurrence',
  });
  assert.equal(
    occurrencesBetween(one.tasks, [], '2026-07-17', '2026-07-18').length,
    1
  );
  const completed = taskReducer(state, {
    type: 'complete',
    occurrence,
    completedAt: '2026-07-17T14:00:00Z',
  });
  const removed = taskReducer(completed, {
    type: 'delete',
    occurrence,
    scope: 'series',
  });
  assert.equal(removed.tasks.length, 0);
  assert.equal(removed.completions.length, 1);
  const restored = taskReducer(removed, {
    type: 'undo',
    id: occurrence.occurrenceId,
  });
  assert.equal(restored.tasks.length, 1);
  assert.equal(restored.tasks[0].frequency, 'none');
});

test('repetições semanais respeitam dias e término, e mensais acomodam meses curtos', () => {
  const weekly = {
    ...daily,
    frequency: 'weekly',
    weekdays: [1, 3, 5],
    endDate: '2026-07-24',
  };
  assert.deepEqual(
    occurrencesBetween([weekly], [], '2026-07-17', '2026-07-31').map(
      task => task.occurrenceDate
    ),
    ['2026-07-17', '2026-07-20', '2026-07-22', '2026-07-24']
  );
  const monthly = { ...daily, date: '2024-01-31', frequency: 'monthly' };
  assert.deepEqual(
    occurrencesBetween([monthly], [], '2024-02-01', '2024-03-31').map(
      task => task.occurrenceDate
    ),
    ['2024-02-29', '2024-03-31']
  );
});

test('reagendar uma série semanal conserva a quantidade e a distância entre os dias', () => {
  const weekly = { ...daily, frequency: 'weekly', weekdays: [1, 3, 5] };
  const original = { ...state, tasks: [weekly] };
  const occurrence = occurrencesBetween(
    original.tasks,
    [],
    '2026-07-17',
    '2026-07-17'
  )[0];
  const changedTime = taskReducer(original, {
    type: 'reschedule',
    occurrence,
    scope: 'series',
    date: '2026-07-17',
    time: '16:00',
  });
  assert.deepEqual(changedTime.tasks[0].weekdays, [1, 3, 5]);
  const shifted = taskReducer(original, {
    type: 'reschedule',
    occurrence,
    scope: 'series',
    date: '2026-07-18',
    time: '16:00',
  });
  assert.deepEqual(shifted.tasks[0].weekdays, [2, 4, 6]);
});

test('validação rejeita horário, data e repetição inválidos; sugestões usam datas futuras', () => {
  const errors = validateTask({
    ...daily,
    title: ' ',
    date: '2026-02-30',
    time: '25:00',
    frequency: 'weekly',
    weekdays: [],
  });
  assert.deepEqual(Object.keys(errors), ['title', 'date', 'time', 'weekdays']);
  const suggestions = buildSuggestions('estudos', '2026-07-17');
  assert.ok(
    suggestions.every(
      task =>
        task.date >= '2026-07-17' &&
        Object.keys(validateTask(task)).length === 0
    )
  );
  assert.ok(suggestions.every(task => task.category === 'pessoal'));
  assert.equal(initialState('2026-07-17').completions.length, 4);
});
