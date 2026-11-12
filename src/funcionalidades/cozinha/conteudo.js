import {
  adicionarDias,
  analisarData,
  chaveData,
} from '../rotina/utilitarios/datas';

export const CHAVE_COZINHA = 'iagora:cozinha:v1';

export const normalizarTexto = texto =>
  texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .trim();

export const chaveIngrediente = texto =>
  normalizarTexto(texto)
    .replace(/ovos/g, 'ovo')
    .replace(/tomates/g, 'tomate')
    .replace(/cebolas/g, 'cebola');

const criarIngrediente = (name, amount, unit, category = 'Básicos') => ({
  name,
  amount,
  unit,
  category,
});

const ingredientesBolo = [
  criarIngrediente('Farinha de trigo', 2, 'xícara'),
  criarIngrediente('Açúcar', 1, 'xícara'),
  criarIngrediente('Chocolate em pó', 1, 'xícara'),
  criarIngrediente('Ovo', 3, 'unidade', 'Frescos'),
  criarIngrediente('Óleo', 0.5, 'xícara', 'Outros'),
  criarIngrediente('Leite', 1, 'xícara', 'Frescos'),
  criarIngrediente('Fermento', 1, 'colher de sopa', 'Outros'),
  criarIngrediente('Sal', 1, 'pitada', 'Outros'),
];

const passosBolo = [
  'Bata os ovos, o açúcar e o óleo em uma tigela.',
  'Junte a farinha, o chocolate em pó e o sal. Misture bem.',
  'Acrescente o leite e misture até obter uma massa homogênea.',
  'Adicione o fermento e misture delicadamente.',
  'Coloque em uma forma untada e leve ao forno preaquecido a 180 °C por cerca de 40 minutos. Confira o ponto antes de retirar.',
];

export const receitasCozinha = [
  {
    id: 'bolo',
    title: 'Bolo de chocolate simples',
    image: 'receita-bolo-1',
    detailImage: 'receita-bolo-detalhe',
    minutes: 50,
    portions: 8,
    level: 'Fácil',
    tags: ['Econômica', 'Fácil'],
    description: 'Um bolo de chocolate fofinho, com ingredientes simples.',
    ingredients: ingredientesBolo,
    steps: passosBolo,
  },
  {
    id: 'bolo-cobertura',
    title: 'Bolo de chocolate com cobertura',
    image: 'receita-bolo-2',
    minutes: 70,
    portions: 10,
    level: 'Média',
    tags: ['Média', 'Tradicional'],
    description: 'O bolo de sempre com uma cobertura simples de chocolate.',
    ingredients: [
      ...ingredientesBolo,
      criarIngrediente('Chocolate em pó', 2, 'colher de sopa'),
      criarIngrediente('Açúcar', 2, 'colher de sopa'),
      criarIngrediente('Leite', 3, 'colher de sopa', 'Frescos'),
    ],
    steps: [
      ...passosBolo,
      'Em fogo baixo, misture os ingredientes adicionais da cobertura até engrossar levemente e espalhe sobre o bolo.',
    ],
  },
  {
    id: 'bolo-sem-ovos',
    title: 'Bolo de chocolate sem ovos',
    image: 'receita-bolo-3',
    minutes: 45,
    portions: 8,
    level: 'Fácil',
    tags: ['Econômica', 'Sem ovos'],
    description: 'Uma opção simples de bolo sem ovos na massa.',
    ingredients: ingredientesBolo.filter(item => item.name !== 'Ovo'),
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
    image: 'cozinha-macarrao',
    minutes: 25,
    portions: 2,
    level: 'Tô começando',
    tags: ['Rápida', 'Econômica'],
    description: 'Uma panela, um almoço resolvido.',
    ingredients: [
      criarIngrediente('Macarrão', 200, 'g'),
      criarIngrediente('Tomate', 2, 'unidade', 'Frescos'),
      criarIngrediente('Alho', 2, 'dente', 'Frescos'),
      criarIngrediente('Azeite', 1, 'colher de sopa', 'Outros'),
      criarIngrediente('Sal', 1, 'pitada', 'Outros'),
      criarIngrediente('Água', 500, 'ml', 'Outros'),
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
    image: 'receita-prato-2',
    minutes: 15,
    portions: 1,
    level: 'Fácil',
    tags: ['Rápida', 'Simples'],
    description: 'Uma refeição prática para qualquer hora do dia.',
    ingredients: [
      criarIngrediente('Ovo', 2, 'unidade', 'Frescos'),
      criarIngrediente('Cebola', 0.25, 'unidade', 'Frescos'),
      criarIngrediente('Tomate', 0.5, 'unidade', 'Frescos'),
      criarIngrediente('Óleo', 1, 'colher de chá', 'Outros'),
      criarIngrediente('Sal', 1, 'pitada', 'Outros'),
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
    image: 'receita-prato-1',
    minutes: 10,
    portions: 1,
    level: 'Fácil',
    tags: ['Rápida', 'Econômica'],
    description: 'O básico que combina com uma refeição simples.',
    ingredients: [
      criarIngrediente('Ovo', 1, 'unidade', 'Frescos'),
      criarIngrediente('Óleo', 1, 'colher de chá', 'Outros'),
      criarIngrediente('Sal', 1, 'pitada', 'Outros'),
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
    image: 'receita-prato-3',
    minutes: 10,
    portions: 1,
    level: 'Fácil',
    tags: ['Rápida', 'Econômica'],
    description: 'Uma opção rápida para o café da manhã.',
    ingredients: [
      criarIngrediente('Ovo', 2, 'unidade', 'Frescos'),
      criarIngrediente('Óleo', 1, 'colher de chá', 'Outros'),
      criarIngrediente('Sal', 1, 'pitada', 'Outros'),
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
    image: 'receita-prato-4',
    minutes: 20,
    portions: 2,
    level: 'Média',
    tags: ['Média', 'Diferente'],
    description: 'Ovos em um molho simples de tomate.',
    ingredients: [
      criarIngrediente('Ovo', 2, 'unidade', 'Frescos'),
      criarIngrediente('Tomate', 2, 'unidade', 'Frescos'),
      criarIngrediente('Cebola', 0.5, 'unidade', 'Frescos'),
      criarIngrediente('Azeite', 1, 'colher de sopa', 'Outros'),
      criarIngrediente('Sal', 1, 'pitada', 'Outros'),
    ],
    steps: [
      'Refogue a cebola no azeite e acrescente o tomate picado.',
      'Cozinhe até formar um molho e ajuste o sal.',
      'Abra espaços no molho, adicione os ovos e tampe até as claras e as gemas ficarem firmes.',
    ],
  },
];

export const abasCozinha = [
  ['inicio', 'Cozinha'],
  ['buscar', 'Buscar receita'],
  ['despensa', 'O que tenho em casa'],
  ['plano', 'Meu plano'],
  ['compras', 'Lista de compras'],
  ['favoritas', 'Favoritas'],
];

export const cabecalhosCozinha = {
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

export const tiposRefeicao = ['Café da manhã', 'Almoço', 'Jantar', 'Lanche'];

export const estadoInicialCozinha = () => ({
  version: 1,
  pantry: [],
  favorites: [],
  meals: [],
  shopping: [],
  checks: {},
});

export function lerEstadoCozinha() {
  try {
    const bruto = localStorage.getItem(CHAVE_COZINHA);
    if (!bruto) return { dados: estadoInicialCozinha(), erro: false };
    const dados = JSON.parse(bruto);
    if (
      dados?.version !== 1 ||
      !['pantry', 'favorites', 'meals', 'shopping'].every(chave =>
        Array.isArray(dados[chave])
      ) ||
      !dados.pantry.every(item => typeof item === 'string') ||
      !dados.favorites.every(id =>
        receitasCozinha.some(receita => receita.id === id)
      ) ||
      !dados.meals.every(
        item =>
          typeof item.id === 'string' &&
          analisarData(item.date) &&
          tiposRefeicao.includes(item.type) &&
          receitasCozinha.some(receita => receita.id === item.recipeId) &&
          Number.isFinite(item.portions) &&
          item.portions > 0 &&
          item.portions <= 24
      ) ||
      !dados.shopping.every(
        item =>
          typeof item.id === 'string' &&
          typeof item.name === 'string' &&
          typeof item.unit === 'string' &&
          Number.isFinite(item.amount) &&
          item.amount > 0 &&
          typeof item.bought === 'boolean'
      ) ||
      !dados.checks ||
      typeof dados.checks !== 'object' ||
      Array.isArray(dados.checks)
    ) {
      throw new Error('invalido');
    }
    return { dados, erro: false };
  } catch {
    return { dados: estadoInicialCozinha(), erro: true };
  }
}

export function segundaFeiraSemana(data = chaveData()) {
  const valor = analisarData(data);
  return adicionarDias(data, -((valor.getDay() + 6) % 7));
}

export const formatarQuantidade = quantidade =>
  new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(
    quantidade
  );

export const possuiIngrediente = (despensa, nome) =>
  despensa.some(item => chaveIngrediente(item) === chaveIngrediente(nome));

export function ingredientesFaltantes(receita, porcoes, despensa) {
  return receita.ingredients
    .filter(
      item => !possuiIngrediente(despensa, item.name) && item.name !== 'Água'
    )
    .map(item => ({
      ...item,
      amount: (item.amount * porcoes) / receita.portions,
    }));
}

export function adicionarNaListaCompras(estado, ingredientes) {
  const itens = estado.shopping.map(item => ({ ...item }));
  for (const item of ingredientes) {
    const existente = itens.find(
      entrada =>
        chaveIngrediente(entrada.name) === chaveIngrediente(item.name) &&
        entrada.unit === item.unit &&
        !entrada.bought
    );
    if (existente) {
      existente.amount = Math.max(existente.amount, item.amount);
      continue;
    }
    itens.push({ ...item, id: crypto.randomUUID(), bought: false });
  }
  return { ...estado, shopping: itens };
}

export function ingredientesDoPlano(refeicoes, despensa) {
  const resultado = [];
  for (const refeicao of refeicoes) {
    const receita = receitasCozinha.find(item => item.id === refeicao.recipeId);
    if (!receita) continue;
    for (const item of ingredientesFaltantes(
      receita,
      refeicao.portions,
      despensa
    )) {
      const existente = resultado.find(
        entrada =>
          chaveIngrediente(entrada.name) === chaveIngrediente(item.name) &&
          entrada.unit === item.unit
      );
      if (existente) existente.amount += item.amount;
      else resultado.push({ ...item });
    }
  }
  return resultado;
}

export { adicionarDias, chaveData };
