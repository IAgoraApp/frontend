import test from 'node:test';
import assert from 'node:assert/strict';
import { agruparExecucoes } from './extratoLimpeza.js';

test('agrupa por dia e ordena os horários do mais recente para o mais antigo', () => {
  const registros = [
    { id: 1, realizada_em: '2026-11-13T14:00:00' },
    { id: 2, realizada_em: '2026-11-15T09:00:00' },
    { id: 3, realizada_em: '2026-11-15T18:30:00' },
    { id: 4, realizada_em: '2026-11-10T10:30:00' },
  ];
  const grupos = agruparExecucoes(registros);
  assert.deepEqual(
    grupos.map(g => g.dia),
    ['2026-11-15', '2026-11-13', '2026-11-10']
  );
  assert.deepEqual(
    grupos[0].execucoes.map(e => e.id),
    [3, 2]
  );
  assert.deepEqual(
    registros.map(e => e.id),
    [1, 2, 3, 4]
  );
});

test('mantém todos os registros em horários iguais e aceita histórico vazio', () => {
  assert.deepEqual(agruparExecucoes([]), []);
  assert.deepEqual(
    agruparExecucoes([
      { id: 1, realizada_em: '2026-11-15T09:00:00' },
      { id: 2, realizada_em: '2026-11-15T09:00:00' },
    ])[0].execucoes.map(e => e.id),
    [2, 1]
  );
});
