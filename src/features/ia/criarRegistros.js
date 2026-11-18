import {
  alterarBancoCompras,
  dataCurta,
  hoje,
  inserir,
  moeda,
  salvarRegistro,
} from '../../app/dados/bancoMvp';
import { atualizarFinancas } from '../financas/financasDados';
import { adicionarDias, analisarData } from '../rotina/utils/dates';
import { validarTarefa } from '../rotina/utils/tasks';

export const areasCriacao = {
  rotina: { nome: 'Rotina', exemplo: 'Agende trocar a lâmpada amanhã às 19h.' },
  limpeza: {
    nome: 'Limpeza',
    exemplo: 'Agende limpar o fogão na cozinha amanhã.',
  },
  financas: { nome: 'Finanças', exemplo: 'Gastei R$ 50 no mercado hoje.' },
  compras: {
    nome: 'Lista de compras',
    exemplo: 'Adicione 2 tomates na lista Compras da semana.',
  },
};

const normalizar = texto =>
  texto.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
const limpar = valor =>
  valor
    ?.trim()
    .replace(/[.;,!?]+$/, '')
    .trim();
const padraoData =
  /\b(\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}(?:\/\d{4})?|hoje|amanha|ontem)\b/i;

function campo(texto, nomes) {
  const correspondencias = [
    ...texto.matchAll(
      new RegExp('(?:^|[;\\n])\\s*(?:' + nomes + ')\\s*:\\s*([^;\\n]+)', 'gi')
    ),
  ];
  return limpar(correspondencias.at(-1)?.[1]);
}

function lerData(texto) {
  const trecho = normalizar(texto).match(padraoData)?.[1];
  if (!trecho) return null;
  if (trecho === 'hoje') return hoje();
  if (trecho === 'amanha' || trecho === 'ontem')
    return adicionarDias(hoje(), trecho === 'amanha' ? 1 : -1);
  if (trecho.includes('/')) {
    const [dia, mes, ano = hoje().slice(0, 4)] = trecho.split('/');
    const iso = ano + '-' + mes.padStart(2, '0') + '-' + dia.padStart(2, '0');
    return analisarData(iso) ? iso : null;
  }
  return analisarData(trecho) ? trecho : null;
}

function lerHora(texto) {
  const hora = normalizar(texto).match(
    /\b(\d{1,2})(?:\s*h\s*(\d{2})?|:(\d{2}))\b/
  );
  if (!hora) return null;
  return hora[1].padStart(2, '0') + ':' + (hora[2] || hora[3] || '00');
}

function porNome(itens, nome) {
  return nome && itens.find(item => normalizar(item.nome) === normalizar(nome));
}

function mencionar(itens, texto) {
  const palavras = ' ' + normalizar(texto).replace(/[^\p{L}\d]+/gu, ' ') + ' ';
  const encontrados = itens.filter(item =>
    palavras.includes(
      ' ' + normalizar(item.nome).replace(/[^\p{L}\d]+/gu, ' ') + ' '
    )
  );
  return encontrados.length === 1 ? encontrados[0] : null;
}

function tituloAgenda(texto) {
  const explicito = campo(texto, 'tarefa|atividade|descri[cç][aã]o|nome');
  if (explicito) return explicito;
  return limpar(
    texto
      .split(/[;\n]/)[0]
      .replace(
        /^(?:(?:por favor[, ]+)?(?:agende|crie|adicione|registre|marque)\s+(?:(?:uma?|a)\s+)?(?:tarefa(?: de)?|atividade(?: de)?)?\s*|me lembre de\s+)/i,
        ''
      )
      .split(
        /\s+(?:hoje|amanh[ãa]|ontem|(?:no )?dia\s+\d|\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}|[àa]s\s+\d|todo dia|toda semana|todo m[êe]s|categoria\s*:)/i
      )[0]
  );
}

function falta(campos) {
  return {
    texto:
      'Para criar o registro, preciso de ' +
      campos.join(', ') +
      '. Responda aqui para completar o pedido.',
    pendente: true,
  };
}

function rotina(texto, { categorias }, despachar) {
  const title = tituloAgenda(texto);
  const date = lerData(campo(texto, 'data') ?? texto);
  const time = lerHora(campo(texto, 'hor[aá]rio|hora') ?? texto);
  const nomeCategoria = campo(texto, 'categoria');
  const categoria = nomeCategoria
    ? porNome(categorias, nomeCategoria)
    : (mencionar(categorias, texto) ??
      categorias.find(c => /organiza/i.test(c.nome)) ??
      categorias[0]);
  const pedido = normalizar(texto);
  const frequency = /todo dia|diari/.test(pedido)
    ? 'daily'
    : /toda semana|semanal/.test(pedido)
      ? 'weekly'
      : /todo mes|mensal/.test(pedido)
        ? 'monthly'
        : 'none';
  const dados = {
    title,
    date,
    time,
    category: categoria ? String(categoria.id) : '',
    frequency,
    notes: '',
    endDate: '',
    weekdays: date ? [analisarData(date).getDay()] : [],
  };
  const erros = validarTarefa(
    dados,
    categorias.map(c => ({ id: String(c.id) }))
  );
  const faltando = [
    erros.title && 'um título de até 150 caracteres',
    erros.date && 'uma data (por exemplo, amanhã ou 20/11)',
    erros.time && 'um horário (por exemplo, 19h ou 19:30)',
    erros.category &&
      'uma categoria da Rotina (' +
        categorias.map(c => c.nome).join(', ') +
        ')',
  ].filter(Boolean);
  if (faltando.length) return falta(faltando);
  despachar({ type: 'add', tasks: [dados] });
  return {
    texto:
      'Tarefa “' +
      title +
      '” criada para ' +
      dataCurta(date) +
      ' às ' +
      time +
      ' em ' +
      categoria.nome +
      '.',
    rota: '/rotina?visao=lista&data=' + date,
  };
}

function limpeza(texto, { comodos }) {
  const nomeComodo = campo(texto, 'c[oô]modo');
  const comodo = nomeComodo
    ? porNome(comodos, nomeComodo)
    : mencionar(comodos, texto);
  const data = lerData(campo(texto, 'data') ?? texto);
  const nome = tituloAgenda(texto);
  const faltando = [
    (!nome || nome.length > 150) && 'a atividade de limpeza',
    !comodo &&
      'um cômodo da sua casa (' + comodos.map(c => c.nome).join(', ') + ')',
    !data && 'a próxima data da limpeza',
  ].filter(Boolean);
  if (faltando.length) return falta(faltando);
  salvarRegistro('limpezas', {
    nome,
    comodo_id: comodo.id,
    proxima_vez: data,
    ultima_vez: null,
    descricao: null,
  });
  return {
    texto:
      'Limpeza “' +
      nome +
      '” agendada em ' +
      comodo.nome +
      ' para ' +
      dataCurta(data) +
      '.',
    rota: '/limpeza?comodo=' + comodo.id,
  };
}

const numeroReais =
  '(\\d{1,3}(?:\\.\\d{3})+(?:,\\d{1,2})?|\\d+(?:[,.]\\d{1,2})?)';

function financas(texto, { b, perfil }) {
  const categorias = b.categoria_financas.filter(
    c => c.user_id === perfil.user_id
  );
  const contas = b.conta_financeira.filter(c => c.user_id === perfil.user_id);
  const valorComMoeda = texto.match(
    new RegExp(
      'R\\$\\s*' + numeroReais + '|' + numeroReais + '\\s*reais\\b',
      'i'
    )
  );
  const valorTexto =
    campo(texto, 'valor') ?? valorComMoeda?.[1] ?? valorComMoeda?.[2];
  const valorLimpo = valorTexto?.replace(/^R\$\s*/i, '');
  const valor = valorLimpo
    ? Number(
        valorLimpo.includes(',')
          ? valorLimpo.replaceAll('.', '').replace(',', '.')
          : /^\d{1,3}(\.\d{3})+$/.test(valorLimpo)
            ? valorLimpo.replaceAll('.', '')
            : valorLimpo
      )
    : NaN;
  const pedido = normalizar(texto);
  const tipo = campo(texto, 'tipo')
    ? normalizar(campo(texto, 'tipo'))
    : /\b(receita|recebi|entrada)\b/.test(pedido)
      ? 'receita'
      : /\b(despesa|paguei|gastei|saida|gasto)\b/.test(pedido)
        ? 'despesa'
        : null;
  const pago = /\b(paguei|gastei|recebi)\b/.test(pedido);
  const data = lerData(campo(texto, 'data|vencimento|compet[eê]ncia') ?? texto);
  const descricao =
    campo(texto, 'descri[cç][aã]o|nome') ??
    limpar(
      texto
        .match(
          /\b(?:reais|R\$\s*[\d.,]+)\s+(?:com|em|no|na|de|por|para)\s+([^;\n]+)/i
        )?.[1]
        ?.split(/\s+(?:hoje|amanh[ãa]|ontem|em\s+\d|na conta)\b/i)[0]
    );
  const nomeCategoria = campo(texto, 'categoria');
  const inferida = /mercado|aliment|restaurante|padaria/.test(pedido)
    ? 'Alimentação'
    : /aluguel|internet|moradia/.test(pedido)
      ? 'Moradia'
      : /uber|onibus|transporte|combustivel/.test(pedido)
        ? 'Transporte'
        : /salario/.test(pedido)
          ? 'Salário'
          : null;
  const categoria = nomeCategoria
    ? porNome(categorias, nomeCategoria)
    : (mencionar(categorias, texto) ?? porNome(categorias, inferida));
  const nomeConta = campo(texto, 'conta');
  const conta = porNome(contas, nomeConta);
  const semConta = nomeConta && normalizar(nomeConta) === 'sem conta';
  const faltando = [
    !['receita', 'despesa'].includes(tipo) && 'o tipo (receita ou despesa)',
    (!Number.isFinite(valor) || valor <= 0 || valor >= 1e13) &&
      'o valor em reais',
    (!descricao || descricao.length > 150) &&
      'uma descrição (use “descrição: …”)',
    !categoria &&
      'uma categoria de Finanças (' +
        categorias.map(c => c.nome).join(', ') +
        ')',
    !data && 'a data do lançamento',
    nomeConta &&
      !conta &&
      !semConta &&
      'uma conta existente ou “conta: sem conta”',
  ].filter(Boolean);
  if (faltando.length) return falta(faltando);
  const registro = atualizarFinancas('transacao_financeira', {
    user_id: perfil.user_id,
    categoria_id: categoria.id,
    conta_id: conta?.id ?? null,
    descricao,
    tipo,
    valor,
    competencia: data.slice(0, 7) + '-01',
    vencimento: pago ? null : data,
    pago_em: pago ? data : null,
    status: pago ? 'pago' : 'pendente',
    recorrencia_id: null,
  });
  return {
    texto:
      'Lançamento “' +
      descricao +
      '” de ' +
      moeda(valor) +
      ' registrado em ' +
      categoria.nome +
      ' para ' +
      dataCurta(data) +
      (pago
        ? tipo === 'receita'
          ? ', como recebido.'
          : ', como pago.'
        : ', como pendente.'),
    rota: '/financas?visao=lancamentos&lancamento=' + registro.id,
  };
}

function compras(texto, { b, casa }) {
  const listas = b.compras.filter(l => l.casa_id === casa?.id);
  const nomeLista = campo(texto, 'lista');
  const lista = nomeLista
    ? porNome(listas, nomeLista)
    : (mencionar(listas, texto) ?? (listas.length === 1 ? listas[0] : null));
  const trecho = texto.match(
    /(?:adicion[eae]|coloque|inclua)\s+(?:(\d+)\s+)?(.+?)(?:\s+(?:na|à|a) lista\b|[;\n]|$)/i
  );
  const nome = campo(texto, 'produto|item|nome') ?? limpar(trecho?.[2]);
  const quantidade = Number(campo(texto, 'quantidade') ?? trecho?.[1] ?? 1);
  const faltando = [
    (!nome || nome.length > 150) && 'o nome do produto',
    !lista && 'a lista de destino (' + listas.map(l => l.nome).join(', ') + ')',
    (!Number.isInteger(quantidade) ||
      quantidade < 1 ||
      quantidade > 2147483647) &&
      'uma quantidade inteira',
  ].filter(Boolean);
  if (faltando.length) return falta(faltando);
  alterarBancoCompras(db => {
    if (!db.compras.some(l => l.id === lista.id && l.casa_id === casa.id))
      throw new Error('A lista de compras não está mais disponível.');
    inserir(
      'compra_item',
      {
        compras_id: lista.id,
        produto_id: null,
        nome_item: nome,
        quantidade,
        comprado: false,
      },
      db
    );
  });
  return {
    texto:
      quantidade + ' × “' + nome + '” adicionado à lista ' + lista.nome + '.',
    rota: '/cozinha?visao=compras&lista=' + lista.id,
  };
}

export function criarRegistro(area, texto, dados, despachar) {
  if (
    /^(?:(?:por favor[, ]+)?(?:nao\s+|cancele\b|exclua\b|remova\b|edite\b|apague\b))/m.test(
      normalizar(texto.trim())
    )
  )
    return {
      texto: 'Nenhum registro criado. Use Criar para adicionar um novo item.',
    };
  return { rotina, limpeza, financas, compras }[area](texto, dados, despachar);
}
