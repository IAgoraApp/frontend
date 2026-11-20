import { acessoLocal } from '../../app/dados/acessoLocal';
import { dataCurta, hoje, moeda } from '../../app/dados/bancoMvp';
import { salvarImovel } from '../encontrar-casa/imovelDados';
import {
  alterarDinheiro,
  categoriasGasto,
  destinosGasto,
  validarValor,
} from '../financas-B/dinheiroDados';
import { lerGuia } from '../minha-jornada/guiaMudanca';
import { atualizarGuia } from '../minha-jornada/jornadaDados';
import { proximoId } from '../preparacao/modelo';
import { campo, falta, lerData, normalizar } from './criarRegistros';

export const areasPreparacao = {
  jornada: {
    nome: 'Minha jornada',
    exemplo: 'Item: Pedir orçamento de frete; etapa: Organize a mudança',
  },
  imoveis: {
    nome: 'Imóveis desejados',
    exemplo:
      'Nome: Studio perto do metrô; tipo: studio; valor: R$ 1500; cobrança: mensal',
  },
  dinheiro: {
    nome: 'Meu dinheiro',
    exemplo:
      'Gasto: Internet; valor: R$ 90; categoria: Contas e serviços; frequência: fixo; mudança: continua',
  },
  metas: {
    nome: 'Metas',
    exemplo: 'Meta: Reserva da mudança; valor: R$ 6000; por mês: R$ 500',
  },
};

function valorDoCampo(texto, nomes) {
  const informado = campo(texto, nomes);
  if (informado == null) return null;
  const limpo = informado.replace(/^R\$\s*/i, '').trim();
  if (!/^(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d{1,2})?$|^\d+\.\d{1,2}$/.test(limpo))
    throw new Error('Informe um valor em reais, por exemplo: R$ 1.500,00.');
  const numero = /^\d+\.\d{1,2}$/.test(limpo)
    ? Number(limpo)
    : Number(limpo.replaceAll('.', '').replace(',', '.'));
  return validarValor(numero, 'o valor');
}

function lerOpcao(texto, opcoes) {
  return (
    texto &&
    opcoes.find(([id, rotulo]) =>
      [id, rotulo].some(valor => normalizar(valor) === normalizar(texto))
    )?.[0]
  );
}

function jornada(texto, banco, usuario) {
  const item = campo(texto, 'item|tarefa');
  const nomeEtapa = campo(texto, 'etapa');
  const descricao = campo(texto, 'descri[cç][aã]o|observa[cç][aã]o');
  const etapas = lerGuia(banco, usuario).etapas;
  if (item) {
    const etapa =
      nomeEtapa &&
      etapas.find(
        opcao =>
          normalizar(opcao.titulo) === normalizar(nomeEtapa) ||
          opcao.id === nomeEtapa
      );
    if (!etapa)
      return falta([
        'uma etapa da jornada (' +
          etapas.map(opcao => opcao.titulo).join(', ') +
          ')',
      ]);
    if (item.length > 150) return falta(['um item com até 150 caracteres']);
    atualizarGuia(usuario, etapa, 'adicionar-item', {
      titulo: item,
      descricao,
    });
    return {
      texto: 'Adicionei “' + item + '” ao checklist de “' + etapa.titulo + '”.',
      rota: '/minhajornada?etapa=' + encodeURIComponent(etapa.id),
    };
  }
  const titulo =
    campo(texto, 'nova etapa') ??
    texto
      .trim()
      .match(
        /^(?:crie|adicione)\s+(?:uma\s+)?(?:nova\s+)?etapa(?:\s+(?:chamada|de))?\s+([^;\n]+)/i
      )?.[1]
      ?.trim();
  if (!titulo || titulo.length > 150)
    return falta(['“Nova etapa: nome” ou “Item: nome; etapa: nome da etapa”']);
  atualizarGuia(usuario, null, 'adicionar-etapa', { titulo, descricao });
  return {
    texto: 'Etapa “' + titulo + '” adicionada à Minha jornada.',
    rota: '/minhajornada',
  };
}

function imoveis(texto, _, usuario) {
  const titulo = campo(texto, 'nome|im[oó]vel|t[ií]tulo');
  const tipo = campo(texto, 'tipo');
  const valor = valorDoCampo(texto, 'valor|pre[cç]o');
  const valor_tipo = lerOpcao(campo(texto, 'cobran[cç]a|periodicidade'), [
    ['mensal', 'mensal'],
    ['total', 'total'],
  ]);
  const faltando = [
    (!titulo || titulo.length > 150) &&
      '“Nome: nome do imóvel” (até 150 caracteres)',
    tipo?.length > 150 && 'um tipo de imóvel com até 150 caracteres',
    valor != null && !valor_tipo && '“Cobrança: mensal” ou “Cobrança: total”',
  ].filter(Boolean);
  if (faltando.length) return falta(faltando);
  const id = salvarImovel(usuario, null, {
    titulo,
    tipo,
    valor,
    valor_tipo,
    descricao: campo(texto, 'descri[cç][aã]o|observa[cç][aã]o'),
  });
  return {
    texto: 'Imóvel “' + titulo + '” cadastrado.',
    rota: '/encontrar-casa?imovel=' + id,
  };
}

function dinheiro(texto, _, usuario) {
  const nome = campo(texto, 'gasto|nome|despesa');
  const valor = valorDoCampo(texto, 'valor');
  const categoriaInformada = campo(texto, 'categoria');
  const categoria = lerOpcao(categoriaInformada, categoriasGasto);
  const frequencia = lerOpcao(campo(texto, 'frequ[eê]ncia|tipo'), [
    ['fixo', 'fixo'],
    ['variavel', 'variável'],
  ]);
  const destino = lerOpcao(campo(texto, 'mudan[cç]a|destino'), destinosGasto);
  const faltando = [
    (!nome || nome.length > 100) && '“Gasto: nome” (até 100 caracteres)',
    valor == null && '“Valor: quanto custa por mês”',
    !frequencia && '“Frequência: fixo” ou “Frequência: variável”',
    !destino &&
      '“Mudança: continua”, “Mudança: termina” ou “Mudança: transferido”',
    categoriaInformada &&
      !categoria &&
      'uma categoria de Meu dinheiro (' +
        categoriasGasto.map(([, rotulo]) => rotulo).join(', ') +
        ')',
  ].filter(Boolean);
  if (faltando.length) return falta(faltando);
  alterarDinheiro(usuario, registro => {
    registro.gastos.push({
      id: proximoId(registro.gastos),
      nome,
      valor,
      categoria: categoria ?? null,
      frequencia,
      destino,
    });
  });
  return {
    texto:
      'Registrei “' +
      nome +
      '” de ' +
      moeda(valor) +
      ' por mês em Meu dinheiro.',
    rota: '/financas-b?visao=dinheiro',
  };
}

function metas(texto, _, usuario) {
  const nome = campo(texto, 'meta|nome');
  const alvo = valorDoCampo(texto, 'valor|alvo');
  const dataInformada = campo(texto, 'data|prazo');
  const data = dataInformada ? lerData(dataInformada) : null;
  const aporte = valorDoCampo(texto, 'por m[eê]s|aporte');
  const faltando = [
    (!nome || nome.length > 100) && '“Meta: nome” (até 100 caracteres)',
    !(alvo > 0) && '“Valor: quanto quer juntar”',
    dataInformada &&
      !(data && data > hoje()) &&
      'uma data futura em “Data: DD/MM/AAAA”',
    !dataInformada &&
      !(aporte > 0) &&
      '“Data: DD/MM/AAAA” ou “Por mês: quanto pode guardar”',
  ].filter(Boolean);
  if (faltando.length) return falta(faltando);
  let id;
  alterarDinheiro(usuario, registro => {
    id = proximoId(registro.metas);
    registro.metas.push({
      id,
      nome,
      fonte: 'personalizada',
      alvo: String(alvo),
      modo: data ? 'prazo' : 'aporte',
      data: data ?? '',
      aporte: aporte > 0 ? String(aporte) : '',
    });
  });
  return {
    texto:
      'Meta “' +
      nome +
      '” de ' +
      moeda(alvo) +
      ' criada' +
      (data
        ? ' para ' + dataCurta(data)
        : ' com ' + moeda(aporte) + ' por mês') +
      '.',
    rota: '/financas-b?visao=metas&meta=' + id,
  };
}

export function criarRegistroPreparacao(area, texto, { b, perfil }) {
  if (!acessoLocal || !perfil?.user_id)
    return { texto: 'A criação de registros está disponível na prévia local.' };
  if (
    /^(?:por favor[, ]+)?(?:nao\s+|cancele\b|exclua\b|remova\b|edite\b|apague\b)/m.test(
      normalizar(texto.trim())
    )
  )
    return {
      texto: 'Nenhum registro criado. Use Criar para adicionar um novo item.',
    };
  return { jornada, imoveis, dinheiro, metas }[area](texto, b, perfil.user_id);
}
