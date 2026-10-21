import cooking from '../assets/images/household/cooking.png';
import food from '../assets/images/household/food.png';

export const kitchenHero = {
  eyebrow: 'DA PRIMEIRA RECEITA AO SEU PRATO FAVORITO',
  title: 'Hoje tem',
  highlight: 'eu que fiz.',
  description:
    'Receitas possíveis para quem está começando, economizando ou só com vontade de comer bem.',
  action: { href: '#lista-compras', label: 'Organizar minhas compras' },
  primaryPhoto: cooking,
  secondaryPhoto: food,
};

export const featuredRecipe = {
  image: food,
  name: 'MACARRÃO COM MOLHO DE TOMATE',
  metadata: '25 MIN  ·  2 PORÇÕES  ·  NÍVEL: TÔ COMEÇANDO',
  ingredients: 'Você vai usar: macarrão, tomate, alho, azeite, sal e água.',
  steps: [
    'Refogue o alho e o tomate.',
    'Junte o macarrão e a água aos poucos.',
    'Cozinhe até ficar no ponto e finalize.',
  ],
};

export const shoppingSteps = [
  {
    id: 'alimentos-abertos',
    title: 'Veja o que já está aberto',
    description: 'Comece pelos alimentos que precisam ser usados primeiro.',
  },
  {
    id: 'refeicoes',
    title: 'Escolha duas ou três refeições da semana',
    description: 'Repetir ingredientes ajuda a economizar e evita sobras.',
  },
  {
    id: 'lista',
    title: 'Leve a lista com você',
    description: 'Planeje o gasto com a calculadora de compras.',
  },
];
