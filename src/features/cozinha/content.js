import { addDays, dateKey, parseDate } from '../rotina/utils/dates';

export const storageKey = 'iagora:cozinha:v1';
export const normalize = text =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .trim();
export const ingredientKey = text =>
  normalize(text)
    .replace(/ovos/g, 'ovo')
    .replace(/tomates/g, 'tomate')
    .replace(/cebolas/g, 'cebola');
const ingredient = (name, amount, unit, category = 'Básicos') => ({
  name,
  amount,
  unit,
  category,
});
const cake = [
  ingredient('Farinha de trigo', 2, 'xícara'),
  ingredient('Açúcar', 1, 'xícara'),
  ingredient('Chocolate em pó', 1, 'xícara'),
  ingredient('Ovo', 3, 'unidade', 'Frescos'),
  ingredient('Óleo', 0.5, 'xícara', 'Outros'),
  ingredient('Leite', 1, 'xícara', 'Frescos'),
  ingredient('Fermento', 1, 'colher de sopa', 'Outros'),
  ingredient('Sal', 1, 'pitada', 'Outros'),
];
const cakeSteps = [
  'Bata os ovos, o açúcar e o óleo em uma tigela.',
  'Junte a farinha, o chocolate em pó e o sal. Misture bem.',
  'Acrescente o leite e misture até obter uma massa homogênea.',
  'Adicione o fermento e misture delicadamente.',
  'Coloque em uma forma untada e leve ao forno preaquecido a 180 °C por cerca de 40 minutos. Confira o ponto antes de retirar.',
];
export const recipes = [
  {
    id: 'bolo',
    title: 'Bolo de chocolate simples',
    image: 'ImageCake1',
    detailImage: 'ImageCakeDetail',
    minutes: 50,
    portions: 8,
    level: 'Fácil',
    tags: ['Econômica', 'Fácil'],
    description: 'Um bolo de chocolate fofinho, com ingredientes simples.',
    ingredients: cake,
    steps: cakeSteps,
  },
  {
    id: 'bolo-cobertura',
    title: 'Bolo de chocolate com cobertura',
    image: 'ImageCake2',
    minutes: 70,
    portions: 10,
    level: 'Média',
    tags: ['Média', 'Tradicional'],
    description: 'O bolo de sempre com uma cobertura simples de chocolate.',
    ingredients: [
      ...cake,
      ingredient('Chocolate em pó', 2, 'colher de sopa'),
      ingredient('Açúcar', 2, 'colher de sopa'),
      ingredient('Leite', 3, 'colher de sopa', 'Frescos'),
    ],
    steps: [
      ...cakeSteps,
      'Em fogo baixo, misture os ingredientes adicionais da cobertura até engrossar levemente e espalhe sobre o bolo.',
    ],
  },
  {
    id: 'bolo-sem-ovos',
    title: 'Bolo de chocolate sem ovos',
    image: 'ImageCake3',
    minutes: 45,
    portions: 8,
    level: 'Fácil',
    tags: ['Econômica', 'Sem ovos'],
    description: 'Uma opção simples de bolo sem ovos na massa.',
    ingredients: cake.filter(item => item.name !== 'Ovo'),
    steps: [
      'Misture a farinha, o açúcar, o chocolate e o sal.',
      'Adicione o óleo e o leite. Misture até ficar homogêneo.',
      'Acrescente o fermento delicadamente.',
      'Leve em forma untada ao forno preaquecido a 180 °C. Asse por cerca de 35 minutos e confira o ponto.',
    ],
  },
  {
    id: 'macarrao',
    title: 'Macarrão com molho de tomate',
    image: 'EditorialPhotoFood',
    minutes: 25,
    portions: 2,
    level: 'Tô começando',
    tags: ['Rápida', 'Econômica'],
    description: 'Uma panela, um almoço resolvido.',
    ingredients: [
      ingredient('Macarrão', 200, 'g'),
      ingredient('Tomate', 2, 'unidade', 'Frescos'),
      ingredient('Alho', 2, 'dente', 'Frescos'),
      ingredient('Azeite', 1, 'colher de sopa', 'Outros'),
      ingredient('Sal', 1, 'pitada', 'Outros'),
      ingredient('Água', 500, 'ml', 'Outros'),
    ],
    steps: [
      'Refogue o alho e o tomate no azeite.',
      'Junte o macarrão e a água aos poucos.',
      'Cozinhe até o ponto indicado na embalagem, ajuste o sal e finalize.',
    ],
  },
  {
    id: 'omelete',
    title: 'Omelete simples',
    image: 'ImageDish2',
    minutes: 15,
    portions: 1,
    level: 'Fácil',
    tags: ['Rápida', 'Simples'],
    description: 'Uma refeição prática para qualquer hora do dia.',
    ingredients: [
      ingredient('Ovo', 2, 'unidade', 'Frescos'),
      ingredient('Cebola', 0.25, 'unidade', 'Frescos'),
      ingredient('Tomate', 0.5, 'unidade', 'Frescos'),
      ingredient('Óleo', 1, 'colher de chá', 'Outros'),
      ingredient('Sal', 1, 'pitada', 'Outros'),
    ],
    steps: [
      'Bata os ovos e misture a cebola, o tomate picado e o sal.',
      'Aqueça o óleo em uma frigideira e despeje a mistura.',
      'Cozinhe em fogo baixo, virando com cuidado, até os ovos estarem firmes.',
    ],
  },
  {
    id: 'ovo-frito',
    title: 'Ovo frito',
    image: 'ImageDish1',
    minutes: 10,
    portions: 1,
    level: 'Fácil',
    tags: ['Rápida', 'Econômica'],
    description: 'O básico que combina com uma refeição simples.',
    ingredients: [
      ingredient('Ovo', 1, 'unidade', 'Frescos'),
      ingredient('Óleo', 1, 'colher de chá', 'Outros'),
      ingredient('Sal', 1, 'pitada', 'Outros'),
    ],
    steps: [
      'Aqueça o óleo em fogo baixo.',
      'Quebre o ovo em um recipiente e coloque na frigideira com cuidado.',
      'Tempere e cozinhe até a clara e a gema ficarem firmes.',
    ],
  },
  {
    id: 'ovo-mexido',
    title: 'Ovo mexido',
    image: 'ImageDish3',
    minutes: 10,
    portions: 1,
    level: 'Fácil',
    tags: ['Rápida', 'Econômica'],
    description: 'Uma opção rápida para o café da manhã.',
    ingredients: [
      ingredient('Ovo', 2, 'unidade', 'Frescos'),
      ingredient('Óleo', 1, 'colher de chá', 'Outros'),
      ingredient('Sal', 1, 'pitada', 'Outros'),
    ],
    steps: [
      'Bata os ovos com o sal.',
      'Aqueça o óleo e acrescente os ovos.',
      'Mexa em fogo baixo até os ovos estarem cozidos e firmes.',
    ],
  },
  {
    id: 'shakshuka',
    title: 'Shakshuka (ovo com tomate)',
    image: 'ImageDish4',
    minutes: 20,
    portions: 2,
    level: 'Média',
    tags: ['Média', 'Diferente'],
    description: 'Ovos em um molho simples de tomate.',
    ingredients: [
      ingredient('Ovo', 2, 'unidade', 'Frescos'),
      ingredient('Tomate', 2, 'unidade', 'Frescos'),
      ingredient('Cebola', 0.5, 'unidade', 'Frescos'),
      ingredient('Azeite', 1, 'colher de sopa', 'Outros'),
      ingredient('Sal', 1, 'pitada', 'Outros'),
    ],
    steps: [
      'Refogue a cebola no azeite e acrescente o tomate picado.',
      'Cozinhe até formar um molho e ajuste o sal.',
      'Abra espaços no molho, adicione os ovos e tampe até as claras e as gemas ficarem firmes.',
    ],
  },
];
export const tabs = [
  ['inicio', 'Cozinha'],
  ['buscar', 'Buscar receita'],
  ['despensa', 'O que tenho em casa'],
  ['plano', 'Meu plano'],
  ['compras', 'Lista de compras'],
  ['favoritas', 'Favoritas'],
];
export const headings = {
  buscar: [
    'O que você quer fazer hoje?',
    'Encontre uma receita do nosso catálogo para o seu dia.',
  ],
  despensa: [
    'O que você tem em casa?',
    'Adicione os ingredientes disponíveis e encontre ideias.',
  ],
  plano: [
    'Meu plano de refeições.',
    'Organize sua semana de forma simples e prática.',
  ],
  compras: [
    'Sua lista de compras.',
    'Planeje o que falta a partir das receitas e do que você já tem.',
  ],
  favoritas: [
    'Suas receitas favoritas.',
    'Guarde as receitas que você quer fazer de novo.',
  ],
  basico: [
    'Um repertório para começar.',
    'Poucos passos e receitas possíveis no seu ritmo.',
  ],
};
export const mealTypes = ['Café da manhã', 'Almoço', 'Jantar', 'Lanche'];
export const initialState = () => ({
  version: 1,
  pantry: [],
  favorites: [],
  meals: [],
  shopping: [],
  checks: {},
});
export function readState() {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return { data: initialState(), error: false };
    const data = JSON.parse(raw);
    if (
      data?.version !== 1 ||
      !['pantry', 'favorites', 'meals', 'shopping'].every(key =>
        Array.isArray(data[key])
      ) ||
      !data.pantry.every(item => typeof item === 'string') ||
      !data.favorites.every(id => recipes.some(recipe => recipe.id === id)) ||
      !data.meals.every(
        item =>
          typeof item.id === 'string' &&
          parseDate(item.date) &&
          mealTypes.includes(item.type) &&
          recipes.some(recipe => recipe.id === item.recipeId) &&
          Number.isFinite(item.portions) &&
          item.portions > 0 &&
          item.portions <= 24
      ) ||
      !data.shopping.every(
        item =>
          typeof item.id === 'string' &&
          typeof item.name === 'string' &&
          typeof item.unit === 'string' &&
          Number.isFinite(item.amount) &&
          item.amount > 0 &&
          typeof item.bought === 'boolean'
      ) ||
      !data.checks ||
      typeof data.checks !== 'object' ||
      Array.isArray(data.checks)
    )
      throw new Error('invalid');
    return { data, error: false };
  } catch {
    return { data: initialState(), error: true };
  }
}
export function monday(date = dateKey()) {
  const value = parseDate(date);
  return addDays(date, -((value.getDay() + 6) % 7));
}
export const formatAmount = amount =>
  new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(amount);
export const hasIngredient = (pantry, name) =>
  pantry.some(item => ingredientKey(item) === ingredientKey(name));
export function missingIngredients(recipe, portions, pantry) {
  return recipe.ingredients
    .filter(item => !hasIngredient(pantry, item.name) && item.name !== 'Água')
    .map(item => ({
      ...item,
      amount: (item.amount * portions) / recipe.portions,
    }));
}
export function addShopping(state, ingredients) {
  const items = state.shopping.map(item => ({ ...item }));
  for (const item of ingredients) {
    const existing = items.find(
      entry =>
        ingredientKey(entry.name) === ingredientKey(item.name) &&
        entry.unit === item.unit &&
        !entry.bought
    );
    if (existing) {
      existing.amount = Math.max(existing.amount, item.amount);
      continue;
    }
    items.push({ ...item, id: crypto.randomUUID(), bought: false });
  }
  return { ...state, shopping: items };
}
export function planIngredients(meals, pantry) {
  const result = [];
  for (const meal of meals) {
    const recipe = recipes.find(item => item.id === meal.recipeId);
    for (const item of missingIngredients(recipe, meal.portions, pantry)) {
      const existing = result.find(
        entry =>
          ingredientKey(entry.name) === ingredientKey(item.name) &&
          entry.unit === item.unit
      );
      if (existing) existing.amount += item.amount;
      else result.push({ ...item });
    }
  }
  return result;
}
export { dateKey, addDays };
