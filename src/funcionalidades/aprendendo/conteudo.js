import guiaPrimeirosCuidados from '../../ativos/imagens/fotografias/guia-primeiros-cuidados.png';
import guiaOrganizacao from '../../ativos/imagens/fotografias/guia-organizacao.png';
import guiaDespesas from '../../ativos/imagens/fotografias/guia-despesas.png';
import guiaContratos from '../../ativos/imagens/fotografias/guia-contratos.png';
import guiaSeguranca from '../../ativos/imagens/fotografias/guia-seguranca.png';
import editorialCozinha from '../../ativos/imagens/fotografias/editorial-cozinha.png';
import equipeServicos from '../../ativos/imagens/fotografias/equipe-servicos.png';
import chavesCasaNova from '../../ativos/imagens/fotografias/chaves-casa-nova.png';

export const CHAVE_APRENDENDO = 'iagora_aprendendo_v1';

export const cartoesAutonomia = [
  {
    numero: '01',
    categoria: 'COZINHA',
    titulo: 'Cozinhar sem se perder.',
    descricao:
      'Utensílios essenciais, compras e refeições simples para o dia a dia.',
    acao: 'Aprender na cozinha ↗',
    rota: '/cozinha',
    imagem: editorialCozinha,
    alt: 'Homem cozinhando em cozinha compacta e iluminada',
    fundo: 'bg-(--laranja-fundo)',
  },
  {
    numero: '02',
    categoria: 'CUIDADOS',
    titulo: 'Limpeza que cabe na rotina.',
    descricao:
      'Aprenda a organizar os cuidados e escolher o que precisa ter.',
    acao: 'Cuidar da casa ↗',
    rota: '/limpeza',
    imagem: equipeServicos,
    alt: 'Profissionais sorridentes com itens de cuidado doméstico',
    fundo: 'bg-(--azul-fundo)',
  },
  {
    numero: '03',
    categoria: 'PLANEJAMENTO',
    titulo: 'Do aluguel às contas fixas.',
    descricao: 'Entenda os gastos que vão acompanhar seu novo endereço.',
    acao: 'Planejar minhas contas ↗',
    rota: '/planejamento',
    imagem: chavesCasaNova,
    alt: 'Pessoa segurando chaves ao lado de maquete de casa',
    fundo: 'bg-white border border-[#e6edf2]',
  },
];

export const itensPrimeiraSemana = [
  {
    id: 'sem-1',
    titulo: 'Conheça a casa antes de organizar tudo',
    descricao:
      'Observe os espaços, os pontos de água e os equipamentos disponíveis.',
  },
  {
    id: 'sem-2',
    titulo: 'Monte um kit para os primeiros dias',
    descricao:
      'Roupa de cama, higiene, água, comida e os itens básicos de limpeza.',
  },
  {
    id: 'sem-3',
    titulo: 'Defina um lugar para as contas e documentos',
    descricao:
      'Reunir as informações ajuda a acompanhar o que precisa de atenção.',
  },
];

export const guiasAprendendo = [
  {
    slug: 'primeiros-cuidados',
    titulo: 'Primeiros cuidados',
    subtitulo: 'Uma rotina simples para começar.',
    introducao:
      'Defina um dia para revisar tarefas, compras e contas. Comece por uma ação pequena e ajuste a frequência ao seu uso da casa.',
    imagem: guiaPrimeirosCuidados,
    alt: 'Sala e cozinha integradas de apartamento compacto organizado',
    passos: [
      {
        numero: '01',
        titulo: 'Conheça o básico',
        descricao:
          'Localize os equipamentos e guarde os manuais que vieram com a casa.',
      },
      {
        numero: '02',
        titulo: 'Separe uma caixa para a chegada',
        descricao:
          'Higiene, roupa de cama, água e utensílios que você realmente vai usar.',
      },
      {
        numero: '03',
        titulo: 'Escolha uma tarefa por vez',
        descricao:
          'Comece pela pia, pelo lixo ou pela roupa. Repita antes de aumentar a lista.',
      },
    ],
    testeHoje:
      'Em vez de organizar a casa inteira no domingo, escolha um cuidado de 15 minutos para hoje.',
    acaoTeste: 'Montar minha rotina',
    rotaTeste: '/rotina',
  },
  {
    slug: 'organizacao',
    titulo: 'Organização',
    subtitulo: 'Um lugar para o que você usa.',
    introducao:
      'Separe os objetos por uso e deixe os mais frequentes acessíveis. Revise o que precisa manter antes de comprar organizadores.',
    imagem: guiaOrganizacao,
    alt: 'Mesa com utensílios de cozinha e kit básico de ferramentas',
    passos: [
      {
        numero: '01',
        titulo: 'Observe como você usa o espaço',
        descricao: 'Deixe por perto o que faz parte do seu dia.',
      },
      {
        numero: '02',
        titulo: 'Agrupe por função',
        descricao:
          'Itens de café juntos; materiais de limpeza em um lugar adequado; documentos reunidos.',
      },
      {
        numero: '03',
        titulo: 'Teste antes de comprar',
        descricao:
          'Use o que você tem por alguns dias antes de decidir se precisa de organizadores.',
      },
    ],
    testeHoje:
      'O que você usa toda manhã fica acessível. O que quase não usa pode ocupar um espaço menos disputado.',
    acaoTeste: 'Organizar os cuidados da casa',
    rotaTeste: '/casa',
  },
  {
    slug: 'despesas',
    titulo: 'Despesas',
    subtitulo: 'Enxergar o mês ajuda a planejar.',
    introducao:
      'Liste custos fixos e variáveis, registre seus valores e compare com a renda. Use as ferramentas de planejamento para explorar cenários.',
    imagem: guiaDespesas,
    alt: 'Moradora abrindo caixa de mudança na sala do novo apartamento',
    passos: [
      {
        numero: '01',
        titulo: 'Liste o que se repete',
        descricao: 'Moradia, serviços e outros compromissos do mês.',
      },
      {
        numero: '02',
        titulo: 'Enxergue os gastos do dia a dia',
        descricao:
          'Registre alimentação, transporte e compras para perceber o total.',
      },
      {
        numero: '03',
        titulo: 'Compare com sua renda',
        descricao: 'Ajuste limites e revise os valores quando o mês mudar.',
      },
    ],
    testeHoje:
      'Um gasto pequeno só fica claro quando entra na lista junto com os outros. Comece registrando o que saiu hoje.',
    acaoTeste: 'Montar meu orçamento',
    rotaTeste: '/planejamento',
  },
  {
    slug: 'contratos',
    titulo: 'Contratos',
    subtitulo: 'Leia, compare e tire suas dúvidas.',
    introducao:
      'Este guia é um roteiro de leitura, não uma análise jurídica. Anote dúvidas sobre valores, prazos, responsabilidades e encerramento. Busque orientação qualificada antes de assumir obrigações.',
    imagem: guiaContratos,
    alt: 'Fachada ensolarada de casa residencial',
    passos: [
      {
        numero: '01',
        titulo: 'Reúna o que foi combinado',
        descricao: 'Compare proposta, valores e informações recebidas.',
      },
      {
        numero: '02',
        titulo: 'Marque suas dúvidas',
        descricao:
          'Pergunte sobre prazos, responsabilidades e condições que você não entendeu.',
      },
      {
        numero: '03',
        titulo: 'Revise antes de assumir um compromisso',
        descricao:
          'Procure orientação qualificada para analisar sua situação.',
      },
    ],
    testeHoje:
      'Sua lista de perguntas pode começar com: quais valores estão incluídos? O que preciso confirmar antes de decidir?',
    acaoTeste: 'Organizar meus documentos',
    rotaTeste: '/minhajornada?visao=documentos',
  },
  {
    slug: 'seguranca',
    titulo: 'Segurança',
    subtitulo: 'Prevenção no dia a dia.',
    introducao:
      'Conheça os manuais dos equipamentos e mantenha os contatos do condomínio e prestadores acessíveis. Para manutenção elétrica, gás ou falhas estruturais, procure profissionais habilitados.',
    imagem: guiaSeguranca,
    alt: 'Equipe de serviços preparada para cuidados e manutenção da casa',
    passos: [
      {
        numero: '01',
        titulo: 'Conheça as orientações da casa',
        descricao: 'Consulte manuais e informações do condomínio.',
      },
      {
        numero: '02',
        titulo: 'Evite improvisar reparos',
        descricao:
          'Eletricidade, gás e problemas estruturais pedem profissionais habilitados.',
      },
      {
        numero: '03',
        titulo: 'Deixe contatos úteis acessíveis',
        descricao:
          'Organize os contatos oficiais da sua região e os profissionais de confiança.',
      },
    ],
    testeHoje:
      'Percebeu um problema que não sabe avaliar? Registre o que observou e procure uma pessoa qualificada.',
    acaoTeste: 'Encontrar profissionais',
    rotaTeste: '/marketplace',
  },
];

export function lerEstadoAprendendo() {
  try {
    const salvo = localStorage.getItem(CHAVE_APRENDENDO);
    if (!salvo) {
      return { lidos: [], primeiraSemana: {}, etapaSimulacao: 'simulacao' };
    }
    const analisado = JSON.parse(salvo);
    return {
      lidos: Array.isArray(analisado.lidos) ? analisado.lidos : [],
      primeiraSemana: analisado.primeiraSemana || {},
      etapaSimulacao: analisado.etapaSimulacao || 'simulacao',
    };
  } catch {
    return { lidos: [], primeiraSemana: {}, etapaSimulacao: 'simulacao' };
  }
}

export function salvarEstadoAprendendo(estado) {
  try {
    localStorage.setItem(CHAVE_APRENDENDO, JSON.stringify(estado));
  } catch {
    return false;
  }
  return true;
}
