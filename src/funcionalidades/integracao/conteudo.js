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

export const opcoesPrioridades = [
  'Planejar minha mudança',
  'Organizar a casa e a rotina',
  'Cuidar do meu dinheiro',
  'Aprender a cozinhar',
  'Conhecer serviços para a casa',
];
