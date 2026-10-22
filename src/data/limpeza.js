import services from '../assets/images/household/services.png';
import essentials from '../assets/images/household/essentials.png';

export const cleaningHero = {
  eyebrow: 'LIMPEZA SEM VIRAR UM DRAMA',
  title: 'Menos caos.',
  highlight: 'Mais casa.',
  description:
    'Não precisa fazer tudo de uma vez. Monte uma rotina que cabe na sua semana.',
  primaryPhoto: services,
  secondaryPhoto: essentials,
  tape: 'INDEPENDÊNCIA NA VIDA REAL ↗',
};

export const cleaningCadences = [
  {
    id: 'dia',
    label: 'No dia a dia',
    initialChecked: ['louca'],
    items: [
      {
        id: 'louca',
        title: 'Lavar a louça e liberar a pia',
        description: 'Uma bancada livre já muda a sensação da cozinha.',
      },
      {
        id: 'lixo',
        title: 'Tirar o lixo e separar os recicláveis',
        description: 'Siga os dias de coleta da sua região.',
      },
      {
        id: 'banheiro',
        title: 'Dar atenção ao banheiro',
        description: 'Pia, vaso e superfícies: cuide de um ponto por vez.',
      },
      {
        id: 'varrer',
        title: 'Varrer os ambientes mais usados',
        description: 'Entrada, cozinha e o caminho que você faz todo dia.',
      },
    ],
  },
  {
    id: 'semana',
    label: 'Na semana',
    items: [
      {
        id: 'roupas-cama',
        title: 'Trocar a roupa de cama e as toalhas',
        description: 'Separe um dia que funcione para você.',
      },
      {
        id: 'poeira',
        title: 'Tirar o pó e limpar o chão',
        description: 'Organize um cômodo por vez, sem acumular tudo.',
      },
      {
        id: 'banheiro-completo',
        title: 'Reservar um cuidado maior para o banheiro',
        description: 'Inclua o box, o vaso e as superfícies mais usadas.',
      },
      {
        id: 'geladeira',
        title: 'Conferir os alimentos da geladeira',
        description:
          'Planeje as próximas refeições com o que precisa ser usado.',
      },
    ],
  },
  {
    id: 'mes',
    label: 'No mês',
    items: [
      {
        id: 'armarios',
        title: 'Revisar os armários',
        description:
          'Organize o que ficou fora do lugar e separe o que não usa.',
      },
      {
        id: 'janelas',
        title: 'Cuidar das janelas e dos cantinhos',
        description: 'Escolha um ambiente para começar.',
      },
      {
        id: 'eletrodomesticos',
        title: 'Dar atenção aos eletrodomésticos',
        description: 'Siga as orientações de limpeza de cada fabricante.',
      },
      {
        id: 'reposicao',
        title: 'Conferir o kit de limpeza',
        description: 'Reponha só o que está acabando.',
      },
    ],
  },
];

export const cleaningCards = [
  {
    image: essentials,
    alt: 'Utensílios essenciais para a primeira casa',
    eyebrow: '01 / COMECE PELO ESSENCIAL',
    title: 'Seu primeiro kit de limpeza.',
    description: 'Poucos itens bem escolhidos resolvem boa parte do básico.',
    action: { label: 'Ver o que vale ter' },
    tinted: true,
  },
  {
    image: services,
    alt: 'Equipe de limpeza pronta para ajudar com os cuidados da casa',
    eyebrow: '02 / AJUDA ESPECIALIZADA',
    title: 'Precisou de uma limpeza maior?',
    description: 'Conheça empresas e converse sobre a necessidade da sua casa.',
    action: { to: '/marketplace', label: 'Encontrar uma prestadora' },
  },
];

export const cleaningKit = [
  {
    id: 'vassoura',
    title: 'Vassoura e pá',
    description: 'Para os cuidados do chão no dia a dia.',
  },
  {
    id: 'panos',
    title: 'Panos e esponjas',
    description: 'Separe os materiais da cozinha e do banheiro.',
  },
  {
    id: 'balde',
    title: 'Balde e rodo',
    description: 'Um conjunto simples para começar.',
  },
  {
    id: 'produtos',
    title: 'Produtos adequados às superfícies',
    description: 'Leia os rótulos e siga as orientações de uso.',
  },
];
