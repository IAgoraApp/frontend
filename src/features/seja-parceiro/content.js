import limpezaImg from './assets/limpeza.png';
import manutencaoImg from './assets/manutencao.png';
import mudancasImg from './assets/mudancas.png';
import instalacoesImg from './assets/instalacoes.png';
import reformasImg from './assets/reformas.png';
import iconeLimpeza from './assets/limpeza.svg';
import iconeManutencao from './assets/manutencao.svg';
import iconeMudancas from './assets/mudancas.svg';
import iconeInstalacoes from './assets/instalacoes.svg';
import iconeReformas from './assets/reformas.svg';
import iconeOutros from './assets/outros.svg';
import iconePublico from './assets/publico.svg';
import iconeVisibilidade from './assets/visibilidade.svg';
import iconeConfianca from './assets/confianca.svg';
import iconeCrescimento from './assets/crescimento.svg';
import iconeConta from './assets/conta.svg';
import iconeAnuncio from './assets/anuncio.svg';
import iconeContatos from './assets/contatos.svg';

export const categoriasDestaque = [
  {
    id: 'limpeza',
    titulo: 'Limpeza',
    descricao: 'Residencial e comercial',
    icone: iconeLimpeza,
    imagem: limpezaImg,
  },
  {
    id: 'manutencao',
    titulo: 'Manutenção',
    descricao: 'Pequenos reparos',
    icone: iconeManutencao,
    imagem: manutencaoImg,
  },
  {
    id: 'mudancas',
    titulo: 'Mudanças',
    descricao: 'Transporte e organização',
    icone: iconeMudancas,
    imagem: mudancasImg,
  },
  {
    id: 'instalacoes',
    titulo: 'Instalações',
    descricao: 'Elétrica, hidráulica e mais',
    icone: iconeInstalacoes,
    imagem: instalacoesImg,
  },
  {
    id: 'reformas',
    titulo: 'Reformas',
    descricao: 'Pintura, acabamento e muito mais',
    icone: iconeReformas,
    imagem: reformasImg,
  },
];

export const categoriasServicos = [
  ...categoriasDestaque,
  { id: 'outros', titulo: 'Outros serviços', icone: iconeOutros },
];

export const beneficiosParceiro = [
  {
    id: 'publico',
    icone: iconePublico,
    titulo: 'Público certo',
    descricao:
      'Conecte-se com pessoas que realmente precisam do seu serviço.',
  },
  {
    id: 'visibilidade',
    icone: iconeVisibilidade,
    titulo: 'Mais visibilidade',
    descricao: 'Seus serviços em destaque na plataforma.',
  },
  {
    id: 'confianca',
    icone: iconeConfianca,
    titulo: 'Confiança e credibilidade',
    descricao:
      'Faça parte de uma comunidade que valoriza bons profissionais.',
  },
  {
    id: 'crescimento',
    icone: iconeCrescimento,
    titulo: 'Crescimento para o seu negócio',
    descricao: 'Aumente suas oportunidades de forma simples e prática.',
  },
];

export const passosParceiro = [
  {
    id: 'conta',
    icone: iconeConta,
    titulo: '01  Crie sua conta',
    descricao: 'Cadastre sua empresa ou serviço.',
  },
  {
    id: 'anuncio',
    icone: iconeAnuncio,
    titulo: '02  Publique seu anúncio',
    descricao: 'Adicione informações, fotos e região de atendimento.',
  },
  {
    id: 'contatos',
    icone: iconeContatos,
    titulo: '03  Receba contatos',
    descricao: 'Conecte-se com pessoas que precisam do seu serviço.',
  },
];

export const duvidasFrequentesParceiro = [
  {
    id: 'servicos',
    pergunta: 'Quais tipos de serviços posso anunciar?',
    resposta:
      'Limpeza, manutenção, mudanças, instalações, reformas e outros serviços que ajudam a cuidar da casa e do dia a dia.',
  },
  {
    id: 'pagamento',
    pergunta: 'É preciso pagar para anunciar?',
    resposta:
      'Para conhecer as condições de publicação de anúncios, fale com a equipe pelo e-mail Iagora@hotmail.com.',
  },
  {
    id: 'contatos',
    pergunta: 'Como recebo os contatos dos clientes?',
    resposta:
      'Os interessados podem usar os dados de contato informados no seu anúncio. Mantenha seu perfil e sua região de atendimento atualizados.',
  },
  {
    id: 'seguranca',
    pergunta: 'O Iagora é seguro para empresas e prestadores de serviço?',
    resposta:
      'O Iagora aproxima profissionais de pessoas que precisam de serviços. Para esclarecer dúvidas sobre o cadastro e o funcionamento da plataforma, fale com a equipe pelo e-mail Iagora@hotmail.com.',
  },
];
