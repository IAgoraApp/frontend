import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizarRecorrencia, proximaOcorrencia } from './recorrenciasMvp.js';

test('recorrência semanal respeita o dia e não repete uma execução existente', () => {
  const regra = {
    tarefa_id: 1,
    frequencia: 'semanal',
    intervalo: 1,
    inicio: '2026-11-01',
    dias_semana: ['sabado'],
    fim: null,
  };
  assert.equal(proximaOcorrencia(regra, [], '2026-11-17'), '2026-11-21');
  assert.equal(
    proximaOcorrencia(
      regra,
      [{ tarefa_id: 1, data_prevista: '2026-11-21T12:00:00' }],
      '2026-11-17'
    ),
    '2026-11-28'
  );
  assert.equal(
    proximaOcorrencia({ ...regra, fim: '2026-11-20' }, [], '2026-11-17'),
    null
  );
});

test('dia 31 mensal não transborda para o mês seguinte e aceita fevereiro bissexto', () => {
  const regra = {
    tarefa_id: 1,
    frequencia: 'mensal',
    intervalo: 1,
    inicio: '2026-01-31',
    dia_mes: [31],
  };
  assert.equal(proximaOcorrencia(regra, [], '2026-02-01'), '2026-03-31');
  assert.equal(
    proximaOcorrencia(
      { ...regra, inicio: '2028-01-29', dia_mes: [29] },
      [],
      '2028-02-01'
    ),
    '2028-02-29'
  );
});

test('intervalo diário respeita início e fim e execuções de outra tarefa não interferem', () => {
  const regra = {
    tarefa_id: 1,
    frequencia: 'diaria',
    intervalo: 3,
    inicio: '2026-11-01',
    fim: '2026-11-30',
  };
  assert.equal(proximaOcorrencia(regra, [], '2026-10-01'), '2026-11-01');
  assert.equal(
    proximaOcorrencia(
      regra,
      [{ tarefa_id: 2, data_prevista: '2026-11-19T12:00:00' }],
      '2026-11-18'
    ),
    '2026-11-19'
  );
  assert.equal(proximaOcorrencia(regra, [], '2026-12-01'), null);
});

test('normaliza dias acentuados e rejeita configurações inválidas', () => {
  const base = {
    frequencia: 'semanal',
    intervalo: 1,
    inicio: '2026-11-01',
    fim: null,
    dias_semana: 'terça, sábado, sábado',
  };
  assert.deepEqual(normalizarRecorrencia(base).dias_semana, [
    'terca',
    'sabado',
  ]);
  assert.throws(
    () => normalizarRecorrencia({ ...base, intervalo: 1.5 }),
    /inteiro/
  );
  assert.throws(
    () => normalizarRecorrencia({ ...base, dias_semana: 'ontem' }),
    /dias/
  );
  assert.throws(
    () => normalizarRecorrencia({ ...base, fim: '2026-10-01' }),
    /final/
  );
  assert.throws(
    () => normalizarRecorrencia({ ...base, dia_mes: '32' }),
    /1 a 31/
  );
});
