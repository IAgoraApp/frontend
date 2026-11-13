const dadosCabecalhoEmpresas = {
  rotaLogo: '/empresa',
  linksNavegacao: [
    { nome: 'Painel', rota: '/empresa/dashboard' },
    { nome: 'Meus serviços', rota: '/empresa/anuncios' },
    { nome: 'Perfil da empresa', rota: '/empresa/perfil' },
    { nome: 'Marketplace', rota: '/empresa/marketplace' },
    { nome: 'Contatos', rota: '/empresa/contatos' },
  ],
  botaoAcao: {
    rotulo: '+ Anunciar serviço',
    rota: '/empresa/anunciar',
    cor: 'laranja',
  },
};

const dadosCabecalhoConsumidorA = {
  rotaLogo: '/home',
  linksNavegacao: [
    { nome: 'Início', rota: '/home' },
    { nome: 'Casa', rota: '/casa' },
    { nome: 'Rotina', rota: '/rotina' },
    { nome: 'Finanças', rota: '/financas' },
    { nome: 'Empresas e Serviços', rota: '/marketplace' },
  ],
  botaoAcao: {
    rotulo: 'Meu perfil',
    rota: '/perfil',
    cor: 'laranja',
  },
};

const dadosCabecalhoConsumidorB = {
  rotaLogo: '/home-b',
  linksNavegacao: [
    { nome: 'Início', rota: '/home-b' },
    { nome: 'Minha jornada', rota: '/minhajornada' },
    { nome: 'Finanças', rota: '/planejamento' },
    { nome: 'Aprendendo a morar', rota: '/aprendendo' },
    { nome: 'Encontrar casa', rota: '/encontrar-casa' },
  ],
  botaoAcao: {
    rotulo: 'Meu perfil',
    rota: '/perfil-b',
    cor: 'laranja',
  },
};

const dadosCabecalhoPublico = {
  rotaLogo: '/',
  linksNavegacao: [
    { nome: 'Como funciona', rota: '/como-funciona' },
    { nome: 'Sobre nós', rota: '/sobrenos' },
    { nome: 'Para empresas', rota: '/sejaparceiro' },
    { nome: 'Entrar', rota: '/login' },
  ],
  botaoAcao: {
    rotulo: 'Começar agora',
    rota: '/login?modo=cadastro',
    cor: 'laranja',
  },
};

const dadosCabecalhoParceiros = {
  ...dadosCabecalhoPublico,
  linksNavegacao: dadosCabecalhoPublico.linksNavegacao.map(item =>
    item.rota === '/login' ? { ...item, rota: '/empresa/login' } : item
  ),
  botaoAcao: {
    rotulo: 'Cadastrar empresa',
    rota: '/empresa/cadastro',
    cor: 'laranja',
  },
};

export const variantesCabecalhoUsuario = {
  consumidorA: dadosCabecalhoConsumidorA,
  consumidorB: dadosCabecalhoConsumidorB,
};

export const variantesCabecalho = {
  onboarding: { rotaLogo: '/onboarding', linksNavegacao: [], botaoAcao: null },
  empresas: dadosCabecalhoEmpresas,
  usuario: dadosCabecalhoConsumidorA,
  publico: dadosCabecalhoPublico,
  parceiros: dadosCabecalhoParceiros,
};
