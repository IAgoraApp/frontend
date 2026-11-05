import { useEffect, useReducer } from 'react';
import { readState, storageKey, taskReducer } from '../utils/tasks';

export function useRoutine() {
  const [state, dispatch] = useReducer(taskReducer, undefined, readState);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // As alterações permanecem disponíveis nesta sessão.
    }
  }, [state]);

  return { state, dispatch };
}
