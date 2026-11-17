const nomesDias = [
  'domingo',
  'segunda',
  'terca',
  'quarta',
  'quinta',
  'sexta',
  'sabado',
];
const chave = data =>
  `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;

export function proximaOcorrencia(regra, execucoes, referencia) {
  const inicio = new Date(`${regra.inicio}T12:00:00`);
  const dia = new Date(`${referencia}T12:00:00`);
  if (dia < inicio) dia.setTime(inicio.getTime());
  const existentes = new Set(
    execucoes
      .filter(e => e.tarefa_id === regra.tarefa_id)
      .map(e => e.data_prevista.slice(0, 10))
  );
  const intervalo = regra.intervalo || 1;
  for (let i = 0; i < 3660; i++, dia.setDate(dia.getDate() + 1)) {
    const data = chave(dia);
    if (regra.fim && data > regra.fim) return null;
    if (existentes.has(data)) continue;
    const diferenca = Math.round(
      (Date.UTC(dia.getFullYear(), dia.getMonth(), dia.getDate()) -
        Date.UTC(inicio.getFullYear(), inicio.getMonth(), inicio.getDate())) /
        86400000
    );
    if (regra.frequencia === 'diaria' && diferenca % intervalo === 0)
      return data;
    if (
      regra.frequencia === 'semanal' &&
      Math.floor(diferenca / 7) % intervalo === 0 &&
      (regra.dias_semana?.length
        ? regra.dias_semana
        : [nomesDias[inicio.getDay()]]
      ).includes(nomesDias[dia.getDay()])
    )
      return data;
    const meses =
      (dia.getFullYear() - inicio.getFullYear()) * 12 +
      dia.getMonth() -
      inicio.getMonth();
    if (
      regra.frequencia === 'mensal' &&
      meses % intervalo === 0 &&
      (regra.dia_mes?.length ? regra.dia_mes : [inicio.getDate()]).includes(
        dia.getDate()
      )
    )
      return data;
  }
  return null;
}

export function normalizarRecorrencia(valores) {
  const { nome, ...registro } = valores;
  void nome;
  if (!Number.isInteger(registro.intervalo) || registro.intervalo < 1)
    throw new Error(
      'O intervalo precisa ser um número inteiro maior que zero.'
    );
  if (registro.fim && registro.fim < registro.inicio)
    throw new Error('A data final deve ser igual ou posterior à data inicial.');
  const dias = String(registro.dias_semana || '')
    .split(',')
    .map(v =>
      v
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
    )
    .filter(Boolean);
  if (dias.some(d => !nomesDias.includes(d)))
    throw new Error(
      'Use dias separados por vírgula: segunda, terça, quarta, quinta, sexta, sábado, domingo.'
    );
  const mensais = String(registro.dia_mes || '')
    .split(',')
    .map(v => v.trim())
    .filter(Boolean)
    .map(Number);
  if (mensais.some(d => !Number.isInteger(d) || d < 1 || d > 31))
    throw new Error('Informe dias do mês de 1 a 31, separados por vírgula.');
  registro.dias_semana =
    registro.frequencia === 'semanal' && dias.length
      ? [...new Set(dias)]
      : null;
  registro.dia_mes =
    registro.frequencia === 'mensal' && mensais.length
      ? [...new Set(mensais)]
      : null;
  return registro;
}
