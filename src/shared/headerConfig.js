const empresasHeaderData = {
  logoLink: '/dashboard',
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
    navLinks: userHeaderData.navLinks
      .filter(item => item.rota !== '/casa')
      .map(item => {
        if (item.rota === '/home') return { ...item, rota: '/home-b' };
        if (item.rota === '/rotina') {
          return { nome: 'Minha jornada', rota: '/minhajornada' };
        }
        return item;
      }),
  },
};

export const headerVariants = {
  empresas: empresasHeaderData,
  user: userHeaderData,
  public: publicHeaderData,
};
