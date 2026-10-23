import essentials from '../assets/images/household/essentials.png';
import apartment from '../assets/images/household/apartment.png';
import services from '../assets/images/household/services.png';
import food from '../assets/images/household/food.png';

export const houseHero = {
  eyebrow: 'SEU CANTO. SEU JEITO DE CUIDAR.',
  title: 'Casa com',
  highlight: 'a sua cara.',
  description:
    'Organize a limpeza, descubra o que cozinhar e encontre ajuda quando precisar.',
  action: { to: '/rotina', label: 'Organizar minha rotina' },
  primaryPhoto: essentials,
  secondaryPhoto: apartment,
};

export const houseCards = [
  {
    image: services,
    alt: 'Equipe de profissionais com materiais para cuidar da casa',
    eyebrow: '01 / LIMPEZA',
    title: 'Casa limpa, sem complicação.',
    description:
      'Uma rotina possível, os produtos certos e um cômodo de cada vez.',
    action: { to: '/limpeza', label: 'Cuidar da limpeza' },
    tinted: true,
  },
  {
    image: food,
    alt: 'Macarrão com molho de tomate e manjericão',
    eyebrow: '02 / COZINHA',
    title: 'Comida boa no seu ritmo.',
    description:
      'Receitas simples e ideias para aproveitar o que já tem em casa.',
    action: { to: '/cozinha', label: 'Explorar a cozinha' },
  },
];

export const houseChecklist = [
  {
    id: 'geladeira',
    title: 'Olhar a geladeira antes de comprar',
    description: 'Evite desperdício e monte uma lista que faça sentido.',
  },
  {
    id: 'cuidados',
    title: 'Separar um dia para os cuidados da casa',
    description: 'Distribua tarefas para não deixar tudo para o fim de semana.',
  },
  {
    id: 'manutencao',
    title: 'Perceber o que precisa de manutenção',
    description: 'Vazamentos, tomadas e reparos pedem atenção especializada.',
  },
];
