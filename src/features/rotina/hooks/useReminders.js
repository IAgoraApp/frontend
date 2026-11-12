import { useEffect, useRef } from 'react';
import { adicionarDias, chaveData } from '../utils/dates';
import { ocorrenciasEntre } from '../utils/tasks';

export function useLembretes(tarefas, conclusoes, notificar) {
  const exibidos = useRef(new Set());

  useEffect(() => {
    function verificar() {
      const agora = Date.now();
      const hoje = chaveData();
      const proximas = ocorrenciasEntre(
        tarefas,
        conclusoes,
        hoje,
        adicionarDias(hoje, 1)
      );
      for (const tarefa of proximas) {
        if (tarefa.reminder === 'none') continue;
        const horarioLembrete =
          new Date(`${tarefa.occurrenceDate}T${tarefa.time}:00`).getTime() -
          Number(tarefa.reminder) * 60_000;
        const chave = `${tarefa.occurrenceId}:${tarefa.time}:${tarefa.reminder}`;
        if (
          horarioLembrete <= agora &&
          agora - horarioLembrete < 60_000 &&
          !exibidos.current.has(chave)
        ) {
          exibidos.current.add(chave);
          notificar(`Lembrete: ${tarefa.title} · ${tarefa.time}`);
        }
      }
    }
    const intervalo = window.setInterval(verificar, 30_000);
    verificar();
    return () => window.clearInterval(intervalo);
  }, [tarefas, conclusoes, notificar]);
}
