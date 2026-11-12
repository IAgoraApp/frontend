const padraoData = /^\d{4}-\d{2}-\d{2}$/;

export function chaveData(data = new Date()) {
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;
}

export function analisarData(valor) {
  if (!padraoData.test(valor ?? '')) return null;
  const [ano, mes, dia] = valor.split('-').map(Number);
  const data = new Date(ano, mes - 1, dia, 12);
  return chaveData(data) === valor ? data : null;
}

export function adicionarDias(valor, dias) {
  const data = typeof valor === 'string' ? analisarData(valor) : new Date(valor);
  data.setDate(data.getDate() + dias);
  return chaveData(data);
}

export function intervaloMes(mes) {
  return {
    inicio: chaveData(new Date(mes.getFullYear(), mes.getMonth(), 1)),
    fim: chaveData(new Date(mes.getFullYear(), mes.getMonth() + 1, 0)),
  };
}

export function diasCalendario(mes) {
  const primeiro = new Date(mes.getFullYear(), mes.getMonth(), 1, 12);
  const deslocamento = (primeiro.getDay() + 6) % 7;
  const diasNoMes = new Date(
    primeiro.getFullYear(),
    primeiro.getMonth() + 1,
    0
  ).getDate();
  const total = Math.ceil((diasNoMes + deslocamento) / 7) * 7;
  const inicio = adicionarDias(primeiro, -deslocamento);
  return Array.from({ length: total }, (_, indice) =>
    adicionarDias(inicio, indice)
  );
}

export function rotuloMes(mes) {
  const rotulo = mes.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });
  return rotulo.charAt(0).toUpperCase() + rotulo.slice(1);
}

export function formatarData(
  valor,
  opcoes = { day: 'numeric', month: 'long' }
) {
  return analisarData(valor)?.toLocaleDateString('pt-BR', opcoes) ?? '';
}

export function diaRelativo(valor, hoje = chaveData()) {
  if (valor === hoje) return 'Hoje';
  if (valor === adicionarDias(hoje, 1)) return 'Amanhã';
  if (valor === adicionarDias(hoje, -1)) return 'Ontem';
  return formatarData(valor);
}

export function proximoDiaSemana(dia, origem = chaveData()) {
  return adicionarDias(origem, (dia - analisarData(origem).getDay() + 7) % 7);
}
