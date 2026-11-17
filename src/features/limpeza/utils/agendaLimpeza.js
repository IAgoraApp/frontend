export function ordenarLimpezas(registros, hoje) {
  return registros.slice().sort((a, b) => {
    const feitas =
      Number(a.ultima_vez === hoje) - Number(b.ultima_vez === hoje);
    if (feitas) return feitas;
    return (
      (a.proxima_vez || '9999-12-31').localeCompare(
        b.proxima_vez || '9999-12-31'
      ) ||
      a.nome.localeCompare(b.nome, 'pt-BR') ||
      a.id - b.id
    );
  });
}

export function situacaoLimpeza(atividade, hoje) {
  if (atividade.ultima_vez === hoje)
    return { nome: 'Feita hoje', classe: 'feita' };
  if (!atividade.proxima_vez) return { nome: 'Sem data', classe: 'sem-data' };
  if (atividade.proxima_vez < hoje)
    return { nome: 'Atrasada', classe: 'atrasada' };
  if (atividade.proxima_vez === hoje) return { nome: 'Hoje', classe: 'hoje' };
  return { nome: 'Agendada', classe: 'agendada' };
}
