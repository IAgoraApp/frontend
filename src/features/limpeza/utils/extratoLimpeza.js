export function dataLocalExecucao(valor) {
  const data = new Date(valor);
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;
}

export function agruparExecucoes(registros) {
  const grupos = new Map();
  const ordenados = registros
    .slice()
    .sort(
      (a, b) =>
        new Date(b.realizada_em) - new Date(a.realizada_em) || b.id - a.id
    );
  for (const registro of ordenados) {
    const dia = dataLocalExecucao(registro.realizada_em);
    if (!grupos.has(dia)) grupos.set(dia, []);
    grupos.get(dia).push(registro);
  }
  return Array.from(grupos, ([dia, execucoes]) => ({ dia, execucoes }));
}
