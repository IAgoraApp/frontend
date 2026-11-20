import { ResumoMvp } from '../../../shared/ui/mvp';
import { servicoPublico } from '../../marketplace/marketplaceDados';

export default function DashboardEmpresa({ b, empresa, servicos, pedidos }) {
  const ids = new Set(
    pedidos.filter(p => p.status === 'concluido').map(p => p.id)
  );
  const avaliacoes = b.avaliacao_servico.filter(a => ids.has(a.contratado_id));
  const nota = avaliacoes.length
    ? (
        avaliacoes.reduce((soma, a) => soma + a.nota, 0) / avaliacoes.length
      ).toLocaleString('pt-BR', { maximumFractionDigits: 1 })
    : 'Sem avaliações';
  return (
    <ResumoMvp
      itens={[
        [
          'Serviços publicados',
          servicos.filter(s =>
            servicoPublico(
              s,
              empresa,
              undefined,
              b.publicacao_servico.filter(p => p.servico_id === s.id)
            )
          ).length,
        ],
        ['Em negociação', pedidos.filter(p => p.status === 'pendente').length],
        ['Serviços concluídos', ids.size],
        ['Nota média', nota],
      ]}
    />
  );
}
