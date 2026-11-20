const texto = (nome, rotulo, maxLength = 150) => ({ nome, rotulo, maxLength });
const longo = (nome, rotulo, maxLength) => ({
  nome,
  rotulo,
  maxLength,
  tipo: 'textarea',
  opcional: true,
});
const numero = (nome, rotulo, opcional = false) => ({
  nome,
  rotulo,
  tipo: 'number',
  opcional,
});
const data = (nome, rotulo) => ({ nome, rotulo, tipo: 'date', opcional: true });
const valor = numero('valor', 'Valor (R$)');
const despesa = [
  texto('nome', 'Nome'),
  texto('categoria', 'Categoria', 50),
  {
    nome: 'tipo',
    rotulo: 'Tipo de custo',
    opcoes: { mensal: 'Mensal', inicial: 'Inicial' },
  },
  valor,
];

export const modelo = {
  jornada: {
    singular: 'jornada',
    plural: 'Jornadas',
    campos: [texto('nome', 'Nome'), longo('descricao', 'Descrição')],
    status: { em_andamento: 'Em andamento', concluida: 'Concluída' },
    filhos: ['etapa_jornada'],
  },
  etapa_jornada: {
    singular: 'etapa',
    plural: 'Etapas',
    vinculo: 'jornada_id',
    ordenavel: true,
    campos: [
      texto('titulo', 'Título'),
      longo('descricao', 'Descrição'),
      { ...texto('categoria', 'Categoria', 50), opcional: true },
      data('prazo', 'Prazo'),
    ],
    status: { pendente: 'Pendente', concluida: 'Concluída' },
    filhos: ['tarefa_jornada'],
  },
  tarefa_jornada: {
    singular: 'tarefa',
    plural: 'Tarefas',
    vinculo: 'etapa_id',
    ordenavel: true,
    campos: [texto('titulo', 'Título'), longo('descricao', 'Descrição')],
  },
  plano_moradia: {
    singular: 'plano',
    plural: 'Planos de moradia',
    campos: [
      texto('nome', 'Nome'),
      numero('renda_mensal', 'Renda mensal (R$)'),
      numero('reserva_atual', 'Reserva atual (R$)'),
      data('mudanca_prevista', 'Mudança prevista'),
    ],
    status: { ativo: 'Ativo', concluido: 'Concluído', arquivado: 'Arquivado' },
    filhos: ['custo_moradia', 'simulacao_moradia'],
  },
  custo_moradia: {
    singular: 'custo',
    plural: 'Custos do plano',
    vinculo: 'plano_id',
    campos: despesa,
  },
  simulacao_moradia: {
    singular: 'simulação',
    plural: 'Simulações',
    vinculo: 'plano_id',
    campos: [
      texto('nome', 'Nome'),
      numero('renda_mensal', 'Renda mensal (R$)'),
      numero('reserva', 'Reserva (R$)'),
    ],
    filhos: ['simulacao_item'],
  },
  simulacao_item: {
    singular: 'item',
    plural: 'Itens da simulação',
    vinculo: 'simulacao_id',
    campos: despesa,
  },
  casa_desejada: {
    singular: 'imóvel',
    plural: 'Imóveis desejados',
    campos: [
      texto('titulo', 'Título'),
      texto('tipo', 'Tipo de imóvel'),
      numero('valor', 'Valor (R$)', true),
      longo('descricao', 'Descrição', 500),
    ],
  },
};

export const nomeRegistro = item => item.nome ?? item.titulo;

export function listar(banco, entidade, usuario, pai) {
  const config = modelo[entidade];
  return banco[entidade]
    .filter(item =>
      config.vinculo ? item[config.vinculo] === pai : item.user_id === usuario
    )
    .sort((a, b) => (a.ordem ?? a.id) - (b.ordem ?? b.id));
}

export const proximoId = registros =>
  Math.max(0, ...registros.map(item => item.id)) + 1;

export function removerRegistro(banco, entidade, id) {
  for (const filha of modelo[entidade].filhos ?? []) {
    const vinculo = modelo[filha].vinculo;
    for (const item of banco[filha].filter(item => item[vinculo] === id))
      removerRegistro(banco, filha, item.id);
  }
  banco[entidade] = banco[entidade].filter(item => item.id !== id);
}

export function resumoMoradia(renda, reserva, custos) {
  const total = tipo =>
    custos
      .filter(item => item.tipo === tipo)
      .reduce((soma, item) => soma + Number(item.valor), 0);
  const mensal = total('mensal');
  const inicial = total('inicial');
  return {
    mensal,
    inicial,
    saldoMensal: renda - mensal,
    saldoInicial: reserva - inicial,
  };
}

export function estimarReserva(reservaAtual, { mensal, inicial }, meses) {
  const alvo = Math.round((inicial + mensal * meses) * 100) / 100;
  return {
    alvo,
    falta: Math.max(0, Math.round((alvo - reservaAtual) * 100) / 100),
  };
}
