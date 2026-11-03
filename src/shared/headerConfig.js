export const empresasHeaderData = {
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

export const userHeaderData = {
  logoLink: '/',
  navLinks: [
    { nome: 'Início', rota: '/home' },
    { nome: 'Rotina', rota: '/minhajornada' },
    { nome: 'Finanças', rota: '/financas' },
    { nome: 'Empresas e Serviços', rota: '/marketplace' },
  ],
  actionButton: {
    label: 'Meu perfil',
    rota: '/dashboard',
    color: 'laranja',
  },
};

export const publicHeaderData = {
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
  empresas: empresasHeaderData,
  user: userHeaderData,
  public: publicHeaderData,
  institucional: publicHeaderData,
};

export default headerVariants;
