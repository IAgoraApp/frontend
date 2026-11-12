import equipeServicos from '../../ativos/imagens/fotografias/equipe-servicos.png';
import empresaFotoUm from '../../ativos/imagens/fotografias/empresa-foto-1.png';
import empresaFotoDois from '../../ativos/imagens/fotografias/empresa-foto-2.png';
import empresaAnuncioPrevia from '../../ativos/imagens/fotografias/empresa-anuncio-previa.png';
import empresaPortfolioAmostra from '../../ativos/imagens/fotografias/empresa-portfolio-amostra.png';
import editorialServicos from '../../ativos/imagens/fotografias/editorial-servicos.png';
import editorialApartamento from '../../ativos/imagens/fotografias/editorial-apartamento.png';

export const imagensPadraoEmpresa = {
  capaServico: empresaAnuncioPrevia,
  equipe: equipeServicos,
  fotoComercialUm: empresaFotoUm,
  fotoComercialDois: empresaFotoDois,
  portfolioAmostra: empresaPortfolioAmostra,
  editorialServicos,
  editorialApartamento,
};

export const abasSituacaoAnuncio = [
  { id: 'todos', rotulo: 'Todos' },
  { id: 'ativo', rotulo: 'Ativos' },
  { id: 'analise', rotulo: 'Em análise' },
  { id: 'pausado', rotulo: 'Pausados' },
  { id: 'expirado', rotulo: 'Expirados' },
  { id: 'rascunho', rotulo: 'Rascunhos' },
];

export const abasSituacaoContato = [
  { id: 'todos', rotulo: 'Todos' },
  { id: 'naoLido', rotulo: 'Não respondidos' },
  { id: 'andamento', rotulo: 'Em andamento' },
  { id: 'concluido', rotulo: 'Concluídos' },
];

export const periodosPainel = [
  { dias: 7, rotulo: 'Últimos 7 dias', fator: 0.25 },
  { dias: 30, rotulo: 'Últimos 30 dias', fator: 1 },
  { dias: 90, rotulo: 'Últimos 90 dias', fator: 1.8 },
];

export const serieBaseVisualizacoes = [
  { rotulo: 'Sem 1', percentual: 18 },
  { rotulo: 'Sem 2', percentual: 32 },
  { rotulo: 'Sem 3', percentual: 28 },
  { rotulo: 'Sem 4', percentual: 48 },
  { rotulo: 'Sem 5', percentual: 64 },
  { rotulo: 'Sem 6', percentual: 51 },
  { rotulo: 'Sem 7', percentual: 82 },
  { rotulo: 'Sem 8', percentual: 74 },
  { rotulo: 'Sem 9', percentual: 91 },
  { rotulo: 'Sem 10', percentual: 100 },
];

export const coresRoscaServicos = [
  '#e03b00',
  '#102a43',
  '#d54c15',
  '#526579',
  '#18794e',
];

export const origensAcessoEmpresa = [
  { id: 'busca', rotulo: 'Busca no Marketplace', percentual: 46 },
  { id: 'categoria', rotulo: 'Navegação por categoria', percentual: 28 },
  { id: 'perfil', rotulo: 'Perfil público da empresa', percentual: 17 },
  { id: 'favoritos', rotulo: 'Favoritos salvos', percentual: 9 },
];

export const opcoesAtendimentoEmpresa = [
  'Residencial',
  'Comercial',
  'Ambos',
  'On-line',
];

export function obterImagemAnuncio(anuncio) {
  if (anuncio?.fotos?.length) return anuncio.fotos[0];
  if (anuncio?.id === 'pos-mudanca') return empresaFotoUm;
  if (anuncio?.id === 'organizacao') return empresaFotoDois;
  if (anuncio?.id === 'limpeza-comercial') return editorialApartamento;
  return empresaAnuncioPrevia;
}

export function obterIniciaisNome(nome) {
  return String(nome || 'CE')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(parte => parte[0]?.toUpperCase() || '')
    .join('');
}

export function estiloSituacaoAnuncio(situacao) {
  if (situacao === 'ativo') {
    return 'bg-[#ecfdf3] text-[#18794e] border border-[#abefc6]';
  }
  if (situacao === 'analise') {
    return 'bg-[#fce8dc] text-[#d54c15] border border-[#f8ccb4]';
  }
  if (situacao === 'pausado') {
    return 'bg-[#f4f7fa] text-[#526579] border border-[#dbe5ed]';
  }
  if (situacao === 'expirado') {
    return 'bg-[#fef3f2] text-[#b42318] border border-[#f4c7c3]';
  }
  return 'bg-[#fff7f2] text-[#102a43] border border-[#dbe5ed]';
}

export function estiloSituacaoContato(situacao) {
  if (situacao === 'naoLido') {
    return 'bg-[#fce8dc] text-[#e03b00] border border-[#f8ccb4]';
  }
  if (situacao === 'andamento') {
    return 'bg-[#eef4fa] text-[#102a43] border border-[#c8daea]';
  }
  return 'bg-[#ecfdf3] text-[#18794e] border border-[#abefc6]';
}
