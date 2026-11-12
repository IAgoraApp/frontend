import orcamento from '../../ativos/vetores/calculadoras/orcamento.svg';
import reserva from '../../ativos/vetores/calculadoras/reserva.svg';
import mudanca from '../../ativos/vetores/calculadoras/mudanca.svg';
import energia from '../../ativos/vetores/calculadoras/energia.svg';
import divisaoContas from '../../ativos/vetores/calculadoras/divisao-contas.svg';
import listaCompras from '../../ativos/vetores/calculadoras/lista-compras.svg';
import desconto from '../../ativos/vetores/calculadoras/desconto.svg';
import transporte from '../../ativos/vetores/calculadoras/transporte.svg';
import inflacao from '../../ativos/vetores/calculadoras/inflacao.svg';

export function analisarNumero(valor) {
  if (typeof valor === 'number') return Number.isFinite(valor) ? valor : 0;
  const limpo = String(valor || '')
    .trim()
    .replace(/\s+/g, '')
    .replace(/R\$/gi, '');
  if (!limpo) return 0;
  const normalizado = limpo.includes(',')
    ? limpo.replace(/\./g, '').replace(',', '.')
    : /^\d{1,3}(\.\d{3})+$/.test(limpo)
      ? limpo.replace(/\./g, '')
      : limpo;
  const convertido = Number(normalizado);
  return Number.isFinite(convertido) ? convertido : 0;
}

export function formatarMoeda(valor, casas = 2) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  }).format(valor || 0);
}

export function formatarNumero(valor, casas = 0) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  }).format(valor || 0);
}

export const categoriasCalculadoras = [
  { id: 'todas', rotulo: 'Todas' },
  { id: 'planejamento', rotulo: 'Planejamento' },
  { id: 'casa', rotulo: 'Casa' },
  { id: 'compras', rotulo: 'Compras' },
  { id: 'transporte', rotulo: 'Transporte' },
];

export const calculadorasLista = [
  {
    slug: 'orcamento-mensal',
    numero: '01',
    categoria: 'planejamento',
    categoriaRotulo: 'PLANEJAMENTO',
    titulo: 'Orçamento mensal',
    descricao: 'Entenda o que entra, o que sai e o que sobra no mês.',
    acao: 'Usar calculadora ↑',
    destaquePessego: false,
    icone: orcamento,
    tituloPagina: 'Seu mês cabe na sua renda?',
    notaAntes:
      'Renda menos gastos fixos e variáveis. Use o mesmo período para todos os valores.',
    notaContexto:
      'Você pode limpar e refazer a conta para comparar possibilidades.',
    dicaResultado:
      'Inclua objetivos e imprevistos antes de comprometer toda a margem.',
    rotuloAcaoPrincipal: 'Definir limites do mês',
    rotaAcaoPrincipal: '/financas?visao=metas',
    campos: [
      { id: 'renda', rotulo: 'Renda mensal', placeholder: '3.200', padrao: '3.200' },
      { id: 'fixos', rotulo: 'Gastos fixos', placeholder: '1.500', padrao: '1.500' },
      {
        id: 'variaveis',
        rotulo: 'Gastos variáveis',
        placeholder: '700',
        padrao: '700',
        larguraTotal: true,
      },
    ],
    calcular(valores) {
      const renda = analisarNumero(valores.renda);
      const fixos = analisarNumero(valores.fixos);
      const variaveis = analisarNumero(valores.variaveis);
      const gastos = fixos + variaveis;
      const margem = renda - gastos;
      return {
        rotuloMetrica: 'Margem mensal estimada',
        valorPrincipal: formatarMoeda(margem, 0),
        formula: `${formatarNumero(renda)} - ${formatarNumero(fixos)} - ${formatarNumero(variaveis)} = ${formatarNumero(margem)}`,
        detalhes: [
          { rotulo: 'Entra no mês', valor: formatarMoeda(renda, 0) },
          { rotulo: 'Gastos somados', valor: formatarMoeda(gastos, 0) },
          {
            rotulo: 'Margem antes dos objetivos',
            valor: formatarMoeda(margem, 0),
          },
        ],
      };
    },
  },
  {
    slug: 'reserva-emergencia',
    numero: '02',
    categoria: 'planejamento',
    categoriaRotulo: 'PLANEJAMENTO',
    titulo: 'Reserva de emergência',
    descricao: 'Descubra quanto guardar para lidar com imprevistos.',
    acao: 'Abrir calculadora ↗',
    destaquePessego: true,
    icone: reserva,
    tituloPagina: 'Um fôlego para imprevistos.',
    notaAntes:
      'Informe suas despesas essenciais e escolha quantos meses quer simular. O valor guardado entra como ponto de partida.',
    notaContexto:
      'Você pode limpar e refazer a conta para comparar possibilidades.',
    dicaResultado:
      'Guarde aos poucos em algo fácil de resgatar para emergências reais.',
    rotuloAcaoPrincipal: 'Criar meta na jornada',
    rotaAcaoPrincipal: '/minhajornada?visao=metas',
    campos: [
      {
        id: 'essenciais',
        rotulo: 'Despesas essenciais por mês',
        placeholder: '2.200',
        padrao: '2.200',
      },
      {
        id: 'meses',
        rotulo: 'Meses de cobertura',
        placeholder: '6',
        padrao: '6',
      },
      {
        id: 'guardado',
        rotulo: 'Quanto já está reservado',
        placeholder: '4.000',
        padrao: '4.000',
        larguraTotal: true,
      },
    ],
    calcular(valores) {
      const essenciais = analisarNumero(valores.essenciais);
      const meses = Math.max(1, analisarNumero(valores.meses));
      const guardado = analisarNumero(valores.guardado);
      const total = essenciais * meses;
      const falta = Math.max(0, total - guardado);
      return {
        rotuloMetrica: 'Reserva total recomendada',
        valorPrincipal: formatarMoeda(total, 0),
        formula: `${formatarNumero(essenciais)} × ${formatarNumero(meses)} meses = ${formatarNumero(total)}`,
        detalhes: [
          { rotulo: 'Objetivo total', valor: formatarMoeda(total, 0) },
          { rotulo: 'Você já tem', valor: formatarMoeda(guardado, 0) },
          { rotulo: 'Ainda falta juntar', valor: formatarMoeda(falta, 0) },
        ],
      };
    },
  },
  {
    slug: 'mudanca',
    numero: '03',
    categoria: 'planejamento',
    categoriaRotulo: 'PLANEJAMENTO',
    titulo: 'Custo da mudança',
    descricao: 'Prepare o bolso para começar uma nova fase.',
    acao: 'Abrir calculadora ↗',
    destaquePessego: false,
    icone: mudanca,
    tituloPagina: 'Quanto custa chegar ao seu canto?',
    notaAntes:
      'Some os custos para chegar ao novo endereço. As despesas mensais ficam em outra conta.',
    notaContexto:
      'Você pode limpar e refazer a conta para comparar possibilidades.',
    dicaResultado:
      'Separe uma pequena folga de 10% para pequenos ajustes nos primeiros dias.',
    rotuloAcaoPrincipal: 'Planejar minha mudança',
    rotaAcaoPrincipal: '/planejamento',
    campos: [
      {
        id: 'transporte',
        rotulo: 'Transporte da mudança',
        placeholder: '600',
        padrao: '600',
      },
      {
        id: 'garantia',
        rotulo: 'Garantia do imóvel',
        placeholder: '3.000',
        padrao: '3.000',
      },
      {
        id: 'moveis',
        rotulo: 'Móveis e itens essenciais',
        placeholder: '2.000',
        padrao: '2.000',
      },
      {
        id: 'outros',
        rotulo: 'Outros custos iniciais',
        placeholder: '400',
        padrao: '400',
      },
    ],
    calcular(valores) {
      const transporteValor = analisarNumero(valores.transporte);
      const garantia = analisarNumero(valores.garantia);
      const moveis = analisarNumero(valores.moveis);
      const outros = analisarNumero(valores.outros);
      const total = transporteValor + garantia + moveis + outros;
      return {
        rotuloMetrica: 'Custo inicial estimado',
        valorPrincipal: formatarMoeda(total, 0),
        formula: `${formatarNumero(transporteValor)} + ${formatarNumero(garantia)} + ${formatarNumero(moveis)} + ${formatarNumero(outros)} = ${formatarNumero(total)}`,
        detalhes: [
          { rotulo: 'Frete e transporte', valor: formatarMoeda(transporteValor, 0) },
          { rotulo: 'Garantia do imóvel', valor: formatarMoeda(garantia, 0) },
          { rotulo: 'Móveis e outros', valor: formatarMoeda(moveis + outros, 0) },
        ],
      };
    },
  },
  {
    slug: 'energia',
    numero: '04',
    categoria: 'casa',
    categoriaRotulo: 'CASA',
    titulo: 'Consumo de energia',
    descricao: 'Estime o gasto dos aparelhos no seu dia a dia.',
    acao: 'Abrir calculadora ↗',
    destaquePessego: false,
    icone: energia,
    tituloPagina: 'Consumo em perspectiva.',
    notaAntes:
      'Use potência em watts, horas por dia e a tarifa da sua conta em reais por kWh.',
    notaContexto: 'Tarifa, uso e equipamentos alteram o resultado.',
    dicaResultado:
      'Aparelhos que esquentam ou esfriam costumam puxar a maior parte da conta.',
    rotuloAcaoPrincipal: 'Ir para minha casa',
    rotaAcaoPrincipal: '/casa?visao=despesas',
    campos: [
      {
        id: 'potencia',
        rotulo: 'Potência do aparelho (W)',
        placeholder: '1.000',
        padrao: '1.000',
      },
      {
        id: 'horas',
        rotulo: 'Horas de uso por dia',
        placeholder: '2',
        padrao: '2',
      },
      { id: 'dias', rotulo: 'Dias no mês', placeholder: '30', padrao: '30' },
      {
        id: 'tarifa',
        rotulo: 'Tarifa informada (R$/kWh)',
        placeholder: '0,90',
        padrao: '0,90',
      },
    ],
    calcular(valores) {
      const potencia = analisarNumero(valores.potencia);
      const horas = analisarNumero(valores.horas);
      const dias = analisarNumero(valores.dias);
      const tarifa = analisarNumero(valores.tarifa);
      const kwh = (potencia * horas * dias) / 1000;
      const custo = kwh * tarifa;
      return {
        rotuloMetrica: 'Custo mensal estimado',
        valorPrincipal: formatarMoeda(custo, 2),
        formula: `${formatarNumero(kwh, 1)} kWh × R$ ${formatarNumero(tarifa, 2)} = ${formatarMoeda(custo, 2)}`,
        detalhes: [
          { rotulo: 'Consumo mensal', valor: `${formatarNumero(kwh, 1)} kWh` },
          { rotulo: 'Tarifa aplicada', valor: `R$ ${formatarNumero(tarifa, 2)} / kWh` },
          { rotulo: 'Valor estimado', valor: formatarMoeda(custo, 2) },
        ],
      };
    },
  },
  {
    slug: 'dividir-contas',
    numero: '05',
    categoria: 'casa',
    categoriaRotulo: 'CASA',
    titulo: 'Divisão de contas',
    descricao: 'Reparta as despesas com quem divide o cantinho.',
    acao: 'Abrir calculadora ↗',
    destaquePessego: false,
    icone: divisaoContas,
    tituloPagina: 'Uma divisão combinada.',
    notaAntes:
      'Esta conta usa divisão igual. Combine o critério com as pessoas que dividem a despesa.',
    notaContexto:
      'Você pode limpar e refazer a conta para comparar possibilidades.',
    dicaResultado:
      'Deixe combinada uma data fixa do mês para acertar tudo sem atrito.',
    rotuloAcaoPrincipal: 'Ir para minhas contas',
    rotaAcaoPrincipal: '/financas?visao=contas',
    campos: [
      { id: 'total', rotulo: 'Total da conta', placeholder: '900', padrao: '900' },
      {
        id: 'pessoas',
        rotulo: 'Quantidade de pessoas',
        placeholder: '3',
        padrao: '3',
      },
    ],
    calcular(valores) {
      const total = analisarNumero(valores.total);
      const pessoas = Math.max(1, Math.round(analisarNumero(valores.pessoas)));
      const porPessoa = total / pessoas;
      return {
        rotuloMetrica: 'Valor por pessoa',
        valorPrincipal: formatarMoeda(porPessoa, 2),
        formula: `${formatarNumero(total)} ÷ ${pessoas} pessoas = ${formatarMoeda(porPessoa, 2)}`,
        detalhes: [
          { rotulo: 'Total da conta', valor: formatarMoeda(total, 2) },
          { rotulo: 'Pessoas dividindo', valor: `${pessoas}` },
          { rotulo: 'Cada pessoa paga', valor: formatarMoeda(porPessoa, 2) },
        ],
      };
    },
  },
  {
    slug: 'compras',
    numero: '06',
    categoria: 'compras',
    categoriaRotulo: 'COMPRAS',
    titulo: 'Lista de compras',
    descricao: 'Organize os itens e estime o total antes de sair.',
    acao: 'Abrir calculadora ↗',
    destaquePessego: true,
    icone: listaCompras,
    tituloPagina: 'A lista antes do caixa.',
    notaAntes:
      'Preço unitário multiplicado pela quantidade. Compare as unidades das embalagens antes de preencher.',
    notaContexto:
      'Você pode limpar e refazer a conta para comparar possibilidades.',
    dicaResultado:
      'Levar uma estimativa pronta ajuda a evitar compras por impulso no mercado.',
    rotuloAcaoPrincipal: 'Abrir lista de compras',
    rotaAcaoPrincipal: '/cozinha?visao=compras',
    campos: [
      {
        id: 'preco1',
        rotulo: 'Item 1 · preço unitário',
        placeholder: '5,00',
        padrao: '5,00',
      },
      {
        id: 'qtd1',
        rotulo: 'Item 1 · quantidade',
        placeholder: '4',
        padrao: '4',
      },
      {
        id: 'preco2',
        rotulo: 'Item 2 · preço unitário',
        placeholder: '10,00',
        padrao: '10,00',
      },
      {
        id: 'qtd2',
        rotulo: 'Item 2 · quantidade',
        placeholder: '3',
        padrao: '3',
      },
    ],
    calcular(valores) {
      const p1 = analisarNumero(valores.preco1);
      const q1 = analisarNumero(valores.qtd1);
      const p2 = analisarNumero(valores.preco2);
      const q2 = analisarNumero(valores.qtd2);
      const sub1 = p1 * q1;
      const sub2 = p2 * q2;
      const total = sub1 + sub2;
      return {
        rotuloMetrica: 'Total estimado no caixa',
        valorPrincipal: formatarMoeda(total, 2),
        formula: `${formatarMoeda(sub1, 2)} + ${formatarMoeda(sub2, 2)} = ${formatarMoeda(total, 2)}`,
        detalhes: [
          { rotulo: 'Subtotal do item 1', valor: formatarMoeda(sub1, 2) },
          { rotulo: 'Subtotal do item 2', valor: formatarMoeda(sub2, 2) },
          { rotulo: 'Total estimado', valor: formatarMoeda(total, 2) },
        ],
      };
    },
  },
  {
    slug: 'desconto',
    numero: '07',
    categoria: 'compras',
    categoriaRotulo: 'COMPRAS',
    titulo: 'Desconto',
    descricao: 'Saiba quanto vai pagar antes de aproveitar a oferta.',
    acao: 'Abrir calculadora ↗',
    destaquePessego: true,
    icone: desconto,
    tituloPagina: 'Qual é o preço com desconto?',
    notaAntes:
      'Compare o preço final, incluindo as condições de pagamento e eventuais custos adicionais.',
    notaContexto:
      'Você pode limpar e refazer a conta para comparar possibilidades.',
    dicaResultado:
      'Antes de aproveitar a oferta, veja se o item realmente cabe no limite do mês.',
    rotuloAcaoPrincipal: 'Ver metas do mês',
    rotaAcaoPrincipal: '/financas?visao=metas',
    campos: [
      { id: 'preco', rotulo: 'Preço original', placeholder: '200', padrao: '200' },
      {
        id: 'percentual',
        rotulo: 'Desconto (%)',
        placeholder: '15',
        padrao: '15',
      },
    ],
    calcular(valores) {
      const preco = analisarNumero(valores.preco);
      const perc = Math.min(100, Math.max(0, analisarNumero(valores.percentual)));
      const economia = (preco * perc) / 100;
      const final = preco - economia;
      return {
        rotuloMetrica: 'Preço final estimado',
        valorPrincipal: formatarMoeda(final, 2),
        formula: `${formatarMoeda(preco, 2)} - ${formatarNumero(perc)}% = ${formatarMoeda(final, 2)}`,
        detalhes: [
          { rotulo: 'Valor original', valor: formatarMoeda(preco, 2) },
          { rotulo: 'Economia na oferta', valor: formatarMoeda(economia, 2) },
          { rotulo: 'Quanto você paga', valor: formatarMoeda(final, 2) },
        ],
      };
    },
  },
  {
    slug: 'transporte',
    numero: '08',
    categoria: 'transporte',
    categoriaRotulo: 'TRANSPORTE',
    titulo: 'Custo por quilômetro',
    descricao: 'Coloque na conta quanto custa se deslocar.',
    acao: 'Abrir calculadora ↗',
    destaquePessego: false,
    icone: transporte,
    tituloPagina: 'Seu deslocamento no mês.',
    notaAntes:
      'Distância diária, dias no mês, consumo do veículo e combustível. Outros custos ficam fora desta estimativa.',
    notaContexto:
      'Você pode limpar e refazer a conta para comparar possibilidades.',
    dicaResultado:
      'Considere somar estacionamento, pedágio ou passagens extras para fechar a conta real.',
    rotuloAcaoPrincipal: 'Conferir gastos de transporte',
    rotaAcaoPrincipal: '/financas',
    campos: [
      {
        id: 'distancia',
        rotulo: 'Distância por dia (km)',
        placeholder: '20',
        padrao: '20',
      },
      {
        id: 'dias',
        rotulo: 'Dias de deslocamento',
        placeholder: '22',
        padrao: '22',
      },
      {
        id: 'consumo',
        rotulo: 'Consumo do veículo (km/L)',
        placeholder: '10',
        padrao: '10',
      },
      {
        id: 'combustivel',
        rotulo: 'Preço do combustível (R$/L)',
        placeholder: '6,00',
        padrao: '6,00',
      },
    ],
    calcular(valores) {
      const distancia = analisarNumero(valores.distancia);
      const dias = analisarNumero(valores.dias);
      const consumo = Math.max(0.1, analisarNumero(valores.consumo));
      const preco = analisarNumero(valores.combustivel);
      const kmMes = distancia * dias;
      const litros = kmMes / consumo;
      const custo = litros * preco;
      return {
        rotuloMetrica: 'Custo mensal de combustível',
        valorPrincipal: formatarMoeda(custo, 2),
        formula: `${formatarNumero(kmMes)} km ÷ ${formatarNumero(consumo, 1)} km/L × ${formatarMoeda(preco, 2)} = ${formatarMoeda(custo, 2)}`,
        detalhes: [
          { rotulo: 'Distância no mês', valor: `${formatarNumero(kmMes)} km` },
          { rotulo: 'Combustível estimado', valor: `${formatarNumero(litros, 1)} L` },
          { rotulo: 'Custo mensal', valor: formatarMoeda(custo, 2) },
        ],
      };
    },
  },
  {
    slug: 'inflacao',
    numero: '09',
    categoria: 'planejamento',
    categoriaRotulo: 'PLANEJAMENTO',
    titulo: 'Correção pela inflação',
    descricao: 'Compare valores em diferentes momentos.',
    acao: 'Abrir calculadora ↗',
    destaquePessego: false,
    icone: inflacao,
    tituloPagina: 'Uma taxa, um cenário.',
    notaAntes:
      'A taxa é um cenário informado por você. O resultado não representa uma previsão.',
    notaContexto: 'A taxa pode ser ajustada para comparar cenários.',
    dicaResultado:
      'Compare reajustes anuais antes de renovar contratos de aluguel ou serviços.',
    rotuloAcaoPrincipal: 'Ver planejador financeiro',
    rotaAcaoPrincipal: '/planejamento',
    campos: [
      { id: 'valor', rotulo: 'Valor atual', placeholder: '1.000', padrao: '1.000' },
      {
        id: 'taxa',
        rotulo: 'Taxa anual informada (%)',
        placeholder: '5',
        padrao: '5',
      },
      {
        id: 'anos',
        rotulo: 'Período em anos',
        placeholder: '2',
        padrao: '2',
        larguraTotal: true,
      },
    ],
    calcular(valores) {
      const valor = analisarNumero(valores.valor);
      const taxa = analisarNumero(valores.taxa);
      const anos = Math.max(0, analisarNumero(valores.anos));
      const corrigido = valor * Math.pow(1 + taxa / 100, anos);
      const diferenca = corrigido - valor;
      return {
        rotuloMetrica: 'Valor corrigido no cenário',
        valorPrincipal: formatarMoeda(corrigido, 2),
        formula: `${formatarMoeda(valor, 2)} × (1 + ${formatarNumero(taxa, 1)}%)^${formatarNumero(anos)} = ${formatarMoeda(corrigido, 2)}`,
        detalhes: [
          { rotulo: 'Valor base', valor: formatarMoeda(valor, 2) },
          { rotulo: 'Variação acumulada', valor: formatarMoeda(diferenca, 2) },
          { rotulo: 'Valor final simulado', valor: formatarMoeda(corrigido, 2) },
        ],
      };
    },
  },
];

export function buscarCalculadoraPorSlug(slug) {
  if (!slug) return null;
  const aliases = { orcamento: 'orcamento-mensal' };
  const normalizado = aliases[slug] || slug;
  return calculadorasLista.find(item => item.slug === normalizado) || null;
}
