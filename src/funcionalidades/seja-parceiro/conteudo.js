import limpezaImg from '../../ativos/imagens/servicos/limpeza.png';
import manutencaoImg from '../../ativos/imagens/servicos/manutencao.png';
import mudancasImg from '../../ativos/imagens/servicos/mudancas.png';
import instalacoesImg from '../../ativos/imagens/servicos/instalacoes.png';
import reformasImg from '../../ativos/imagens/servicos/reformas.png';
import iconeLimpeza from '../../ativos/vetores/parceiro/limpeza.svg';
import iconeManutencao from '../../ativos/vetores/parceiro/manutencao.svg';
import iconeMudancas from '../../ativos/vetores/parceiro/mudancas.svg';
import iconeInstalacoes from '../../ativos/vetores/parceiro/instalacoes.svg';
import iconeReformas from '../../ativos/vetores/parceiro/reformas.svg';
import iconeOutros from '../../ativos/vetores/parceiro/outros.svg';
import iconePublico from '../../ativos/vetores/parceiro/publico.svg';
import iconeVisibilidade from '../../ativos/vetores/parceiro/visibilidade.svg';
import iconeConfianca from '../../ativos/vetores/parceiro/confianca.svg';
import iconeCrescimento from '../../ativos/vetores/parceiro/crescimento.svg';
import iconeConta from '../../ativos/vetores/parceiro/conta.svg';
import iconeAnuncio from '../../ativos/vetores/parceiro/anuncio.svg';
import iconeContatos from '../../ativos/vetores/parceiro/contatos.svg';

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
