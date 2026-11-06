const empresasHeaderData = {
  logoLink: '/empresa',
  navLinks: [
    { nome: 'Painel', rota: '/dashboard' },
    { nome: 'Perfil da empresa', rota: '/perfil-empresa' },
    { nome: 'Contatos', rota: '/contatos' },
  ],
  actionButton: {
    label: '+ Anunciar serviço',
    rota: '/anunciar-servico',
    color: 'laranja',
  },
};

const userHeaderData = {
  logoLink: '/home',
  navLinks: [
    { nome: 'Início', rota: '/home' },
    { nome: 'Casa', rota: '/casa' },
    { nome: 'Rotina', rota: '/rotina' },
    { nome: 'Finanças', rota: '/financas' },
    { nome: 'Empresas e Serviços', rota: '/marketplace' },
  ],
  actionButton: {
    label: 'Meu perfil',
    rota: '/perfil',
    color: 'laranja',
  },
};

const publicHeaderData = {
  logoLink: '/',
  navLinks: [
    { nome: 'Início', rota: '/' },
    { nome: 'Sobre nós', rota: '/sobrenos' },
    { nome: 'Seja parceiro', rota: '/sejaparceiro' },
  ],
  actionButton: {
    label: 'Entrar',
    rota: '/login',
    color: 'laranja',
  },
};

export const userHeaderVariants = {
  userA: userHeaderData,
  userB: {
    ...userHeaderData,
    logoLink: '/home-b',
    navLinks: [
      { nome: 'Início', rota: '/home-b' },
      { nome: 'Minha jornada', rota: '/minhajornada' },
      { nome: 'Finanças', rota: '/planejamento' },
      { nome: 'Aprendendo a morar', rota: '/aprendendo' },
      { nome: 'Encontrar casa', rota: '/encontrar-casa' },
    ],
    actionButton: {
      ...userHeaderData.actionButton,
      rota: '/perfil-b',
    },
  },
};

export const headerVariants = {
  empresas: empresasHeaderData,
  user: userHeaderData,
  public: publicHeaderData,
};
