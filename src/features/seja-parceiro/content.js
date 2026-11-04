import Limpeza from './assets/limpeza.png';
import Manutencao from './assets/manutencao.png';
import Mudancas from './assets/mudancas.png';
import Instalacoes from './assets/instalacoes.png';
import Reformas from './assets/reformas.png';
import IconeLimpeza from './assets/limpeza.svg';
import IconeManutencao from './assets/manutencao.svg';
import IconeMudancas from './assets/mudancas.svg';
import IconeInstalacoes from './assets/instalacoes.svg';
import IconeReformas from './assets/reformas.svg';
import IconeOutros from './assets/outros.svg';
import Publico from './assets/publico.svg';
import Visibilidade from './assets/visibilidade.svg';
import Confianca from './assets/confianca.svg';
import Crescimento from './assets/crescimento.svg';
import Conta from './assets/conta.svg';
import Anuncio from './assets/anuncio.svg';
import Contatos from './assets/contatos.svg';

export const categories = [
  {
    id: 'limpeza',
    title: 'Limpeza',
    description: 'Residencial e comercial',
    icon: IconeLimpeza,
    image: Limpeza,
  },
  {
    id: 'manutencao',
    title: 'Manutenção',
    description: 'Pequenos reparos',
    icon: IconeManutencao,
    image: Manutencao,
  },
  {
    id: 'mudancas',
    title: 'Mudanças',
    description: 'Transporte e organização',
    icon: IconeMudancas,
    image: Mudancas,
  },
  {
    id: 'instalacoes',
    title: 'Instalações',
    description: 'Elétrica, hidráulica e mais',
    icon: IconeInstalacoes,
    image: Instalacoes,
  },
  {
    id: 'reformas',
    title: 'Reformas',
    description: 'Pintura, acabamento e muito mais',
    icon: IconeReformas,
    image: Reformas,
  },
];

export const serviceCategories = [
  ...categories,
  { id: 'outros', title: 'Outros serviços', icon: IconeOutros },
];

export const benefits = [
  {
    id: 'publico',
    icon: Publico,
    title: 'Público certo',
    description:
      'Conecte-se com pessoas que realmente precisam do seu serviço.',
  },
  {
    id: 'visibilidade',
    icon: Visibilidade,
    title: 'Mais visibilidade',
    description: 'Seus serviços em destaque na plataforma.',
  },
  {
    id: 'confianca',
    icon: Confianca,
    title: 'Confiança e credibilidade',
    description:
      'Faça parte de uma comunidade que valoriza bons profissionais.',
  },
  {
    id: 'crescimento',
    icon: Crescimento,
    title: 'Crescimento para o seu negócio',
    description: 'Aumente suas oportunidades de forma simples e prática.',
  },
];

export const steps = [
  {
    id: 'conta',
    icon: Conta,
    title: '01  Crie sua conta',
    description: 'Cadastre sua empresa ou serviço.',
  },
  {
    id: 'anuncio',
    icon: Anuncio,
    title: '02  Publique seu anúncio',
    description: 'Adicione informações, fotos e região de atendimento.',
  },
  {
    id: 'contatos',
    icon: Contatos,
    title: '03  Receba contatos',
    description: 'Conecte-se com pessoas que precisam do seu serviço.',
  },
];

export const questions = [
  {
    id: 'servicos',
    question: 'Quais tipos de serviços posso anunciar?',
    answer:
      'Limpeza, manutenção, mudanças, instalações, reformas e outros serviços que ajudam a cuidar da casa e do dia a dia.',
  },
  {
    id: 'pagamento',
    question: 'É preciso pagar para anunciar?',
    answer:
      'Para conhecer as condições de publicação de anúncios, fale com a equipe pelo e-mail Iagora@hotmail.com.',
  },
  {
    id: 'contatos',
    question: 'Como recebo os contatos dos clientes?',
    answer:
      'Os interessados podem usar os dados de contato informados no seu anúncio. Mantenha seu perfil e sua região de atendimento atualizados.',
  },
  {
    id: 'seguranca',
    question: 'O Iagora é seguro para empresas e prestadores de serviço?',
    answer:
      'O Iagora aproxima profissionais de pessoas que precisam de serviços. Para esclarecer dúvidas sobre o cadastro e o funcionamento da plataforma, fale com a equipe pelo e-mail Iagora@hotmail.com.',
  },
];
