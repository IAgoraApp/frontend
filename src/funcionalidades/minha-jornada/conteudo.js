export const etapasFixasJornada = [
  {
    id: 0,
    chave: 'etapa-1',
    numero: '01',
    tituloNav: 'Seu plano',
    titulo: 'Seu plano.',
    subtitulo: 'Definir momento e prioridades.',
    rotuloAcao: 'Ajustar prioridades',
    rotaAcao: '/onboarding',
    foco: 'Suas prioridades ajudam a comparar escolhas. Elas não precisam ser definitivas.',
    tarefas: [
      {
        titulo: 'Escolher seu momento',
        descricao: 'Como você quer começar essa nova fase?',
      },
      {
        titulo: 'Definir três prioridades',
        descricao: 'Custo, localização ou espaço: o que vem primeiro?',
      },
      {
        titulo: 'Combinar um prazo possível',
        descricao: 'Escolha uma referência e ajuste quando precisar.',
      },
    ],
  },
  {
    id: 1,
    chave: 'etapa-2',
    numero: '02',
    tituloNav: 'Seu dinheiro',
    titulo: 'Seu dinheiro.',
    subtitulo: 'Estimar custos e reserva.',
    rotuloAcao: 'Planejar meu dinheiro',
    rotaAcao: '/planejamento',
    foco: 'Pense em duas contas diferentes: chegar ao novo endereço e manter o mês funcionando.',
    tarefas: [
      {
        titulo: 'Anotar renda e valor guardado',
        descricao: 'Comece pelos recursos que você tem hoje.',
      },
      {
        titulo: 'Estimar o custo do mês',
        descricao: 'Inclua moradia, contas, alimentação e transporte.',
      },
      {
        titulo: 'Separar os custos de chegada',
        descricao: 'Garantia, mudança e itens essenciais entram no plano inicial.',
      },
    ],
  },
  {
    id: 2,
    chave: 'etapa-3',
    numero: '03',
    tituloNav: 'Seu canto',
    titulo: 'Seu canto.',
    subtitulo: 'Pesquisar imóveis e visitar.',
    rotuloAcao: 'Pesquisar imóveis',
    rotaAcao: '/encontrar-casa',
    foco: 'Olhe além da foto: coloque o custo completo e a rotina do bairro na comparação.',
    tarefas: [
      {
        titulo: 'Escolher regiões para pesquisar',
        descricao: 'Compare deslocamento, serviços e custo total.',
      },
      {
        titulo: 'Salvar duas ou três opções',
        descricao: 'Use os mesmos critérios para comparar imóveis.',
      },
      {
        titulo: 'Preparar perguntas para a visita',
        descricao:
          'Confirme valores, condições e disponibilidade com o anunciante.',
      },
    ],
  },
  {
    id: 3,
    chave: 'etapa-4',
    numero: '04',
    tituloNav: 'Sua mudança',
    titulo: 'Sua mudança.',
    subtitulo: 'Organizar documentos e essenciais.',
    rotuloAcao: 'Organizar documentos',
    visaoAcao: 'documentos',
    foco: 'Uma pasta e uma lista de perguntas ajudam a acompanhar os próximos passos sem depender da memória.',
    tarefas: [
      {
        titulo: 'Organizar os documentos',
        descricao: 'Confira o que será solicitado na sua negociação.',
      },
      {
        titulo: 'Anotar condições e dúvidas',
        descricao:
          'Guarde as informações combinadas e revise antes de decidir.',
      },
      {
        titulo: 'Preparar a chegada',
        descricao:
          'Combine transporte, acesso e o que precisa estar disponível no primeiro dia.',
      },
    ],
  },
  {
    id: 4,
    chave: 'etapa-5',
    numero: '05',
    tituloNav: 'Seu dia a dia',
    titulo: 'Seu dia a dia.',
    subtitulo: 'Aprender os primeiros cuidados.',
    rotuloAcao: 'Abrir os guias',
    rotaAcao: '/aprendendo',
    foco: 'Seu primeiro mês não precisa estar perfeito. Uma rotina pequena e repetível já ajuda.',
    tarefas: [
      {
        titulo: 'Separar o essencial',
        descricao: 'Priorize o que você vai usar na primeira semana.',
      },
      {
        titulo: 'Planejar compras e refeições',
        descricao: 'Confira o que já tem antes de montar a lista.',
      },
      {
        titulo: 'Criar uma rotina pequena',
        descricao: 'Comece com tarefas possíveis e ajuste a frequência.',
      },
    ],
  },
];

export const checklistDocumentosPadrao = [
  {
    id: 'doc-id',
    titulo: 'Documento de identificação',
    descricao: 'Confira a necessidade diretamente com a outra parte.',
  },
  {
    id: 'doc-renda',
    titulo: 'Comprovante de renda, quando solicitado',
    descricao: 'Confira a necessidade diretamente com a outra parte.',
  },
  {
    id: 'doc-garantia',
    titulo: 'Informações sobre a garantia combinada',
    descricao: 'Confira a necessidade diretamente com a outra parte.',
  },
  {
    id: 'doc-contrato',
    titulo: 'Contrato e registros da vistoria',
    descricao: 'Confira a necessidade diretamente com a outra parte.',
  },
];

export const historicoInicialJornada = [
  {
    id: 'hist-1',
    titulo: 'Prioridades definidas',
    detalhe: 'Etapa Seu plano',
    etapaId: 0,
  },
  {
    id: 'hist-2',
    titulo: 'Primeiro valor guardado',
    detalhe: 'Reserva inicial iniciada',
    visao: 'metas',
  },
];
