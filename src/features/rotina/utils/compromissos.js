import { moeda } from '../../../app/dados/bancoMvp';

export function listarCompromissos(limpezas, transacoes) {
  return [
    ...limpezas
      .filter(l => l.proxima_vez)
      .map(l => ({
        id: 'limpeza-' + l.id,
        data: l.proxima_vez.slice(0, 10),
        tipo: 'limpeza',
        titulo: l.nome,
        detalhe: 'Limpeza programada',
        rota: '/limpeza',
      })),
    ...transacoes
      .filter(t => t.vencimento || t.pago_em)
      .map(t => ({
        id: 'conta-' + t.id,
        data: (t.pago_em || t.vencimento).slice(0, 10),
        tipo: 'conta',
        titulo: t.descricao,
        subtitulo:
          t.tipo === 'receita'
            ? t.status === 'pago'
              ? 'Recebimento'
              : 'Receita prevista'
            : t.status === 'pago'
              ? 'Pagamento'
              : 'Vencimento',
        detalhe: moeda(t.valor),
        rota: '/financas?visao=lancamentos&lancamento=' + t.id,
      })),
  ];
}
