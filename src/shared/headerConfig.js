const dadosCabecalhoEmpresas = {
  rotaLogo: '/empresa',
  linksNavegacao: [
    { nome: 'Início', rota: '/empresa' },
    { nome: 'Meus serviços', rota: '/empresa/anuncios' },
    { nome: 'Atendimentos', rota: '/empresa/contatos' },
    { nome: 'Empresas e Serviços', rota: '/empresa/marketplace' },
  ],
  botaoAcao: {
    rotulo: 'Meu perfil',
    rota: '/empresa/perfil',
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
    { nome: 'IA', rota: '/ia' },
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
    { nome: 'Finanças', rota: '/financas-b' },
    { nome: 'Empresas e Serviços', rota: '/marketplace' },
    { nome: 'IA', rota: '/ia-b' },
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
    { nome: 'Início', rota: '/' },
    { nome: 'Sobre nós', rota: '/sobrenos' },
    { nome: 'Para empresas', rota: '/sejaparceiro' },
  ],
  botaoAcao: { rotulo: 'Acessar plataforma', rota: '/login', cor: 'laranja' },
};

export const variantesCabecalhoUsuario = {
  consumidorA: dadosCabecalhoConsumidorA,
  consumidorB: dadosCabecalhoConsumidorB,
};

export const variantesCabecalho = {
  empresas: dadosCabecalhoEmpresas,
  usuario: dadosCabecalhoConsumidorA,
  publico: dadosCabecalhoPublico,
};
