import fotoPlanejamento from '../onboarding/assets/onboarding-quero-morar-sozinho.jpg';
import fotoImovel from '../encontrar-casa/assets/apartamento-vila-mariana.jpg';
import fotoMudanca from '../landing-page/assets/momento-mudanca.jpg';
import fotoCasa from '../casa/assets/cozinha-comida-boa.jpg';

export const nomeGuia = 'Guia da primeira mudança';
export const descricaoGuia =
  'Checklist guiado para preparar sua mudança e os primeiros dias na casa.';

export const etapasGuia = [
  {
    id: 'orcamento',
    titulo: 'Faça as contas',
    categoria: 'financas',
    foto: fotoPlanejamento,
    descricao: 'Descubra quanto cabe no seu mês e na sua reserva.',
    tarefas: [
      [
        'Liste sua renda e seus gastos fixos',
        'Use o valor que realmente entra por mês e inclua as despesas que vão continuar depois da mudança.',
      ],
      [
        'Defina um teto para a moradia',
        'Some aluguel, condomínio, contas básicas e transporte antes de comparar opções.',
      ],
      [
        'Separe os gastos de entrada',
        'Reserve dinheiro para frete, garantia da locação e itens básicos da casa.',
      ],
    ],
    apoio: { rota: '/planejamento', rotulo: 'Abrir planejamento' },
  },
  {
    id: 'imovel',
    titulo: 'Escolha seu canto',
    categoria: 'moradia',
    foto: fotoImovel,
    descricao: 'Compare as opções e confira o imóvel antes de decidir.',
    tarefas: [
      [
        'Compare os endereços e o custo total',
        'Observe o trajeto que você fará no dia a dia e anote o valor completo de cada opção.',
      ],
      [
        'Visite o imóvel com uma lista',
        'Teste torneiras, portas e janelas. Confira ventilação, tomadas e sinais de umidade.',
      ],
      [
        'Revise o contrato e a vistoria',
        'Confira o que está incluso, as datas e as condições de entrega. Guarde os registros da vistoria.',
      ],
    ],
    apoio: { rota: '/encontrar-casa', rotulo: 'Ver imóveis desejados' },
  },
  {
    id: 'mudanca',
    titulo: 'Organize a mudança',
    categoria: 'mudanca',
    foto: fotoMudanca,
    descricao: 'Prepare o transporte e facilite o primeiro dia.',
    tarefas: [
      [
        'Combine a data e o transporte',
        'Confira os horários de entrada, as regras do prédio e se é preciso reservar o elevador.',
      ],
      [
        'Identifique as caixas por cômodo',
        'Escreva o destino em mais de um lado e deixe os itens frágeis bem sinalizados.',
      ],
      [
        'Monte uma bolsa para a primeira noite',
        'Separe chaves, carregador, roupa, itens de higiene e o necessário para dormir.',
      ],
    ],
    apoio: { rota: '/marketplace', rotulo: 'Consultar serviços disponíveis' },
  },
  {
    id: 'primeira-semana',
    titulo: 'Prepare a primeira semana',
    categoria: 'organizacao',
    foto: fotoCasa,
    descricao: 'Resolva o básico para começar a rotina.',
    tarefas: [
      [
        'Confirme o funcionamento dos serviços',
        'Confira água, energia e internet. Identifique onde ficam o registro de água e o quadro de energia.',
      ],
      [
        'Compre apenas o essencial para começar',
        'Priorize roupa de cama, material de limpeza e o que você precisa para preparar refeições simples.',
      ],
      [
        'Planeje suas primeiras compras e refeições',
        'Confira o que já tem e liste os ingredientes de algumas refeições fáceis.',
      ],
    ],
    apoio: { rota: '/aprendendo', rotulo: 'Abrir aulas sobre a casa' },
  },
  {
    id: 'compras',
    titulo: 'Organize as compras',
    categoria: 'compras',
    foto: fotoCasa,
    descricao: 'Confira o que já tem e o que falta para montar a casa.',
    tarefas: [
      [
        'Quarto e primeira noite',
        'Confira se você já tem colchão, travesseiro e roupa de cama.',
      ],
      [
        'Cozinha do dia a dia',
        'Confira geladeira, fogão, panela, pratos, copos e talheres.',
      ],
      [
        'Banheiro',
        'Separe toalhas, papel higiênico, sabonete e itens de higiene.',
      ],
      [
        'Limpeza e lavanderia',
        'Confira vassoura, pano, produtos de limpeza e um lugar para secar roupas.',
      ],
    ],
  },
];

const tarefasExtras = {
  orcamento: [
    [
      'Separe despesas fixas e variáveis',
      'Inclua aluguel, condomínio, IPTU quando aplicável, internet e contas de consumo. Use estimativas separadas para alimentação, transporte, gás e gastos que variam.',
    ],
    [
      'Orce o que você ainda precisa comprar',
      'Passe por quarto, cozinha, banheiro, lavanderia e limpeza. Para cada item, anote se já tem, se precisa antes da mudança ou se pode esperar. Lance no plano apenas o que pretende pagar.',
    ],
    [
      'Compare dois cenários de moradia',
      'Simule uma opção com custo menor e outra mais próxima do que você procura. Compare os saldos, confira quanto sobra da reserva após os gastos de entrada e ajuste o plano se ficar no negativo.',
    ],
  ],
  imovel: [
    [
      'Defina o que sua localização precisa ter',
      'Compare tempo de deslocamento, transporte, mercado e acesso a serviços. Se puder, visite a região em horários diferentes antes de decidir.',
    ],
    [
      'Confira os documentos pedidos para a locação',
      'Peça a lista ao responsável pela oferta. Separe o que foi solicitado e confirme o destinatário antes de enviar documentos pessoais.',
    ],
    [
      'Registre dúvidas e custos antes de fechar',
      'Pergunte quem paga cada conta e como avisar sobre problemas. Compare as opções salvas com a renda do plano e guarde contrato e vistoria em local acessível.',
    ],
  ],
  mudanca: [
    [
      'Meça os móveis e o caminho até o imóvel',
      'Confira portas, corredores e elevador antes de comprar ou contratar o transporte. Separe o que vai levar, doar ou deixar para depois.',
    ],
    [
      'Peça orçamentos com o mesmo escopo',
      'Informe origem, destino, escadas, volume e se precisa de montagem. Confira o que cada proposta inclui e combine por escrito data, valor e condições.',
    ],
    [
      'Organize a entrega das chaves e os acessos',
      'Confirme quem recebe a mudança, como liberar a entrada e onde veículos podem parar. Deixe contatos e documentos acessíveis no dia.',
    ],
  ],
  'primeira-semana': [
    [
      'Organize a limpeza e a lavagem de roupas',
      'Separe pano, vassoura, detergente e produtos adequados a cada superfície. Divida banheiro, cozinha e lavanderia em tarefas pequenas ao longo da semana.',
    ],
    [
      'Planeje como guardar e reaproveitar alimentos',
      'Confira geladeira e espaço de armazenamento antes de comprar. Planeje porções e aproveite ingredientes em mais de uma refeição.',
    ],
    [
      'Monte uma rotina semanal com margem para imprevistos',
      'Defina dias para compras, limpeza e contas. Salve contatos de manutenção e procure ajuda qualificada para problemas com eletricidade ou gás.',
    ],
  ],
};

export function tarefasDaEtapa(etapa) {
  return [...etapa.tarefas, ...(tarefasExtras[etapa.id] ?? [])];
}

export function encontrarGuia(banco, usuario) {
  return banco.jornada.find(
    jornada =>
      jornada.user_id === usuario &&
      jornada.nome === nomeGuia &&
      jornada.descricao === descricaoGuia
  );
}

const referencias = {
  'Revise o contrato e a vistoria': [
    'Lei do Inquilinato',
    'https://www.planalto.gov.br/ccivil_03/leis/l8245.htm',
  ],
  'Peça orçamentos com o mesmo escopo': [
    'Orientações da Secretaria Nacional do Consumidor',
    'https://www.gov.br/mj/pt-br/assuntos/seus-direitos/consumidor',
  ],

  'Liste sua renda e seus gastos fixos': [
    'Orçamento pessoal no Banco Central',
    'https://www.bcb.gov.br/meubc/faqs/s/educacao-financeira-sub',
  ],
  'Separe despesas fixas e variáveis': [
    'Orçamento na prática com a CAIXA',
    'https://www.caixa.gov.br/educacao-financeira/voce/orcamento-pratica/Paginas/default.aspx',
  ],
  'Compare dois cenários de moradia': [
    'Caderno de Educação Financeira',
    'https://www.bcb.gov.br/pre/pef/port/caderno_cidadania_financeira.pdf',
  ],
  'Planeje como guardar e reaproveitar alimentos': [
    'Boas práticas para alimentos na Anvisa',
    'https://www.gov.br/anvisa/pt-br/centraisdeconteudo/publicacoes/alimentos/manuais-guias-e-orientacoes/',
  ],
  'Confirme o funcionamento dos serviços': [
    'Orientações da ANP sobre gás de botijão',
    'https://www.gov.br/anp/pt-br/centrais-de-conteudo/publicacoes/cartilhas-e-guias/gas-de-botijao-glp-10-orientacoes-para-garantir-seus-direitos-e-sua-seguranca',
  ],
};

export const fotosEtapa = etapasGuia.filter(
  (etapa, indice) =>
    etapasGuia.findIndex(item => item.foto === etapa.foto) === indice
);

function fotoEtapaPersonalizada({ id }) {
  const chave = String(id);
  let hash = 2166136261;
  for (const caractere of chave) {
    hash = Math.imul(hash ^ caractere.codePointAt(0), 16777619);
  }
  return etapasGuia[(hash >>> 0) % etapasGuia.length].foto;
}

export const etapaCompras = etapasGuia.find(etapa => etapa.id === 'compras');

export function lerGuia(banco, usuario) {
  const guia = encontrarGuia(banco, usuario);
  const registros = guia
    ? banco.etapa_jornada
        .filter(item => item.jornada_id === guia.id)
        .toSorted((a, b) => a.ordem - b.ordem)
    : etapasGuia;
  const adicionarCompras =
    guia &&
    !guia.comprasIncluidas &&
    !registros.some(etapa => etapa.categoria === etapaCompras.categoria);
  const etapas = (
    adicionarCompras ? [...registros, etapaCompras] : registros
  ).map(registro => {
    const salvo = guia && registro !== etapaCompras;
    const base = etapasGuia.find(item => item.categoria === registro.categoria);
    const id = base?.id ?? String(registro.id);
    const tarefas = (
      salvo
        ? banco.tarefa_jornada
            .filter(item => item.etapa_id === registro.id)
            .toSorted((a, b) => a.ordem - b.ordem)
        : tarefasDaEtapa(registro).map(([titulo, descricao]) => ({
            titulo,
            descricao,
            concluida: false,
          }))
    ).map(item => ({ ...item, referencia: base && referencias[item.titulo] }));
    const fotoEscolhida =
      guia &&
      banco.fotos_etapas_preparacao?.find(
        item => item.etapa_id === registro.id
      );
    return {
      ...registro,
      id,
      registroId: salvo ? registro.id : undefined,
      tarefas,
      foto:
        fotosEtapa.find(item => item.id === fotoEscolhida?.foto)?.foto ??
        base?.foto ??
        fotoEtapaPersonalizada(registro),
      apoio: base?.apoio,
      feitas: tarefas.filter(item => item.concluida).length,
    };
  });
  return {
    etapas,
    feitas: etapas.reduce((soma, etapa) => soma + etapa.feitas, 0),
    total: etapas.reduce((soma, etapa) => soma + etapa.tarefas.length, 0),
    proxima: etapas.find(etapa => etapa.feitas < etapa.tarefas.length),
  };
}
