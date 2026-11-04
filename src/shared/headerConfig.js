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
    { nome: 'Seja parceiro', rota: '/sejaparceiro' },
  ],
  actionButton: {
    label: 'Entrar',
    rota: '/login',
    color: 'laranja',
  },
};

export const prestadoresHeaderData = {
  logoLink: '/',
  navLinks: [
    { nome: 'Como funciona', rota: '#como-funciona' },
    { nome: 'Categorias', rota: '#categorias' },
    { nome: 'Vantagens', rota: '#vantagens' },
    { nome: 'Perguntas frequentes', rota: '#perguntas-frequentes' },
    { nome: 'Contato', rota: '#contato' },
  ],
  actionButton: {
    label: 'Quero anunciar',
    rota: '/cadastro-empresa',
    color: 'laranja',
  },
};

export const empresaAcessoHeaderData = {
  logoLink: '/',
  navLinks: [
    {
      nome: 'Como funciona',
      rota: '/sejaparceiro#como-funciona',
      className: 'w-[109px]',
    },
    { nome: 'Sobre nós', rota: '/sobrenos', className: 'w-[79px]' },
    {
      nome: 'Para empresas',
      rota: '/sejaparceiro',
      className: 'w-[109px]',
      active: true,
    },
    { nome: 'Entrar', rota: '/login?perfil=empresa', className: 'w-14' },
  ],
  actionButton: {
    label: 'Cadastrar empresa',
    rota: '/cadastro-empresa',
    color: 'laranja',
  },
};

export const headerVariants = {
  empresas: empresasHeaderData,
  user: userHeaderData,
  public: publicHeaderData,
  institucional: publicHeaderData,
  prestadores: prestadoresHeaderData,
  'empresa-acesso': empresaAcessoHeaderData,
};

export default headerVariants;
