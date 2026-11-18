import { moeda } from '../../app/dados/bancoMvp';
import { categoriasMercado } from './content';

export function normalizarBusca(texto = '') {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function nomeCategoria(categoria) {
  return (
    categoriasMercado.find(item => item.slug === categoria)?.nome ||
    categoria ||
    'Serviços'
  );
}

export function precoServico(servico) {
  const valor = servico.preco == null ? null : moeda(servico.preco);
  if (!valor || servico.tipo_preco === 'orcamento') return 'Sob orçamento';
  const formatos = {
    a_partir_de: `A partir de ${valor}`,
    por_hora: `${valor} por hora`,
    por_diaria: `${valor} por diária`,
  };
  return formatos[servico.tipo_preco] || valor;
}

export function servicoPublico(servico, empresa, agora = Date.now()) {
  return (
    !!empresa?.validado &&
    servico.ativo &&
    servico.validado &&
    servico.status_publicacao === 'publicado' &&
    (!servico.publicado_em ||
      new Date(servico.publicado_em).getTime() <= agora) &&
    (!servico.expira_em || new Date(servico.expira_em).getTime() > agora)
  );
}

export const statusContratacao = {
  pendente: 'Pendente',
  aceito: 'Aceita',
  em_andamento: 'Em andamento',
  concluido: 'Concluída',
  cancelado: 'Cancelada',
  recusado: 'Recusada',
};
