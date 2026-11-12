const CHAVE_ARMAZENAMENTO = 'iagora_estado_plataforma_v1';

const estadoInicial = {
  perfil: {
    nome: 'Ana',
    nomeCompleto: 'Ana Clara Souza',
    email: 'ana@iagora.com.br',
    telefone: '(11) 99999-0000',
    cidade: 'São Paulo',
    bairro: 'Vila Mariana',
    momento: 'preparacao',
    momentoRotulo: 'Vou morar sozinho',
    prioridades: ['Finanças e orçamento', 'Encontrar um lugar'],
    tipoMoradia: 'Studio compacto (25–32m²)',
    pessoasNaCasa: 1,
    orcamentoMensal: 3200,
    notificacoes: {
      rotina: true,
      financas: true,
      resumoSemanal: true,
      mensagensEmpresa: true,
    },
  },
  etapasJornada: [
    {
      id: 'etapa-1',
      numero: '01',
      titulo: 'Seu plano',
      subtitulo: 'Definir momento e prioridades',
      descricao:
        'Escolha o ritmo da mudança e defina o que precisa resolver primeiro antes da entrega das chaves.',
      situacao: 'concluida',
      itens: [
        { id: 'e1-1', texto: 'Definir momento e meta de mudança', feito: true },
        { id: 'e1-2', texto: 'Listar prioridades iniciais', feito: true },
        { id: 'e1-3', texto: 'Estimar data prevista da mudança', feito: true },
      ],
    },
    {
      id: 'etapa-2',
      numero: '02',
      titulo: 'Seu dinheiro',
      subtitulo: 'Estimar custos e reserva',
      descricao:
        'Calcule aluguel, caução, mobília essencial e crie uma reserva para os primeiros três meses.',
      situacao: 'andamento',
      itens: [
        { id: 'e2-1', texto: 'Calcular teto de aluguel e contas fixas', feito: true },
        { id: 'e2-2', texto: 'Simular reserva inicial de mudança', feito: false },
        { id: 'e2-3', texto: 'Separar valor de caução ou seguro fiança', feito: false },
      ],
    },
    {
      id: 'etapa-3',
      numero: '03',
      titulo: 'Seu canto',
      subtitulo: 'Pesquisar imóveis e visitar',
      descricao:
        'Compare bairros, avalie proximidade de transporte e confira cada item importante durante a visita.',
      situacao: 'pendente',
      itens: [
        { id: 'e3-1', texto: 'Definir 3 bairros prioritários', feito: false },
        { id: 'e3-2', texto: 'Checar pressão da água e tomadas na visita', feito: false },
        { id: 'e3-3', texto: 'Confirmar valor de condomínio e IPTU', feito: false },
      ],
    },
    {
      id: 'etapa-4',
      numero: '04',
      titulo: 'Sua mudança',
      subtitulo: 'Organizar documentos e essenciais',
      descricao:
        'Deixe RG, comprovante de renda, contrato e lista do enxoval básico prontos sem correria.',
      situacao: 'pendente',
      itens: [
        { id: 'e4-1', texto: 'Separar documentos digitais para locação', feito: false },
        { id: 'e4-2', texto: 'Conferir itens básicos de cozinha e limpeza', feito: false },
        { id: 'e4-3', texto: 'Agendar frete ou dia de mudança', feito: false },
      ],
    },
    {
      id: 'etapa-5',
      numero: '05',
      titulo: 'Seu dia a dia',
      subtitulo: 'Aprender os primeiros cuidados',
      descricao:
        'Estude rotinas simples de cozinha, limpeza leve e fechamento do mês antes mesmo de entrar.',
      situacao: 'pendente',
      itens: [
        { id: 'e5-1', texto: 'Ler guia de primeiros cuidados em casa', feito: false },
        { id: 'e5-2', texto: 'Montar plano alimentar simples da semana', feito: false },
      ],
    },
  ],
  metasJornada: [
    {
      id: 'meta-1',
      titulo: 'Reserva inicial de mudança',
      atual: 3200,
      objetivo: 6000,
      prazo: 'Outubro de 2026',
      concluida: false,
    },
    {
      id: 'meta-2',
      titulo: 'Comparar 5 studios na Vila Mariana',
      atual: 3,
      objetivo: 5,
      prazo: 'Esta semana',
      concluida: false,
    },
    {
      id: 'meta-3',
      titulo: 'Definir orçamento mensal fixo',
      atual: 1,
      objetivo: 1,
      prazo: 'Concluída',
      concluida: true,
    },
  ],
  pendenciasJornada: [
    {
      id: 'pend-1',
      titulo: 'Simular custo do primeiro mês com caução',
      categoria: 'Finanças',
      prazo: 'Hoje',
      feito: false,
    },
    {
      id: 'pend-2',
      titulo: 'Salvar checklist de vistoria para visita',
      categoria: 'Seu canto',
      prazo: 'Amanhã',
      feito: false,
    },
    {
      id: 'pend-3',
      titulo: 'Digitalizar comprovantes de renda',
      categoria: 'Documentos',
      prazo: 'Sexta-feira',
      feito: true,
    },
  ],
  documentosJornada: [
    {
      id: 'doc-1',
      nome: 'RG e CPF digitalizados',
      categoria: 'Identificação',
      situacao: 'Pronto',
    },
    {
      id: 'doc-2',
      nome: 'Comprovante de renda dos últimos 3 meses',
      categoria: 'Financeiro',
      situacao: 'Pendente',
    },
    {
      id: 'doc-3',
      nome: 'Comprovante de residência atual',
      categoria: 'Identificação',
      situacao: 'Pronto',
    },
    {
      id: 'doc-4',
      nome: 'Modelo de vistoria de entrada',
      categoria: 'Contrato',
      situacao: 'Pendente',
    },
  ],
  imoveisFavoritos: ['imovel-1', 'imovel-3'],
  imoveisComparados: ['imovel-1', 'imovel-2'],
  servicosFavoritos: ['limpeza-residencial'],
  avaliacoesServicos: [],
  contatosCliente: [],
  checklists: {
    diaADia: [
      { id: 'c1', texto: 'Lavar a louça e liberar a pia', concluido: true },
      { id: 'c2', texto: 'Tirar o lixo e separar os recicláveis', concluido: false },
      { id: 'c3', texto: 'Dar atenção ao banheiro', concluido: false },
    ],
    mudanca: [
      { id: 'm1', texto: 'Chave reserva e documento em mãos', concluido: true },
      { id: 'm2', texto: 'Testar disjuntor e registro de água', concluido: false },
      { id: 'm3', texto: 'Kit básico de limpeza e lâmpadas', concluido: false },
    ],
    mercado: [
      { id: 's1', texto: 'Arroz, feijão e macarrão', concluido: true },
      { id: 's2', texto: 'Detergente, esponja e pano de prato', concluido: true },
      { id: 's3', texto: 'Frutas e legumes da semana', concluido: false },
    ],
  },
};

export function lerEstadoPlataforma() {
  try {
    const salvo = localStorage.getItem(CHAVE_ARMAZENAMENTO);
    if (!salvo) return estadoInicial;
    const analisado = JSON.parse(salvo);
    return {
      ...estadoInicial,
      ...analisado,
      perfil: { ...estadoInicial.perfil, ...(analisado.perfil || {}) },
    };
  } catch {
    return estadoInicial;
  }
}

export function salvarEstadoPlataforma(proximoEstado) {
  try {
    localStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(proximoEstado));
    window.dispatchEvent(new CustomEvent('iagora:estado'));
  } catch {
    return false;
  }
  return true;
}

export function calcularProgressoJornada(estado) {
  const etapas = estado?.etapasJornada || [];
  if (!etapas.length) return 52;
  let totalItens = 0;
  let feitos = 0;
  etapas.forEach(etapa => {
    (etapa.itens || []).forEach(item => {
      totalItens += 1;
      if (item.feito) feitos += 1;
    });
  });
  if (!totalItens) return 52;
  return Math.max(15, Math.round((feitos / totalItens) * 100));
}
