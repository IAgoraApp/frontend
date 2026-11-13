import queroMorarImg from '../../ativos/imagens/fotografias/onboarding-quero-morar-sozinho.jpg';
import jaMoroImg from '../../ativos/imagens/fotografias/onboarding-ja-moro-sozinho.jpg';

export const opcoesMomento = [
  {
    id: 'planning',
    momento: 'preparacao',
    momentoRotulo: 'Vou morar sozinho',
    rotaDestino: '/home-b',
    titulo: 'Quero morar sozinho',
    descricao:
      'Planejar os gastos, encontrar uma casa e se preparar para a mudança.',
    imagem: queroMorarImg,
    alt: 'Jovem organizando caixas e planos para a mudança em apartamento studio',
  },
  {
    id: 'living-alone',
    momento: 'morando',
    momentoRotulo: 'Já moro sozinho',
    rotaDestino: '/home',
    titulo: 'Já moro sozinho',
    descricao:
      'Manter a casa, organizar a rotina e resolver problemas do dia a dia.',
    imagem: jaMoroImg,
    alt: 'Moradora na cozinha de seu studio planejando reparos e tarefas do dia a dia',
  },
];

export const prioridadesPorMomento = {
  planning: {
    titulo: 'O que você quer preparar primeiro?',
    descricao: 'Escolha suas prioridades para começar a morar sozinho. Você pode mudar essas escolhas depois.',
    opcoes: [
      { titulo: 'Planejar minha mudança', descricao: 'Organizar documentos, prazos e o transporte dos meus pertences.' },
      { titulo: 'Encontrar um lugar', descricao: 'Comparar imóveis, bairros e condições de aluguel.' },
      { titulo: 'Cuidar do meu dinheiro', descricao: 'Estimar os custos da mudança e quanto vou precisar por mês.' },
      { titulo: 'Montar minha primeira casa', descricao: 'Definir os móveis, utensílios e itens essenciais para começar.' },
      { titulo: 'Aprender a cozinhar', descricao: 'Aprender receitas básicas para quando eu estiver no meu canto.' },
    ],
  },
  'living-alone': {
    titulo: 'O que você quer facilitar no seu dia a dia?',
    descricao: 'Escolha os cuidados que precisam de mais atenção na sua casa. Você pode mudar essas escolhas depois.',
    opcoes: [
      { titulo: 'Organizar a casa e a rotina', descricao: 'Distribuir tarefas e encontrar uma rotina que funcione para mim.' },
      { titulo: 'Cuidar do meu dinheiro', descricao: 'Acompanhar minhas contas, os gastos da casa e o orçamento do mês.' },
      { titulo: 'Aprender a cozinhar', descricao: 'Variar as refeições e aproveitar melhor os ingredientes que já tenho.' },
      { titulo: 'Cuidar da limpeza e da manutenção', descricao: 'Manter a casa em dia e lembrar dos cuidados e pequenos reparos.' },
      { titulo: 'Conhecer serviços para a casa', descricao: 'Encontrar profissionais para os cuidados que preciso contratar.' },
    ],
  },
};
