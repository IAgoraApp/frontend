export const topicosAjuda = [
  {
    id: 'conta',
    categoria: 'Conta',
    titulo: 'Minha conta e acesso',
    descricao:
      'Como funciona o cadastro demonstrativo, troca de senha e ajustes do seu perfil.',
    rota: '/ajuda/faq?tema=conta',
  },
  {
    id: 'rotina',
    categoria: 'Rotina',
    titulo: 'Rotina e lembretes',
    descricao:
      'Como organizar tarefas da casa, marcações recorrentes e avisos no painel.',
    rota: '/ajuda/faq?tema=rotina',
  },
  {
    id: 'financas',
    categoria: 'Finanças',
    titulo: 'Dinheiro e orçamento',
    descricao:
      'Uso das calculadoras de mudança, contas fixas e metas mensais sem complicação.',
    rota: '/ajuda/faq?tema=financas',
  },
  {
    id: 'empresa',
    categoria: 'Empresas',
    titulo: 'Anúncios e empresa',
    descricao:
      'Como publicar serviços, adicionar fotos no portfólio e responder moradores.',
    rota: '/ajuda/faq/3',
  },
];

export const perguntasFrequentes = [
  {
    id: '0',
    tema: 'conta',
    pergunta: 'Preciso de conta para conhecer o Iagora?',
    resposta:
      'Você pode navegar livremente pelas páginas públicas, entender como a plataforma funciona e explorar as orientações para moradores e parceiros. Para personalizar lembretes, checklists e favoritos neste navegador, basta entrar ou criar sua conta demonstrativa.',
    passos: [
      'Explore a apresentação inicial e a página Como funciona.',
      'Clique em Começar agora quando quiser escolher seu momento.',
      'Seus ajustes locais permanecem salvos neste navegador.',
    ],
  },
  {
    id: '1',
    tema: 'rotina',
    pergunta: 'Como escolho meu momento?',
    resposta:
      'Durante a integração inicial, você escolhe entre Já moro sozinho ou Vou morar sozinho. Cada momento organiza os atalhos, metas, finanças e guias de acordo com o que importa agora, e você pode alternar a qualquer hora em Meu perfil.',
    passos: [
      'Acesse a integração em /onboarding ou abra Meu perfil.',
      'Selecione o momento que melhor combina com sua fase atual.',
      'Ajuste prioridades de rotina, cozinha, limpeza ou mudança.',
    ],
  },
  {
    id: '2',
    tema: 'financas',
    pergunta: 'O Iagora faz pagamentos?',
    resposta:
      'Não. O Iagora funciona como guia de organização pessoal e vitrine de conexão entre moradores e prestadores de serviço. Valores, agendamentos e pagamentos de serviços são combinados diretamente entre você e a empresa escolhida.',
    passos: [
      'Use as calculadoras e metas para estimar seu orçamento.',
      'No Marketplace, envie uma solicitação de orçamento para comparar propostas.',
      'Acompanhe toda a conversa em Meus contatos antes de fechar.',
    ],
  },
  {
    id: '3',
    tema: 'empresa',
    pergunta: 'Como anuncio um serviço?',
    resposta:
      'Empresas e profissionais autônomos acessam a área Para empresas, criam seu perfil comercial e cadastram anúncios com categoria, descrição, região atendida, preço inicial e fotos do trabalho.',
    passos: [
      'Entre pela página Seja parceiro ou Área da empresa.',
      'Complete os dados comerciais em Perfil da empresa.',
      'Clique em + Anunciar serviço, revise a prévia e acompanhe contatos recebidos.',
    ],
  },
];

export const passosComoFunciona = [
  {
    numero: '01 / Seu momento',
    titulo: 'Comece pela fase em que você realmente está',
    descricao:
      'Se você já tem a chave na mão, o foco vai para casa, cozinha, limpeza, rotina e orçamento mensal. Se ainda está se preparando, ganha planos de mudança, simuladores de reserva e guias para visitar imóveis.',
  },
  {
    numero: '02 / Suas prioridades',
    titulo: 'Use apenas as ferramentas que fazem sentido',
    descricao:
      'Cada módulo resolve uma necessidade prática sem excesso de menus: listas de compras, receitas acessíveis, contas a pagar, metas financeiras, rotinas leves e busca de prestadores.',
  },
  {
    numero: '03 / Seu próximo passo',
    titulo: 'Avance no seu ritmo com lembretes reais',
    descricao:
      'Checklist por checklist, o Iagora transforma grandes mudanças em pequenas ações acompanháveis, mantendo seu histórico organizado em um só lugar.',
  },
];

export const notificacoesIniciais = [
  {
    id: 'notif-luz',
    titulo: 'Sua conta de luz vence em dois dias',
    descricao:
      'Confira o valor previsto e marque o pagamento para manter o fechamento do mês em dia.',
    categoria: 'Finanças',
    tempo: 'Hoje · 09:30',
    rota: '/financas?visao=contas',
    textoAcao: 'Ver contas',
    lida: false,
  },
  {
    id: 'notif-rotina',
    titulo: 'Você tem tarefas para hoje',
    descricao:
      'Duas atividades rápidas da casa estão separadas na sua agenda semanal.',
    categoria: 'Rotina',
    tempo: 'Hoje · 08:15',
    rota: '/rotina',
    textoAcao: 'Abrir rotina',
    lida: false,
  },
  {
    id: 'notif-jornada',
    titulo: 'Sua meta de mudança avançou',
    descricao:
      'Você já completou 53% da reserva inicial planejada para os primeiros meses.',
    categoria: 'Minha jornada',
    tempo: 'Ontem · 19:00',
    rota: '/minhajornada?visao=metas',
    textoAcao: 'Ver metas',
    lida: true,
  },
];

export const orientacoesSeguranca = [
  'Desligue o disjuntor correspondente no quadro elétrico antes de mexer em tomadas, interruptores ou chuveiros, mesmo para pequenas inspeções visuais.',
  'Feche o registro geral de água do cômodo antes de apertar conexões, trocar flexíveis ou limpar sifões para evitar vazamentos súbitos.',
  'Nunca misture produtos de limpeza com água sanitária e desinfetantes ácidos ou amoníaco; mantenha janelas abertas e prefira suporte profissional quando houver risco estrutural, gás ou altura.',
];

export const catalogoIndicePlataforma = [
  {
    grupo: 'Público e entrada',
    itens: [
      { nome: 'Landing Page A (Consumidor)', rota: '/' },
      { nome: 'Como funciona', rota: '/como-funciona' },
      { nome: 'Sobre nós', rota: '/sobrenos' },
      { nome: 'Seja parceiro', rota: '/sejaparceiro' },
      { nome: 'Login e cadastro', rota: '/login' },
      { nome: 'Onboarding de momento', rota: '/onboarding' },
    ],
  },
  {
    grupo: 'Consumidor A · Já moro sozinho',
    itens: [
      { nome: 'Início Consumidor A', rota: '/home' },
      { nome: 'Casa (Visão geral)', rota: '/casa' },
      { nome: 'Limpeza', rota: '/limpeza' },
      { nome: 'Cozinha', rota: '/cozinha' },
      { nome: 'Rotina e agenda', rota: '/rotina' },
      { nome: 'Finanças', rota: '/financas' },
      { nome: 'Calculadoras financeiras', rota: '/calculadoras' },
      { nome: 'Meu perfil', rota: '/perfil' },
      { nome: 'Meus checklists', rota: '/checklists' },
      { nome: 'Guia de segurança', rota: '/seguranca' },
      { nome: 'Notificações', rota: '/notificacoes' },
    ],
  },
  {
    grupo: 'Consumidor B · Vou morar sozinho',
    itens: [
      { nome: 'Início Consumidor B', rota: '/home-b' },
      { nome: 'Minha jornada', rota: '/minhajornada' },
      { nome: 'Planejamento financeiro', rota: '/planejamento' },
      { nome: 'Aprendendo a morar', rota: '/aprendendo' },
      { nome: 'Encontrar casa', rota: '/encontrar-casa' },
      { nome: 'Perfil Consumidor B', rota: '/perfil-b' },
    ],
  },
  {
    grupo: 'Marketplace de serviços',
    itens: [
      { nome: 'Marketplace principal', rota: '/marketplace' },
      { nome: 'Buscar serviços', rota: '/buscar' },
      { nome: 'Mapa de serviços', rota: '/buscar/mapa' },
      { nome: 'Filtros avançados', rota: '/marketplace/filtros' },
      { nome: 'Categoria Limpeza', rota: '/categoria/limpeza' },
      { nome: 'Detalhe do serviço', rota: '/servicos/limpeza-residencial' },
      {
        nome: 'Avaliações do serviço',
        rota: '/servicos/limpeza-residencial/avaliacoes',
      },
      {
        nome: 'Entrar em contato',
        rota: '/servicos/limpeza-residencial/contato',
      },
      { nome: 'Perfil público da empresa', rota: '/empresas/casa-em-dia' },
      { nome: 'Meus favoritos', rota: '/favoritos' },
      { nome: 'Meus contatos e histórico', rota: '/meus-contatos' },
    ],
  },
  {
    grupo: 'Área da empresa',
    itens: [
      { nome: 'Acesso / cadastro da empresa', rota: '/empresa/cadastro' },
      { nome: 'Início da empresa', rota: '/empresa' },
      { nome: 'Dashboard de métricas', rota: '/empresa/dashboard' },
      { nome: 'Meus anúncios', rota: '/empresa/anuncios' },
      { nome: 'Novo anúncio', rota: '/empresa/anunciar' },
      { nome: 'Perfil da empresa', rota: '/empresa/perfil' },
      { nome: 'Logo e portfólio', rota: '/empresa/perfil/midias' },
      { nome: 'Contatos recebidos', rota: '/empresa/contatos' },
      { nome: 'Marketplace pela visão empresa', rota: '/empresa/marketplace' },
    ],
  },
  {
    grupo: 'Ajuda, legal e sistema',
    itens: [
      { nome: 'Central de ajuda', rota: '/ajuda' },
      { nome: 'Perguntas frequentes', rota: '/ajuda/faq' },
      { nome: 'Falar com suporte', rota: '/ajuda/contato' },
      { nome: 'Termos de uso', rota: '/termos' },
      { nome: 'Política de privacidade', rota: '/privacidade' },
      { nome: 'Estados e validações', rota: '/estados' },
      { nome: 'Sem conexão', rota: '/sem-conexao' },
      { nome: 'Página indisponível', rota: '/indisponivel' },
    ],
  },
];

export const catalogoEstadosValidacoes = [
  {
    titulo: 'Carregamento na busca do Marketplace',
    descricao: 'Simula esqueleto e animação de busca de prestadores.',
    rota: '/buscar?carregando=1',
  },
  {
    titulo: 'Erro de servidor na busca do Marketplace',
    descricao: 'Exibe alerta de falha temporária com recuperação.',
    rota: '/buscar?erro=1',
  },
  {
    titulo: 'Busca sem resultados',
    descricao: 'Mostra estado vazio com opção para limpar filtros.',
    rota: '/buscar?busca=servico-inexistente-teste',
  },
  {
    titulo: 'Serviço sem avaliações',
    descricao: 'Simula anúncio sem comentários publicados.',
    rota: '/servicos/limpeza-residencial/avaliacoes?vazio=1',
  },
  {
    titulo: 'Serviço indisponível',
    descricao: 'Anúncio pausado, removido ou expirado.',
    rota: '/servicos/indisponivel',
  },
  {
    titulo: 'Carregamento no painel da empresa',
    descricao: 'Simula atualização de dados do painel B2B.',
    rota: '/empresa/dashboard?carregando=1',
  },
  {
    titulo: 'Erro sem conexão',
    descricao: 'Tela de sistema quando não há rede disponível.',
    rota: '/sem-conexao',
  },
  {
    titulo: 'Página indisponível (404)',
    descricao: 'Fallback elegante para rotas não mapeadas.',
    rota: '/indisponivel',
  },
];
