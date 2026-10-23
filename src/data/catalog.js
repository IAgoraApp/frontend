import food from '../assets/images/household/food.png';
import cooking from '../assets/images/household/cooking.png';
import apartment from '../assets/images/apartment.png';
import house from '../assets/images/casa.jpg';
import services from '../assets/images/services.png';
import essentials from '../assets/images/essentials.png';
import moving from '../assets/images/moving.png';

export const recipes = [
  {
    id: 'pasta',
    name: 'Macarrão com molho de tomate',
    time: 25,
    portions: 2,
    image: food,
    ingredients: ['macarrão', 'tomate', 'alho', 'azeite', 'sal'],
    quantities: [
      '200 g de macarrão',
      '2 tomates picados',
      '1 dente de alho',
      '1 colher de azeite',
      'Sal a gosto',
    ],
    steps: [
      'Aqueça o azeite e refogue o alho e o tomate por 5 minutos.',
      'Cozinhe o macarrão em água conforme a embalagem.',
      'Escorra, misture ao molho e ajuste o sal.',
    ],
  },
  {
    id: 'omelet',
    name: 'Omelete de tomate',
    time: 10,
    portions: 1,
    image: cooking,
    ingredients: ['ovo', 'tomate', 'cebola', 'azeite', 'sal'],
    quantities: [
      '2 ovos',
      '1 tomate',
      '1/4 de cebola',
      '1 colher de azeite',
      'Sal a gosto',
    ],
    steps: [
      'Bata os ovos e misture o tomate e a cebola picados.',
      'Aqueça o azeite em fogo baixo e despeje a mistura.',
      'Cozinhe dos dois lados até os ovos ficarem firmes.',
    ],
  },
  {
    id: 'rice',
    name: 'Arroz com legumes',
    time: 30,
    portions: 2,
    image: food,
    ingredients: ['arroz', 'cenoura', 'alho', 'azeite', 'sal'],
    quantities: [
      '1 xícara de arroz',
      '1 cenoura picada',
      '1 dente de alho',
      '1 colher de azeite',
      'Sal a gosto',
    ],
    steps: [
      'Refogue o alho no azeite e acrescente o arroz e a cenoura.',
      'Adicione 2 xícaras de água quente e sal.',
      'Cozinhe em fogo baixo até a água secar e os grãos ficarem macios.',
    ],
  },
  {
    id: 'salad',
    name: 'Salada de grão-de-bico',
    time: 15,
    portions: 2,
    image: cooking,
    ingredients: ['grão-de-bico', 'tomate', 'cebola', 'limão', 'azeite'],
    quantities: [
      '1 xícara de grão-de-bico cozido',
      '1 tomate',
      '1/4 de cebola',
      '1 limão',
      '1 colher de azeite',
    ],
    steps: [
      'Use grão-de-bico já cozido e frio.',
      'Pique o tomate e a cebola e misture aos grãos.',
      'Tempere com limão e azeite e sirva.',
    ],
  },
];

export const servicesCatalog = [
  {
    id: 'service-1',
    title: 'Limpeza residencial',
    company: 'Casa em Dia Serviços',
    description:
      'Limpeza dos ambientes, cozinha e banheiro. Materiais básicos incluídos. Exemplo de prestadora para explorar a plataforma.',
    category: 'Limpeza',
    region: 'São Paulo · Pinheiros',
    price: 180,
    priceMode: 'A partir de',
    attendance: 'Presencial',
    availability: 'Segunda a sábado, das 8h às 17h',
    image: services,
    rating: 4.9,
    reviews: [
      'Pontual e cuidadosa com os ambientes.',
      'Combinamos os detalhes antes da visita.',
    ],
    contact: 'Contato fictício · nenhum envio externo',
  },
  {
    id: 'service-2',
    title: 'Pequenos reparos domésticos',
    company: 'Liga & Resolve',
    description:
      'Instalação de prateleiras e pequenos reparos. Avaliação do escopo antes do atendimento.',
    category: 'Manutenção',
    region: 'São Paulo · Vila Mariana',
    price: 120,
    priceMode: 'A partir de',
    attendance: 'Presencial',
    availability: 'Dias úteis, das 9h às 18h',
    image: essentials,
    rating: 4.7,
    reviews: ['Explicou o serviço antes de começar.'],
    contact: 'Contato fictício · nenhum envio externo',
  },
  {
    id: 'service-3',
    title: 'Mudança para o primeiro apê',
    company: 'Mudaê Transportes',
    description:
      'Transporte de móveis e caixas com agendamento e orçamento conforme distância e volume.',
    category: 'Mudança',
    region: 'Campinas · Centro',
    price: 350,
    priceMode: 'A partir de',
    attendance: 'Presencial',
    availability: 'Segunda a sábado, sob agendamento',
    image: moving,
    rating: 4.8,
    reviews: ['As caixas chegaram bem organizadas.'],
    contact: 'Contato fictício · nenhum envio externo',
  },
  {
    id: 'service-4',
    title: 'Organização com orientação online',
    company: 'Cada Coisa',
    description:
      'Planejamento dos ambientes e organização da rotina por chamada. Serviço de exemplo.',
    category: 'Organização',
    region: 'Todo o Brasil',
    price: 90,
    priceMode: 'Preço fixo',
    attendance: 'Online',
    availability: 'Terça a sexta, das 10h às 20h',
    image: essentials,
    rating: 4.6,
    reviews: ['Ideias simples que couberam na rotina.'],
    contact: 'Contato fictício · nenhum envio externo',
  },
];

export const properties = [
  {
    id: 'property-1',
    title: 'Um apê para começar',
    city: 'São Paulo',
    district: 'Vila Mariana',
    region: 'Zona Sul',
    type: 'Apartamento',
    rooms: 1,
    area: 38,
    rent: 1400,
    fees: 280,
    tax: 60,
    image: apartment,
    photos: [apartment, house],
    description:
      'Apartamento ilustrativo com sala integrada, cozinha e um quarto. Sem mobília. Contrato e disponibilidade fictícios.',
    neighborhood:
      'Exemplo de região com transporte público, mercados e serviços próximos.',
    conditions: 'Simulação: caução de 3 aluguéis; prazo de 30 meses.',
    contact: 'Imobiliária demonstrativa · contato não disponível',
  },
  {
    id: 'property-2',
    title: 'Seu canto no centro',
    city: 'Campinas',
    district: 'Centro',
    region: 'Região Central',
    type: 'Studio',
    rooms: 1,
    area: 29,
    rent: 1000,
    fees: 180,
    tax: 45,
    image: house,
    photos: [house, apartment],
    description:
      'Studio ilustrativo com espaço integrado e cozinha compacta. Mobília básica na simulação.',
    neighborhood: 'Exemplo de região central com comércio e linhas de ônibus.',
    conditions: 'Simulação: caução de 2 aluguéis; água cobrada à parte.',
    contact: 'Anunciante demonstrativo · contato não disponível',
  },
  {
    id: 'property-3',
    title: 'Mais espaço para seus planos',
    city: 'São Paulo',
    district: 'Santana',
    region: 'Zona Norte',
    type: 'Casa',
    rooms: 2,
    area: 65,
    rent: 1900,
    fees: 0,
    tax: 90,
    image: house,
    photos: [house, apartment],
    description:
      'Casa ilustrativa com dois quartos e quintal pequeno. Sem mobília.',
    neighborhood: 'Exemplo de bairro residencial com comércio local.',
    conditions: 'Simulação: caução de 3 aluguéis; contas individuais.',
    contact: 'Proprietário demonstrativo · contato não disponível',
  },
];

export const journeySteps = [
  {
    id: 'budget',
    title: 'Entender meu dinheiro',
    category: 'Financeira',
    to: '/financas',
    items: [
      'Registrar minha renda',
      'Estimar o custo mensal',
      'Planejar uma reserva',
    ],
  },
  {
    id: 'documents',
    title: 'Preparar os documentos',
    category: 'Documental',
    to: '/aprendendo',
    items: [
      'Separar documento de identificação',
      'Organizar comprovantes de renda',
      'Ler as condições do contrato de exemplo',
    ],
  },
  {
    id: 'home',
    title: 'Encontrar meu canto',
    category: 'Prática',
    to: '/encontrar-casa',
    items: [
      'Definir região e orçamento',
      'Comparar opções de moradia',
      'Listar perguntas para uma visita',
    ],
  },
  {
    id: 'skills',
    title: 'Aprender o básico da casa',
    category: 'Prática',
    to: '/aprendendo',
    items: [
      'Aprender uma refeição simples',
      'Montar uma rotina de limpeza',
      'Conhecer cuidados de segurança',
    ],
  },
  {
    id: 'move',
    title: 'Organizar a mudança',
    category: 'Prática',
    to: '/financas',
    items: [
      'Planejar móveis essenciais',
      'Estimar o transporte',
      'Montar checklist do primeiro dia',
    ],
  },
];

export const lessons = [
  {
    id: 'routine',
    title: 'Uma casa se cuida aos poucos',
    category: 'Responsabilidades',
    minutes: 4,
    content: [
      'Separe tarefas diárias, semanais e mensais. Distribua o esforço em blocos pequenos.',
      'Confira louça, lixo e alimentos diariamente. Reserve outro momento para roupa de cama e chão.',
      'Monte uma lista de materiais e acompanhe o que já fez. Ajuste a frequência ao uso da casa.',
    ],
    question: 'Você tem 20 minutos livres. Como começar?',
    options: [
      'Tentar limpar toda a casa de uma vez',
      'Escolher uma tarefa pequena e definir o próximo dia',
    ],
    correct: 1,
    explanation:
      'Tarefas pequenas e frequentes ajudam a criar uma rotina possível.',
  },
  {
    id: 'money',
    title: 'Seu orçamento tem endereço',
    category: 'Finanças',
    minutes: 5,
    content: [
      'Liste sua renda disponível e separe despesas fixas das variáveis.',
      'Além do aluguel, considere contas, alimentação, transporte e gastos inesperados.',
      'Compare cenários no simulador. Os valores são exemplos editáveis, não previsões garantidas.',
    ],
    question: 'O aluguel cabe na renda. O que falta conferir?',
    options: [
      'Contas, alimentação, transporte e reserva',
      'Somente a cor das paredes',
    ],
    correct: 0,
    explanation: 'O custo de morar inclui despesas além do aluguel.',
  },
  {
    id: 'contract',
    title: 'Antes de pegar as chaves',
    category: 'Aluguel e contratos',
    minutes: 5,
    content: [
      'Neste exercício, observe aluguel, taxas, garantia, prazo e responsabilidades descritos no contrato fictício.',
      'Compare o laudo de vistoria com o estado do imóvel e registre dúvidas antes de decidir.',
      'As condições variam. Este conteúdo é uma atividade educativa; a análise de um contrato real requer informações e orientação específicas.',
    ],
    question: 'O contrato de exemplo tem uma taxa que você não entendeu.',
    options: [
      'Assinar sem perguntar',
      'Pedir esclarecimento e registrar a condição antes de decidir',
    ],
    correct: 1,
    explanation: 'Entender as condições evita surpresas no planejamento.',
  },
  {
    id: 'safety',
    title: 'Segurança começa na atenção',
    category: 'Segurança e manutenção',
    minutes: 4,
    content: [
      'Conheça os registros e os canais de ajuda da sua moradia.',
      'Mantenha produtos nas embalagens originais e siga os rótulos. Não misture produtos de limpeza.',
      'Para manutenção especializada, descreva o problema e procure um profissional habilitado. Não faça reparos elétricos ou de gás por conta própria.',
    ],
    question: 'Uma tomada apresenta defeito no exercício.',
    options: [
      'Improvisar um reparo sem preparo',
      'Evitar usar a tomada e procurar assistência qualificada',
    ],
    correct: 1,
    explanation: 'Reconhecer quando pedir ajuda faz parte da autonomia.',
  },
];
