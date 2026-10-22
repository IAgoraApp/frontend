export const dashboardHeaderData = {
  logoLink: '/',
  navLinks: [
    { nome: 'Painel', rota: '/dashboard' },
    { nome: 'Perfil da empresa', rota: '/perfil-empresa' },
  ],
  actionButton: {
    label: '+ Anunciar serviço',
    rota: '/meus-servicos',
    color: 'laranja',
  },
};

export const homeHeaderData = {
  logoLink: '/',
  navLinks: [
    { nome: 'Início', rota: '/home' },
    { nome: 'Rotina', rota: '/minhajornada' },
    { nome: 'Minha casa', rota: '/casa' },
    { nome: 'Finanças', rota: '/manutencao' },
    { nome: 'Empresas e Serviços', rota: '/marketplace' },
  ],
  actionButton: {
    label: 'Meu perfil',
    rota: '/dashboard',
    color: 'laranja',
  },
};

export const landingHeaderData = {
  logoLink: '/',
  navLinks: [
    { nome: 'Início', rota: '/' },
    { nome: 'Sobre nós', rota: '/sobrenos' },
    { nome: 'Seja parceiro', rota: '/cadastro-empresa' },
  ],
  actionButton: {
    label: 'Entrar',
    rota: '/login',
    color: 'laranja',
  },
};

export const headerVariants = {
  dashboard: dashboardHeaderData,
  home: homeHeaderData,
  landing: landingHeaderData,
  institucional: landingHeaderData,
};

export default headerVariants;
