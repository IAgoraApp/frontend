import { useLayoutEffect, useMemo, useRef } from 'react';
import { hoje, useBancoMvp } from '../../../app/dados/bancoMvp';

export function useInicio() {
  const { b, tarefas, limpezas, transacoes } = useBancoMvp();
  const referencia = useRef(null);
  const dia = hoje();
  const execucoes = b.execucao_tarefa.filter(
    e => e.status === 'pendente' && tarefas.some(t => t.id === e.tarefa_id)
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
              e.status === 'pendente' && tarefas.some(t => t.id === e.tarefa_id)
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
          .filter(t => t.status === 'pendente')
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

  useLayoutEffect(() => {
    const elemento = referencia.current;
    const header = elemento
      ?.closest('[data-layout-aplicacao]')
      ?.querySelector(':scope > header');
    if (!elemento) return;
    const atualizar = () =>
      elemento.style.setProperty(
        '--inicio-altura',
        `${Math.max(0, (window.visualViewport?.height ?? window.innerHeight) - (header?.getBoundingClientRect().height ?? 0))}px`
      );
    const observador = new ResizeObserver(atualizar);
    if (header) observador.observe(header);
    window.addEventListener('resize', atualizar);
    window.visualViewport?.addEventListener('resize', atualizar);
    atualizar();
    return () => {
      observador.disconnect();
      window.removeEventListener('resize', atualizar);
      window.visualViewport?.removeEventListener('resize', atualizar);
    };
  }, []);
  return { referencia, tarefas: resumo, eventos };
}
