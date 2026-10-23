import test from 'node:test';
import assert from 'node:assert/strict';
import {
  financialProjection,
  nextTaskDate,
  normalize,
} from '../src/utils/format.js';
import { passwordDigest } from '../src/utils/demoAuth.js';

const records = new Map();
const events = new EventTarget();
Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: key => records.get(key) ?? null,
    setItem: (key, value) => records.set(key, value),
    removeItem: key => records.delete(key),
  },
  configurable: true,
});
globalThis.dispatchEvent = events.dispatchEvent.bind(events);
const { useAppStore } = await import('../src/store/useAppStore.js');

test('monthly recurrence respects short months and preserves the chosen day', () => {
  const february = nextTaskDate({
    date: '2027-01-31',
    frequency: 'Mensal',
    monthDay: 31,
  });
  assert.equal(february, '2027-02-28');
  assert.equal(
    nextTaskDate({ date: february, frequency: 'Mensal', monthDay: 31 }),
    '2027-03-31'
  );
  assert.equal(
    nextTaskDate({ date: '2028-01-31', frequency: 'Mensal', monthDay: 31 }),
    '2028-02-29'
  );
});

test('weekly recurrence follows selected weekdays and crosses year boundaries', () => {
  assert.equal(
    nextTaskDate({
      date: '2026-12-31',
      frequency: 'Semanal',
      days: ['1', '5'],
    }),
    '2027-01-01'
  );
  assert.equal(
    nextTaskDate({
      date: '2027-01-01',
      frequency: 'Semanal',
      days: ['1', '5'],
    }),
    '2027-01-04'
  );
  assert.equal(
    nextTaskDate({ date: '2026-12-31', frequency: 'Diária' }),
    '2027-01-01'
  );
  assert.equal(
    nextTaskDate({ date: '2026-12-31', frequency: 'Uma vez' }),
    '2026-12-31'
  );
});

test('moving projections include property fees, reserve, deposit and current savings', () => {
  const result = financialProjection({
    income: 5000,
    savings: 2000,
    rent: 1000,
    housingFees: 200,
    deposit: 3,
    moving: 500,
    furniture: 1500,
    bills: 300,
    food: 500,
    transport: 200,
    months: 10,
    reserveMonths: 3,
  });
  assert.deepEqual(result, {
    monthly: 2200,
    initial: 5000,
    target: 11600,
    missing: 9600,
    monthlySaving: 960,
    available: 2800,
  });
  assert.equal(
    financialProjection({
      income: 100,
      savings: 500,
      rent: 0,
      bills: 0,
      food: 0,
      transport: 0,
      deposit: 0,
      moving: 0,
      furniture: 0,
      months: 0,
      reserveMonths: 0,
    }).monthlySaving,
    0
  );
});

test('search is insensitive to accents and case', () => {
  assert.equal(normalize('  MANUTENÇÃO São Paulo '), 'manutencao sao paulo');
});

test('local credential verification is salted and never requires the plain password in storage', async () => {
  const hash = await passwordDigest('Example123', 'salt-a');
  assert.equal(hash, await passwordDigest('Example123', 'salt-a'));
  assert.notEqual(hash, await passwordDigest('Example123', 'salt-b'));
  assert.notEqual(hash, await passwordDigest('Wrong123', 'salt-a'));
  assert.equal(hash.length, 64);
});

test('cleaning tasks deduplicate, complete, reschedule and update shared history', () => {
  const store = useAppStore.getState();
  store.addCleaningTasks([
    {
      title: 'Limpar teste',
      cleaningId: 'clean-test',
      date: '2026-10-23',
      time: '10:00',
      frequency: 'Diária',
      days: [],
      done: false,
      category: 'Limpeza',
      reminder: true,
    },
  ]);
  store.addCleaningTasks([{ title: 'Duplicado', cleaningId: 'clean-test' }]);
  const task = useAppStore
    .getState()
    .data.tasks.find(task => task.cleaningId === 'clean-test');
  assert.equal(
    useAppStore
      .getState()
      .data.tasks.filter(task => task.cleaningId === 'clean-test').length,
    1
  );
  store.completeTask(task.id);
  const data = useAppStore.getState().data;
  assert.equal(data.tasks.find(item => item.id === task.id).date, '2026-10-24');
  assert.equal(data.tasks.find(item => item.id === task.id).done, false);
  assert.ok(data.cleaningChecks.includes('clean-test'));
  assert.ok(data.completions.some(item => item.taskId === task.id));
});

test('shared data survives persistence and logout keeps records while ending the local session', async () => {
  const store = useAppStore.getState();
  store.startDemo();
  store.saveItem('transactions', {
    title: 'Casa teste',
    house: true,
    type: 'expense',
    amount: 75.5,
    date: '2026-10-23',
  });
  const persisted = JSON.parse(records.get('iagora:app:v1'));
  assert.equal(persisted.state.data.transactions.at(-1).amount, 75.5);
  store.logout();
  assert.equal(useAppStore.getState().session, false);
  assert.equal(useAppStore.getState().data.transactions.at(-1).house, true);
  await useAppStore.persist.rehydrate();
  assert.equal(
    useAppStore.getState().data.transactions.at(-1).title,
    'Casa teste'
  );
});

test('blocked storage preserves in-memory changes and emits an actionable warning', () => {
  const original = globalThis.localStorage.setItem;
  let warned = false;
  events.addEventListener(
    'iagora-storage-error',
    () => {
      warned = true;
    },
    { once: true }
  );
  globalThis.localStorage.setItem = () => {
    throw new Error('Quota exceeded');
  };
  useAppStore.getState().update({ budget: 900 });
  assert.equal(useAppStore.getState().data.budget, 900);
  assert.equal(warned, true);
  globalThis.localStorage.setItem = original;
});
