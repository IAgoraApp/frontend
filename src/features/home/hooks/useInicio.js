import { useMemo } from 'react';
import { hoje, useBancoMvp } from '../../../app/dados/bancoMvp';

export function useInicio(preparacao = false) {
  const banco = useBancoMvp();
  const usuario = banco.perfil?.user_id;
  const { b, tarefas, limpezas, transacoes } = banco;
  const dia = hoje();
  const execucoes = b.execucao_tarefa.filter(
    e => ['pendente', 'atrasada'].includes(e.status) && tarefas.some(t => t.id === e.tarefa_id)
  );
  const resumo = {
    hoje: execucoes
      .filter(e => e.data_prevista.slice(0, 10) <= dia)
      .map(e => ({ title: tarefas.find(t => t.id === e.tarefa_id).nome })),
    proximas: execucoes
      .filter(e => e.data_prevista.slice(0, 10) > dia)
      .map(e => ({ title: tarefas.find(t => t.id === e.tarefa_id).nome })),
  };
  const eventos = useMemo(
    () =>
      [
        ...b.execucao_tarefa
          .filter(
            e =>
              ['pendente', 'atrasada'].includes(e.status) && tarefas.some(t => t.id === e.tarefa_id)
          )
          .map(e => ({
            id: `tarefa-${e.id}`,
            data: e.data_prevista.slice(0, 10),
            titulo: tarefas.find(t => t.id === e.tarefa_id).nome,
            subtitulo: 'Minha rotina',
            rota: '/rotina?visao=agenda',
            tipo: 'rotina',
          })),
        ...transacoes
          .filter(t => t.status === 'pendente' && t.vencimento)
          .map(t => ({
            id: `conta-${t.id}`,
            data: t.vencimento,
            titulo: t.descricao,
            subtitulo: 'Vencimento',
            rota: '/financas',
            tipo: 'financas',
          })),
        ...limpezas
          .filter(l => l.proxima_vez)
          .map(l => ({
            id: `limpeza-${l.id}`,
            data: l.proxima_vez,
            titulo: l.nome,
            subtitulo: 'Cuidado da casa',
            rota: '/limpeza',
            tipo: 'casa',
          })),
      ].sort((a, c) => a.data.localeCompare(c.data)),
    [b, tarefas, transacoes, limpezas]
  );

  if (preparacao) {
    const jornadas = b.jornada.filter(item => item.user_id === usuario);
    const etapas = b.etapa_jornada.filter(item => item.status === 'pendente' && jornadas.some(j => j.id === item.jornada_id && j.status === 'em_andamento'));
    const prazoPorEtapa = new Map(etapas.map(etapa => [etapa.id, etapa.prazo]));
    const pendentes = b.tarefa_jornada.filter(item => !item.concluida && etapas.some(e => e.id === item.etapa_id));
    const tarefas = {
      hoje: pendentes.filter(tarefasVencidas).map(item => ({ title: item.titulo })),
      proximas: pendentes.filter(item => !tarefasVencidas(item)).map(item => ({ title: item.titulo })),
    };
    function tarefasVencidas(item) {
      const prazo = prazoPorEtapa.get(item.etapa_id);
      return prazo && prazo <= dia;
    }
    return { banco, tarefas };
  }
  return { banco, tarefas: resumo, eventos };
}
