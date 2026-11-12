import { useEffect, useReducer } from 'react';
import {
  CHAVE_ROTINA,
  lerEstadoRotina,
  redutorTarefas,
} from '../utils/tasks';

export function useRotina() {
  const [estado, despachar] = useReducer(
    redutorTarefas,
    undefined,
    lerEstadoRotina
  );

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE_ROTINA, JSON.stringify(estado));
    } catch (erro) {
      void erro;
    }
  }, [estado]);

  return { estado, despachar };
}
