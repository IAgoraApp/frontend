import test from 'node:test';
import assert from 'node:assert/strict';
import { ordenarLimpezas, situacaoLimpeza } from './agendaLimpeza.js';

test('ordena atrasadas e agendadas pela data, depois sem data e por último feitas hoje', () => {
  const registros = [
    { id: 1, nome: 'Sem data', proxima_vez: null, ultima_vez: null },
    {
      id: 2,
      nome: 'Feita',
      proxima_vez: '2026-11-10',
      ultima_vez: '2026-11-17',
    },
    { id: 3, nome: 'Futura', proxima_vez: '2026-11-20', ultima_vez: null },
    { id: 4, nome: 'Atrasada', proxima_vez: '2026-11-14', ultima_vez: null },
    { id: 5, nome: 'Hoje', proxima_vez: '2026-11-17', ultima_vez: null },
  ];
  assert.deepEqual(
    ordenarLimpezas(registros, '2026-11-17').map(l => l.id),
    [4, 5, 3, 1, 2]
  );
  assert.deepEqual(
    registros.map(l => l.id),
    [1, 2, 3, 4, 5]
  );
});

test('desempata por nome e distingue atividades atrasadas, sem data e feitas', () => {
  const registros = [
    { id: 1, nome: 'Zelar', proxima_vez: '2026-11-20' },
    { id: 2, nome: 'Arrumar', proxima_vez: '2026-11-20' },
  ];
  assert.deepEqual(
    ordenarLimpezas(registros, '2026-11-17').map(l => l.id),
    [2, 1]
  );
  assert.equal(
    situacaoLimpeza({ proxima_vez: '2026-11-16' }, '2026-11-17').classe,
    'atrasada'
  );
  assert.equal(
    situacaoLimpeza({ proxima_vez: '2026-11-17' }, '2026-11-17').classe,
    'hoje'
  );
  assert.equal(
    situacaoLimpeza({ proxima_vez: null }, '2026-11-17').classe,
    'sem-data'
  );
  assert.equal(
    situacaoLimpeza(
      { proxima_vez: '2026-11-16', ultima_vez: '2026-11-17' },
      '2026-11-17'
    ).classe,
    'feita'
  );
});
